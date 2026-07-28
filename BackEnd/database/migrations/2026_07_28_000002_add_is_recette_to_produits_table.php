<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('produits', 'is_recette')) {
            Schema::table('produits', function (Blueprint $table) {
                $table->boolean('is_recette')->default(false)->after('logoP');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('produits', 'is_recette')) {
            Schema::table('produits', function (Blueprint $table) {
                $table->dropColumn('is_recette');
            });
        }
    }
};
