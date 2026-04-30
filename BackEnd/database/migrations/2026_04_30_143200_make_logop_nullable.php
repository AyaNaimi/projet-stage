<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use raw SQL to avoid requiring doctrine/dbal for column modification
        DB::statement("ALTER TABLE `produits` MODIFY `logoP` VARCHAR(255) NULL;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `produits` MODIFY `logoP` VARCHAR(255) NOT NULL;");
    }
};
