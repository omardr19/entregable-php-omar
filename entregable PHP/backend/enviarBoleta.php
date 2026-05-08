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

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
require_once "conexion.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idBoleta'])) {
    echo json_encode(["success" => false, "mensaje" => "ID faltante"]);
    exit;
}

$idBoleta = $data['idBoleta'];

try {

    $sql = "
        SELECT b.id, b.fechaEmision, b.Ptotal, u.correo, u.nombres
        FROM boleta b
        JOIN clientes c ON b.idCliente = c.id
        JOIN usuarios u ON c.id_usuario = u.id
        WHERE b.id = :id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([":id" => $idBoleta]);
    $boleta = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$boleta) {
        echo json_encode(["success" => false, "mensaje" => "Boleta no encontrada"]);
        exit;
    }

    if (!$boleta['correo']) {
        echo json_encode(["success" => false, "mensaje" => "Correo no disponible"]);
        exit;
    }

    $sqlDetalle = "
        SELECT p.nombre, d.cantidad, d.precio, d.subtotal
        FROM detalles_boleta d
        JOIN productos p ON d.idProducto = p.id
        WHERE d.idBoleta = :id
    ";

    $stmtD = $conn->prepare($sqlDetalle);
    $stmtD->execute([":id" => $idBoleta]);
    $detalles = $stmtD->fetchAll(PDO::FETCH_ASSOC);

    $html = "
    <div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px;'>

        <h2 style='text-align:center; color:#00C853;'>🧾 Boleta de Compra</h2>

        <p><strong>Boleta N°:</strong> {$boleta['id']}</p>
        <p><strong>Fecha:</strong> {$boleta['fechaEmision']}</p>
        <p><strong>Cliente:</strong> {$boleta['nombres']}</p>

        <hr>

        <table style='width:100%; border-collapse: collapse;'>
            <thead>
                <tr style='background:#f5f5f5;'>
                    <th style='padding:10px; border:1px solid #ddd;'>Producto</th>
                    <th style='padding:10px; border:1px solid #ddd;'>Cant.</th>
                    <th style='padding:10px; border:1px solid #ddd;'>Precio</th>
                    <th style='padding:10px; border:1px solid #ddd;'>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    ";

    $subtotalGeneral = 0;

    foreach ($detalles as $d) {
        $html .= "
        <tr>
            <td style='padding:8px; border:1px solid #ddd;'>{$d['nombre']}</td>
            <td style='padding:8px; border:1px solid #ddd; text-align:center;'>{$d['cantidad']}</td>
            <td style='padding:8px; border:1px solid #ddd;'>S/ {$d['precio']}</td>
            <td style='padding:8px; border:1px solid #ddd;'>S/ {$d['subtotal']}</td>
        </tr>
        ";

        $subtotalGeneral += $d['subtotal'];
    }

    $igv = $subtotalGeneral * 0.18;
    $total = $subtotalGeneral + $igv;

    $html .= "
            </tbody>
        </table>

        <br>

        <div style='text-align:right;'>
            <p><strong>Subtotal:</strong> S/ " . number_format($subtotalGeneral, 2) . "</p>
            <p><strong>IGV (18%):</strong> S/ " . number_format($igv, 2) . "</p>
            <p style='font-size:18px; color:#00C853;'><strong>Total:</strong> S/ " . number_format($total, 2) . "</p>
        </div>

        <hr>

        <p style='text-align:center; font-size:12px; color:gray;'>
            Gracias por tu compra 💚 <br>
            Tienda Tech
        </p>

    </div>
    ";

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST'); 
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER');
    $mail->Password = getenv('SMTP_PASS'); 
    $mail->SMTPSecure = 'tls';
    $mail->Port = getenv('SMTP_PORT');

    $mail->setFrom(getenv('SMTP_USER'), 'Tienda Tech');
    $mail->addAddress($boleta['correo'], $boleta['nombres']);

    $mail->isHTML(true);
    $mail->Subject = "Boleta de compra #{$boleta['id']}";
    $mail->Body = $html;

    $mail->send();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>