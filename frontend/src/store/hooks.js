import { useDispatch, useSelector } from 'react-redux';

// Hook pour les produits
export const useProduits = () => {
  const dispatch = useDispatch();
  const { items, chartData, loading, error } = useSelector(state => state.produits || {});
  return { produits: items, chartData, loading, error, dispatch };
};

// Hook pour les catégories
export const useCategories = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.categories || {});
  return { categories: items, loading, error, dispatch };
};

// Hook pour les calibres
export const useCalibres = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.calibres || {});
  return { calibres: items, loading, error, dispatch };
};

// Hook pour l'authentification
export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth || {});
  return { user, loading, error, dispatch };
};
