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
            $table->decimal('grammage', 10, 3)->nullable()->after('marque');
            $table->decimal('rendement', 10, 2)->default(100)->after('grammage');
            $table->decimal('temps_production', 10, 2)->nullable()->after('rendement'); // minutes or hours
            $table->decimal('cout_horaire_mod', 10, 2)->nullable()->after('temps_production');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn(['grammage', 'rendement', 'temps_production', 'cout_horaire_mod']);
        });
    }
};
