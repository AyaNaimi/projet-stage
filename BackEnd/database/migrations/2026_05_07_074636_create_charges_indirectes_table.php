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
        Schema::create('charges_indirectes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->decimal('montant', 15, 2);
            $table->enum('frequence', ['mensuel', 'annuel', 'trimestriel'])->default('mensuel');
            $table->enum('methode_repartition', ['volume', 'quantite', 'temps_machine'])->default('quantite');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('charges_indirectes');
    }
};
