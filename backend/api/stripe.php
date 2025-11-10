<?php
require_once 'cors.php';
require_once "../config/db.php";
require '../vendor/autoload.php';
\Stripe\Stripe::setApiKey('STRIPE_SECRET_KEY');

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['user_id'];
$shopId = $input['shop_id'];

// Fetch user cart items
$items = $conn->query("SELECT p.name, p.price, c.quantity FROM carts c JOIN products p ON p.id=c.product_id WHERE c.user_id=$userId AND c.shop_id=$shopId");
$lineItems = [];
$total = 0;

while ($row = $items->fetch_assoc()) {
    $lineItems[] = [
        'price_data' => [
            'currency' => 'usd',
            'product_data' => ['name' => $row['name']],
            'unit_amount' => $row['price'] * 100,
        ],
        'quantity' => $row['quantity'],
    ];
    $total += $row['price'] * $row['quantity'];
}

$session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => $lineItems,
    'mode' => 'payment',
    'success_url' => 'http://localhost:5173/success',
    'cancel_url' => 'http://localhost:5173/cart',
]);

echo json_encode(['id' => $session->id]);
?>
