<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employes', function (Blueprint $table) {
            $table->unsignedBigInteger('poste_id')->nullable()->after('departement_id');
            $table->foreign('poste_id')->references('id')->on('gp_postes')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('employes', function (Blueprint $table) {
            $table->dropForeign(['poste_id']);
            $table->dropColumn('poste_id');
        });
    }
};
