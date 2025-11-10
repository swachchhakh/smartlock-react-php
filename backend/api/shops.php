<?php
require_once 'cors.php';
require_once "../config/db.php";
session_start();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}


$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['role'] ?? 'user'; 

if ($method === 'GET') {
    if ($user_role === 'admin') {
       
        $result = $conn->query("SELECT * FROM shops");
        $shops = $result->fetch_all(MYSQLI_ASSOC);
    } else {
       
        $stmt = $conn->prepare("SELECT * FROM shops WHERE created_by = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $shops = $result->fetch_all(MYSQLI_ASSOC);
    }
    echo json_encode($shops);
    exit;
}

if ($method === 'POST') {
    $name = $_POST['name'] ?? '';
    $desc = $_POST['description'] ?? '';
    $address = $_POST['address'] ?? '';
    $created_by = $_POST['created_by'] ?? 0;

    // Handle photo
    $photo_url = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $uploadDir = __DIR__ . "/../uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = time() . "_" . basename($_FILES['photo']['name']);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photo_url = "uploads/" . $fileName;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload photo"]);
            exit();
        }
    }

    $stmt = $conn->prepare("INSERT INTO shops (name, description, photo_url, address, created_by) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $name, $desc, $photo_url, $address, $created_by);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "shop_id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
    exit;
}
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }

    if ($user_role === 'admin') {
        $stmt = $conn->prepare("DELETE FROM shops WHERE id = ?");
        $stmt->bind_param("i", $id);
    } else {
        $stmt = $conn->prepare("DELETE FROM shops WHERE id = ? AND created_by = ?");
        $stmt->bind_param("ii", $id, $user_id);
    }

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Not authorized or shop not found"]);
    }
    exit;
}

?>
