<?php
$tables = ['recettes','matiere_premieres'];
$envFile = __DIR__ . '/../.env';
if (!file_exists($envFile)) { fwrite(STDERR, "No .env\n"); exit(2); }
$env = [];
foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    if (!strpos($line, '=')) continue;
    list($k,$v) = explode('=', $line, 2);
    $k = trim($k); $v = trim($v);
    if (strlen($v) && (($v[0]==='"' && substr($v,-1)==='"') || ($v[0]==="'" && substr($v,-1)==="'"))) {
        $v = substr($v,1,-1);
    }
    $env[$k] = $v;
}
$dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',$env['DB_HOST'] ?? '127.0.0.1',$env['DB_PORT'] ?? '3306',$env['DB_DATABASE'] ?? '');
try { $pdo = new PDO($dsn, $env['DB_USERNAME'] ?? '', $env['DB_PASSWORD'] ?? '', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]); }
catch (Exception $e) { fwrite(STDERR, "DB connect error: " . $e->getMessage() . "\n"); exit(4); }
foreach ($tables as $t) {
    $stmt = $pdo->query('SELECT COUNT(*) AS c FROM `'.$t.'`');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo strtoupper($t)."_DB_COUNT=".($row['c']??0)."\n";
}
