// EXEMPLE DE REFACTORISATION POUR UTILISER REDUX
// Remplacez les imports et les hooks useState par ceux-ci dans ProduitList.jsx

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProduits, useCategories, useCalibres, useAuthRedux } from '../store/hooks';
import { fetchProduits } from '../store/produitSlice';
import { fetchCategories } from '../store/categorieSlice';
import { fetchCalibres } from '../store/calibreSlice';
import { fetchAuthenticatedUser } from '../store/authSlice';

/**
 * AVANT: Avec useState (beaucoup de boilerplate)
 * ========================================
 * const [produits, setProduits] = useState([]);
 * const [user, setUser] = useState({});
 * const [categories, setCategories] = useState([]);
 * const [calibres, setCalibres] = useState([]);
 * ... 30+ autres useState
 */

/**
 * APRÈS: Avec Redux (plus clean et réutilisable)
 * ========================================
 */

export const useInitialDataFetch = () => {
  const dispatch = useDispatch();
  const { produits, chartData, loading: produitsLoading } = useProduits();
  const { categories, loading: categoriesLoading } = useCategories();
  const { calibres, loading: calibresLoading } = useCalibres();
  const { user, loading: userLoading } = useAuthRedux();

  useEffect(() => {
    // Fetch all data on component mount
    dispatch(fetchProduits());
    dispatch(fetchCategories());
    dispatch(fetchCalibres());
    dispatch(fetchAuthenticatedUser());
  }, [dispatch]);

  return {
    produits,
    chartData,
    categories,
    calibres,
    user,
    loading: produitsLoading || categoriesLoading || calibresLoading || userLoading,
  };
};

/**
 * UTILISATION DANS UN COMPOSANT:
 * ========================================
 * const ProduitList = () => {
 *   const { produits, categories, calibres, user, loading } = useInitialDataFetch();
 *
 *   // Le reste du code du composant reste identique
 * };
 */

/**
 * AVANTAGES:
 * ✅ Code plus clean et maintenable
 * ✅ État partagé entre tous les composants
 * ✅ Pas besoin de passer les props à travers plusieurs niveaux
 * ✅ Données cachées automatiquement avec Redux DevTools
 * ✅ Temps de chargement amélioré grâce au caching
 */
