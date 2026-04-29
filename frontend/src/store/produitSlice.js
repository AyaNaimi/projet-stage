import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { storeDataInIndexedDB } from '../utils/indexedDBUtils';

export const fetchProduits = createAsyncThunk(
  'produits/fetchProduits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/produits`);
      await storeDataInIndexedDB(response.data.produit, 'produits');
      return {
        produits: response.data.produit,
        chartData: response.data.AllProduit
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching produits');
    }
  }
);

const produitSlice = createSlice({
  name: 'produits',
  initialState: {
    items: [],
    chartData: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.produits;
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchProduits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default produitSlice.reducer;
