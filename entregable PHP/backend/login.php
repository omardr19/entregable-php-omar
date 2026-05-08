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
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'] ?? '';
$contrasena = $data['contrasena'] ?? '';

if (empty($usuario) || empty($contrasena)) {
    echo json_encode([
        "success" => false,
        "mensaje" => "Usuario o contraseña vacíos"
    ]);
    exit;
}

try {

    $sql = "SELECT * FROM usuarios WHERE nombre_usuario = :usuario AND estado = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":usuario", $usuario);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {

        if ($contrasena === $user['contrasena']) {

            $idUsuario = $user['id'];

            $sqlEmp = "SELECT id FROM empleados WHERE id_usuario = :id";
            $stmtEmp = $conn->prepare($sqlEmp);
            $stmtEmp->bindParam(":id", $idUsuario);
            $stmtEmp->execute();

            $empleado = $stmtEmp->fetch(PDO::FETCH_ASSOC);
            $esEmpleado = $empleado ? true : false;

            // 🔹 Verificar cliente
            $sqlCli = "SELECT id FROM clientes WHERE id_usuario = :id";
            $stmtCli = $conn->prepare($sqlCli);
            $stmtCli->bindParam(":id", $idUsuario);
            $stmtCli->execute();

            $cliente = $stmtCli->fetch(PDO::FETCH_ASSOC);

            if (!$cliente) {

                $sqlInsert = "INSERT INTO clientes (id_usuario) VALUES (:id)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->execute([":id" => $idUsuario]);

                $idCliente = $conn->lastInsertId();

            } else {
                $idCliente = $cliente['id'];
            }

            // 🔹 RESPUESTA FINAL
            echo json_encode([
                "success" => true,
                "nombre" => $user['nombres'],
                "idUsuario" => $idUsuario,
                "idCliente" => $idCliente,
                "esEmpleado" => $esEmpleado
            ]);

        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "mensaje" => "Contraseña incorrecta"
            ]);
        }

    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "mensaje" => "Usuario no encontrado"
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "mensaje" => "Error en el servidor"
    ]);
}
?>