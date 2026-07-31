<?php
$envFile = __DIR__ . '/../.env';
if (!file_exists($envFile)) {
    fwrite(STDERR, "No .env file found at $envFile\n");
    exit(2);
}
$env = [];
foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    if (!strpos($line, '=')) continue;
    list($k,$v) = explode('=', $line, 2);
    $k = trim($k); $v = trim($v);
    // remove surrounding quotes
    if (strlen($v) && (($v[0]==='"' && substr($v,-1)==='"') || ($v[0]==="'" && substr($v,-1)==="'"))) {
        $v = substr($v,1,-1);
    }
    $env[$k] = $v;
}
if (!isset($env['DB_CONNECTION']) || $env['DB_CONNECTION'] !== 'mysql') {
    fwrite(STDERR, "This script supports only MySQL (DB_CONNECTION=mysql)\n");
    exit(3);
}
$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? null;
$dbUser = $env['DB_USERNAME'] ?? null;
$dbPass = $env['DB_PASSWORD'] ?? null;
if (!$dbName || !$dbUser) {
    fwrite(STDERR, "Missing DB_DATABASE or DB_USERNAME in .env\n");
    exit(4);
}
$dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Exception $e) {
    fwrite(STDERR, "PDO connect error: " . $e->getMessage() . "\n");
    exit(5);
}
$outDir = __DIR__ . '/../backups';
if (!is_dir($outDir)) mkdir($outDir, 0755, true);
$outFile = $outDir . '/backup_before_rollback_php.sql';
$fp = fopen($outFile, 'w');
if (!$fp) { fwrite(STDERR, "Cannot open output file $outFile\n"); exit(6); }
fwrite($fp, "-- SQL dump created by mysql_dump_php.php on " . date('c') . "\n\n");
// get tables
$stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = " . $pdo->quote($dbName) . " AND table_type='BASE TABLE'");
tables:
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $table) {
    fwrite($fp, "-- ----------------------------\n");
    fwrite($fp, "-- Table structure for `{$table}`\n");
    fwrite($fp, "-- ----------------------------\n");
    $row = $pdo->query("SHOW CREATE TABLE `{$table}`")->fetch(PDO::FETCH_ASSOC);
    $create = $row['Create Table'] ?? null;
    if ($create) {
        fwrite($fp, "DROP TABLE IF EXISTS `{$table}`;\n");
        fwrite($fp, $create . ";\n\n");
    }
    // data
    fwrite($fp, "-- ----------------------------\n");
    fwrite($fp, "-- Data for table `{$table}`\n");
    fwrite($fp, "-- ----------------------------\n");
    $q = $pdo->query("SELECT * FROM `{$table}`");
    $first = true;
    $batch = [];
    $columns = null;
    while ($r = $q->fetch(PDO::FETCH_ASSOC)) {
        if ($columns === null) $columns = array_keys($r);
        $vals = [];
        foreach ($r as $v) {
            if (is_null($v)) { $vals[] = 'NULL'; continue; }
            $vals[] = $pdo->quote($v);
        }
        $batch[] = '(' . implode(',', $vals) . ')';
        if (count($batch) >= 100) {
            fwrite($fp, "INSERT INTO `{$table}` (`" . implode('`,`', $columns) . "`) VALUES\n" . implode(",\n", $batch) . ";\n");
            $batch = [];
        }
    }
    if (count($batch)) {
        fwrite($fp, "INSERT INTO `{$table}` (`" . implode('`,`', $columns) . "`) VALUES\n" . implode(",\n", $batch) . ";\n");
    }
    fwrite($fp, "\n\n");
}
fclose($fp);
$size = filesize($outFile);
if ($size === false) { fwrite(STDERR, "Could not stat output file\n"); exit(7); }
echo "BACKUP_FILE={$outFile}\nBACKUP_SIZE={$size}\n";
exit(0);
