<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajoute trois colonnes de texte libre pour l'emballage primaire, secondaire et l'étiquette.
 * Ces champs remplacent les FK produit_Etiq_id / produit_Embalg_id / produit_Embalg_S_id
 * dans le formulaire de saisie (qui utilisait un Autocomplete converti en input texte).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (!Schema::hasColumn('produits', 'emballage_primaire_label')) {
                $table->string('emballage_primaire_label')->nullable()->after('unite_embalage_primaire');
            }
            if (!Schema::hasColumn('produits', 'emballage_secondaire_label')) {
                $table->string('emballage_secondaire_label')->nullable()->after('unite_embalage_secondaire');
            }
            if (!Schema::hasColumn('produits', 'etiquette_label')) {
                $table->string('etiquette_label')->nullable()->after('unite_etiquette');
            }
        });
    }

    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn(['emballage_primaire_label', 'emballage_secondaire_label', 'etiquette_label']);
        });
    }
};
