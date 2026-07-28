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
            $table->unsignedBigInteger('famille_id')->nullable()->after('unite');
            $table->unsignedBigInteger('type_id')->nullable()->after('famille_id');
            
            $table->foreign('famille_id')->references('id')->on('famille_matieres')->onDelete('set null');
            $table->foreign('type_id')->references('id')->on('type_matieres')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matiere_premieres', function (Blueprint $table) {
            $table->dropForeign(['famille_id']);
            $table->dropForeign(['type_id']);
            $table->dropColumn(['famille_id', 'type_id']);
        });
    }
};
