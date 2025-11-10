<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'cors.php';
require_once "../config/db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch single product by ID
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_assoc());
            exit;
        }

        // Fetch products by shop ID
        if (isset($_GET['shop_id'])) {
            $shop_id = intval($_GET['shop_id']);
            $stmt = $conn->prepare("SELECT * FROM products WHERE shop_id = ?");
            $stmt->bind_param("i", $shop_id);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
            exit;
        }

        // Fetch all products
        $result = $conn->query("SELECT * FROM products");
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    case 'POST':
        // Create new product
        $shop_id = $_POST['shop_id'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        $photo_url = "";
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
            $uploadDir = __DIR__ . "/../uploads/";
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = uniqid() . "_" . basename($_FILES['photo']['name']);
            $targetFile = $uploadDir . $fileName;
            move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile);
            $photo_url = "uploads/" . $fileName;
        }

        $stmt = $conn->prepare("INSERT INTO products (shop_id, name, description, price, stock, photo_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issdis", $shop_id, $name, $description, $price, $stock, $photo_url);
        echo json_encode(["success" => $stmt->execute()]);
        break;

    case 'PUT':
        // Update product
        parse_str(file_get_contents("php://input"), $_PUT);
        $id = $_PUT['id'];
        $name = $_PUT['name'];
        $description = $_PUT['description'];
        $price = $_PUT['price'];
        $stock = $_PUT['stock'];

        $stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?");
        $stmt->bind_param("ssdii", $name, $description, $price, $stock, $id);
        echo json_encode(["success" => $stmt->execute()]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;

        if (!$id) {
            echo json_encode(["error" => "Product ID not provided"]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;
}
