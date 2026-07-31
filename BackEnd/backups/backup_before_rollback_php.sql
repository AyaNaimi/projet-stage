-- SQL dump created by mysql_dump_php.php on 2026-07-30T14:29:37+00:00

-- ----------------------------
-- Table structure for `absence_previsionnels`
-- ----------------------------
DROP TABLE IF EXISTS `absence_previsionnels`;
CREATE TABLE `absence_previsionnels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `absence` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_depart` date NOT NULL,
  `heure_depart` time NOT NULL,
  `date_reprise` date NOT NULL,
  `heure_reprise` time NOT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `absence_previsionnels_employee_id_foreign` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `absence_previsionnels`
-- ----------------------------


-- ----------------------------
-- Table structure for `agents`
-- ----------------------------
DROP TABLE IF EXISTS `agents`;
CREATE TABLE `agents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `NomAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PrenomAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SexeAgent` enum('Masculin','Feminin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailAgent` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TelAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AdresseAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VilleAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CodePostalAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agents_emailagent_unique` (`EmailAgent`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `agents`
-- ----------------------------


-- ----------------------------
-- Table structure for `arrondis`
-- ----------------------------
DROP TABLE IF EXISTS `arrondis`;
CREATE TABLE `arrondis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `min` double(8,2) NOT NULL,
  `max` double(8,2) NOT NULL,
  `valeur_arrondi` double(8,2) NOT NULL,
  `type_arrondi` enum('Ajouter','Détruire') COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupe_arrondi_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `arrondis_groupe_arrondi_id_foreign` (`groupe_arrondi_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `arrondis`
-- ----------------------------


-- ----------------------------
-- Table structure for `autorisations`
-- ----------------------------
DROP TABLE IF EXISTS `autorisations`;
CREATE TABLE `autorisations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `autorisation_onas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_autorisation` date NOT NULL,
  `date_expiration` date NOT NULL,
  `date_alerte` date DEFAULT NULL,
  `vehicule_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `autorisations_vehicule_id_foreign` (`vehicule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `autorisations`
-- ----------------------------


-- ----------------------------
-- Table structure for `bon__entres`
-- ----------------------------
DROP TABLE IF EXISTS `bon__entres`;
CREATE TABLE `bon__entres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `emetteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recepteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `bon__entres`
-- ----------------------------


-- ----------------------------
-- Table structure for `bon__sourties`
-- ----------------------------
DROP TABLE IF EXISTS `bon__sourties`;
CREATE TABLE `bon__sourties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `emetteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recepteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `bon__sourties`
-- ----------------------------


-- ----------------------------
-- Table structure for `bon_livraisons`
-- ----------------------------
DROP TABLE IF EXISTS `bon_livraisons`;
CREATE TABLE `bon_livraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `validation_offer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bon_livraisons_client_id_foreign` (`client_id`),
  KEY `bon_livraisons_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `bon_livraisons`
-- ----------------------------


-- ----------------------------
-- Table structure for `calculs`
-- ----------------------------
DROP TABLE IF EXISTS `calculs`;
CREATE TABLE `calculs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rubrique_id` bigint unsigned NOT NULL,
  `type_calcul` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gain` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule` text COLLATE utf8mb4_unicode_ci,
  `formule_nombre` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_base` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_taux` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_montant` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `report_base` tinyint(1) NOT NULL DEFAULT '0',
  `report_taux` tinyint(1) NOT NULL DEFAULT '0',
  `report_montant` tinyint(1) NOT NULL DEFAULT '0',
  `impression_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `impression_base` tinyint(1) NOT NULL DEFAULT '0',
  `impression_taux` tinyint(1) NOT NULL DEFAULT '0',
  `impression_montant` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_base` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_taux` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_montant` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calculs_rubrique_id_index` (`rubrique_id`),
  KEY `calculs_type_calcul_index` (`type_calcul`),
  KEY `calculs_gain_index` (`gain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `calculs`
-- ----------------------------


-- ----------------------------
-- Table structure for `calendries`
-- ----------------------------
DROP TABLE IF EXISTS `calendries`;
CREATE TABLE `calendries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `calendries`
-- ----------------------------


-- ----------------------------
-- Table structure for `calibre`
-- ----------------------------
DROP TABLE IF EXISTS `calibre`;
CREATE TABLE `calibre` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `calibre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `calibre`
-- ----------------------------
INSERT INTO `calibre` (`id`,`calibre`,`created_at`,`updated_at`) VALUES
('1','WHAT','2026-07-28 22:32:32','2026-07-28 22:32:32');


-- ----------------------------
-- Table structure for `categories`
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `logoP` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idCatMer` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_idcatmer_foreign` (`idCatMer`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `categories`
-- ----------------------------
INSERT INTO `categories` (`id`,`logoP`,`categorie`,`idCatMer`,`created_at`,`updated_at`) VALUES
('1','/storage/logoP/pda4YQQrrwXUS6rnW4qyuVNKj01667hnJ951m7ag.png','WHATU',NULL,'2026-07-28 22:32:57','2026-07-28 22:32:57'),
('2','/storage/logoP/oZLUwhj7LkimHM8hfBffZ2sGiwtiBjm2QO0dc8MJ.png','H','1','2026-07-28 22:33:17','2026-07-28 22:33:17'),
('3','','Emballage',NULL,'2026-07-28 22:39:36','2026-07-28 22:39:36'),
('4','/storage/logoP/b3ndGt5o5Ur2JQ5VIP8Xlx4GskfkW4t0NBhDgr9F.png','T','3','2026-07-29 09:46:25','2026-07-29 09:46:25');


-- ----------------------------
-- Table structure for `chargement_commandes`
-- ----------------------------
DROP TABLE IF EXISTS `chargement_commandes`;
CREATE TABLE `chargement_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicule_id` bigint unsigned NOT NULL,
  `conforme` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusChargemant` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `livreur_id` bigint unsigned NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `dateLivraisonPrevue` date NOT NULL,
  `dateLivraisonReelle` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chargement_commandes_vehicule_id_foreign` (`vehicule_id`),
  KEY `chargement_commandes_livreur_id_foreign` (`livreur_id`),
  KEY `chargement_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `chargement_commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `charges_indirectes`
-- ----------------------------
DROP TABLE IF EXISTS `charges_indirectes`;
CREATE TABLE `charges_indirectes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `frequence` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `methode_repartition` enum('volume','quantite','temps_machine') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'quantite',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `charges_indirectes`
-- ----------------------------
INSERT INTO `charges_indirectes` (`id`,`nom`,`montant`,`frequence`,`methode_repartition`,`created_at`,`updated_at`) VALUES
('1','Électricité','6.00','trimestriel','quantite','2026-07-28 22:43:35','2026-07-28 22:43:35');


-- ----------------------------
-- Table structure for `chiffre_affaires`
-- ----------------------------
DROP TABLE IF EXISTS `chiffre_affaires`;
CREATE TABLE `chiffre_affaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chiffre_affaires_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `chiffre_affaires`
-- ----------------------------


-- ----------------------------
-- Table structure for `client_groupe_client`
-- ----------------------------
DROP TABLE IF EXISTS `client_groupe_client`;
CREATE TABLE `client_groupe_client` (
  `CodeClient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Id_groupe` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`CodeClient`,`Id_groupe`),
  KEY `client_groupe_client_id_groupe_foreign` (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `client_groupe_client`
-- ----------------------------


-- ----------------------------
-- Table structure for `clients`
-- ----------------------------
DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeClient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_client` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jour` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoC` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `zone_id` bigint unsigned NOT NULL,
  `region_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_codeclient_unique` (`CodeClient`),
  KEY `clients_user_id_foreign` (`user_id`),
  KEY `clients_zone_id_foreign` (`zone_id`),
  KEY `clients_region_id_foreign` (`region_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `clients`
-- ----------------------------


-- ----------------------------
-- Table structure for `commandes`
-- ----------------------------
DROP TABLE IF EXISTS `commandes`;
CREATE TABLE `commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateSaisis` timestamp NOT NULL,
  `dateCommande` date NOT NULL,
  `datePreparationCommande` date DEFAULT NULL,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode_payement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned DEFAULT NULL,
  `site_id` bigint unsigned DEFAULT NULL,
  `fournisseur_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commandes_client_id_foreign` (`client_id`),
  KEY `commandes_site_id_foreign` (`site_id`),
  KEY `commandes_fournisseur_id_foreign` (`fournisseur_id`),
  KEY `commandes_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `comptes`
-- ----------------------------
DROP TABLE IF EXISTS `comptes`;
CREATE TABLE `comptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designations` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_compte` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `devise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rib` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `swift` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `comptes`
-- ----------------------------


-- ----------------------------
-- Table structure for `constantes`
-- ----------------------------
DROP TABLE IF EXISTS `constantes`;
CREATE TABLE `constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_constante` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memo` text COLLATE utf8mb4_unicode_ci,
  `valeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visibilite` tinyint(1) NOT NULL DEFAULT '1',
  `group_constante_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `constantes_group_constante_id_foreign` (`group_constante_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `constantes`
-- ----------------------------


-- ----------------------------
-- Table structure for `contact_clients`
-- ----------------------------
DROP TABLE IF EXISTS `contact_clients`;
CREATE TABLE `contact_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `idClient` bigint unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_clients_idclient_foreign` (`idClient`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `contact_clients`
-- ----------------------------


-- ----------------------------
-- Table structure for `contract_types`
-- ----------------------------
DROP TABLE IF EXISTS `contract_types`;
CREATE TABLE `contract_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_types_name_unique` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `contract_types`
-- ----------------------------


-- ----------------------------
-- Table structure for `contrats`
-- ----------------------------
DROP TABLE IF EXISTS `contrats`;
CREATE TABLE `contrats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `numero_contrat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_contrat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arret_prevu` date DEFAULT NULL,
  `duree_prevu` int DEFAULT NULL,
  `design` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `debut_le` date DEFAULT NULL,
  `arret_effectif` date DEFAULT NULL,
  `duree_effective` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `motif_depart` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dernier_jour_travaille` date DEFAULT NULL,
  `notification_rupture` date DEFAULT NULL,
  `engagement_procedure` date DEFAULT NULL,
  `signature_rupture_conventionnelle` date DEFAULT NULL,
  `transaction_en_cours` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contrats_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `contrats`
-- ----------------------------


-- ----------------------------
-- Table structure for `departements`
-- ----------------------------
DROP TABLE IF EXISTS `departements`;
CREATE TABLE `departements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departements_parent_id_foreign` (`parent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `departements`
-- ----------------------------


-- ----------------------------
-- Table structure for `detail_motif_absences`
-- ----------------------------
DROP TABLE IF EXISTS `detail_motif_absences`;
CREATE TABLE `detail_motif_absences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_motif_absence_id` bigint unsigned DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('payé','non payé') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'payé',
  `cause` enum('congé','maladie') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'congé',
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_motif_absences_group_motif_absence_id_foreign` (`group_motif_absence_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `detail_motif_absences`
-- ----------------------------


-- ----------------------------
-- Table structure for `details_calendries`
-- ----------------------------
DROP TABLE IF EXISTS `details_calendries`;
CREATE TABLE `details_calendries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `debut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupe_id` bigint unsigned NOT NULL,
  `groupe_horaire_id` bigint unsigned NOT NULL,
  `jourDebut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_calendries_groupe_id_foreign` (`groupe_id`),
  KEY `details_calendries_groupe_horaire_id_foreign` (`groupe_horaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `details_calendries`
-- ----------------------------


-- ----------------------------
-- Table structure for `details_periodiques`
-- ----------------------------
DROP TABLE IF EXISTS `details_periodiques`;
CREATE TABLE `details_periodiques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero_jour` int DEFAULT NULL,
  `libele` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `horaire` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupe_horaire_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_periodiques_groupe_horaire_id_foreign` (`groupe_horaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `details_periodiques`
-- ----------------------------


-- ----------------------------
-- Table structure for `details_regles`
-- ----------------------------
DROP TABLE IF EXISTS `details_regles`;
CREATE TABLE `details_regles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `heures_supplementaires` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autre_supplement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plafond` decimal(10,2) NOT NULL,
  `numero_ordre` int NOT NULL,
  `regle_compensation_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_regles_regle_compensation_id_foreign` (`regle_compensation_id`),
  CONSTRAINT `details_regles_regle_compensation_id_foreign` FOREIGN KEY (`regle_compensation_id`) REFERENCES `regle_compensation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `details_regles`
-- ----------------------------


-- ----------------------------
-- Table structure for `devis`
-- ----------------------------
DROP TABLE IF EXISTS `devis`;
CREATE TABLE `devis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `validation_offer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devis_client_id_foreign` (`client_id`),
  KEY `devis_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `devis`
-- ----------------------------


-- ----------------------------
-- Table structure for `employe_departement`
-- ----------------------------
DROP TABLE IF EXISTS `employe_departement`;
CREATE TABLE `employe_departement` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `departement_id` bigint unsigned NOT NULL,
  `date_début` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employe_departement_employe_id_foreign` (`employe_id`),
  KEY `employe_departement_departement_id_foreign` (`departement_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `employe_departement`
-- ----------------------------


-- ----------------------------
-- Table structure for `employee_histories`
-- ----------------------------
DROP TABLE IF EXISTS `employee_histories`;
CREATE TABLE `employee_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement_id` bigint unsigned DEFAULT NULL,
  `departement_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employe_id` bigint unsigned NOT NULL,
  `date_début` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_histories_departement_id_index` (`departement_id`),
  KEY `employee_histories_employe_id_index` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `employee_histories`
-- ----------------------------


-- ----------------------------
-- Table structure for `employes`
-- ----------------------------
DROP TABLE IF EXISTS `employes`;
CREATE TABLE `employes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_badge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lieu_naiss` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_naiss` date DEFAULT NULL,
  `cin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnss` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexe` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `situation_fm` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nb_enfants` int DEFAULT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fonction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `niveau` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `echelon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coeficients` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imputation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_entree` date DEFAULT NULL,
  `date_embauche` date DEFAULT NULL,
  `date_sortie` date DEFAULT NULL,
  `salaire_base` decimal(10,2) DEFAULT NULL,
  `remarque` text COLLATE utf8mb4_unicode_ci,
  `url_img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `centreCout` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departement_id` int DEFAULT NULL,
  `poste_id` bigint unsigned DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `delivree_par` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `carte_sejour` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif_depart` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dernier_jour_travaille` date DEFAULT NULL,
  `notification_rupture` date DEFAULT NULL,
  `engagement_procedure` date DEFAULT NULL,
  `signature_rupture_conventionnelle` date DEFAULT NULL,
  `transaction_en_cours` tinyint(1) DEFAULT '0',
  `bulletin_modele` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `salaire_moyen` decimal(10,2) DEFAULT NULL,
  `salaire_reference_annuel` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employes_poste_id_foreign` (`poste_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `employes`
-- ----------------------------


-- ----------------------------
-- Table structure for `encaissements`
-- ----------------------------
DROP TABLE IF EXISTS `encaissements`;
CREATE TABLE `encaissements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `referencee` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_encaissement` date NOT NULL,
  `montant_total` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comptes_id` bigint unsigned NOT NULL,
  `type_encaissement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `encaissements_comptes_id_foreign` (`comptes_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `encaissements`
-- ----------------------------


-- ----------------------------
-- Table structure for `entrer_comptes`
-- ----------------------------
DROP TABLE IF EXISTS `entrer_comptes`;
CREATE TABLE `entrer_comptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `numero_cheque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datee` date NOT NULL,
  `mode_de_paiement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entrer_comptes_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `entrer_comptes`
-- ----------------------------


-- ----------------------------
-- Table structure for `etat_recouvrements`
-- ----------------------------
DROP TABLE IF EXISTS `etat_recouvrements`;
CREATE TABLE `etat_recouvrements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `reste` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `etat_recouvrements_client_id_foreign` (`client_id`),
  KEY `etat_recouvrements_id_facture_foreign` (`id_facture`),
  KEY `etat_recouvrements_entrer_comptes_id_foreign` (`entrer_comptes_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `etat_recouvrements`
-- ----------------------------


-- ----------------------------
-- Table structure for `factures`
-- ----------------------------
DROP TABLE IF EXISTS `factures`;
CREATE TABLE `factures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `ref_BL` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_BC` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_ttc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `id_devis` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factures_client_id_foreign` (`client_id`),
  KEY `factures_id_devis_foreign` (`id_devis`),
  KEY `factures_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `factures`
-- ----------------------------


-- ----------------------------
-- Table structure for `failed_jobs`
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `failed_jobs`
-- ----------------------------


-- ----------------------------
-- Table structure for `famille_matieres`
-- ----------------------------
DROP TABLE IF EXISTS `famille_matieres`;
CREATE TABLE `famille_matieres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `famille_matieres`
-- ----------------------------


-- ----------------------------
-- Table structure for `fournisseurs`
-- ----------------------------
DROP TABLE IF EXISTS `fournisseurs`;
CREATE TABLE `fournisseurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeFournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` bigint NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fournisseurs_codefournisseur_unique` (`CodeFournisseur`),
  KEY `fournisseurs_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `fournisseurs`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_agences`
-- ----------------------------
DROP TABLE IF EXISTS `gp_agences`;
CREATE TABLE `gp_agences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banque_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_agences_banque_id_foreign` (`banque_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_agences`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_banques`
-- ----------------------------
DROP TABLE IF EXISTS `gp_banques`;
CREATE TABLE `gp_banques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_banques`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_bon_sortie`
-- ----------------------------
DROP TABLE IF EXISTS `gp_bon_sortie`;
CREATE TABLE `gp_bon_sortie` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_sortie` date DEFAULT NULL,
  `heure_sortie` time DEFAULT NULL,
  `duree_estimee` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif_sortie` text COLLATE utf8mb4_unicode_ci,
  `responsable_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responsable_poste` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_autorisation` date DEFAULT NULL,
  `heure_retour` time DEFAULT NULL,
  `date_retour` date DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bon_sortie_employee_id_foreign` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_bon_sortie`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_bultin_model_constante`
-- ----------------------------
DROP TABLE IF EXISTS `gp_bultin_model_constante`;
CREATE TABLE `gp_bultin_model_constante` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bultin_model_id` bigint unsigned NOT NULL,
  `constante_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_model_constante_bultin_model_id_foreign` (`bultin_model_id`),
  KEY `gp_bultin_model_constante_constante_id_foreign` (`constante_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_bultin_model_constante`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_bultin_model_rubrique`
-- ----------------------------
DROP TABLE IF EXISTS `gp_bultin_model_rubrique`;
CREATE TABLE `gp_bultin_model_rubrique` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bultin_model_id` bigint unsigned NOT NULL,
  `rubrique_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_model_rubrique_bultin_model_id_foreign` (`bultin_model_id`),
  KEY `gp_bultin_model_rubrique_rubrique_id_foreign` (`rubrique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_bultin_model_rubrique`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_bultin_models`
-- ----------------------------
DROP TABLE IF EXISTS `gp_bultin_models`;
CREATE TABLE `gp_bultin_models` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_bultin_model_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_models_theme_bultin_model_id_foreign` (`theme_bultin_model_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_bultin_models`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_calendriers_employes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_calendriers_employes`;
CREATE TABLE `gp_calendriers_employes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `calendrier_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_calendriers_employes_employe_id_foreign` (`employe_id`),
  KEY `gp_calendriers_employes_calendrier_id_foreign` (`calendrier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_calendriers_employes`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_categories_employes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_categories_employes`;
CREATE TABLE `gp_categories_employes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gp_categories_employes_nom_unique` (`nom`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_categories_employes`
-- ----------------------------
INSERT INTO `gp_categories_employes` (`id`,`nom`,`description`,`created_at`,`updated_at`) VALUES
('1','Cadre','Personnel cadre','2026-07-28 20:22:38','2026-07-28 20:22:38'),
('2','Technicien','Personnel technique','2026-07-28 20:22:38','2026-07-28 20:22:38'),
('3','Opérateur','Personnel d\'exécution','2026-07-28 20:22:38','2026-07-28 20:22:38');


-- ----------------------------
-- Table structure for `gp_communes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_communes`;
CREATE TABLE `gp_communes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_communes_ville_id_foreign` (`ville_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_communes`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_comptes_bancaires`
-- ----------------------------
DROP TABLE IF EXISTS `gp_comptes_bancaires`;
CREATE TABLE `gp_comptes_bancaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `agence_id` bigint unsigned DEFAULT NULL,
  `rib` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_comptes_bancaires_employe_id_foreign` (`employe_id`),
  KEY `gp_comptes_bancaires_agence_id_foreign` (`agence_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_comptes_bancaires`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_conges`
-- ----------------------------
DROP TABLE IF EXISTS `gp_conges`;
CREATE TABLE `gp_conges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `jours_cumules` decimal(5,2) NOT NULL DEFAULT '0.00',
  `jours_consomes` decimal(5,2) NOT NULL DEFAULT '0.00',
  `solde_actuel` decimal(5,2) NOT NULL DEFAULT '0.00',
  `last_update` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_conges_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_conges`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_demandes_conges`
-- ----------------------------
DROP TABLE IF EXISTS `gp_demandes_conges`;
CREATE TABLE `gp_demandes_conges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `type_conge` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `nombre_jours` int DEFAULT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `piece_jointe` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('en_attente','approuve','rejete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_demandes_conges_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_demandes_conges`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_employe_bulletins`
-- ----------------------------
DROP TABLE IF EXISTS `gp_employe_bulletins`;
CREATE TABLE `gp_employe_bulletins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `bulletin_modele_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_employe_bulletins_employe_id_foreign` (`employe_id`),
  KEY `gp_employe_bulletins_bulletin_modele_id_foreign` (`bulletin_modele_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_employe_bulletins`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_group_paie`
-- ----------------------------
DROP TABLE IF EXISTS `gp_group_paie`;
CREATE TABLE `gp_group_paie` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_group_paie`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_paie_rubrique`
-- ----------------------------
DROP TABLE IF EXISTS `gp_paie_rubrique`;
CREATE TABLE `gp_paie_rubrique` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_paie_id` bigint unsigned NOT NULL,
  `rubrique_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_paie_rubrique_group_paie_id_foreign` (`group_paie_id`),
  KEY `gp_paie_rubrique_rubrique_id_foreign` (`rubrique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_paie_rubrique`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_pays`
-- ----------------------------
DROP TABLE IF EXISTS `gp_pays`;
CREATE TABLE `gp_pays` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_pays`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_postes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_postes`;
CREATE TABLE `gp_postes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_postes_unite_id_foreign` (`unite_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_postes`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_regle_employe`
-- ----------------------------
DROP TABLE IF EXISTS `gp_regle_employe`;
CREATE TABLE `gp_regle_employe` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `regle_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_regle_employe_regle_id_foreign` (`regle_id`),
  KEY `gp_regle_employe_employe_id_regle_id_index` (`employe_id`,`regle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_regle_employe`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_services`
-- ----------------------------
DROP TABLE IF EXISTS `gp_services`;
CREATE TABLE `gp_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_services_departement_id_foreign` (`departement_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_services`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_societes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_societes`;
CREATE TABLE `gp_societes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `RaisonSocial` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ICE` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NumeroCNSS` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NumeroFiscale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RegistreCommercial` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AdresseSociete` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_societes`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_theme_bultin_model`
-- ----------------------------
DROP TABLE IF EXISTS `gp_theme_bultin_model`;
CREATE TABLE `gp_theme_bultin_model` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_par_defaut` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_theme_bultin_model`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_unites`
-- ----------------------------
DROP TABLE IF EXISTS `gp_unites`;
CREATE TABLE `gp_unites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_unites_service_id_foreign` (`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_unites`
-- ----------------------------


-- ----------------------------
-- Table structure for `gp_villes`
-- ----------------------------
DROP TABLE IF EXISTS `gp_villes`;
CREATE TABLE `gp_villes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_villes_pays_id_foreign` (`pays_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `gp_villes`
-- ----------------------------


-- ----------------------------
-- Table structure for `group_constantes`
-- ----------------------------
DROP TABLE IF EXISTS `group_constantes`;
CREATE TABLE `group_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_constantes_parent_id_foreign` (`parent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `group_constantes`
-- ----------------------------


-- ----------------------------
-- Table structure for `group_motif_absences`
-- ----------------------------
DROP TABLE IF EXISTS `group_motif_absences`;
CREATE TABLE `group_motif_absences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `group_motif_absences`
-- ----------------------------


-- ----------------------------
-- Table structure for `group_rubriques`
-- ----------------------------
DROP TABLE IF EXISTS `group_rubriques`;
CREATE TABLE `group_rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `group_rubriques`
-- ----------------------------


-- ----------------------------
-- Table structure for `groupe_arrondi`
-- ----------------------------
DROP TABLE IF EXISTS `groupe_arrondi`;
CREATE TABLE `groupe_arrondi` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HT` tinyint(1) NOT NULL DEFAULT '0',
  `HN` tinyint(1) NOT NULL DEFAULT '0',
  `PR` tinyint(1) NOT NULL DEFAULT '0',
  `HS_0` tinyint(1) NOT NULL DEFAULT '0',
  `HS_25` tinyint(1) NOT NULL DEFAULT '0',
  `HS_50` tinyint(1) NOT NULL DEFAULT '0',
  `HS_100` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `groupe_arrondi`
-- ----------------------------


-- ----------------------------
-- Table structure for `groupe_clients`
-- ----------------------------
DROP TABLE IF EXISTS `groupe_clients`;
CREATE TABLE `groupe_clients` (
  `Id_groupe` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `groupe_clients`
-- ----------------------------


-- ----------------------------
-- Table structure for `groupe_horaires`
-- ----------------------------
DROP TABLE IF EXISTS `groupe_horaires`;
CREATE TABLE `groupe_horaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('fixe','automatique','flexible ouvrable') COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `groupe_horaires`
-- ----------------------------


-- ----------------------------
-- Table structure for `heures_travail`
-- ----------------------------
DROP TABLE IF EXISTS `heures_travail`;
CREATE TABLE `heures_travail` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `heures_normales` tinyint(1) NOT NULL DEFAULT '0',
  `ferie_paye` tinyint(1) NOT NULL DEFAULT '0',
  `absence_paye` tinyint(1) NOT NULL DEFAULT '0',
  `absence` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_0` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_25` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_50` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_100` tinyint(1) NOT NULL DEFAULT '0',
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `heures_travail`
-- ----------------------------


-- ----------------------------
-- Table structure for `historique_m_o_d_s`
-- ----------------------------
DROP TABLE IF EXISTS `historique_m_o_d_s`;
CREATE TABLE `historique_m_o_d_s` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `cout_horaire_mod` decimal(15,4) DEFAULT NULL,
  `temps_production` double DEFAULT NULL,
  `perte_mod` decimal(5,2) DEFAULT NULL,
  `quantite` double DEFAULT NULL,
  `cout_total` decimal(15,4) DEFAULT NULL,
  `date_debut` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_fin` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `historique_m_o_d_s`
-- ----------------------------
INSERT INTO `historique_m_o_d_s` (`id`,`produit_id`,`cout_horaire_mod`,`temps_production`,`perte_mod`,`quantite`,`cout_total`,`date_debut`,`date_fin`,`user_id`,`created_at`,`updated_at`) VALUES
('1','1','7.0000','6','0.00','16','11.2000','2026-07-29 21:48:45','2026-07-29 21:54:51','3','2026-07-29 21:48:45','2026-07-29 21:54:51'),
('2','1','5.0000','6','4.00','1','0.7000','2026-07-29 21:54:51',NULL,'3','2026-07-29 21:54:51','2026-07-29 21:54:51');


-- ----------------------------
-- Table structure for `horaire_exceptionnels`
-- ----------------------------
DROP TABLE IF EXISTS `horaire_exceptionnels`;
CREATE TABLE `horaire_exceptionnels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `horaire_id` bigint unsigned DEFAULT NULL,
  `horaire_periodique_id` bigint unsigned DEFAULT NULL,
  `jour_debut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `horaire_exceptionnels_employee_id_foreign` (`employee_id`),
  KEY `horaire_exceptionnels_horaire_id_foreign` (`horaire_id`),
  KEY `horaire_exceptionnels_horaire_periodique_id_foreign` (`horaire_periodique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `horaire_exceptionnels`
-- ----------------------------


-- ----------------------------
-- Table structure for `horaire_periodiques`
-- ----------------------------
DROP TABLE IF EXISTS `horaire_periodiques`;
CREATE TABLE `horaire_periodiques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periode` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `horaire_periodiques`
-- ----------------------------


-- ----------------------------
-- Table structure for `horaires`
-- ----------------------------
DROP TABLE IF EXISTS `horaires`;
CREATE TABLE `horaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `typePlageHoraire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'obligatoire',
  `tauxPlageHoraire` int NOT NULL DEFAULT '0',
  `tauxType` enum('heure','jours') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'heure',
  `entreeDe` time NOT NULL DEFAULT '00:00:00',
  `entreeA` time NOT NULL DEFAULT '00:00:00',
  `penaliteEntree` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reposDe` time NOT NULL DEFAULT '00:00:00',
  `reposA` time NOT NULL DEFAULT '00:00:00',
  `deduireRepos` enum('Deduit','NonDeduit') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dureeRepos` time NOT NULL DEFAULT '00:00:00',
  `sortieDe` time NOT NULL DEFAULT '00:00:00',
  `sortieA` time NOT NULL DEFAULT '00:00:00',
  `pointageAutomatique` tinyint(1) NOT NULL DEFAULT '0',
  `penaliteSortie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cumul` int NOT NULL DEFAULT '0',
  `jourTravaille` int NOT NULL DEFAULT '0',
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `groupe_horaire_id` int DEFAULT NULL,
  `heureDebut` time DEFAULT NULL,
  `heureFin` time DEFAULT NULL,
  `horaireJournalier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeHoraire` int DEFAULT NULL,
  `veille` tinyint(1) NOT NULL DEFAULT '0',
  `jourPlus1` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `horaires`
-- ----------------------------


-- ----------------------------
-- Table structure for `imprimables`
-- ----------------------------
DROP TABLE IF EXISTS `imprimables`;
CREATE TABLE `imprimables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `imprimables`
-- ----------------------------


-- ----------------------------
-- Table structure for `jour_feries`
-- ----------------------------
DROP TABLE IF EXISTS `jour_feries`;
CREATE TABLE `jour_feries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('paye','non_paye') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree` time DEFAULT NULL,
  `taux` decimal(8,2) DEFAULT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fix` tinyint(1) NOT NULL DEFAULT '0',
  `fix_day` int DEFAULT NULL,
  `fix_month` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `jour_feries`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne__bon__entres`
-- ----------------------------
DROP TABLE IF EXISTS `ligne__bon__entres`;
CREATE TABLE `ligne__bon__entres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Entre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne__bon__entres_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne__bon__entres`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne__bon__sourties`
-- ----------------------------
DROP TABLE IF EXISTS `ligne__bon__sourties`;
CREATE TABLE `ligne__bon__sourties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Sourtie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne__bon__sourties_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne__bon__sourties`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne_commandes`
-- ----------------------------
DROP TABLE IF EXISTS `ligne_commandes`;
CREATE TABLE `ligne_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` bigint unsigned NOT NULL,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `prix_unitaire` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_commandes_commande_id_foreign` (`commande_id`),
  KEY `ligne_commandes_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne_commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne_devis`
-- ----------------------------
DROP TABLE IF EXISTS `ligne_devis`;
CREATE TABLE `ligne_devis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_devis` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_devis_produit_id_foreign` (`produit_id`),
  KEY `ligne_devis_id_devis_foreign` (`id_devis`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne_devis`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne_factures`
-- ----------------------------
DROP TABLE IF EXISTS `ligne_factures`;
CREATE TABLE `ligne_factures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_factures_produit_id_foreign` (`produit_id`),
  KEY `ligne_factures_id_facture_foreign` (`id_facture`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne_factures`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne_livraisons`
-- ----------------------------
DROP TABLE IF EXISTS `ligne_livraisons`;
CREATE TABLE `ligne_livraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_ligne_livraisons` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_livraisons_produit_id_foreign` (`produit_id`),
  KEY `ligne_livraisons_id_ligne_livraisons_foreign` (`id_ligne_livraisons`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne_livraisons`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligne_preparation_commandes`
-- ----------------------------
DROP TABLE IF EXISTS `ligne_preparation_commandes`;
CREATE TABLE `ligne_preparation_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `preparation_id` bigint unsigned NOT NULL,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `prix_unitaire` bigint unsigned NOT NULL,
  `lot` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_preparation_commandes_preparation_id_foreign` (`preparation_id`),
  KEY `ligne_preparation_commandes_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligne_preparation_commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligneencaissements`
-- ----------------------------
DROP TABLE IF EXISTS `ligneencaissements`;
CREATE TABLE `ligneencaissements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `encaissements_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligneencaissements_entrer_comptes_id_foreign` (`entrer_comptes_id`),
  KEY `ligneencaissements_encaissements_id_foreign` (`encaissements_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligneencaissements`
-- ----------------------------


-- ----------------------------
-- Table structure for `ligneentrercomptes`
-- ----------------------------
DROP TABLE IF EXISTS `ligneentrercomptes`;
CREATE TABLE `ligneentrercomptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `avance` decimal(8,2) DEFAULT NULL,
  `restee` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligneentrercomptes_entrer_comptes_id_foreign` (`entrer_comptes_id`),
  KEY `ligneentrercomptes_client_id_foreign` (`client_id`),
  KEY `ligneentrercomptes_id_facture_foreign` (`id_facture`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `ligneentrercomptes`
-- ----------------------------


-- ----------------------------
-- Table structure for `lignelivraisons`
-- ----------------------------
DROP TABLE IF EXISTS `lignelivraisons`;
CREATE TABLE `lignelivraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Livraison` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lignelivraisons_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `lignelivraisons`
-- ----------------------------


-- ----------------------------
-- Table structure for `livreurs`
-- ----------------------------
DROP TABLE IF EXISTS `livreurs`;
CREATE TABLE `livreurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cin` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `livreurs_cin_unique` (`cin`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `livreurs`
-- ----------------------------


-- ----------------------------
-- Table structure for `matiere_premiere_historiques`
-- ----------------------------
DROP TABLE IF EXISTS `matiere_premiere_historiques`;
CREATE TABLE `matiere_premiere_historiques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `matiere_premiere_id` bigint unsigned NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matiere_premiere_historiques_matiere_premiere_id_foreign` (`matiere_premiere_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `matiere_premiere_historiques`
-- ----------------------------
INSERT INTO `matiere_premiere_historiques` (`id`,`matiere_premiere_id`,`prix`,`created_at`,`updated_at`) VALUES
('1','1','88.00','2026-07-29 09:37:38','2026-07-29 09:37:38');


-- ----------------------------
-- Table structure for `matiere_premieres`
-- ----------------------------
DROP TABLE IF EXISTS `matiere_premieres`;
CREATE TABLE `matiere_premieres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_achat` decimal(10,2) NOT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `famille_id` bigint unsigned DEFAULT NULL,
  `type_id` bigint unsigned DEFAULT NULL,
  `fournisseur_id` bigint unsigned DEFAULT NULL,
  `photo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matiere_premieres_fournisseur_id_foreign` (`fournisseur_id`),
  KEY `matiere_premieres_famille_id_foreign` (`famille_id`),
  KEY `matiere_premieres_type_id_foreign` (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `matiere_premieres`
-- ----------------------------
INSERT INTO `matiere_premieres` (`id`,`nom`,`prix_achat`,`unite`,`famille_id`,`type_id`,`fournisseur_id`,`photo_url`,`created_at`,`updated_at`) VALUES
('1','Bahij','88.00','kg',NULL,NULL,NULL,NULL,'2026-07-29 09:37:38','2026-07-29 09:37:38');


-- ----------------------------
-- Table structure for `memos`
-- ----------------------------
DROP TABLE IF EXISTS `memos`;
CREATE TABLE `memos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `memos`
-- ----------------------------


-- ----------------------------
-- Table structure for `memos_constantes`
-- ----------------------------
DROP TABLE IF EXISTS `memos_constantes`;
CREATE TABLE `memos_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `memos_constantes`
-- ----------------------------


-- ----------------------------
-- Table structure for `migrations`
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `migrations`
-- ----------------------------
INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES
('1','2014_10_12_000000_create_users_table','1'),
('2','2014_10_12_100000_create_password_reset_tokens_table','1'),
('3','2019_08_19_000000_create_failed_jobs_table','1'),
('4','2019_12_14_000001_create_personal_access_tokens_table','1'),
('5','2024_02_14_090056_create_calibre','1'),
('6','2024_02_14_090057_create_categories_table','1'),
('7','2024_02_14_095626_create_produits_table','1'),
('8','2024_02_14_113433_create_fournisseurs_table','1'),
('9','2024_02_14_113433_create_mode_paimants_table','1'),
('10','2024_02_14_113443_create_regions_table','1'),
('11','2024_02_14_113443_create_zones_table','1'),
('12','2024_02_14_113444_create_secteur_clients_table','1'),
('13','2024_02_14_113445_create_clients_table','1'),
('14','2024_02_14_113446_create_site_clients_table','1'),
('15','2024_02_14_113502_create_commandes_table','1'),
('16','2024_02_14_113507_create_ligne_commandes_table','1'),
('17','2024_02_14_113514_create_status_commandes_table','1'),
('18','2024_02_23_082128_create_roles_table','1'),
('19','2024_02_23_082131_create_permissions_table','1'),
('20','2024_02_23_082133_create_role_user_table','1'),
('21','2024_02_23_082136_create_permission_role_table','1'),
('22','2024_03_05_213408_create_livreurs_table','1'),
('23','2024_03_05_213637_create_vehicules_table','1'),
('24','2024_03_05_213654_create_objectifs_table','1'),
('25','2024_03_05_213740_create_vehicule_livreurs_table','1'),
('26','2024_03_08_072214_create_chiffre_affaires_table','1'),
('27','2024_03_08_100736_create_reclamations_table','1'),
('28','2024_03_14_095822_create_devis_table','1'),
('29','2024_03_14_095823_create_ligne_devis_table','1'),
('30','2024_03_14_095841_create_factures_table','1'),
('31','2024_03_14_095842_create_entrer_comptes_table','1'),
('32','2024_03_14_104358_permis','1'),
('33','2024_03_15_095843_create_etat_recouvrements_table','1'),
('34','2024_03_19_131551_create_stock_table','1'),
('35','2024_03_19_131830_create_chargement_commandes_table','1'),
('36','2024_03_19_131851_create_preparation_commandes_table','1'),
('37','2024_03_19_131852_create_ligne_preparation_commandes_table','1'),
('38','2024_03_20_144734_create_ligne_entrer_comptes_table','1'),
('39','2024_04_02_141214_create_comptes_table','1'),
('40','2024_04_02_141354_create_encaissements_table','1'),
('41','2024_04_02_141425_create_ligneencaissements_table','1'),
('42','2024_04_15_182302_create_agents_table','1'),
('43','2024_04_16_144055_create_ligne_factures_table','1'),
('44','2024_04_16_144124_create_bon__livraisons_table','1'),
('45','2024_05_09_113954_create_ligne_livraisons_table','1'),
('46','2024_05_20_094215_create_group_rubriques_table','1'),
('47','2024_05_27_141912_create_autorisations_table','1'),
('48','2024_05_29_095748_create_rubriques_table','1'),
('49','2024_06_03_210221_create_vis_table','1'),
('50','2024_06_05_142501_create_oeufcasses_table','1'),
('51','2024_06_05_142519_create_oeuffini_semifinis_table','1'),
('52','2024_07_19_134823_lignelivraisons','1'),
('53','2024_08_05_085417_create_stock_magasins_table','1'),
('54','2024_08_09_095154_create_stock__productions_table','1'),
('55','2024_08_09_104000_create_bon__entres_table','1'),
('56','2024_08_09_104011_create_bon__sourties_table','1'),
('57','2024_08_09_104054_create_ligne__bon__entres_table','1'),
('58','2024_08_09_132241_create_ligne__bon__sourties_table','1'),
('59','2024_08_09_145915_create_offres_prix_table','1'),
('60','2024_08_09_150030_create_offre_details_table','1'),
('61','2024_08_12_095105_create_groupe_clients_table','1'),
('62','2024_08_12_111242_client_groupe_client','1'),
('63','2024_08_28_085627_create_offre_groupe_table','1'),
('64','2024_09_04_093013_create_employes_table','1'),
('65','2024_09_04_093041_create_departements_table','1'),
('66','2024_09_04_102739_create_employes_departement_table','1'),
('67','2024_09_10_084714_create_contact_clients_table','1'),
('68','2024_09_20_151653_create_contrats_table','1'),
('69','2024_10_03_114035_create_employee_histories_table','1'),
('70','2024_10_10_091744_create_villes_table','1'),
('71','2024_11_26_085638_create_contract_types_table','1'),
('72','2024_12_12_102024_prix_produit','1'),
('73','2024_12_17_084854_add_to_p_rix_produit_type_qte_et_unite','1'),
('74','2025_01_15_000001_add_calcul_fields_to_rubriques_table','1'),
('75','2025_01_15_000002_add_is_complete_to_rubriques_table','1'),
('76','2025_01_15_000003_create_types_calculs_table','1'),
('77','2025_01_21_135613_create_group_motif_absences_table','1'),
('78','2025_01_22_092855_create_detail_motif_absences_table','1'),
('79','2025_01_24_110513_create_jour_feries_table','1'),
('80','2025_01_30_151925_create_absence_previsionnels_table','1'),
('81','2025_02_03_143750_create_groupe_horaires_table','1'),
('82','2025_02_03_154813_create_horaires_table','1'),
('83','2025_02_18_114457_create_horaire_periodiques_table','1'),
('84','2025_02_18_125501_create_details_periodiques_table','1'),
('85','2025_02_27_104850_create_calendries_table','1'),
('86','2025_02_27_104956_create_details_calendries_table','1'),
('87','2025_03_21_103103_create_regle_compensation_table','1'),
('88','2025_03_21_142035_create_penalites_table','1'),
('89','2025_03_25_125256_create_groupe_arrondi_table','1'),
('90','2025_03_26_115334_create_arrondis_table','1'),
('91','2025_04_08_170439_create_parametre_bases_table','1'),
('92','2025_04_10_112719_create_details_regles_table','1'),
('93','2025_04_11_164051_create_heure_travails_table','1'),
('94','2025_04_15_114638_create_horaire_exceptionnels_table','1'),
('95','2025_04_23_114927_create_group_constantes_table','1'),
('96','2025_04_24_105126_create_type_constantes_table','1'),
('97','2025_04_25_144401_create_gp_pays','1'),
('98','2025_04_25_145016_creaye_gp_villes','1'),
('99','2025_04_25_145051_create_gp_communes','1'),
('100','2025_04_28_093519_create_gp_services_table','1');
INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES
('101','2025_04_28_093557_create_gp_unites_table','1'),
('102','2025_04_28_093632_create_gp_postes_table','1'),
('103','2025_04_30_112308_create_type_rubriques_table','1'),
('104','2025_05_02_092606_create_gp_calendriers_employes_table','1'),
('105','2025_05_02_093704_create_memos_table','1'),
('106','2025_05_06_090943_create_constantes_table','1'),
('107','2025_05_07_093039_create_memos_constantes_table','1'),
('108','2025_05_14_091422_add_infos_supplementaires_to_employes_table','1'),
('109','2025_05_14_113538_make_bulletin_modele_nullable_in_employes_table','1'),
('110','2025_05_14_135953_add_details_to_contrats_table','1'),
('111','2025_05_19_094946_create_gp_banques_table','1'),
('112','2025_05_19_094948_create_gp_agences_table','1'),
('113','2025_05_19_094948_create_gp_comptes_bancaires_table','1'),
('114','2025_05_26_091539_create_imprimables_table','1'),
('115','2025_05_26_110620_create_mois_clotures_table','1'),
('116','2025_05_26_111701_create_rappel_salaires_table','1'),
('117','2025_05_26_115125_create_proprietes_table','1'),
('118','2025_05_28_091208_create_gp_societes_table','1'),
('119','2025_05_29_101033_create_calculs_table','1'),
('120','2025_05_29_135541_create_gp_regle_employe_table','1'),
('121','2025_06_10_081212_create_gp_theme_bultin_model_table','1'),
('122','2025_06_11_094126_create_gp_bultin_models_table','1'),
('123','2025_06_11_094148_create_gp_bultin_model_rubrique_table','1'),
('124','2025_06_11_094213_create_gp_bultin_model_constante_table','1'),
('125','2025_06_11_145642_create_gp_employe_bulletins_table','1'),
('126','2025_07_22_091259_create_gp_group_paie_table','1'),
('127','2025_07_22_092719_create_gp_paie_rubrique','1'),
('128','2025_08_07_140335_create_gp_bon_sortie_table','1'),
('129','2025_09_15_154031_create_gp_conges_table','1'),
('130','2025_09_18_101715_create_gp_demandes_conges_table','1'),
('131','2026_05_06_114923_create_matiere_premieres_table','1'),
('132','2026_05_06_114947_create_matiere_premiere_historiques_table','1'),
('133','2026_05_06_120822_add_photo_url_to_matiere_premieres_table','1'),
('134','2026_05_06_131856_add_nom_to_fournisseurs_table','1'),
('135','2026_05_06_133204_create_famille_matieres_table','1'),
('136','2026_05_06_133205_create_type_matieres_table','1'),
('137','2026_05_06_133222_add_famille_and_type_to_matiere_premieres','1'),
('138','2026_05_07_074616_add_cost_fields_to_produits_table','1'),
('139','2026_05_07_074631_create_recettes_table','1'),
('140','2026_05_07_074636_create_charges_indirectes_table','1'),
('141','2026_05_07_084627_add_missing_columns_to_produits_table','1'),
('142','2026_05_07_084847_add_embalage_columns_to_produits_table','1'),
('143','2026_05_07_085239_add_all_missing_columns_to_produits_table','1'),
('144','2026_05_07_102323_add_id_cat_mer_to_categories_table','1'),
('145','2026_05_07_150515_fix_unite_column_in_produits_table','1'),
('146','2026_05_08_072211_add_fields_to_recettes_table','1'),
('147','2026_07_14_000001_add_cost_engine_fields_to_produits_table','1'),
('148','2026_07_14_000002_change_frequence_to_string_in_charges_indirectes','1'),
('149','2026_07_20_000001_add_emballage_text_fields_to_produits_table','1'),
('150','2026_07_23_000001_add_poste_id_to_employes_table','1'),
('151','2026_07_23_000002_create_gp_categories_employes_table','1'),
('152','2026_07_28_000001_add_matiere_premiere_nom_to_recettes_table','1'),
('153','2026_07_28_000002_add_is_recette_to_produits_table','1'),
('154','2026_07_29_000000_create_historique_m_o_d_s_table','2'),
('155','2026_07_29_000001_add_perte_mod_to_produits_table','3');


-- ----------------------------
-- Table structure for `mode_paimants`
-- ----------------------------
DROP TABLE IF EXISTS `mode_paimants`;
CREATE TABLE `mode_paimants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mode_paimants` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `mode_paimants`
-- ----------------------------


-- ----------------------------
-- Table structure for `mois_clotures`
-- ----------------------------
DROP TABLE IF EXISTS `mois_clotures`;
CREATE TABLE `mois_clotures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `mois_clotures`
-- ----------------------------


-- ----------------------------
-- Table structure for `objectifs`
-- ----------------------------
DROP TABLE IF EXISTS `objectifs`;
CREATE TABLE `objectifs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_objectif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valeur` int NOT NULL,
  `periode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `objectifs`
-- ----------------------------


-- ----------------------------
-- Table structure for `oeufcasses`
-- ----------------------------
DROP TABLE IF EXISTS `oeufcasses`;
CREATE TABLE `oeufcasses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nbr_oeuf_cass` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Poid_moy_oeuf` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `oeufcasses`
-- ----------------------------


-- ----------------------------
-- Table structure for `oeuffini_semifinis`
-- ----------------------------
DROP TABLE IF EXISTS `oeuffini_semifinis`;
CREATE TABLE `oeuffini_semifinis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `eau_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entier_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `janne_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blan_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LC_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oeufcongles_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entier_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `janne_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blan_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LC_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oeufcongles_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `oeuffini_semifinis`
-- ----------------------------


-- ----------------------------
-- Table structure for `offre_details`
-- ----------------------------
DROP TABLE IF EXISTS `offre_details`;
CREATE TABLE `offre_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `Prix` decimal(8,2) NOT NULL,
  `id_offre` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offre_details_produit_id_foreign` (`produit_id`),
  KEY `offre_details_id_offre_foreign` (`id_offre`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `offre_details`
-- ----------------------------


-- ----------------------------
-- Table structure for `offre_groupe_table`
-- ----------------------------
DROP TABLE IF EXISTS `offre_groupe_table`;
CREATE TABLE `offre_groupe_table` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Id_offre` bigint unsigned NOT NULL,
  `Id_groupe` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offre_groupe_table_id_offre_foreign` (`Id_offre`),
  KEY `offre_groupe_table_id_groupe_foreign` (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `offre_groupe_table`
-- ----------------------------


-- ----------------------------
-- Table structure for `offres`
-- ----------------------------
DROP TABLE IF EXISTS `offres`;
CREATE TABLE `offres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Désignation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Offre_prix` decimal(8,2) NOT NULL,
  `Date_début` date NOT NULL,
  `Date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `offres`
-- ----------------------------


-- ----------------------------
-- Table structure for `parametre_bases`
-- ----------------------------
DROP TABLE IF EXISTS `parametre_bases`;
CREATE TABLE `parametre_bases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parametre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `parametre_bases`
-- ----------------------------


-- ----------------------------
-- Table structure for `password_reset_tokens`
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `password_reset_tokens`
-- ----------------------------


-- ----------------------------
-- Table structure for `penalites`
-- ----------------------------
DROP TABLE IF EXISTS `penalites`;
CREATE TABLE `penalites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('entree','sortie') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecart_min` decimal(8,2) NOT NULL,
  `ecart_max` decimal(8,2) NOT NULL,
  `penalite` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `penalites`
-- ----------------------------


-- ----------------------------
-- Table structure for `permis`
-- ----------------------------
DROP TABLE IF EXISTS `permis`;
CREATE TABLE `permis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `livreur_id` bigint unsigned NOT NULL,
  `n_permis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_permis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_permis` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `permis_livreur_id_foreign` (`livreur_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `permis`
-- ----------------------------


-- ----------------------------
-- Table structure for `permission_role`
-- ----------------------------
DROP TABLE IF EXISTS `permission_role`;
CREATE TABLE `permission_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_role_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `permission_role_permission_id_foreign` (`permission_id`)
) ENGINE=MyISAM AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `permission_role`
-- ----------------------------
INSERT INTO `permission_role` (`id`,`role_id`,`permission_id`,`created_at`,`updated_at`) VALUES
('1','1','1',NULL,NULL),
('2','1','2',NULL,NULL),
('3','1','3',NULL,NULL),
('4','1','4',NULL,NULL),
('5','1','5',NULL,NULL),
('6','1','6',NULL,NULL),
('7','1','7',NULL,NULL),
('8','1','8',NULL,NULL),
('9','1','9',NULL,NULL),
('10','1','10',NULL,NULL),
('11','1','11',NULL,NULL),
('12','1','12',NULL,NULL),
('13','1','13',NULL,NULL),
('14','1','14',NULL,NULL),
('15','1','15',NULL,NULL),
('16','1','16',NULL,NULL),
('17','1','17',NULL,NULL),
('18','1','18',NULL,NULL),
('19','1','19',NULL,NULL),
('20','1','20',NULL,NULL),
('21','1','21',NULL,NULL),
('22','1','22',NULL,NULL),
('23','1','23',NULL,NULL),
('24','1','24',NULL,NULL),
('25','1','25',NULL,NULL),
('26','1','26',NULL,NULL),
('27','1','27',NULL,NULL),
('28','1','28',NULL,NULL),
('29','1','29',NULL,NULL),
('30','1','30',NULL,NULL),
('31','1','31',NULL,NULL),
('32','1','32',NULL,NULL),
('33','1','33',NULL,NULL),
('34','1','34',NULL,NULL),
('35','1','35',NULL,NULL),
('36','1','36',NULL,NULL),
('37','1','37',NULL,NULL),
('38','1','38',NULL,NULL),
('39','1','39',NULL,NULL),
('40','1','40',NULL,NULL),
('41','1','41',NULL,NULL),
('42','1','42',NULL,NULL),
('43','1','43',NULL,NULL),
('44','1','44',NULL,NULL),
('45','1','45',NULL,NULL),
('46','1','46',NULL,NULL),
('47','1','47',NULL,NULL),
('48','1','48',NULL,NULL),
('49','1','49',NULL,NULL),
('50','1','50',NULL,NULL),
('51','1','51',NULL,NULL),
('52','1','52',NULL,NULL),
('53','1','53',NULL,NULL),
('54','1','54',NULL,NULL),
('55','1','55',NULL,NULL),
('56','1','56',NULL,NULL),
('57','1','57',NULL,NULL),
('58','1','58',NULL,NULL),
('59','1','59',NULL,NULL),
('60','1','60',NULL,NULL),
('61','1','61',NULL,NULL),
('62','1','62',NULL,NULL),
('63','1','63',NULL,NULL),
('64','1','64',NULL,NULL),
('65','1','65',NULL,NULL),
('66','1','66',NULL,NULL),
('67','1','67',NULL,NULL),
('68','1','68',NULL,NULL),
('69','1','69',NULL,NULL),
('70','1','70',NULL,NULL),
('71','1','71',NULL,NULL),
('72','1','72',NULL,NULL),
('73','1','73',NULL,NULL),
('74','1','74',NULL,NULL),
('75','1','75',NULL,NULL),
('76','1','76',NULL,NULL),
('77','1','77',NULL,NULL),
('78','1','78',NULL,NULL),
('79','1','79',NULL,NULL),
('80','1','80',NULL,NULL),
('81','1','81',NULL,NULL),
('82','1','82',NULL,NULL),
('83','1','83',NULL,NULL),
('84','1','84',NULL,NULL),
('85','1','85',NULL,NULL),
('86','1','86',NULL,NULL),
('87','1','87',NULL,NULL),
('88','1','88',NULL,NULL),
('89','1','89',NULL,NULL),
('90','1','90',NULL,NULL),
('91','1','91',NULL,NULL),
('92','1','92',NULL,NULL),
('93','1','93',NULL,NULL),
('94','1','94',NULL,NULL),
('95','1','95',NULL,NULL),
('96','1','96',NULL,NULL),
('97','1','97',NULL,NULL),
('98','1','98',NULL,NULL),
('99','1','99',NULL,NULL),
('100','1','100',NULL,NULL);
INSERT INTO `permission_role` (`id`,`role_id`,`permission_id`,`created_at`,`updated_at`) VALUES
('101','1','101',NULL,NULL),
('102','1','102',NULL,NULL),
('103','1','103',NULL,NULL),
('104','1','104',NULL,NULL),
('105','1','105',NULL,NULL),
('106','1','106',NULL,NULL),
('107','1','107',NULL,NULL),
('108','1','108',NULL,NULL),
('109','1','109',NULL,NULL),
('110','1','110',NULL,NULL),
('111','1','111',NULL,NULL),
('112','1','112',NULL,NULL),
('113','1','113',NULL,NULL),
('114','1','114',NULL,NULL),
('115','1','115',NULL,NULL),
('116','1','116',NULL,NULL),
('117','1','117',NULL,NULL),
('118','1','118',NULL,NULL),
('119','1','119',NULL,NULL),
('120','1','120',NULL,NULL),
('121','1','121',NULL,NULL),
('122','1','122',NULL,NULL),
('123','1','123',NULL,NULL),
('124','1','124',NULL,NULL),
('125','1','125',NULL,NULL),
('126','1','126',NULL,NULL),
('127','1','127',NULL,NULL),
('128','1','128',NULL,NULL),
('129','1','129',NULL,NULL),
('130','1','130',NULL,NULL),
('131','1','131',NULL,NULL),
('132','1','132',NULL,NULL),
('133','1','133',NULL,NULL),
('134','1','134',NULL,NULL),
('135','1','135',NULL,NULL),
('136','1','136',NULL,NULL),
('137','1','137',NULL,NULL),
('138','1','138',NULL,NULL),
('139','1','139',NULL,NULL),
('140','1','140',NULL,NULL),
('141','1','141',NULL,NULL),
('142','1','142',NULL,NULL),
('143','1','143',NULL,NULL),
('144','1','144',NULL,NULL),
('145','1','145',NULL,NULL),
('146','1','146',NULL,NULL),
('147','1','147',NULL,NULL),
('148','1','148',NULL,NULL),
('149','1','149',NULL,NULL),
('150','1','150',NULL,NULL),
('151','1','151',NULL,NULL),
('152','1','152',NULL,NULL),
('153','1','153',NULL,NULL),
('154','1','154',NULL,NULL),
('155','1','155',NULL,NULL),
('156','1','156',NULL,NULL),
('157','1','157',NULL,NULL),
('158','1','158',NULL,NULL),
('159','1','159',NULL,NULL),
('160','1','160',NULL,NULL);


-- ----------------------------
-- Table structure for `permissions`
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `permissions`
-- ----------------------------
INSERT INTO `permissions` (`id`,`name`,`created_at`,`updated_at`) VALUES
('1','view_all_products','2026-07-28 20:46:46','2026-07-28 20:46:46'),
('2','create_product','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('3','edit_product','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('4','delete_product','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('5','view_all_livreurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('6','create_livreurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('7','update_livreurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('8','delete_livreurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('9','delete_fournisseurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('10','update_fournisseurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('11','create_fournisseurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('12','view_all_fournisseurs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('13','delete_user','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('14','edit_user','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('15','create_user','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('16','view_all_users','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('17','delete_clients','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('18','update_clients','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('19','view_all_clients','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('20','create_clients','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('21','view_all_vehicules','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('22','update_vehicules','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('23','create_vehicules','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('24','delete_vehicules','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('25','view_all_objectifs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('26','create_objectifs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('27','update_objectifs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('28','delete_objectifs','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('29','view_all_commandes','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('30','create_commandes','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('31','update_commandes','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('32','delete_commandes','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('33','view_all_employes','2026-07-28 20:46:47','2026-07-28 20:46:47'),
('34','create_employes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('35','update_employes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('36','delete_employes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('37','view_emp_historique','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('38','view_emp_contrats','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('39','view_all_employee_histories','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('40','create_employee_histories','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('41','update_employee_histories','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('42','delete_employee_histories','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('43','view_all_contrats','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('44','create_contrats','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('45','update_contrats','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('46','delete_contrats','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('47','view_all_absences','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('48','create_absences','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('49','update_absences','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('50','delete_absences','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('51','view_all_jour_feries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('52','create_jour_feries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('53','update_jour_feries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('54','delete_jour_feries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('55','view_all_calendries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('56','create_calendries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('57','update_calendries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('58','delete_calendries','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('59','view_all_horaires','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('60','create_horaires','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('61','update_horaires','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('62','delete_horaires','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('63','view_all_horaire_periodiques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('64','create_horaire_periodiques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('65','update_horaire_periodiques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('66','delete_horaire_periodiques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('67','view_all_rubriques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('68','create_rubriques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('69','update_rubriques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('70','delete_rubriques','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('71','view_all_constantes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('72','create_constantes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('73','update_constantes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('74','delete_constantes','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('75','view_all_groupes_paie','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('76','create_groupes_paie','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('77','update_groupes_paie','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('78','delete_groupes_paie','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('79','view_all_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('80','create_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('81','update_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('82','delete_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('83','view_all_theme_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('84','create_theme_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('85','update_theme_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('86','delete_theme_bultin_models','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('87','view_all_absence_previsionnels','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('88','create_absence_previsionnels','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('89','update_absence_previsionnels','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('90','delete_absence_previsionnels','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('91','view_all_conges','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('92','create_conges','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('93','update_conges','2026-07-28 20:46:48','2026-07-28 20:46:48'),
('94','delete_conges','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('95','view_all_demandes_conges','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('96','create_demandes_conges','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('97','update_demandes_conges','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('98','delete_demandes_conges','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('99','view_bulletin_paie','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('100','view_valeur_base','2026-07-28 20:46:49','2026-07-28 20:46:49');
INSERT INTO `permissions` (`id`,`name`,`created_at`,`updated_at`) VALUES
('101','view_all_societes','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('102','create_societes','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('103','update_societes','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('104','delete_societes','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('105','view_all_bon_de_sortie','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('106','create_bon_de_sortie','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('107','update_bon_de_sortie','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('108','delete_bon_de_sortie','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('109','view_all_regle_compensation','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('110','create_regle_compensation','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('111','update_regle_compensation','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('112','delete_regle_compensation','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('113','view_all_penalites','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('114','create_penalites','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('115','update_penalites','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('116','delete_penalites','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('117','view_all_arrondis','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('118','create_arrondis','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('119','update_arrondis','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('120','delete_arrondis','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('121','view_all_parametre_base','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('122','create_parametre_base','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('123','update_parametre_base','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('124','delete_parametre_base','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('125','view_all_heure_travail','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('126','create_heure_travail','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('127','update_heure_travail','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('128','delete_heure_travail','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('129','view_all_horaire_exceptionnel','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('130','create_horaire_exceptionnel','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('131','update_horaire_exceptionnel','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('132','delete_horaire_exceptionnel','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('133','view_all_departements','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('134','create_departements','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('135','update_departements','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('136','delete_departements','2026-07-28 20:46:49','2026-07-28 20:46:49'),
('137','view_all_group_motifs','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('138','create_group_motifs','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('139','update_group_motifs','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('140','delete_group_motifs','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('141','view_all_groupe_horaires','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('142','create_groupe_horaires','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('143','update_groupe_horaires','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('144','delete_groupe_horaires','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('145','view_all_group_constantes','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('146','create_group_constantes','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('147','update_group_constantes','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('148','delete_group_constantes','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('149','view_all_group_rubriques','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('150','create_group_rubriques','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('151','update_group_rubriques','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('152','delete_group_rubriques','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('153','view_groupes_paie_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('154','create_groupes_paie_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('155','update_groupes_paie_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('156','delete_groupes_paie_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('157','view_bultin_models_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('158','create_bultin_models_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('159','update_bultin_models_details','2026-07-28 20:46:50','2026-07-28 20:46:50'),
('160','delete_bultin_models_details','2026-07-28 20:46:50','2026-07-28 20:46:50');


-- ----------------------------
-- Table structure for `personal_access_tokens`
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `personal_access_tokens`
-- ----------------------------
INSERT INTO `personal_access_tokens` (`id`,`tokenable_type`,`tokenable_id`,`name`,`token`,`abilities`,`last_used_at`,`expires_at`,`created_at`,`updated_at`) VALUES
('1','App\\Models\\User','1','test','3c9a7fc9108bba8e67b5793c0f2ebd82efdc6fca65409f1f1d6c580633861719','[\"*\"]','2026-07-28 20:22:39',NULL,'2026-07-28 20:22:39','2026-07-28 20:22:39'),
('2','App\\Models\\User','2','API_TOKEN','4e20576c9fc79e048177f1d1825b77dfccdd86a9c06e816e253c382883eb5637','[\"*\"]',NULL,NULL,'2026-07-28 20:48:02','2026-07-28 20:48:02'),
('3','App\\Models\\User','2','API_TOKEN','1e2677b377a58559b6e76ae279fb6ad4729ec48f457a4383a9a55bad7054d17d','[\"*\"]','2026-07-29 00:03:26',NULL,'2026-07-28 21:07:48','2026-07-29 00:03:26'),
('4','App\\Models\\User','2','API_TOKEN','8e28814be3d9ae518b677b915c5a9b414ed0a47981f0c59b35a2e91fa3df3722','[\"*\"]',NULL,NULL,'2026-07-29 00:02:13','2026-07-29 00:02:13'),
('5','App\\Models\\User','2','API_TOKEN','bfeef3ba148fadbc4919134ae5c70cfd3f3fae1c936467417e8f607bd7d409de','[\"*\"]','2026-07-29 00:16:01',NULL,'2026-07-29 00:02:31','2026-07-29 00:16:01'),
('6','App\\Models\\User','2','API_TOKEN','ee46f289482177a4d4350f9226171da05ac9cf76c0a39cdd3d2186a4faf576ba','[\"*\"]','2026-07-29 00:45:28',NULL,'2026-07-29 00:22:28','2026-07-29 00:45:28'),
('7','App\\Models\\User','3','API_TOKEN','126426d24b4c0a505c5515b64a4e4e7deefa9acb0f7027fe0582bc9bb4b2425d','[\"*\"]','2026-07-30 13:40:46',NULL,'2026-07-29 08:59:55','2026-07-30 13:40:46');


-- ----------------------------
-- Table structure for `preparation_commandes`
-- ----------------------------
DROP TABLE IF EXISTS `preparation_commandes`;
CREATE TABLE `preparation_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodePreparation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `status_preparation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datePreparationCommande` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preparation_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `preparation_commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `prix_produits`
-- ----------------------------
DROP TABLE IF EXISTS `prix_produits`;
CREATE TABLE `prix_produits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `prixProduit` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `typeQte` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Unite` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prix_produits_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `prix_produits`
-- ----------------------------
INSERT INTO `prix_produits` (`id`,`produit_id`,`dateDebut`,`dateFin`,`prixProduit`,`created_at`,`updated_at`,`typeQte`,`Unite`) VALUES
('1','1','2026-06-06','2027-07-07','6.00','2026-07-28 22:36:05','2026-07-28 22:36:05','K',NULL),
('2','3','2026-07-28',NULL,'6.00','2026-07-28 22:39:36','2026-07-28 22:39:36',NULL,NULL),
('3','3','2026-07-28','2026-08-08','876.00','2026-07-29 09:39:26','2026-07-29 09:39:26','U',NULL),
('4','3','2026-06-01','2026-09-25','65.00','2026-07-29 09:39:26','2026-07-29 09:39:26','U',NULL),
('5','4','2026-06-06','2026-07-22','6.00','2026-07-29 09:48:15','2026-07-29 09:48:15','U',NULL),
('6','4','2026-06-06','2026-07-22','6.00','2026-07-29 09:51:34','2026-07-29 09:51:34','K',NULL),
('7','4','2026-06-06','2026-07-22','6.00','2026-07-29 09:52:22','2026-07-29 09:52:22','K',NULL),
('8','4','2026-06-06','2026-07-22','6.00','2026-07-29 09:52:22','2026-07-29 09:52:22','K',NULL);


-- ----------------------------
-- Table structure for `produits`
-- ----------------------------
DROP TABLE IF EXISTS `produits`;
CREATE TABLE `produits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Code_produit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seuil_alerte` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_initial` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etat_produit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marque` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grammage` decimal(10,3) DEFAULT NULL,
  `rendement` decimal(10,2) NOT NULL DEFAULT '100.00',
  `temps_production` decimal(10,2) DEFAULT NULL,
  `cout_horaire_mod` decimal(10,2) DEFAULT NULL,
  `perte_mod` decimal(5,2) DEFAULT NULL,
  `quantite_production_mensuelle` decimal(15,2) DEFAULT NULL COMMENT 'Quantité produite par mois (base de répartition des charges indirectes)',
  `temps_machine` decimal(10,2) DEFAULT NULL COMMENT 'Temps machine en minutes par unité produite',
  `logoP` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_recette` tinyint(1) NOT NULL DEFAULT '0',
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `categorie_id` bigint unsigned NOT NULL,
  `suCat_id` bigint unsigned DEFAULT NULL,
  `calibre_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `genre` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tva` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `produit_Embalg_S_id` bigint unsigned DEFAULT NULL,
  `unite_etiquette` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etiquette_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unite_embalage_primaire` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emballage_primaire_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unite_embalage_secondaire` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emballage_secondaire_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Dvie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `produit_Etiq_id` bigint unsigned DEFAULT NULL,
  `produit_Embalg_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `produits_code_produit_unique` (`Code_produit`),
  KEY `produits_user_id_foreign` (`user_id`),
  KEY `produits_categorie_id_foreign` (`categorie_id`),
  KEY `produits_sucat_id_foreign` (`suCat_id`),
  KEY `produits_calibre_id_foreign` (`calibre_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `produits`
-- ----------------------------
INSERT INTO `produits` (`id`,`Code_produit`,`designation`,`type_quantite`,`unite`,`seuil_alerte`,`stock_initial`,`etat_produit`,`marque`,`grammage`,`rendement`,`temps_production`,`cout_horaire_mod`,`perte_mod`,`quantite_production_mensuelle`,`temps_machine`,`logoP`,`is_recette`,`prix_vente`,`user_id`,`categorie_id`,`suCat_id`,`calibre_id`,`created_at`,`updated_at`,`genre`,`tva`,`produit_Embalg_S_id`,`unite_etiquette`,`etiquette_label`,`unite_embalage_primaire`,`emballage_primaire_label`,`unite_embalage_secondaire`,`emballage_secondaire_label`,`type`,`Dvie`,`reference`,`produit_Etiq_id`,`produit_Embalg_id`) VALUES
('1','6YY','9I','kg','56','6','7','6','Ovotec','57.000','100.00','6.00','5.00','4.00','7.00','7.00','storage/logop/ZdTpuqtUKYmFQCBbALwNgKETR3NSww7I5uoL0b2b.png','0','6.00','2','1','2','1','2026-07-28 22:36:05','2026-07-29 21:54:51','vente',NULL,NULL,'SDF','FGHJ','ZER','TY','ZER','FGHJ','P','7','44',NULL,NULL),
('2','REC-1785278187810','HIHISK','kg',NULL,NULL,NULL,NULL,NULL,NULL,'100.00',NULL,NULL,NULL,NULL,NULL,'storage/logop/gcjPqUlipbUy6iTe6Em7p7LEoUWDE55bXmMTK7nE.png','1',NULL,'2','2',NULL,NULL,'2026-07-28 22:36:28','2026-07-28 22:36:46',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('3','44','OISEAU','unite','KG','9','9','EXISTANTANT',NULL,'2.400','100.00','22.00','45.00',NULL,'88.00','66.00',NULL,'0','88.00','3','3',NULL,NULL,'2026-07-28 22:39:36','2026-07-29 09:39:26','vente',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'emballage','null',NULL,NULL,NULL),
('4','6667','LIFR','kg','6','7','6','GUGU','Ovotec','7.000','100.00','7.00','8.00',NULL,'7.00','9.00','storage/logop/QfvK14AQ4CPMBY22eSbxto69aE7fsTVtzrWj2Y9E.png','0','8.00','3','3','4','1','2026-07-29 09:48:15','2026-07-29 09:52:22','vente',NULL,NULL,'FG','Y','H','Y','G','TYH','P','8','7',NULL,NULL),
('5','REC-1785320377238','test','kg',NULL,NULL,NULL,NULL,NULL,NULL,'100.00',NULL,NULL,NULL,NULL,NULL,'storage/logop/Aq5hWvTmjFHMJRPfjdiWFv3EPINbvSBjkXaFUPLH.png','1',NULL,'3','4',NULL,NULL,'2026-07-29 10:19:38','2026-07-29 10:19:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('6','REC-1785325072945','huv','kg',NULL,NULL,NULL,NULL,NULL,NULL,'100.00',NULL,NULL,NULL,NULL,NULL,'storage/logop/ZKcTAm3yGpgZEwGl6tkZ5eWSRaELzDAVgtI45kUZ.png','1',NULL,'3','4',NULL,NULL,'2026-07-29 11:37:55','2026-07-29 11:38:16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);


-- ----------------------------
-- Table structure for `proprietes`
-- ----------------------------
DROP TABLE IF EXISTS `proprietes`;
CREATE TABLE `proprietes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `imprimable_id` bigint unsigned DEFAULT NULL,
  `mois_cloture_id` bigint unsigned DEFAULT NULL,
  `rappel_salaire_id` bigint unsigned DEFAULT NULL,
  `en_activite` tinyint(1) NOT NULL DEFAULT '0',
  `regularisation` tinyint(1) NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '0',
  `exclue_net_payer` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proprietes_imprimable_id_foreign` (`imprimable_id`),
  KEY `proprietes_mois_cloture_id_foreign` (`mois_cloture_id`),
  KEY `proprietes_rappel_salaire_id_foreign` (`rappel_salaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `proprietes`
-- ----------------------------


-- ----------------------------
-- Table structure for `rappel_salaires`
-- ----------------------------
DROP TABLE IF EXISTS `rappel_salaires`;
CREATE TABLE `rappel_salaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `rappel_salaires`
-- ----------------------------


-- ----------------------------
-- Table structure for `recettes`
-- ----------------------------
DROP TABLE IF EXISTS `recettes`;
CREATE TABLE `recettes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `matiere_premiere_id` bigint unsigned NOT NULL,
  `quantite` decimal(15,6) NOT NULL,
  `perte` decimal(5,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantite_reelle` decimal(15,6) DEFAULT NULL,
  `matiere_premiere_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recettes_produit_id_foreign` (`produit_id`),
  KEY `recettes_matiere_premiere_id_foreign` (`matiere_premiere_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `recettes`
-- ----------------------------
INSERT INTO `recettes` (`id`,`produit_id`,`matiere_premiere_id`,`quantite`,`perte`,`created_at`,`updated_at`,`unite`,`quantite_reelle`,`matiere_premiere_nom`) VALUES
('1','2','1','7.000000','6.00','2026-07-28 22:37:20','2026-07-28 22:37:20','8','7.000000','9I'),
('2','2','1','7.000000','7.00','2026-07-28 22:37:20','2026-07-28 22:37:20','7','7.000000','9I'),
('6','6','3','6.000000','6.00','2026-07-29 14:18:20','2026-07-29 14:18:20','KG','6.000000','OISEAU'),
('5','6','4','77.000000','77.00','2026-07-29 14:18:20','2026-07-29 14:18:20','KG','7.000000','LIFR');


-- ----------------------------
-- Table structure for `reclamations`
-- ----------------------------
DROP TABLE IF EXISTS `reclamations`;
CREATE TABLE `reclamations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `sujet` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_reclamation` datetime NOT NULL,
  `status_reclamation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `traitement_reclamation` text COLLATE utf8mb4_unicode_ci,
  `date_traitement` datetime DEFAULT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reclamations_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `reclamations`
-- ----------------------------


-- ----------------------------
-- Table structure for `regions`
-- ----------------------------
DROP TABLE IF EXISTS `regions`;
CREATE TABLE `regions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `regions`
-- ----------------------------


-- ----------------------------
-- Table structure for `regle_compensation`
-- ----------------------------
DROP TABLE IF EXISTS `regle_compensation`;
CREATE TABLE `regle_compensation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequence_calcul` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plafond_hn` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `regle_compensation`
-- ----------------------------


-- ----------------------------
-- Table structure for `role_user`
-- ----------------------------
DROP TABLE IF EXISTS `role_user`;
CREATE TABLE `role_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_user_user_id_role_id_unique` (`user_id`,`role_id`),
  KEY `role_user_role_id_foreign` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `role_user`
-- ----------------------------
INSERT INTO `role_user` (`id`,`user_id`,`role_id`,`created_at`,`updated_at`) VALUES
('1','2','1',NULL,NULL);


-- ----------------------------
-- Table structure for `roles`
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `roles`
-- ----------------------------
INSERT INTO `roles` (`id`,`name`,`created_at`,`updated_at`) VALUES
('1','admin','2026-07-28 20:46:46','2026-07-28 20:46:46');


-- ----------------------------
-- Table structure for `rubriques`
-- ----------------------------
DROP TABLE IF EXISTS `rubriques`;
CREATE TABLE `rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `intitule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_rubrique` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memo` text COLLATE utf8mb4_unicode_ci,
  `is_complete` tinyint(1) NOT NULL DEFAULT '0',
  `calculs` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gain` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule` text COLLATE utf8mb4_unicode_ci,
  `formule_nombre` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_base` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_taux` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_montant` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `report_base` tinyint(1) NOT NULL DEFAULT '0',
  `report_taux` tinyint(1) NOT NULL DEFAULT '0',
  `report_montant` tinyint(1) NOT NULL DEFAULT '0',
  `impression_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `impression_base` tinyint(1) NOT NULL DEFAULT '0',
  `impression_taux` tinyint(1) NOT NULL DEFAULT '0',
  `impression_montant` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_base` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_taux` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_montant` tinyint(1) NOT NULL DEFAULT '0',
  `group_rubrique_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rubriques_group_rubrique_id_foreign` (`group_rubrique_id`),
  KEY `rubriques_calculs_index` (`calculs`),
  KEY `rubriques_gain_index` (`gain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `rubriques`
-- ----------------------------


-- ----------------------------
-- Table structure for `secteur_clients`
-- ----------------------------
DROP TABLE IF EXISTS `secteur_clients`;
CREATE TABLE `secteur_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `secteurClient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoP` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `secteur_clients`
-- ----------------------------


-- ----------------------------
-- Table structure for `site_clients`
-- ----------------------------
DROP TABLE IF EXISTS `site_clients`;
CREATE TABLE `site_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeSiteclient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` int NOT NULL,
  `logoSC` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone_id` bigint unsigned NOT NULL,
  `region_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `site_clients_zone_id_foreign` (`zone_id`),
  KEY `site_clients_region_id_foreign` (`region_id`),
  KEY `site_clients_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `site_clients`
-- ----------------------------


-- ----------------------------
-- Table structure for `status_commandes`
-- ----------------------------
DROP TABLE IF EXISTS `status_commandes`;
CREATE TABLE `status_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_status` timestamp NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `status_commandes`
-- ----------------------------


-- ----------------------------
-- Table structure for `stock`
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `seuil_minimal` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `stock`
-- ----------------------------


-- ----------------------------
-- Table structure for `stock__productions`
-- ----------------------------
DROP TABLE IF EXISTS `stock__productions`;
CREATE TABLE `stock__productions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `quantite` int NOT NULL,
  `n_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock__productions_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `stock__productions`
-- ----------------------------


-- ----------------------------
-- Table structure for `stock_magasins`
-- ----------------------------
DROP TABLE IF EXISTS `stock_magasins`;
CREATE TABLE `stock_magasins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `quantite` int NOT NULL,
  `n_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_magasins_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `stock_magasins`
-- ----------------------------


-- ----------------------------
-- Table structure for `type_constantes`
-- ----------------------------
DROP TABLE IF EXISTS `type_constantes`;
CREATE TABLE `type_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `type_constantes`
-- ----------------------------


-- ----------------------------
-- Table structure for `type_matieres`
-- ----------------------------
DROP TABLE IF EXISTS `type_matieres`;
CREATE TABLE `type_matieres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `type_matieres`
-- ----------------------------


-- ----------------------------
-- Table structure for `type_rubriques`
-- ----------------------------
DROP TABLE IF EXISTS `type_rubriques`;
CREATE TABLE `type_rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `type_rubriques`
-- ----------------------------


-- ----------------------------
-- Table structure for `types_calculs`
-- ----------------------------
DROP TABLE IF EXISTS `types_calculs`;
CREATE TABLE `types_calculs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modele_formule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `champs_requis` json NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `exemple` text COLLATE utf8mb4_unicode_ci,
  `ordre` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `types_calculs_designation_unique` (`designation`),
  KEY `types_calculs_is_active_ordre_index` (`is_active`,`ordre`),
  KEY `types_calculs_categorie_index` (`categorie`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `types_calculs`
-- ----------------------------


-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `users`
-- ----------------------------
INSERT INTO `users` (`id`,`name`,`email`,`email_verified_at`,`password`,`photo`,`remember_token`,`created_at`,`updated_at`) VALUES
('1','Test User','dashboard@example.com',NULL,'',NULL,NULL,'2026-07-28 20:22:39','2026-07-28 20:22:39'),
('2','Admin User','admin@example.com',NULL,'admin123',NULL,NULL,'2026-07-28 20:46:51','2026-07-28 23:59:18'),
('3','','projet@gmail.com',NULL,'$2y$12$mfTDYIb/9afg7l54PXZ2lO1CPMvOI1AawZxxUVMj2IP.X4boop32S',NULL,NULL,NULL,'2026-07-29 08:59:54');


-- ----------------------------
-- Table structure for `vehicule_livreurs`
-- ----------------------------
DROP TABLE IF EXISTS `vehicule_livreurs`;
CREATE TABLE `vehicule_livreurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `livreur_id` bigint unsigned NOT NULL,
  `vehicule_id` bigint unsigned NOT NULL,
  `date_debut_affectation` date NOT NULL,
  `date_fin_affectation` date DEFAULT NULL,
  `kilometrage_debut` int NOT NULL,
  `kilometrage_fin` int DEFAULT NULL,
  `heure` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_livreurs_livreur_id_foreign` (`livreur_id`),
  KEY `vehicule_livreurs_vehicule_id_foreign` (`vehicule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `vehicule_livreurs`
-- ----------------------------


-- ----------------------------
-- Table structure for `vehicules`
-- ----------------------------
DROP TABLE IF EXISTS `vehicules`;
CREATE TABLE `vehicules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `marque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacite` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicules_matricule_unique` (`matricule`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `vehicules`
-- ----------------------------


-- ----------------------------
-- Table structure for `villes`
-- ----------------------------
DROP TABLE IF EXISTS `villes`;
CREATE TABLE `villes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `villes_region_id_foreign` (`region_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `villes`
-- ----------------------------


-- ----------------------------
-- Table structure for `vis`
-- ----------------------------
DROP TABLE IF EXISTS `vis`;
CREATE TABLE `vis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_visite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentaire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicule_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `vis`
-- ----------------------------


-- ----------------------------
-- Table structure for `zones`
-- ----------------------------
DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `zone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Data for table `zones`
-- ----------------------------


