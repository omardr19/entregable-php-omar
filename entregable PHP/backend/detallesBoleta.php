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

$idBoleta = $_GET['idBoleta'];

$sql = "SELECT d.*, p.nombre 
        FROM detalles_Boleta d
        JOIN productos p ON d.idProducto = p.id
        WHERE d.idBoleta = :id";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":id", $idBoleta);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>