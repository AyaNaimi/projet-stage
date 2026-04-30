<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipement_categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->timestamps();
        });

        Schema::create('equipements', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('categorie')->nullable();
            $table->unsignedInteger('quantite')->default(1);
            $table->string('numero_serie')->unique();
            $table->decimal('valeur', 12, 2)->nullable();
            $table->date('date_expiration')->nullable();
            $table->string('etat')->nullable();
            $table->string('statut')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });

        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->foreignId('equipement_id')->constrained('equipements')->cascadeOnDelete();
            $table->date('date_attribution');
            $table->date('date_restitution')->nullable();
            $table->string('etat')->nullable();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });

        Schema::create('restitutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipement_id')->constrained('equipements')->cascadeOnDelete();
            $table->foreignId('affectation_id')->nullable()->constrained('affectations')->nullOnDelete();
            $table->foreignId('employe_actuel_id')->nullable()->constrained('employes')->nullOnDelete();
            $table->date('date_attribution')->nullable();
            $table->string('etat')->nullable();
            $table->string('statut')->nullable();
            $table->date('date_retour')->nullable();
            $table->string('etat_retour')->nullable();
            $table->foreignId('nouvel_employe_id')->nullable()->constrained('employes')->nullOnDelete();
            $table->date('date_transfert')->nullable();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });

        Schema::create('demandes_attestations', function (Blueprint $table) {
            $table->id();
            $table->string('employe');
            $table->string('type');
            $table->string('langue')->nullable();
            $table->string('destinataire')->nullable();
            $table->date('date_souhaitee')->nullable();
            $table->text('commentaire')->nullable();
            $table->string('statut')->nullable();
            $table->timestamps();
        });

        Schema::create('reclamation_salaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->string('mois_concerne');
            $table->string('type_probleme');
            $table->text('description')->nullable();
            $table->string('piece_jointe')->nullable();
            $table->string('piece_jointe_nom')->nullable();
            $table->string('statut')->nullable();
            $table->timestamps();
        });

        Schema::create('reclamations_rh', function (Blueprint $table) {
            $table->id();
            $table->string('employe');
            $table->string('type_reclamation');
            $table->decimal('montant', 12, 2)->default(0);
            $table->date('date')->nullable();
            $table->string('statut')->nullable();
            $table->timestamps();
        });

        Schema::create('demandes_administration', function (Blueprint $table) {
            $table->id();
            $table->string('employe');
            $table->string('type_demande');
            $table->date('date_demande')->nullable();
            $table->string('statut')->nullable();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });

        Schema::create('demandes_materiels', function (Blueprint $table) {
            $table->id();
            $table->string('type_demandeur')->nullable();
            $table->string('demandeur');
            $table->string('categorie')->nullable();
            $table->unsignedInteger('quantite')->default(1);
            $table->string('equipement_souhaite');
            $table->string('urgence')->nullable();
            $table->date('date_souhaitee')->nullable();
            $table->text('justificatif')->nullable();
            $table->string('piece_jointe')->nullable();
            $table->string('statut')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_materiels');
        Schema::dropIfExists('demandes_administration');
        Schema::dropIfExists('reclamations_rh');
        Schema::dropIfExists('reclamation_salaires');
        Schema::dropIfExists('demandes_attestations');
        Schema::dropIfExists('restitutions');
        Schema::dropIfExists('affectations');
        Schema::dropIfExists('equipements');
        Schema::dropIfExists('equipement_categories');
    }
};
