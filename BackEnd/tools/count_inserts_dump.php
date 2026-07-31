<?php
$file = __DIR__ . '/../backups/backup_before_rollback_php.sql';
if (!file_exists($file)) { fwrite(STDERR, "dump missing\n"); exit(2); }
$contents = file_get_contents($file);
$tables = ['recettes','matiere_premieres'];
foreach ($tables as $t) {
    $pattern = '/INSERT INTO\s+`'.preg_quote($t,'/').'`[\s\S]*?;/i';
    preg_match_all($pattern, $contents, $matches);
    $stmtCount = count($matches[0]);
    $rows = 0;
    foreach ($matches[0] as $s) {
        // count tuples by counting '),(' occurrences then +1 if non-empty
        $c = preg_match_all('/\),\s*\(/', $s, $m);
        if (preg_match('/\(.*\)/s', $s)) {
            $rows += $c + 1;
        }
    }
    echo strtoupper($t)."_DUMP_STATEMENTS=".$stmtCount."\n";
    echo strtoupper($t)."_DUMP_ROWS=".$rows."\n";
}
exit(0);
