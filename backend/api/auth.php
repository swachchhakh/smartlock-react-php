<?php
require_once 'cors.php';
require_once "../config/db.php";
session_start();

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $name = $input['name'];
    $email = $input['email'];
    $password = password_hash($input['password'], PASSWORD_BCRYPT);
    $role = 'user';

    $stmt = $conn->prepare("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)");
    $stmt->bind_param("ssss", $name, $email, $password, $role);
    echo $stmt->execute() ? json_encode(["success" => true]) : json_encode(["error" => "Registration failed"]);
}

if ($action === 'login') {
    $email = $input['email'];
    $password = $input['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(["success" => true]);
}
?>
