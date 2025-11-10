<?php

require_once 'cors.php';
require_once "../config/db.php";

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;

    if (!$user_id) {
        http_response_code(400);
        echo json_encode(["error" => "user_id is required"]);
        exit;
    }

    $sql = "SELECT 
                c.id, 
                c.product_id, 
                c.quantity, 
                p.name, 
                p.price, 
                p.photo_url, 
                s.id AS shop_id, 
                s.name AS shop_name
            FROM carts c
            JOIN products p ON c.product_id = p.id
            JOIN shops s ON c.shop_id = s.id
            WHERE c.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $cart = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($cart);
    exit;
}

// POST: add product to cart (or increase quantity)
if ($method === 'POST') {
    // detect if this is a clear cart action
    if (isset($_GET['action']) && $_GET['action'] === 'clear') {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $data['user_id'];
        $shop_id = $data['shop_id'];

        if (!$user_id || !$shop_id) {
            http_response_code(400);
            echo json_encode(["error" => "user_id and shop_id are required"]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ? AND shop_id = ?");
        $stmt->bind_param("ii", $user_id, $shop_id);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Cart cleared for this shop"]);
        exit;
    }

    // normal add-to-cart flow
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $data['user_id'];
    $product_id = $data['product_id'];
    $quantity = $data['quantity'];

    // fetch shop_id from product
    $res = $conn->query("SELECT shop_id FROM products WHERE id = $product_id LIMIT 1");
    if ($res->num_rows === 0) {
        http_response_code(400);
        echo json_encode(["error" => "Product not found"]);
        exit;
    }
    $shop_id = $res->fetch_assoc()['shop_id'];

    // check if item exists
    $res2 = $conn->query("SELECT * FROM carts WHERE user_id=$user_id AND product_id=$product_id");
    if ($res2->num_rows > 0) {
        $conn->query("UPDATE carts SET quantity=quantity+$quantity WHERE user_id=$user_id AND product_id=$product_id");
    } else {
        $stmt = $conn->prepare("INSERT INTO carts (user_id, shop_id, product_id, quantity) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiii", $user_id, $shop_id, $product_id, $quantity);
        $stmt->execute();
    }

    echo json_encode(["success" => true]);
    exit;
}


if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $quantity = $data['quantity'];

    $stmt = $conn->prepare("UPDATE carts SET quantity = ? WHERE id = ?");
    $stmt->bind_param("ii", $quantity, $id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}



if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);

    if ($id) {
        $conn->query("DELETE FROM carts WHERE id = $id");
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Missing or invalid ID"]);
    }
    exit;
}
// clear cart
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Content-Type: application/json");
    $action = $_GET['action'] ?? '';
    $data = json_decode(file_get_contents("php://input"), true);

    // Clear specific shop's cart for a user
    if ($action === 'clear') {
        $user_id = intval($data['user_id'] ?? 0);
        $shop_id = intval($data['shop_id'] ?? 0);

        if ($user_id && $shop_id) {
            $query = "DELETE FROM carts WHERE user_id = $user_id AND shop_id = $shop_id";
            if ($conn->query($query)) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $conn->error]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing user_id or shop_id"]);
        }
        exit;
    }

   
}


?>
