<?php
require_once 'cors.php';

require_once "../config/db.php";
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];

$result = $conn->query("SELECT * FROM users WHERE email='$email' LIMIT 1");

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
       
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["error" => "Invalid password"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}
?>
