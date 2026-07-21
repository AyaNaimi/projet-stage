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
        Schema::table('recettes', function (Blueprint $table) {
            $table->string('unite')->nullable();
            $table->decimal('quantite_reelle', 15, 6)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recettes', function (Blueprint $table) {
            $table->dropColumn(['unite', 'quantite_reelle']);
        });
    }
};
