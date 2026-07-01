<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=fundiconnect', 'root', '');
$stmt = $pdo->query('SELECT id, booking_number, status FROM bookings WHERE id IN (15, 20)');
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo $row['id'] . ' | ' . $row['booking_number'] . ' | ' . $row['status'] . PHP_EOL;
}
