<?php
$host = "localhost";
$db = "entregable_php";
$user = "root";
$pass = "ben10000";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error conexión: " . $e->getMessage());
}