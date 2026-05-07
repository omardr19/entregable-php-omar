<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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