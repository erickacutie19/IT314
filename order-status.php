<?php
session_start();
header("Content-Type: application/json");

require_once "db.php";

function statusRespond($status, $message, $extra = []) {
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $status >= 200 && $status < 300,
        "message" => $message
    ], $extra));

    exit;
}

function normalizeErickaffeStatus($status) {
    $value = strtolower(trim((string) $status));

    $map = [
        "pending" => "Pending",
        "preparing" => "Preparing",
        "ready" => "Ready for Pickup",
        "ready for pickup" => "Ready for Pickup",
        "out for delivery" => "Out for Delivery",
        "received" => "Pending",
        "completed" => "Received/Completed",
        "received/completed" => "Received/Completed",
        "cancelled" => "Cancelled",
        "canceled" => "Cancelled"
    ];

    return $map[$value] ?? trim((string) $status);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    statusRespond(405, "POST requests only.");
}

/*
 * Status changes must come from a server-authenticated staff account.
 */
$role = $_SESSION["user_role"] ?? "";

if (
    empty($_SESSION["user_id"]) ||
    !in_array($role, ["staff", "admin", "hybrid"], true)
) {
    statusRespond(
        403,
        "Please log in with an authorized staff or owner account."
    );
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    statusRespond(400, "Invalid request data.");
}

$reference = trim((string) ($data["reference"] ?? ""));
$nextStatus = trim((string) ($data["status"] ?? ""));

$validStatuses = [
    "Preparing",
    "Ready for Pickup",
    "Out for Delivery",
    "Received/Completed",
    "Cancelled"
];

if (
    $reference === "" ||
    strlen($reference) > 40 ||
    !in_array($nextStatus, $validStatuses, true)
) {
    statusRespond(400, "Invalid order reference or status.");
}

$flow = [
    "Pending" => ["Preparing", "Cancelled"],
    "Preparing" => [
        "Ready for Pickup",
        "Out for Delivery",
        "Cancelled"
    ],
    "Ready for Pickup" => ["Received/Completed", "Cancelled"],
    "Out for Delivery" => ["Received/Completed", "Cancelled"],
    "Received/Completed" => [],
    "Cancelled" => []
];

try {
    $conn->begin_transaction();

    // Lock the order while its status and rewards are updated.
    $query = $conn->prepare(
        "SELECT order_id, customer_id, fulfillment_method, order_status
         FROM orders
         WHERE order_number = ?
         FOR UPDATE"
    );

    $query->bind_param("s", $reference);
    $query->execute();

    $order = $query->get_result()->fetch_assoc();
    $query->close();

    if (!$order) {
        throw new Exception(
            "Order not found in the database. Please refresh the dashboard."
        );
    }

    $orderId = (int) $order["order_id"];
    $customerId = (int) ($order["customer_id"] ?? 0);
    $fulfillment = $order["fulfillment_method"];

    $previousStatus = normalizeErickaffeStatus(
        $order["order_status"]
    );

    if (
        !in_array(
            $nextStatus,
            $flow[$previousStatus] ?? [],
            true
        )
    ) {
        throw new Exception(
            "Invalid order transition: " .
            $previousStatus . " to " . $nextStatus . "."
        );
    }

    if (
        ($nextStatus === "Ready for Pickup" && $fulfillment !== "pickup") ||
        ($nextStatus === "Out for Delivery" && $fulfillment !== "delivery")
    ) {
        throw new Exception(
            "The next status does not match the order's fulfillment method."
        );
    }

    $starsAwarded = 0;
    $customerLoyaltyStars = null;

    /*
     * Award stars only when the order is completed.
     * One star is earned per eligible paid item, matching the
     * previous menu's quantity-based loyalty rule.
     */
    if ($nextStatus === "Received/Completed") {
        if ($customerId < 1) {
            throw new Exception(
                "This order is not linked to a customer account."
            );
        }

        $query = $conn->prepare(
            "SELECT COALESCE(SUM(quantity), 0) AS earned_stars
             FROM order_items
             WHERE order_id = ?
               AND unit_price > 0"
        );

        $query->bind_param("i", $orderId);
        $query->execute();

        $starRow = $query->get_result()->fetch_assoc();
        $query->close();

        $earnedStars = (int) ($starRow["earned_stars"] ?? 0);

        // Use a transaction record to prevent duplicate rewards.
        $description = "Completed order reward: " . $reference;

        $query = $conn->prepare(
            "SELECT loyalty_transaction_id
             FROM loyalty_transactions
             WHERE order_id = ?
               AND description = ?
             LIMIT 1
             FOR UPDATE"
        );

        $query->bind_param("is", $orderId, $description);
        $query->execute();

        $existingReward = $query->get_result()->fetch_assoc();
        $query->close();

        if (!$existingReward && $earnedStars > 0) {
            $query = $conn->prepare(
                "UPDATE customers
                 SET loyalty_stars = loyalty_stars + ?
                 WHERE customer_id = ?"
            );

            $query->bind_param("ii", $earnedStars, $customerId);
            $query->execute();

            if ($query->affected_rows !== 1) {
                $query->close();

                throw new Exception(
                    "Unable to update the customer's loyalty balance."
                );
            }

            $query->close();

            $query = $conn->prepare(
                "INSERT INTO loyalty_transactions (
                    customer_id,
                    order_id,
                    points_change,
                    description
                ) VALUES (?, ?, ?, ?)"
            );

            $query->bind_param(
                "iiis",
                $customerId,
                $orderId,
                $earnedStars,
                $description
            );

            $query->execute();
            $query->close();

            $starsAwarded = $earnedStars;
        }

        // Read the current balance from MySQL.
        $query = $conn->prepare(
            "SELECT loyalty_stars
             FROM customers
             WHERE customer_id = ?"
        );

        $query->bind_param("i", $customerId);
        $query->execute();

        $customer = $query->get_result()->fetch_assoc();
        $query->close();

        $customerLoyaltyStars = (int) $customer["loyalty_stars"];
    }

    // Save the new order status in MySQL.
    $query = $conn->prepare(
        "UPDATE orders
         SET order_status = ?
         WHERE order_id = ?"
    );

    $query->bind_param("si", $nextStatus, $orderId);
    $query->execute();
    $query->close();

    $conn->commit();

    statusRespond(200, "Order status updated successfully.", [
        "reference" => $reference,
        "status" => $nextStatus,
        "starsAwarded" => $starsAwarded,
        "customerLoyaltyStars" => $customerLoyaltyStars
    ]);

} catch (Throwable $error) {
    try {
        $conn->rollback();
    } catch (Throwable $ignored) {
        // No active transaction to roll back.
    }

    error_log("Erickaffe order status error: " . $error->getMessage());

    $message = $error instanceof mysqli_sql_exception
        ? "Unable to update the order. Please check the database configuration."
        : $error->getMessage();

    statusRespond(
        $error instanceof mysqli_sql_exception ? 500 : 400,
        $message
    );
}
?>