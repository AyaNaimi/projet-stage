import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCalibres = createAsyncThunk(
  'calibres/fetchCalibres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/calibres`);
      localStorage.setItem('calibres', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching calibres');
    }
  }
);

const calibreSlice = createSlice({
  name: 'calibres',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalibres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalibres.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCalibres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default calibreSlice.reducer;
