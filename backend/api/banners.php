<?php
require_once 'cors.php';
require_once "../config/db.php";

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM banners ORDER BY id ASC");
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    exit;
}


if ($method === 'POST') {
    $banner_ids = [1,2,3];
    $uploaded = [];

    foreach ($banner_ids as $id) {
        if (isset($_FILES["banner$id"]) && $_FILES["banner$id"]['error'] === 0) {
            $uploadDir = __DIR__ . "/../uploads/";
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $fileName = uniqid() . "_" . basename($_FILES["banner$id"]['name']);
            $targetFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES["banner$id"]['tmp_name'], $targetFile)) {
                $photo_url = "uploads/" . $fileName;

                // Check if banner exists
                $stmt = $conn->prepare("SELECT id FROM banners WHERE id=?");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $res = $stmt->get_result();

                if ($res->num_rows > 0) {
                    // Update
                    $stmt = $conn->prepare("UPDATE banners SET image_url=? WHERE id=?");
                    $stmt->bind_param("si", $photo_url, $id);
                    $stmt->execute();
                } else {
                    // Insert
                    $stmt = $conn->prepare("INSERT INTO banners (id, image_url) VALUES (?, ?)");
                    $stmt->bind_param("is", $id, $photo_url);
                    $stmt->execute();
                }

                $uploaded[$id] = $photo_url;
            }
        }
    }

    echo json_encode(["success" => true, "uploaded" => $uploaded]);
    exit;
}
?>
