<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

foreach (['villes', 'gp_villes', 'gp_pays', 'gp_communes'] as $table) {
    if (Schema::hasTable($table)) {
        echo "Table: $table\n";
        echo "Count: " . DB::table($table)->count() . "\n";
        echo "Columns: " . implode(', ', Schema::getColumnListing($table)) . "\n";
        if (DB::table($table)->count() > 0) {
            echo "First row: " . json_encode(DB::table($table)->first()) . "\n";
        }
        echo "---------------------------\n";
    } else {
        echo "Table $table does not exist!\n";
    }
}
