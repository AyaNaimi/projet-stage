import { configureStore } from '@reduxjs/toolkit';
import factureReducer from './factureSlice';
import produitReducer from './produitSlice';
import categorieReducer from './categorieSlice';
import calibreReducer from './calibreSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    factures: factureReducer,
    produits: produitReducer,
    categories: categorieReducer,
    calibres: calibreReducer,
    auth: authReducer,
  },
});

export default store;


