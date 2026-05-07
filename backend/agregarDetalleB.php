<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

/* Validar datos */
if (!isset($data['idBoleta']) || !isset($data['productos'])) {

    echo json_encode([
        "success" => false,
        "mensaje" => "Datos incompletos"
    ]);

    exit;
}

try {

    /* Iniciar transacción */
    $conn->beginTransaction();

    $stmt = $conn->prepare(
        "CALL sp_agregar_detalle_boleta(:b, :p, :c, :pr)"
    );

    foreach ($data['productos'] as $p) {

        $stmt->execute([
            ":b" => $data['idBoleta'],
            ":p" => $p['id'],
            ":c" => $p['cantidad'],
            ":pr" => $p['precio']
        ]);

        $stmt->closeCursor();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "mensaje" => "Detalles registrados correctamente"
    ]);

} catch (PDOException $e) {

    $conn->rollBack();

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "mensaje" => $e->getMessage()
    ]);

    exit;
}
?>