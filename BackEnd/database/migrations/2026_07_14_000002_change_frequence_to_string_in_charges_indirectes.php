<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Convertit la colonne `frequence` de ENUM vers VARCHAR(20).
 *
 * Motivation : le moteur CostEngine accepte des fréquences numériques
 * (nombre de mois, ex : 1, 3, 6, 12) en plus des valeurs textuelles
 * héritées ('mensuel', 'trimestriel', 'annuel').
 * Un ENUM ne peut pas stocker de valeurs numériques arbitraires.
 */
return new class extends Migration
{
    public function up(): void
    {
        // SQLite ne supporte pas CHANGE COLUMN — on utilise une approche
        // compatible multi-driver.
        if (Schema::hasColumn('charges_indirectes', 'frequence')) {
            // Sur MySQL : alter directement
            // Sur SQLite (tests) : recreateColumn n'est pas disponible avant
            // Laravel 10.x — on utilise une migration manuelle.
            $driver = Schema::getConnection()->getDriverName();

            if ($driver === 'sqlite') {
                // SQLite : on recrée la table avec la bonne définition
                Schema::table('charges_indirectes', function (Blueprint $table) {
                    // SQLite gère le VARCHAR implicitement — on drop/re-add
                    // via dropColumn + addColumn dans la même blueprint
                    $table->string('frequence_new', 20)->default('1')->after('montant');
                });

                DB::statement('UPDATE charges_indirectes SET frequence_new = frequence');

                Schema::table('charges_indirectes', function (Blueprint $table) {
                    $table->dropColumn('frequence');
                });

                Schema::table('charges_indirectes', function (Blueprint $table) {
                    $table->renameColumn('frequence_new', 'frequence');
                });
            } else {
                // MySQL / PostgreSQL
                DB::statement(
                    "ALTER TABLE charges_indirectes MODIFY COLUMN frequence VARCHAR(20) NOT NULL DEFAULT '1'"
                );
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('charges_indirectes', 'frequence')) {
            $driver = Schema::getConnection()->getDriverName();

            if ($driver === 'sqlite') {
                // Pas de rollback ENUM sur SQLite — on laisse en VARCHAR
                return;
            }

            // MySQL : on remet l'ENUM en ne conservant que les valeurs valides
            DB::statement(
                "UPDATE charges_indirectes SET frequence = 'mensuel'
                 WHERE frequence NOT IN ('mensuel','trimestriel','annuel')"
            );
            DB::statement(
                "ALTER TABLE charges_indirectes MODIFY COLUMN frequence
                 ENUM('mensuel','annuel','trimestriel') NOT NULL DEFAULT 'mensuel'"
            );
        }
    }
};
