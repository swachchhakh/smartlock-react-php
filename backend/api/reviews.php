<?php
require_once 'cors.php';

require_once "../config/db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        $productId = intval($_GET['product_id']);
        $result = $conn->query("SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE product_id=$productId ORDER BY created_at DESC");
        $reviews = [];
        while ($row = $result->fetch_assoc()) $reviews[] = $row;
        echo json_encode($reviews);
        break;

    case "POST":
        $input = json_decode(file_get_contents("php://input"), true);
        $productId = $input['product_id'];
        $userId = $input['user_id'];
        $rating = $input['rating'];
        $comment = $input['comment'];

        $stmt = $conn->prepare("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?,?,?,?)");
        $stmt->bind_param("iiis", $productId, $userId, $rating, $comment);

        echo $stmt->execute()
            ? json_encode(["success" => true, "message" => "Review added"])
            : json_encode(["error" => "Failed to add review"]);
        break;

    case "DELETE":
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'];

        $stmt = $conn->prepare("DELETE FROM reviews WHERE id=?");
        $stmt->bind_param("i", $id);
        echo $stmt->execute()
            ? json_encode(["success" => true, "message" => "Review deleted"])
            : json_encode(["error" => "Failed to delete review"]);
        break;

    default:
        echo json_encode(["error" => "Invalid request"]);
}
?>
