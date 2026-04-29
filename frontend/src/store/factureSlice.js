import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFactures = createAsyncThunk(
  'factures/fetchFactures',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/indexPourPrix`);
      // Expecting resp.data to be the array of factures
      return resp.data;
    } catch (err) { 
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const factureSlice = createSlice({
  name: 'factures',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setFactures(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFactures.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFactures.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFactures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFactures } = factureSlice.actions;

export const selectAllFactures = (state) => state.factures.items || [];

export default factureSlice.reducer;
