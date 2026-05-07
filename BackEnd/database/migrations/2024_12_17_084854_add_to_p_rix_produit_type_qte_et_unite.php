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
        Schema::table('prix_produits', function (Blueprint $table) {
            $table->string('typeQte')->nullable(); // Date de début
            $table->decimal('Unite')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prix_produits', function (Blueprint $table) {
            //
        });
    }
};
