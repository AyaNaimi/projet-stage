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
            if (!Schema::hasColumn('produits', 'suCat_id')) {
                $table->unsignedBigInteger('suCat_id')->nullable()->after('categorie_id');
                $table->foreign('suCat_id')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (Schema::hasColumn('produits', 'suCat_id')) {
                $table->dropForeign(['suCat_id']);
                $table->dropColumn('suCat_id');
            }
        });
    }
};
