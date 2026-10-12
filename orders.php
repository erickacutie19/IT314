
<?php
session_start();
header("Content-Type: application/json");

require_once "db.php";

function respond($status, $message, $extra = []) {
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $status >= 200 && $status < 300,
        "message" => $message
    ], $extra));

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(405, "POST requests only.");
}

if (
    empty($_SESSION["user_id"]) ||
    ($_SESSION["user_role"] ?? "") !== "customer"
) {
    respond(401, "Please log in before checking out.");
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !is_array($data) ||
    empty($data["items"]) ||
    !is_array($data["items"])
) {
    respond(400, "Your basket is empty.");
}

$customerId = (int) $_SESSION["user_id"];
$reference = trim((string) ($data["reference"] ?? ""));
$fulfillment = $data["fulfillment"] ?? "";
$payment = $data["payment"] ?? "";
$address = trim((string) ($data["address"] ?? ""));
$eta = trim((string) ($data["eta"] ?? ""));
$receiver = trim((string) ($data["receiver"] ?? ""));

if (
    $reference === "" ||
    strlen($reference) > 40 ||
    !in_array($fulfillment, ["pickup", "delivery"], true) ||
    !in_array($payment, ["GCash", "Maya", "Cash on Delivery"], true) ||
    ($fulfillment === "delivery" && $address === "") ||
    ($fulfillment === "pickup" && $payment === "Cash on Delivery")
) {
    respond(400, "Please check your checkout details.");
}

try {
    $conn->begin_transaction();

    // Get the logged-in customer from MySQL.
    $query = $conn->prepare(
        "SELECT name, email, phone
         FROM customers
         WHERE customer_id = ?"
    );

    $query->bind_param("i", $customerId);
    $query->execute();
    $customer = $query->get_result()->fetch_assoc();
    $query->close();

    if (!$customer) {
        throw new Exception(
            "Customer account not found. Please log in again."
        );
    }

    $items = [];
    $subtotal = 0;

    // Validate products and use database prices.
    foreach ($data["items"] as $item) {
        $productId = trim((string) ($item["productId"] ?? ""));

        $quantity = filter_var(
            $item["qty"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (
            $productId === "" ||
            $quantity === false ||
            $quantity < 1 ||
            $quantity > 100
        ) {
            throw new Exception(
                "Invalid product ID or quantity."
            );
        }

        if (($item["category"] ?? "") === "reward") {
            throw new Exception(
                "Reward checkout is not available yet. Please remove the reward."
            );
        }

        $productQuery = $conn->prepare(
            "SELECT product_id, name, price, stock_quantity, is_active
             FROM products
             WHERE product_id = ?
             FOR UPDATE"
        );

        $productQuery->bind_param("s", $productId);
        $productQuery->execute();

        $product = $productQuery
            ->get_result()
            ->fetch_assoc();

        $productQuery->close();

        // Diagnostic 1: Product ID was not found.
        if (!$product) {
            throw new Exception(
                "Product ID " . $productId .
                " was not found in the database. Please check the product ID."
            );
        }

        // Diagnostic 2: Product is inactive.
        if ((int) $product["is_active"] !== 1) {
            throw new Exception(
                $product["name"] .
                " is inactive in the database. Please check its is_active value."
            );
        }

        // Diagnostic 3: Stock is less than the requested quantity.
        $availableStock = (int) $product["stock_quantity"];

        if ($availableStock < $quantity) {
            throw new Exception(
                "Insufficient stock for " . $product["name"] .
                ". Available: " . $availableStock .
                ", requested: " . $quantity . "."
            );
        }

        $price = (float) $product["price"];
        $lineTotal = round($price * $quantity, 2);

        $subtotal += $lineTotal;

        $items[] = [
            "productId" => $product["product_id"],
            "name" => $product["name"],
            "customization" => trim(
                (string) ($item["custom"] ?? "")
            ),
            "quantity" => $quantity,
            "price" => $price,
            "lineTotal" => $lineTotal
        ];
    }

    $subtotal = round($subtotal, 2);
    $total = $subtotal;

    $deliveryAddress = $fulfillment === "delivery"
        ? $address
        : null;

    $pickupDetails = $fulfillment === "pickup"
        ? "Erickaffe Coffee Co., Lipa City, Batangas"
        : null;

    $customerNote = json_encode([
        "receiver" => $receiver !== ""
            ? $receiver
            : $customer["name"],
        "eta" => $eta
    ], JSON_UNESCAPED_UNICODE);

    // Save the order as Pending.
    $query = $conn->prepare(
        "INSERT INTO orders (
            order_number,
            customer_id,
            customer_name,
            customer_email,
            customer_phone,
            fulfillment_method,
            delivery_address,
            pickup_details,
            payment_method,
            payment_status,
            order_status,
            subtotal,
            total,
            customer_note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?, ?, ?)"
    );

    $query->bind_param(
        "sisssssssdds",
        $reference,
        $customerId,
        $customer["name"],
        $customer["email"],
        $customer["phone"],
        $fulfillment,
        $deliveryAddress,
        $pickupDetails,
        $payment,
        $subtotal,
        $total,
        $customerNote
    );

    $query->execute();

    $orderId = $conn->insert_id;

    $query->close();

    // Save the products belonging to this order.
    $itemQuery = $conn->prepare(
        "INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            customization,
            quantity,
            unit_price,
            line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    foreach ($items as $item) {
        $productId = $item["productId"];
        $name = $item["name"];
        $customization = $item["customization"];
        $quantity = $item["quantity"];
        $price = $item["price"];
        $lineTotal = $item["lineTotal"];

        $itemQuery->bind_param(
            "isssidd",
            $orderId,
            $productId,
            $name,
            $customization,
            $quantity,
            $price,
            $lineTotal
        );

        $itemQuery->execute();
    }

    $itemQuery->close();

    $conn->commit();

    respond(200, "Order saved successfully.", [
        "orderId" => $orderId,
        "reference" => $reference,
        "status" => "Pending",
        "paymentStatus" => "Pending",
        "total" => $total,
        "items" => $items
    ]);

} catch (Throwable $error) {
    try {
        $conn->rollback();
    } catch (Throwable $ignored) {
        // No active transaction to roll back.
    }

    error_log(
        "Erickaffe order error: " . $error->getMessage()
    );

    $message = $error instanceof mysqli_sql_exception
        ? "Unable to save your order. Please check the database and try again."
        : $error->getMessage();

    respond(400, $message);
}
?>
