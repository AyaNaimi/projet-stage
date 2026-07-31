<?php
$src = __DIR__ . '/../backups/backup_before_rollback_php.sql';
$dst = 'C:\\Users\\dell\\Desktop\\backup_produits_30juillet.sql';
if (!file_exists($src)) { fwrite(STDERR, "SRC_MISSING\n"); exit(2); }
$contents = file_get_contents($src);
if ($contents === false) { fwrite(STDERR, "READ_ERR\n"); exit(3); }
$r = @file_put_contents($dst, $contents);
if ($r === false) { fwrite(STDERR, "WRITE_ERR\n"); exit(4); }
$size = filesize($dst);
echo "WROTE:" . $dst . "|" . $size . "\n";
exit(0);
