import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchStockProduction = createAsyncThunk(
  "production/fetchStockProduction",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stock_production`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchProduits = createAsyncThunk(
  "production/fetchProduits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/produits`);
      return response.data.produit;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchProductions = createAsyncThunk(
  "production/fetchProductions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/productions`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const productionSlice = createSlice({
  name: "production",
  initialState: {
    n_lot: [],
    produits: [],
    productions: [],
    stock: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockProduction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStockProduction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.n_lot = action.payload;
      })
      .addCase(fetchStockProduction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProduits.fulfilled, (state, action) => {
        state.produits = action.payload;
      })
      .addCase(fetchProductions.fulfilled, (state, action) => {
        state.productions = action.payload.productions || [];
        state.stock = action.payload.stock || [];
      });
  },
});

export default productionSlice.reducer;
