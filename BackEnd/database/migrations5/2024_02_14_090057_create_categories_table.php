<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('logoP')->nullable();
            $table->string('categorie');
            
            // Colonne pour définir la Famille (Parent) et le Type (Enfant)
            // Si NULL, c'est une Famille (Parent). Si rempli, c'est un Type (Enfant) lié à un parent.
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
