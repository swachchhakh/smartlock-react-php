<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once 'cors.php';
require '../vendor/autoload.php';

function sendReceiptEmail($email, $items, $total) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'saftabmiraj@gmail.com';
        $mail->Password = 'bvshnzquwhxzdoxa';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('saftabmiraj@gmail.com', 'ShopEase');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Your Order Receipt';

        $itemsHtml = "";
        foreach ($items as $i) {
            $itemsHtml .= "<tr>
                <td style='padding: 8px; border: 1px solid #ddd;'>{$i['name']}</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>\${$i['price']}</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>{$i['quantity']}</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>\$" . ($i['price'] * $i['quantity']) . "</td>
            </tr>";
        }

        $mail->Body = "
        <div style='font-family: Arial, sans-serif; line-height: 1.5; color: #333;'>
            <h2 style='color: #2D3748;'>Thank you for your order!</h2>
            <p>Here is a summary of your purchase:</p>
            <table style='border-collapse: collapse; width: 100%;'>
                <thead>
                    <tr style='background-color: #f7fafc;'>
                        <th style='padding: 8px; border: 1px solid #ddd;'>Product</th>
                        <th style='padding: 8px; border: 1px solid #ddd;'>Price</th>
                        <th style='padding: 8px; border: 1px solid #ddd;'>Quantity</th>
                        <th style='padding: 8px; border: 1px solid #ddd;'>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    $itemsHtml
                </tbody>
            </table>
            <h3 style='text-align: right; margin-top: 16px;'>Total: \$$total</h3>
            <p style='margin-top: 20px;'>We appreciate your business!</p>
        </div>
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log("Email error: {$mail->ErrorInfo}");
    }
}
?>
