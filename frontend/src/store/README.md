# Redux Setup Guide 🎯

## Structure Redux
```
src/
├── store/
│   ├── index.js              ← Configuration du store
│   ├── hooks.js              ← Hooks personnalisés (useProduits, useCategories, etc.)
│   ├── produitSlice.js       ← Slice pour les produits
│   ├── categorieSlice.js     ← Slice pour les catégories
│   ├── calibreSlice.js       ← Slice pour les calibres
│   ├── authSlice.js          ← Slice pour l'authentification
│   └── factureSlice.js       ← Slice existant pour les factures
```

## Configuration Initiale ✅

Le store est déjà configuré dans `main.jsx`:
```jsx
import store from './store';
import { Provider } from 'react-redux';

<Provider store={store}>
  <App />
</Provider>
```

## Utilisation dans les Composants 📱

### 1. Import des hooks
```javascript
import { useProduits, useCategories, useCalibres, useAuthRedux } from '../store/hooks';
import { fetchProduits, fetchCategories, fetchCalibres, fetchAuthenticatedUser } from '../store/slices';
```

### 2. Utilisation simple
```javascript
const MyComponent = () => {
  const dispatch = useDispatch();
  const { produits, loading, error } = useProduits();

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return <div>{produits.map(p => <p key={p.id}>{p.designation}</p>)}</div>;
};
```

### 3. Initialiser tous les données au mount
```javascript
const { produits, categories, calibres, user, loading } = useInitialDataFetch();
```

## Avantages vs useState ⚡

| Aspect | useState | Redux |
|--------|----------|-------|
| Code | Verbeux (100+ lignes) | Clean (10-20 lignes) |
| Réutilisabilité | Non partageable | Partageable partout |
| Props Drilling | Oui ❌ | Non ✅ |
| Debugging | Difficile | Facile avec DevTools |
| Caching | Manuel | Automatique |
| Performance | Variable | Optimisée |

## Actions Disponibles 🎬

### Produits
- `fetchProduits()` - Récupère les produits et données de graphique
- État: `state.produits = { items, chartData, loading, error }`

### Catégories
- `fetchCategories()` - Récupère les catégories
- État: `state.categories = { items, loading, error }`

### Calibres
- `fetchCalibres()` - Récupère les calibres
- État: `state.calibres = { items, loading, error }`

### Authentification
- `fetchAuthenticatedUser()` - Récupère l'utilisateur authentifié
- État: `state.auth = { user, loading, error }`

## Exemple Complet de Refactorisation 📝

### AVANT (avec useState):
```javascript
const [produits, setProduits] = useState([]);
const [categories, setCategories] = useState([]);
const [calibres, setCalibres] = useState([]);
const [user, setUser] = useState({});

useEffect(() => {
  fetchProduits();
  fetchCategories();
  fetchCalibres();
}, []);

const fetchProduits = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/produits`);
    setProduits(response.data.produit);
    // ... plus de code
  } catch (error) {
    console.error(error);
  }
};
// ... 200+ lignes de code
```

### APRÈS (avec Redux):
```javascript
const { produits, categories, calibres, user, loading } = useInitialDataFetch();

// C'est tout! Redux gère le reste automatiquement
```

## Prochaines Étapes 🚀

1. **Installer Redux DevTools** (optionnel mais recommandé)
   ```bash
   npm install redux-devtools
   ```

2. **Intégrer Redux dans vos composants**
   - Commencez par ProduitList.jsx
   - Puis migrez les autres composants

3. **Ajouter d'autres slices** au besoin
   - Clientes
   - Fournisseurs
   - Etc.

## Debugging 🔍

Avec Redux DevTools, vous pouvez:
- Voir toutes les actions Redux
- Inspecter l'état à chaque moment
- Voyager dans le temps (time-travel debugging)
- Re-dispatcher les actions

Extension disponible pour:
- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
