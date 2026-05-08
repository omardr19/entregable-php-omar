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

function limpiarNombre($texto) {

    $texto = strtolower($texto);

    $texto = iconv('UTF-8', 'ASCII//TRANSLIT', $texto);

    $texto = preg_replace('/\s+/', '-', $texto);

    $texto = preg_replace('/[^a-z0-9\-]/', '', $texto);

    return $texto;
}

try {

    $id = $_POST['id'];

    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $categoria = $_POST['categoria'];
    $stock = $_POST['stock'];
    $precio = $_POST['precio'];
    $estadoProduc = $_POST['estadoProduc'];

    // 🔹 OBTENER IMAGEN ACTUAL
    $sqlImg = "SELECT imagen
               FROM productos
               WHERE id = :id";

    $stmtImg = $conn->prepare($sqlImg);

    $stmtImg->execute([
        ":id" => $id
    ]);

    $producto = $stmtImg->fetch(PDO::FETCH_ASSOC);

    $nombreImagen = $producto['imagen'];

    if (isset($_FILES['imagen'])) {

        // eliminar imagen vieja
        if (
            $nombreImagen &&
            file_exists("../IMG/productos/" . $nombreImagen)
        ) {

            unlink("../IMG/productos/" . $nombreImagen);
        }

        $archivo = $_FILES['imagen'];

        $extension = pathinfo(
            $archivo['name'],
            PATHINFO_EXTENSION
        );

        $nombreLimpio = limpiarNombre($nombre);

        $nombreImagen =
            $nombreLimpio .
            "-" .
            time() .
            "." .
            $extension;

        $rutaDestino =
            "../IMG/productos/" . $nombreImagen;

        move_uploaded_file(
            $archivo['tmp_name'],
            $rutaDestino
        );
    }

    $sql = "UPDATE productos SET

        nombre = :nombre,
        descripcion = :descripcion,
        categoria = :categoria,
        stock = :stock,
        precio = :precio,
        imagen = :imagen,
        estadoProduc = :estadoProduc

        WHERE id = :id";

    $stmt = $conn->prepare($sql);

    $stmt->execute([

        ":id" => $id,
        ":nombre" => $nombre,
        ":descripcion" => $descripcion,
        ":categoria" => $categoria,
        ":stock" => $stock,
        ":precio" => $precio,
        ":imagen" => $nombreImagen,
        ":estadoProduc" => $estadoProduc

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