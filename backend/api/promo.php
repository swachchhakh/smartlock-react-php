<?php
require_once 'cors.php';
require_once "../config/db.php";

$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json'); // Ensure JSON response

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM promo_codes");
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    exit;
}

if ($method === 'POST') {
   
    error_log("POST data: " . print_r($_POST, true));
    
    $code = $_POST['code'] ?? null;
    $discount = $_POST['discount_percent'] ?? null;
    $expires = $_POST['expires_at'] ?? null;

    // Check for missing fields
    if (!$code || !$discount || !$expires) {
        error_log("Missing fields - code: $code, discount: $discount, expires: $expires");
        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO promo_codes (code, discount_percent, expires_at) VALUES (?,?,?)");
    $stmt->bind_param("sis", $code, $discount, $expires);
    $stmt->execute();

    echo json_encode(["success" => true, "promo_id" => $stmt->insert_id]);
}


if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'];
    $stmt = $conn->prepare("DELETE FROM promo_codes WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["success" => true]);
}
?>