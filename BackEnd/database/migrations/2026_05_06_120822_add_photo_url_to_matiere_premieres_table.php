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
        Schema::table('matiere_premieres', function (Blueprint $table) {
            $table->string('photo_url')->nullable()->after('fournisseur_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matiere_premieres', function (Blueprint $table) {
            $table->dropColumn('photo_url');
        });
    }
};
