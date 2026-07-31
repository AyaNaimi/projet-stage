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


-- (file continues identical to backup_before_rollback_php.sql)
