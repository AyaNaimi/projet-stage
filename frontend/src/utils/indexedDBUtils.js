// indexedDBUtils.js

// Ouvrir la base de données GestionBE avec plusieurs object stores
export const openDB = () => {
    return new Promise((resolve, reject) => {
        // bump DB version to trigger onupgradeneeded when adding new stores
        const request = indexedDB.open('NewGestionBE', 1);
        console.log('Opening IndexedDB...');

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log('onupgradeneeded triggered');
            const stores = ['clients', 'villes', 'zones', 'regions', 'secteurClients','fournisseurs'
                ,'produits','famille','factures','categories','ligneFactures','modePaimant','agents',
                'bonCommandeAchat','livraisonsachat','banRetourAchat','stockProduit','demmandeAchat',
                'stockCommandeVente',
                'devisesAchat','fichecontrolecasse','controlSheets','facturesvante','devisvante',
                'bonretourvente','livraisonsvente','bonCommendevente','Gestionproductions','stockGestionproduction',
                'stockCongele','stockproductionform','NewstockGestionproduction','banquesregelement','ligneEntrerComptes'
                ,'AgentseReglemnt','banquesName','paimentfacture','ligneEntrerComptesAchat','comptes','banquesencaissement'
                ,'encaissements','banqueshistorique','ligneEntrerComptesencaisement','ligneEncaissements',
                'chiffreaffaires','chiffreaffairesachat','RecouvremnettotalImpye','facturesreco','facturesvantechefre'
                ,'factureschefre','commissionData','balanceData','etatchiffreClientclients','etatchiffreClient','etatchiffreClientAchatclients',
                'etatchiffreClientAchat','facturesEtatdachafournisuer','produitsEtatdachafournisuer',
                'fournisseursEtatdachafournisuer','categoriesEtatdachafournisuer','facturesentre',
                'produitsentre','fournisseursentre','categoriesentre','facturesmeillerprix','produitsmeillerprix',
                'fournisseursmeillerprix','categoriesmeillerprix','banRetourAchatSF','dashboardCounts','users',
                'bonreception','fichecontrolecasse_magasinier','devisesAchat_devis2','controlSheets_magasinier',
                'livraisonsachatFicheReceptionMagasinier','fichecassegenerte2','uniqueCounterFichedepoie2','encaissementsSF','facturesrecoSF','banquesregelementSF',
                'banquesencaissementSF','BonEntreAchat','BonSortieVente','bonretourventesf','etatchiffreClientclientsPFR','livraisonsventeSF'
                ,'bonCommendeventeSF'
            ];

            stores.forEach(store => {
                if (!db.objectStoreNames.contains(store)) {
                    console.log(`Creating object store: ${store}`);
                    db.createObjectStore(store, { keyPath: 'id' });
                }
            });
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error opening IndexedDB:', event);
            reject('Error opening IndexedDB');
        };
    });
};


// Stocker des données dans un object store spécifique
export const storeDataInIndexedDB = async (data, storeName) => {
    const db = await openDB();
    console.log('Database opened:', db, data);
    console.log('Storing data for:', storeName);

    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // 🔥 Supprimer tout l'ancien contenu
    await store.clear();

    // ➕ Ajouter la nouvelle data
    data.forEach(item => {
        store.put(item);
    });

    transaction.oncomplete = () => {
        console.log(`${storeName} data stored successfully.`);
    };

    transaction.onerror = (event) => {
        console.error('Error storing data in IndexedDB:', event);
    };
};



// Récupérer des données depuis un object store spécifique
export const getDataFromIndexedDB = async (storeName) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = (event) => {
            const data = event.target.result;
            // Tri des données par ordre décroissant en fonction d'un attribut
            const sortedData = data.sort((a, b) => b.id - a.id);  // Remplacez 'id' par le champ que vous souhaitez utiliser
            resolve(sortedData);
        };

        request.onerror = (event) => {
            reject('Error fetching data from IndexedDB:', event);
        };
    });
};



// Supprimer des données depuis un object store spécifique
export const deleteDataFromIndexedDB = async (storeName, id) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    store.delete(id);

    transaction.oncomplete = () => {
        console.log(`Data with id ${id} deleted from ${storeName}`);
    };

    transaction.onerror = (event) => {
        console.error('Error deleting data from IndexedDB:', event);
    };
};


  