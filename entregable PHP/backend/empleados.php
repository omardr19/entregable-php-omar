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

$sql = "
SELECT
u.id,
u.nombres,
u.apellidos,
u.nombre_usuario,
u.correo,
e.rol
FROM usuarios u
JOIN empleados e
ON u.id = e.id_usuario
WHERE u.estado = 1
";

$stmt = $conn->prepare($sql);
$stmt->execute();

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);
?>