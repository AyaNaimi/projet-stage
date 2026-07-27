<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gp_categories_employes', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default categories
        DB::table('gp_categories_employes')->insert([
            ['nom' => 'Cadre', 'description' => 'Personnel cadre', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Technicien', 'description' => 'Personnel technique', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Opérateur', 'description' => 'Personnel d\'exécution', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('gp_categories_employes');
    }
};