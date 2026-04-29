import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { storeDataInIndexedDB } from '../utils/indexedDBUtils';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      await storeDataInIndexedDB(response.data, 'famille');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching categories');
    }
  }
);

const categorieSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorieSlice.reducer;
