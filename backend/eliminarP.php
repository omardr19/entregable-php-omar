<?php

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