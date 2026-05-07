<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('prix_produits', function (Blueprint $table) {
            $table->id(); // ID auto-incrémenté pour la table
            $table->unsignedBigInteger('produit_id')->nullable(); // Référence au produit
            $table->date('dateDebut')->nullable(); // Date de début
            $table->date('dateFin')->nullable(); // Date de fin
            $table->decimal('prixProduit', 10, 2)->nullable(); // Prix du produit avec deux décimales
            $table->timestamps(); // Colonnes created_at et updated_at

            // Clé étrangère vers la table des produits (si elle existe)
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
