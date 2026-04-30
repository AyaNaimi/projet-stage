<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prix_produits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('produit_id')->index();
            $table->date('dateDebut')->nullable();
            $table->date('dateFin')->nullable();
            $table->decimal('prixProduit', 10, 2)->nullable();
            $table->string('typeQte', 10)->nullable();
            $table->string('Unite', 50)->nullable();
            $table->timestamps();

            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prix_produits');
    }
};
