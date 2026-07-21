<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration CostEngine (personne 5)
 *
 * Ajoute les deux colonnes utilisées par le moteur de calcul des charges
 * indirectes qui n'existaient pas encore dans la table produits :
 *   - quantite_production_mensuelle : volume mensuel produit (pour la répartition)
 *   - temps_machine                 : temps machine en minutes (méthode temps_machine)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            if (!Schema::hasColumn('produits', 'quantite_production_mensuelle')) {
                $table->decimal('quantite_production_mensuelle', 15, 2)
                      ->nullable()
                      ->after('cout_horaire_mod')
                      ->comment('Quantité produite par mois (base de répartition des charges indirectes)');
            }

            if (!Schema::hasColumn('produits', 'temps_machine')) {
                $table->decimal('temps_machine', 10, 2)
                      ->nullable()
                      ->after('quantite_production_mensuelle')
                      ->comment('Temps machine en minutes par unité produite');
            }
        });
    }

    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('produits', 'quantite_production_mensuelle')) {
                $columns[] = 'quantite_production_mensuelle';
            }
            if (Schema::hasColumn('produits', 'temps_machine')) {
                $columns[] = 'temps_machine';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
