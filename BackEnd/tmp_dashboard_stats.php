<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Http\Request;
use App\Http\Controllers\DashboardController;

$request = Request::create('/api/dashboard-stats', 'GET');
$controller = app(DashboardController::class);
$response = $controller->index($request);
echo $response->getContent();
