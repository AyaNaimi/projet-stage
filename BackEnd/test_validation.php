<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\CategorieController;
use Illuminate\Http\Request;

$controller = new CategorieController();

$cases = [
    'null_value' => null,
    'empty_string' => '',
    'string_undefined' => 'undefined'
];

foreach ($cases as $name => $val) {
    $request = Request::create('/api/categories', 'POST', [
        'categorie' => 'Test ' . $name,
        'idCatMer' => $val,
    ]);

    $response = $controller->store($request);
    echo "Case [$name] - Status: " . $response->getStatusCode() . "\n";
    echo "Content: " . $response->getContent() . "\n\n";
}
