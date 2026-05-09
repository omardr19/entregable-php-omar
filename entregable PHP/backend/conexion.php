<?php
// PERMISOS CORS (Para que Netlify pueda entrar)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Si es una petición de prueba (OPTIONS) de los navegadores, responder OK y salir
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === TU CÓDIGO ORIGINAL INTACTO ===
$host = getenv("DB_HOST");
$db   = getenv("DB_NAME");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$port = getenv("DB_PORT");

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error conexión: " . $e->getMessage());
}