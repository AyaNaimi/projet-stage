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
        Schema::table('produits', function (Blueprint $table) {
            $table->unsignedBigInteger('produit_Embalg_S_id')->nullable();
            $table->string('unite_etiquette')->nullable();
            $table->string('unite_embalage_primaire')->nullable();
            $table->string('unite_embalage_secondaire')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn(['produit_Embalg_S_id', 'unite_etiquette', 'unite_embalage_primaire', 'unite_embalage_secondaire']);
        });
    }
};
