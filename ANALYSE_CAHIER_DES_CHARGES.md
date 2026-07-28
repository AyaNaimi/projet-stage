# Analyse du projet vs cahier des charges

## Constat global

Le projet contient deja un socle fonctionnel autour de la gestion des produits, des matieres premieres, des recettes et de certaines charges. On trouve aussi une logique de calcul du cout unitaire dans le modele produit. En revanche, plusieurs blocs du cahier des charges restent absents ou seulement partiels: simulation de scenarios, pricing et marges, reporting metier centralise, historique complet des calculs, et une exposition API proprement activee cote backend.

## Elements deja faits

| Element | Etat | Detail observe | Fichiers reperes |
|---|---|---|---|
| Authentification | Fait | Login, logout, register, gestion de token Sanctum, association user-role-permission. | [BackEnd/app/Http/Controllers/AuthController.php](BackEnd/app/Http/Controllers/AuthController.php), [BackEnd/app/Models/User.php](BackEnd/app/Models/User.php), [BackEnd/app/Models/Role.php](BackEnd/app/Models/Role.php) |
| Gestion des roles | Fait | Tables `roles` et `role_user`, permissions reliees aux roles, verifications par role/permission. | [BackEnd/database/migrations/2024_02_23_082128_create_roles_table.php](BackEnd/database/migrations/2024_02_23_082128_create_roles_table.php), [BackEnd/database/migrations/2024_02_23_082133_create_role_user_table.php](BackEnd/database/migrations/2024_02_23_082133_create_role_user_table.php) |
| Produits | Fait | CRUD produit cote frontend, champs metier importants: designation, code, prix vente, grammage, rendement, temps production, cout horaire MOD. | [frontend/src/Produit/ProduitList.jsx](frontend/src/Produit/ProduitList.jsx), [BackEnd/app/Models/Produit.php](BackEnd/app/Models/Produit.php), [BackEnd/database/migrations/2024_02_14_095626_create_produits_table.php](BackEnd/database/migrations/2024_02_14_095626_create_produits_table.php) |
| Matieres premieres | Fait | CRUD matiere premiere, liaison fournisseur, photo, historique des prix via relation dediee. | [frontend/src/MatierePremiere/MatierePremiereList.jsx](frontend/src/MatierePremiere/MatierePremiereList.jsx), [BackEnd/app/Models/MatierePremiere.php](BackEnd/app/Models/MatierePremiere.php), [BackEnd/database/migrations/2026_05_06_114923_create_matiere_premieres_table.php](BackEnd/database/migrations/2026_05_06_114923_create_matiere_premieres_table.php), [BackEnd/database/migrations/2026_05_06_114947_create_matiere_premiere_historiques_table.php](BackEnd/database/migrations/2026_05_06_114947_create_matiere_premiere_historiques_table.php) |
| Recettes / nomenclature | Fait | Association produit - matiere premiere, quantite, perte, unite, quantite reelle. | [frontend/src/Recette/RecetteList.jsx](frontend/src/Recette/RecetteList.jsx), [BackEnd/app/Models/Recette.php](BackEnd/app/Models/Recette.php), [BackEnd/database/migrations/2026_05_07_074631_create_recettes_table.php](BackEnd/database/migrations/2026_05_07_074631_create_recettes_table.php), [BackEnd/database/migrations/2026_05_08_072211_add_fields_to_recettes_table.php](BackEnd/database/migrations/2026_05_08_072211_add_fields_to_recettes_table.php) |
| Charges directes | Partiel | Ecran de saisie pour temps de production et cout horaire MOD sur le produit. La logique existe, mais il manque un vrai module de calcul et de consolidation des charges directes. | [frontend/src/ChargesDirectes/ChargeDirecteList.jsx](frontend/src/ChargesDirectes/ChargeDirecteList.jsx), [BackEnd/app/Models/Produit.php](BackEnd/app/Models/Produit.php) |
| Charges indirectes | Fait | CRUD charge indirecte avec nom, montant, frequence et methode de repartition. | [frontend/src/ChargesIndirectes/ChargeIndirecteList.jsx](frontend/src/ChargesIndirectes/ChargeIndirecteList.jsx), [BackEnd/app/Models/ChargeIndirecte.php](BackEnd/app/Models/ChargeIndirecte.php), [BackEnd/database/migrations/2026_05_07_074636_create_charges_indirectes_table.php](BackEnd/database/migrations/2026_05_07_074636_create_charges_indirectes_table.php) |
| Calcul du cout unitaire | Fait | Le modele Produit calcule un cout unitaire en combinant matieres premieres, MOD et packaging via les relations produit. | [BackEnd/app/Models/Produit.php](BackEnd/app/Models/Produit.php) |
| Packaging | Partiel | Les champs existent dans Produit via les references vers produits emballage/etiquette, et le cout unitaire les additionne, mais pas de module metier dedie identifie. | [BackEnd/app/Models/Produit.php](BackEnd/app/Models/Produit.php) |
| Export et impression | Partiel | Les ecrans produits et matieres premieres embarquent deja des exports PDF, impression et Excel. | [frontend/src/Produit/ProduitList.jsx](frontend/src/Produit/ProduitList.jsx), [frontend/src/MatierePremiere/MatierePremiereList.jsx](frontend/src/MatierePremiere/MatierePremiereList.jsx) |
| Navigation applicative | Fait | Routes frontend pour login, dashboard, produits, recettes, charges directes, matieres premieres et charges indirectes. | [frontend/src/App.jsx](frontend/src/App.jsx) |

## Elements manquants ou incomplets

| Element du cahier des charges | Manque constate | Impact | Priorite |
|---|---|---|---|
| Simulation en temps reel | Aucun vrai module de simulation/scenarios n a ete identifie. Pas de variation de prix, rendement ou volume avec recalcul instantane. | Impossible de comparer plusieurs hypotheses de cout. | Haute |
| Pricing et marges | Pas de module dedie pour saisir le prix de vente, calculer la marge brute, le taux de marge et le prix minimum conseille. | La decision commerciale reste incomplete. | Haute |
| Reporting metier centralise | Pas de dashboard cout de revient, pas d indicateurs sur cout par produit, evolution des couts, produits non rentables. | Pas de vue directionnelle sur la rentabilite. | Haute |
| Export reporting global | Les exports existent au niveau liste, mais pas de rapport metier centralise en PDF/Excel pour le cout de revient. | Le reporting reste fragmenté. | Moyenne |
| Historique des calculs | Pas de journalisation visible des calculs de cout, des scenarios ou des resultats par date/version. | Pas de traçabilite des decisions de calcul. | Haute |
| Versioning produits | Aucun mecanisme explicite de versioning des fiches produit ou de suivi des variantes de recette. | Risque de perte d historique fonctionnel. | Moyenne |
| Backend API proprement exposee | `routes/api.php` est encore largement commente dans l etat actuel du projet, alors que le frontend consomme des endpoints API. | Risque d incoherence entre UI et backend actif. | Haute |
| Calcul de lot complet | Le cout unitaire existe, mais le cout total par lot et la consolidation complete des charges ne sont pas clairement exposes dans un module metier dedie. | Le calcul reste partiel pour l exploitation industrielle. | Haute |
| Repartition automatique des charges indirectes | Le champ de methode de repartition existe, mais aucun moteur de repartition complet n a ete identifie. | Les charges indirectes restent declaratives plutot que calculatoires. | Haute |
| Multi-produits / multi-recettes complet | La structure supporte plusieurs produits et recettes, mais aucun ecran de comparaison ou de pilotage multi-produits n a ete identifie. | Comparaison industrielle insuffisante. | Moyenne |
| Tableau de bord metier de synthese | Le dashboard courant est oriente RH/activite et non cout de revient. | L application ne remplit pas encore son role de pilotage couts. | Haute |
| Gestion avancee du packaging | Pas de gestion dediee pour film OPP, carton et etiquette comme entites ou nomenclature autonome. | Les couts emballage ne sont pas pilotes finement. | Moyenne |

## Synthese rapide

Le projet couvre deja le noyau fonctionnel suivant: produit, matiere premiere, recette, charges indirectes, authentication et base de calcul unitaire. Le gap principal est le passage d un outil de saisie/crud a un vrai outil de pilotage du cout de revient avec simulation, marges, reporting et historique.

## Recommandation prioritaire

1. Activer et nettoyer la couche API backend pour aligner le frontend avec des routes stables.
2. Ajouter un moteur de calcul centralise pour cout unitaire et cout par lot.
3. Construire le module simulation + pricing/marges.
4. Ajouter reporting metier et historique des calculs.