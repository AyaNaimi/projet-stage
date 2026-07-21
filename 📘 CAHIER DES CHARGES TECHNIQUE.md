📘 CAHIER DES CHARGES TECHNIQUE

Développement d’un système de calcul du coût de revient

⸻

1. 🧭 Contexte & objectif

Dans le cadre de l’optimisation de la gestion industrielle, nous souhaitons développer une application permettant de :
	•	Calculer avec précision le coût de revient unitaire des produits (biscuit, gaufrette, etc.)
	•	Intégrer l’ensemble des charges directes et indirectes
	•	Simuler l’impact des variations de coûts (matières premières, énergie, etc.)
	•	Aider à la prise de décision stratégique (pricing, marges, production)

⸻

1. 🎯 Périmètre fonctionnel

Le système devra couvrir les modules suivants :

2.1 Module Produits
	•	Création / modification / suppression
	•	Gestion des fiches techniques (recettes)
	•	Définition :
	•	Grammage
	•	Format (unité, carton, palette)
	•	Rendement

⸻

2.2 Module Matières Premières
	•	Base de données des matières
	•	Champs obligatoires :
	•	Nom
	•	Prix d’achat
	•	Unité (kg, L, unité)
	•	Fournisseur (optionnel)
	•	Historisation des prix

⸻

2.3 Module Recettes / Nomenclature
	•	Association produit ↔️ matières premières
	•	Quantité par unité produite
	•	Gestion pertes (% déchets, casse)

⸻

2.4 Module Charges Directes

a) Matières premières
	•	Calcul automatique basé sur recette

b) Main d’œuvre directe
	•	Coût horaire
	•	Temps de production par produit

c) Packaging
	•	Intégration :
	•	Film OPP
	•	Carton
	•	Étiquettes
	•	Coût par unité

⸻

2.5 Module Charges Indirectes

Types de charges :
	•	Électricité
	•	Eau
	•	Maintenance
	•	Amortissement
	•	Salaires indirects
	•	Logistique interne

Méthodes de répartition (configurables) :
	•	Par volume produit
	•	Par temps machine
	•	Par quantité produite

⸻

2.6 Module Calcul

Le système doit calculer automatiquement :
	•	Coût matières premières
	•	Coût main d’œuvre
	•	Coût packaging
	•	Quote-part charges indirectes

👉 Résultat final :
	•	Coût de revient unitaire
	•	Coût total par lot

⸻

2.7 Module Simulation
	•	Modifier paramètres (prix matière, rendement, volume)
	•	Visualiser impact en temps réel
	•	Comparer scénarios

⸻

2.8 Module Pricing & Marges
	•	Saisie prix de vente
	•	Calcul :
	•	Marge brute
	•	Taux de marge (%)
	•	Calcul automatique :
	•	Prix minimum conseillé

⸻

2.9 Module Reporting
	•	Tableau de bord
	•	Indicateurs clés :
	•	Coût par produit
	•	Évolution des coûts
	•	Produits non rentables
	•	Export :
	•	PDF
	•	Excel

⸻

1. ⚙️ Règles de gestion (très important)
	•	Tous les coûts doivent être calculés au niveau unitaire
	•	Les pertes doivent être intégrées dans le coût final
	•	Les charges indirectes doivent être réparties automatiquement
	•	Le système doit permettre la mise à jour dynamique des prix matières
	•	Gestion multi-produits et multi-recettes

⸻

1. 🧠 Logique de calcul (simplifiée)

Coût de revient =

= (Coût matières premières
	•	Coût main d’œuvre
	•	Coût packaging
	•	Charges indirectes réparties)

÷ Quantité produite

⸻

1. 🖥️ Interfaces attendues (UX)

Écrans principaux :
	•	Dashboard (vue globale)
	•	Fiche produit détaillée
	•	Gestion matières premières
	•	Paramétrage charges
	•	Simulation

Exigences :
	•	Interface simple, rapide, intuitive
	•	Affichage clair des coûts
	•	Graphiques (évolution, comparaison)

⸻

1. 🗄️ Architecture technique

Backend :
	•	Node.js / Python / PHP

Frontend :
	•	React / Vue.js

Base de données :
	•	MySQL / PostgreSQL

Hébergement :
	•	Cloud (recommandé)

⸻

1. 🔐 Sécurité
	•	Authentification (login / mot de passe)
	•	Gestion des rôles :
	•	Admin
	•	Utilisateur

⸻

1. 📊 Données & traçabilité
	•	Historique des prix matières
	•	Historique des calculs
	•	Versioning des produits

⸻

1. 🚀 Performances attendues
	•	Calcul en temps réel
	•	Capacité à gérer plusieurs produits simultanément
	•	Temps de réponse rapide (<2 secondes)

⸻

1. 🔄 Évolutions futures (optionnelles)
	•	Intégration avec stock
	•	Intégration comptabilité
	•	Connexion ERP
	•	API externe

⸻

⸻

1. 📦 Livrables attendus
	•	Application fonctionnelle
	•	Code source
	•	Documentation technique
	•	Guide utilisateur

⸻

1. 🎯 Critères de réussite
	•	Précision des calculs
	•	Facilité d’utilisation
	•	Adaptation au secteur agroalimentaire
	•	Fiabilité des données

⸻

💡 Remarque stratégique (très importante)

Le système doit être adapté aux contraintes du marché marocain, notamment :
	•	Prix psychologiques (0,5 dh / 1 dh / 2 dh)
	•	Forte variation des matières premières (ex : graisse)
	•	Importance de la distribution (coûts transport, tournée)