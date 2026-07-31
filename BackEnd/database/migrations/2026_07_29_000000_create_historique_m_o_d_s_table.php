<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoriqueMODSTable extends Migration
{
    public function up()
    {
        Schema::create('historique_m_o_d_s', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('produit_id');
            $table->decimal('cout_horaire_mod', 15, 4)->nullable();
            $table->double('temps_production')->nullable();
            $table->decimal('perte_mod', 5, 2)->nullable();
            $table->double('quantite')->nullable();
            $table->decimal('cout_total', 15, 4)->nullable();
            $table->timestamp('date_debut')->useCurrent();
            $table->timestamp('date_fin')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('historique_m_o_d_s');
    }
}
