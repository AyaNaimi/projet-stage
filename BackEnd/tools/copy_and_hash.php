<?php
$src = __DIR__ . '/../backups/backup_before_rollback_php.sql';
$dst = __DIR__ . '/../backups/backup_produits_30juillet_COPIE.sql';
$out = __DIR__ . '/../backups/hash_compare_backup_produits_30juillet.json';

if (!file_exists($src)) {
    fwrite(STDERR, "SRC_MISSING\n");
    exit(2);
}

$contents = file_get_contents($src);
if ($contents === false) {
    fwrite(STDERR, "READ_ERR\n");
    exit(3);
}

$r = @file_put_contents($dst, $contents);
if ($r === false) {
    fwrite(STDERR, "WRITE_ERR\n");
    exit(4);
}

$h1 = hash_file('sha256', $src);
$h2 = hash_file('sha256', $dst);

$result = [
    'hash_src' => $h1,
    'hash_dst' => $h2,
    'identical' => ($h1 === $h2)
];

file_put_contents($out, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "WROTE:" . $out . "\n";
exit(0);
