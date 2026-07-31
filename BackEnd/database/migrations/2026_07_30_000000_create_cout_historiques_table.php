<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cout_historiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            $table->decimal('cout_unitaire', 12, 4);
            $table->decimal('marge_pct', 8, 4)->nullable();
            $table->date('date_calcul');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cout_historiques');
    }
};
