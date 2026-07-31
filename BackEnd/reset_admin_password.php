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

$user->password = Hash::make('password123');
$user->save();
echo $user->email . ':' . $user->password . "\n";
