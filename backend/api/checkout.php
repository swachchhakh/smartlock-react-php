<?php


require_once 'cors.php';
require '../vendor/autoload.php';
require_once '../config/db.php';
require 'email.php';

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$shop_id = $data['shop_id'];
$total_amount = $data['total_amount'];
$email = $data['email']; 
$items = $data['items']; 

Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
try {
 
    $paymentIntent = PaymentIntent::create([
        'amount' => intval($total_amount * 100), // in cents
        'currency' => 'aud',
        'payment_method_types' => ['card'],
    ]);

   
    echo json_encode(['client_secret' => $paymentIntent->client_secret]);

    
    sendReceiptEmail($email, $items, $total_amount);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
