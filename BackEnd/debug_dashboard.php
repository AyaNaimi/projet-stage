<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$request = Illuminate\Http\Request::create('/api/dashboard-stats', 'GET');
$response = $app->handle($request);
echo $response->getStatusCode() . PHP_EOL;
echo $response->getContent() . PHP_EOL;
$app->terminate($request, $response);
