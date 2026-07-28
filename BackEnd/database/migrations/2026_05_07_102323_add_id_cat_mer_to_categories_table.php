<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'idCatMer')) {
                $table->unsignedBigInteger('idCatMer')->nullable()->after('categorie');
                $table->foreign('idCatMer')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'idCatMer')) {
                $table->dropForeign(['idCatMer']);
                $table->dropColumn('idCatMer');
            }
        });
    }
};
