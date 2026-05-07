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
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('logoP');
    $table->string('categorie');
    $table->unsignedBigInteger('idCatMer')->nullable(); // Allowing null values
    $table->foreign('idCatMer')
        ->references('id')
        ->on('categories')
        ->onDelete('cascade'); // Optional: cascade delete if the parent category is deleted
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
