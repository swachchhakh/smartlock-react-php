<?php
require_once 'cors.php';
require_once "../config/db.php";
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $data['user_id'];
    $shop_id = $data['shop_id'];
    $total_amount = $data['total_amount'];
    $stripe_payment_id = $data['stripe_payment_id'];
    $items = $data['items'];

    $conn->begin_transaction();

    try {
        // Insert into orders table
        $stmt = $conn->prepare("INSERT INTO orders (user_id, shop_id, total_amount, stripe_payment_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iids", $user_id, $shop_id, $total_amount, $stripe_payment_id);
        $stmt->execute();
        $order_id = $stmt->insert_id;

        // Insert order items
        $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $stmt_items->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $item['price']);
            $stmt_items->execute();
        }

        $conn->commit();
        echo json_encode(["success" => true, "order_id" => $order_id]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}

if ($method === 'GET') {
    $result = $conn->query("
        SELECT 
            o.id AS order_id, o.user_id, o.shop_id, o.total_amount, o.stripe_payment_id, o.created_at,
            oi.id AS order_item_id, oi.product_id, oi.quantity, oi.price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
    ");

    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];
        if (!isset($orders[$order_id])) {
            $orders[$order_id] = [
                'id' => $order_id,
                'user_id' => $row['user_id'],
                'shop_id' => $row['shop_id'],
                'total_amount' => $row['total_amount'],
                'stripe_payment_id' => $row['stripe_payment_id'],
                'created_at' => $row['created_at'],
                'items' => []
            ];
        }

        if ($row['order_item_id']) {
            $orders[$order_id]['items'][] = [
                'id' => $row['order_item_id'],
                'product_id' => $row['product_id'],
                'quantity' => $row['quantity'],
                'price' => $row['price']
            ];
        }
    }

    $orders = array_values($orders);
    echo json_encode(['success' => true, 'data' => $orders]);
}
