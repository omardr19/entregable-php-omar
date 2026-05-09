<?php
$allowed_origins = [
    "http://localhost:5173",
    "https://benevolent-cactus-7bf28c.netlify.app"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
header("Content-Type: application/json");
require_once "conexion.php";

try {

    $sql = "SELECT p.*, c.nombre AS categoria_nombre
            FROM productos p
            INNER JOIN categoria c ON p.categoria = c.id
            WHERE p.estado = 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($productos);

} catch (PDOException $e) {
    echo json_encode(["success" => false]);
}