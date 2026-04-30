<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (!Schema::hasColumn('produits', 'genre')) {
                $table->string('genre')->nullable()->after('suCat_id');
            }
            if (!Schema::hasColumn('produits', 'type')) {
                $table->string('type')->nullable()->after('genre');
            }
            if (!Schema::hasColumn('produits', 'Dvie')) {
                $table->string('Dvie')->nullable()->after('type');
            }
            if (!Schema::hasColumn('produits', 'reference')) {
                $table->string('reference')->nullable()->after('Dvie');
            }

            if (!Schema::hasColumn('produits', 'produit_Etiq_id')) {
                $table->unsignedBigInteger('produit_Etiq_id')->nullable()->after('reference');
                $table->foreign('produit_Etiq_id')->references('id')->on('produits')->onDelete('set null');
            }

            if (!Schema::hasColumn('produits', 'produit_Embalg_id')) {
                $table->unsignedBigInteger('produit_Embalg_id')->nullable()->after('produit_Etiq_id');
                $table->foreign('produit_Embalg_id')->references('id')->on('produits')->onDelete('set null');
            }

            if (!Schema::hasColumn('produits', 'produit_Embalg_S_id')) {
                $table->unsignedBigInteger('produit_Embalg_S_id')->nullable()->after('produit_Embalg_id');
                $table->foreign('produit_Embalg_S_id')->references('id')->on('produits')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (Schema::hasColumn('produits', 'produit_Embalg_S_id')) {
                $table->dropForeign(['produit_Embalg_S_id']);
                $table->dropColumn('produit_Embalg_S_id');
            }
            if (Schema::hasColumn('produits', 'produit_Embalg_id')) {
                $table->dropForeign(['produit_Embalg_id']);
                $table->dropColumn('produit_Embalg_id');
            }
            if (Schema::hasColumn('produits', 'produit_Etiq_id')) {
                $table->dropForeign(['produit_Etiq_id']);
                $table->dropColumn('produit_Etiq_id');
            }
            if (Schema::hasColumn('produits', 'reference')) {
                $table->dropColumn('reference');
            }
            if (Schema::hasColumn('produits', 'Dvie')) {
                $table->dropColumn('Dvie');
            }
            if (Schema::hasColumn('produits', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('produits', 'genre')) {
                $table->dropColumn('genre');
            }
        });
    }
};
