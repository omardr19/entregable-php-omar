<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

$allowed_origins = [
    "http://localhost:5173",
    "https://benevolent-cactus-7bf28c.netlify.app"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
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