<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si el navegador hace una pregunta de prueba (OPTIONS), respondemos OK y salimos
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombres = $data['nombres'];
$apellidos = $data['apellidos'];
$usuario = $data['usuario'];
$correo = $data['correo'];
$contrasena = $data['contrasena'];
$tipo = $data['tipo']; // "cliente" o "empleado"
$rol = $data['rol'] ?? null; // solo si es empleado

try {

    $conn->beginTransaction();

    $sql = "INSERT INTO usuarios (nombres, apellidos, nombre_usuario, correo, contrasena)
            VALUES (:n, :a, :u, :c, :p)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":n" => $nombres,
        ":a" => $apellidos,
        ":u" => $usuario,
        ":c" => $correo,
        ":p" => $contrasena
    ]);

    $idUsuario = $conn->lastInsertId();

    if ($tipo === "cliente") {

        $sqlCliente = "INSERT INTO clientes (id_usuario) VALUES (:id)";
        $stmtC = $conn->prepare($sqlCliente);
        $stmtC->execute([":id" => $idUsuario]);

    }

    if ($tipo === "empleado") {

        $sqlEmpleado = "INSERT INTO empleados (id_usuario, rol) VALUES (:id, :rol)";
        $stmtE = $conn->prepare($sqlEmpleado);
        $stmtE->execute([
            ":id" => $idUsuario,
            ":rol" => $rol
        ]);
    }

    $conn->commit();

    echo json_encode(["success" => true]);

} catch (PDOException $e) {

    $conn->rollBack();

    echo json_encode([
        "success" => false,
        "mensaje" => "Error al registrar"
    ]);
}