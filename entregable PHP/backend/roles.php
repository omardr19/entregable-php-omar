<?php
$allowed_origins = [
    "http://localhost:5173",
    "https://enchanting-horse-1a7950.netlify.app"
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

    $sql = "SELECT * FROM roles WHERE estado = 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($roles);

} catch (PDOException $e) {
    echo json_encode(["success" => false]);
}