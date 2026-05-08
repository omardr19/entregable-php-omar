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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$mensaje = strtolower($data['mensaje'] ?? '');

try {

    if (strpos($mensaje, 'laptop') !== false) {

        $sql = "
            SELECT nombre, precio, stock
            FROM productos
            WHERE categoria = 1
            AND estado = 1
            LIMIT 3
        ";

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($productos) > 0) {

            $respuesta = "💻 Tenemos estas laptops:\n\n";

            foreach ($productos as $p) {

                $respuesta .=
                    "• {$p['nombre']}\n" .
                    "Precio: S/ {$p['precio']}\n" .
                    "Stock: {$p['stock']}\n\n";
            }

        } else {

            $respuesta = "No hay laptops disponibles";
        }

        echo json_encode([
            "respuesta" => $respuesta
        ]);

        exit;
    }

    if (strpos($mensaje, 'monitor') !== false) {

        $sql = "
            SELECT nombre, precio
            FROM productos
            WHERE categoria = 5
            AND estado = 1
            LIMIT 3
        ";

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $respuesta = "🖥️ Monitores disponibles:\n\n";

        foreach ($productos as $p) {

            $respuesta .=
                "• {$p['nombre']} - S/ {$p['precio']}\n";
        }

        echo json_encode([
            "respuesta" => $respuesta
        ]);

        exit;
    }

    // 🔹 Respuesta por defecto
    echo json_encode([
        "respuesta" => "No encontré productos relacionados 😅"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "respuesta" => "Error al consultar productos"
    ]);
}

?>