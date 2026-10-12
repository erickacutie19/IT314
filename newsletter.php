<?php
declare(strict_types=1);

session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store");

require_once __DIR__ . "/db.php";

function newsletterRespond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function newsletterOwner(mysqli $conn): bool
{
    if (empty($_SESSION["user_id"]) || (int) $_SESSION["user_id"] < 1) {
        return false;
    }

    $customerId = (int) $_SESSION["user_id"];
    $query = $conn->prepare(
        "SELECT email, role
         FROM customers
         WHERE customer_id = ?
         LIMIT 1"
    );
    $query->bind_param("i", $customerId);
    $query->execute();
    $customer = $query->get_result()->fetch_assoc();
    $query->close();

    return $customer
        && strtolower((string) $customer["email"]) === "owner@erickaffe.com"
        && in_array((string) $customer["role"], ["admin", "owner", "hybrid"], true);
}

function newsletterReadInput(): array
{
    $input = json_decode(file_get_contents("php://input"), true);
    return is_array($input) ? $input : [];
}

function newsletterRequireCsrf(array $input): void
{
    $token = $input["csrfToken"] ?? null;
    if (
        !is_string($token) ||
        empty($_SESSION["newsletter_csrf"]) ||
        !hash_equals((string) $_SESSION["newsletter_csrf"], $token)
    ) {
        newsletterRespond(403, [
            "success" => false,
            "message" => "This request expired. Refresh the page and try again."
        ]);
    }
}

function newsletterText(mixed $value, int $maxLength): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $value = trim($value);
    if ($value === "" || mb_strlen($value, "UTF-8") > $maxLength) {
        return null;
    }

    return $value;
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && ($_GET["action"] ?? "") === "token") {
    if (empty($_SESSION["newsletter_csrf"])) {
        $_SESSION["newsletter_csrf"] = bin2hex(random_bytes(32));
    }

    newsletterRespond(200, [
        "success" => true,
        "csrfToken" => $_SESSION["newsletter_csrf"]
    ]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    newsletterRespond(405, ["success" => false, "message" => "POST requests only."]);
}

$input = newsletterReadInput();
newsletterRequireCsrf($input);
$action = $input["action"] ?? "";

if ($action === "subscribe") {
    $rawEmail = $input["email"] ?? null;
    if (!is_string($rawEmail) || strlen($rawEmail) > 254) {
        newsletterRespond(400, ["success" => false, "message" => "Enter a valid email address."]);
    }

    $email = strtolower(trim($rawEmail));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        newsletterRespond(400, ["success" => false, "message" => "Enter a valid email address."]);
    }

    try {
        $conn->begin_transaction();
        $query = $conn->prepare(
            "SELECT subscriber_id, is_active
             FROM newsletter_subscribers
             WHERE email = ?
             FOR UPDATE"
        );
        $query->bind_param("s", $email);
        $query->execute();
        $subscriber = $query->get_result()->fetch_assoc();
        $query->close();

        if ($subscriber && (int) $subscriber["is_active"] === 1) {
            $conn->commit();
            newsletterRespond(409, [
                "success" => false,
                "alreadySubscribed" => true,
                "message" => "This email is already subscribed."
            ]);
        }

        if ($subscriber) {
            $subscriberId = (int) $subscriber["subscriber_id"];
            $query = $conn->prepare(
                "UPDATE newsletter_subscribers
                 SET is_active = 1,
                     subscribed_at = CURRENT_TIMESTAMP
                 WHERE subscriber_id = ?"
            );
            $query->bind_param("i", $subscriberId);
            $query->execute();
            $query->close();
        } else {
            $query = $conn->prepare(
                "INSERT INTO newsletter_subscribers (email, is_active)
                 VALUES (?, 1)"
            );
            $query->bind_param("s", $email);
            $query->execute();
            $query->close();
        }

        $conn->commit();
        newsletterRespond(201, [
            "success" => true,
            "message" => "You’re subscribed! Here is your simulated welcome email.",
            "welcomeEmail" => [
                "sender" => "Erickaffe (simulation)",
                "recipient" => $email,
                "subject" => "Welcome to the Erickaffe table!",
                "preview" => "Thanks for joining us. Expect coffee stories, menu news, and a little Batangas boldness.",
                "simulation" => true
            ]
        ]);
    } catch (Throwable $error) {
        try {
            $conn->rollback();
        } catch (Throwable $rollbackError) {
            error_log("Newsletter rollback error: " . $rollbackError->getMessage());
        }
        if ($error instanceof mysqli_sql_exception && $error->getCode() === 1062) {
            newsletterRespond(409, [
                "success" => false,
                "alreadySubscribed" => true,
                "message" => "This email is already subscribed."
            ]);
        }
        error_log("Newsletter subscription error: " . $error->getMessage());
        newsletterRespond(500, ["success" => false, "message" => "Unable to save your subscription right now."]);
    }
}

if (!in_array($action, ["list", "unsubscribe", "simulate"], true)) {
    newsletterRespond(400, ["success" => false, "message" => "Unknown newsletter action."]);
}

if (!newsletterOwner($conn)) {
    newsletterRespond(403, ["success" => false, "message" => "Only the Erickaffe Owner account can manage newsletters."]);
}

if ($action === "list") {
    $recipients = $conn->query(
        "SELECT subscriber_id, email, subscribed_at
         FROM newsletter_subscribers
         WHERE is_active = 1
         ORDER BY subscribed_at DESC, subscriber_id DESC"
    )->fetch_all(MYSQLI_ASSOC);
    $recipientCount = (int) $conn->query(
        "SELECT COUNT(*) AS recipient_count
         FROM newsletter_subscribers
         WHERE is_active = 1"
    )->fetch_assoc()["recipient_count"];
    $subscribers = $conn->query(
        "SELECT subscriber_id, email,
                IF(is_active = 1, 'subscribed', 'unsubscribed') AS status,
                subscribed_at
         FROM newsletter_subscribers
         ORDER BY subscribed_at DESC, subscriber_id DESC"
    )->fetch_all(MYSQLI_ASSOC);
    $campaigns = $conn->query(
        "SELECT campaign_id, subject, recipient_count, simulation_status, created_at
         FROM newsletter_campaigns
         ORDER BY campaign_id DESC
         LIMIT 20"
    )->fetch_all(MYSQLI_ASSOC);

    newsletterRespond(200, [
        "success" => true,
        "recipients" => $recipients,
        "recipientCount" => $recipientCount,
        "subscribers" => $subscribers,
        "campaigns" => $campaigns
    ]);
}

if ($action === "unsubscribe") {
    $subscriberId = filter_var(
        $input["subscriberId"] ?? null,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
    );
    if ($subscriberId === false) {
        newsletterRespond(400, ["success" => false, "message" => "Select a valid subscriber."]);
    }

    $query = $conn->prepare(
        "UPDATE newsletter_subscribers
         SET is_active = 0
         WHERE subscriber_id = ?
           AND is_active = 1"
    );
    $query->bind_param("i", $subscriberId);
    $query->execute();
    $changed = $query->affected_rows === 1;
    $query->close();

    if (!$changed) {
        newsletterRespond(404, ["success" => false, "message" => "Subscriber not found or already unsubscribed."]);
    }

    newsletterRespond(200, ["success" => true, "message" => "Subscriber marked as unsubscribed."]);
}

$subject = newsletterText($input["subject"] ?? null, 200);
$message = newsletterText($input["message"] ?? null, 10000);
$requestKey = $input["requestKey"] ?? null;
if (
    $subject === null ||
    $message === null ||
    !is_string($requestKey) ||
    !preg_match('/^[a-f0-9]{64}$/', $requestKey)
) {
    newsletterRespond(400, ["success" => false, "message" => "Enter a campaign subject and message, then preview it again."]);
}

try {
    $conn->begin_transaction();
    $check = $conn->prepare(
        "SELECT campaign_id, recipient_count
         FROM newsletter_campaigns
         WHERE request_key = ?
         LIMIT 1
         FOR UPDATE"
    );
    $check->bind_param("s", $requestKey);
    $check->execute();
    $existingCampaign = $check->get_result()->fetch_assoc();
    $check->close();
    if ($existingCampaign) {
        $conn->commit();
        newsletterRespond(409, [
            "success" => false,
            "message" => "This campaign confirmation was already processed. No second simulation was recorded."
        ]);
    }

    $ownerId = (int) $_SESSION["user_id"];
    $query = $conn->prepare(
        "        SELECT subscriber_id, email
        FROM newsletter_subscribers
        WHERE is_active = 1
         ORDER BY subscriber_id
         FOR UPDATE"
    );
    $query->execute();
    $recipients = $query->get_result()->fetch_all(MYSQLI_ASSOC);
    $query->close();
    $recipientCount = count($recipients);

    $insert = $conn->prepare(
        "INSERT INTO newsletter_campaigns
            (created_by, subject, message, recipient_count, request_key)
         VALUES (?, ?, ?, ?, ?)"
    );
    $insert->bind_param("issis", $ownerId, $subject, $message, $recipientCount, $requestKey);
    $insert->execute();
    $campaignId = (int) $conn->insert_id;
    $insert->close();

    if ($recipients) {
        $recipientInsert = $conn->prepare(
            "INSERT INTO newsletter_campaign_recipients
                (campaign_id, subscriber_id, email_snapshot)
             VALUES (?, ?, ?)"
        );
        foreach ($recipients as $recipient) {
            $recipientId = (int) $recipient["subscriber_id"];
            $recipientEmail = (string) $recipient["email"];
            $recipientInsert->bind_param("iis", $campaignId, $recipientId, $recipientEmail);
            $recipientInsert->execute();
        }
        $recipientInsert->close();
    }

    $conn->commit();
    newsletterRespond(201, [
        "success" => true,
        "message" => "Campaign simulation recorded. No emails were sent.",
        "recipientCount" => $recipientCount,
        "simulation" => true
    ]);
} catch (Throwable $error) {
    try {
        $conn->rollback();
    } catch (Throwable $rollbackError) {
        error_log("Newsletter campaign rollback error: " . $rollbackError->getMessage());
    }
    if ($error instanceof mysqli_sql_exception && $error->getCode() === 1062) {
        newsletterRespond(409, [
            "success" => false,
            "message" => "This campaign confirmation was already processed. No second simulation was recorded."
        ]);
    }
    error_log("Newsletter campaign simulation error: " . $error->getMessage());
    newsletterRespond(500, ["success" => false, "message" => "Unable to record the campaign simulation."]);
}
?>
