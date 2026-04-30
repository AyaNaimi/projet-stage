<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Make calibre_id nullable
        DB::statement("ALTER TABLE `produits` MODIFY `calibre_id` BIGINT UNSIGNED NULL;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `produits` MODIFY `calibre_id` BIGINT UNSIGNED NOT NULL;");
    }
};
