<?php
chdir(__DIR__);
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@example.com')->first();
if (!$user) {
    echo "NO_USER\n";
    exit(1);
}

echo $user->email . PHP_EOL;
echo $user->password . PHP_EOL;
echo (Hash::check('password123', $user->password) ? 'HASH_OK' : 'HASH_NO') . PHP_EOL;
