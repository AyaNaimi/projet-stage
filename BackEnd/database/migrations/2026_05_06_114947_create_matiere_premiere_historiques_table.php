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
        Schema::create('matiere_premiere_historiques', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('matiere_premiere_id');
            $table->decimal('prix', 10, 2);
            $table->foreign('matiere_premiere_id')->references('id')->on('matiere_premieres')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matiere_premiere_historiques');
    }
};
