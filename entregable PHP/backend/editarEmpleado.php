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
require_once "conexion.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

try {

    $sql = "
    UPDATE usuarios
    SET
    nombres = :nombres,
    apellidos = :apellidos,
    nombre_usuario = :usuario,
    correo = :correo
    WHERE id = :id
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":id" => $data['id'],
        ":nombres" => $data['nombres'],
        ":apellidos" => $data['apellidos'],
        ":usuario" => $data['usuario'],
        ":correo" => $data['correo']
    ]);

    $sqlRol = "
    UPDATE empleados
    SET rol = :rol
    WHERE id_usuario = :id
    ";

    $stmtRol = $conn->prepare($sqlRol);

    $stmtRol->execute([
        ":rol" => $data['rol'],
        ":id" => $data['id']
    ]);

    echo json_encode([
        "success" => true
    ]);

} catch(PDOException $e) {

    echo json_encode([
        "success" => false
    ]);
}
?>