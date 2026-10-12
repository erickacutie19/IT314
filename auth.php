
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Allow POST requests only
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "POST requests only."
    ]);

    exit;
}

// Read JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request data."
    ]);

    exit;
}

// Get the submitted information
$action = $data["action"] ?? "";
$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

// Validate email and password
if (
    !is_string($email) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !is_string($password) ||
    $password === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Enter a valid email and password."
    ]);

    exit;
}


// ============================
// REGISTER ACCOUNT
// ============================

if ($action === "register") {

    $name = trim($data["name"] ?? "");

    if (
        $name === "" ||
        strlen($name) > 150 ||
        strlen($password) < 8
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Enter your name and a password with at least 8 characters."
        ]);

        exit;
    }

    // Check if email already exists
    $check = $conn->prepare(
        "SELECT customer_id
         FROM customers
         WHERE email = ?
         LIMIT 1"
    );

    $check->bind_param("s", $email);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows > 0) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "An account with this email already exists."
        ]);

        $check->close();
        exit;
    }

    $check->close();

    // Securely hash the password
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // New registrations are always customers
    $role = "customer";

    // Save the account to MySQL
    $stmt = $conn->prepare(
        "INSERT INTO customers
            (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssss",
        $name,
        $email,
        $passwordHash,
        $role
    );

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Could not create the account."
        ]);

        $stmt->close();
        exit;
    }

    // Start a server-side login session
    $userId = (int) $conn->insert_id;

    session_regenerate_id(true);

    $_SESSION["user_id"] = $userId;
    $_SESSION["user_role"] = $role;

    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully.",
        "user" => [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "role" => $role,
            "loyaltyStars" => 0
        ]
    ]);

    exit;
}


// ============================
// LOGIN ACCOUNT
// ============================

if ($action === "login") {

    // Find the account using its email
    $stmt = $conn->prepare(
        "SELECT
            customer_id,
            name,
            email,
            password_hash,
            role,
            loyalty_stars
         FROM customers
         WHERE email = ?
         LIMIT 1"
    );

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    $stmt->close();

    // Check the submitted password
    if (
        !$user ||
        !password_verify(
            $password,
            $user["password_hash"]
        )
    ) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Incorrect email or password."
        ]);

        exit;
    }

    // Create a server-side login session
    session_regenerate_id(true);

    $_SESSION["user_id"] = (int) $user["customer_id"];
    $_SESSION["user_role"] = $user["role"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "user" => [
            "id" => (int) $user["customer_id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"],
            "loyaltyStars" => (int) $user["loyalty_stars"]
        ]
    ]);

    exit;
}


// ============================
// UNKNOWN ACTION
// ============================

http_response_code(400);

echo json_encode([
    "success" => false,
    "message" => "Unknown action."
]);

?>
