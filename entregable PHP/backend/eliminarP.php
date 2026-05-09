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

header("Content-Type: application/json");

require_once "conexion.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

try {

    $sqlImg = "SELECT imagen
               FROM productos
               WHERE id = :id";

    $stmtImg = $conn->prepare($sqlImg);

    $stmtImg->execute([
        ":id" => $data['id']
    ]);

    $producto = $stmtImg->fetch(PDO::FETCH_ASSOC);

    if ($producto['imagen']) {

        $ruta =
            "../IMG/productos/" .
            $producto['imagen'];

        if (file_exists($ruta)) {
            unlink($ruta);
        }
    }

    $sql = "UPDATE productos
            SET estado = 0
            WHERE id = :id";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":id" => $data['id']
    ]);

    echo json_encode([
        "success" => true
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>