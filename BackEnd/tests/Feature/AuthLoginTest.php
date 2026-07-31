<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthLoginTest extends TestCase
{
    public function test_login_returns_200_for_admin_with_password123(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password123')]
        );

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonPath('status', 1);
        $response->assertJsonPath('message', 'Utilisateur connecté');
        $response->assertJsonStructure(['token']);
        $this->assertTrue(Hash::check('password123', $user->fresh()->password));
    }
}
