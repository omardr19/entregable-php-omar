<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $categoria = $_POST['categoria'];
    $stock = $_POST['stock'];
    $precio = $_POST['precio'];
    $estadoProduc = $_POST['estadoProduc'];

    $nombreImagen = null;

    if (isset($_FILES['imagen'])) {

        $archivo = $_FILES['imagen'];

        $extension = pathinfo(
            $archivo['name'],
            PATHINFO_EXTENSION
        );

        $nombreLimpio = limpiarNombre($nombre);

        // nombre final
        $nombreImagen =
            $nombreLimpio .
            "-" .
            time() .
            "." .
            $extension;

        // ruta
        $rutaDestino =
            "../IMG/productos/" . $nombreImagen;

        move_uploaded_file(
            $archivo['tmp_name'],
            $rutaDestino
        );
    }

    $sql = "INSERT INTO productos
    (
        nombre,
        descripcion,
        categoria,
        stock,
        precio,
        imagen,
        estadoProduc
    )
    VALUES
    (
        :nombre,
        :descripcion,
        :categoria,
        :stock,
        :precio,
        :imagen,
        :estadoProduc
    )";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
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