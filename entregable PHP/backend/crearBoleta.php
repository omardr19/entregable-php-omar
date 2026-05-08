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

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validamos que vengan los datos mínimos
if (!$data) {
    echo json_encode(["success" => false, "mensaje" => "No se recibieron datos"]);
    exit;
}

try {
    $stmt = $conn->prepare("CALL sp_crear_boleta(:c, :e, :s, :i, :t)");
    $stmt->execute([
        ":c" => $data['idCliente'],
        ":e" => $data['idEmpleado'],
        ":s" => $data['subtotal'],
        ":i" => $data['igv'],
        ":t" => $data['totalFinal']
    ]);

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "id_boleta" => $res['id_boleta']
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}