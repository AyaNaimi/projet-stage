import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

const normalizeCalibres = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.calibres)) return payload.calibres;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const fetchCalibres = createAsyncThunk(
  'calibres/fetchCalibres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/calibres');
      const calibres = normalizeCalibres(response.data);
      localStorage.setItem('calibres', JSON.stringify(calibres));
      return calibres;
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
