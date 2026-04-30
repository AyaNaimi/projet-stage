import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL, { getApiRequestConfig } from '../utils/api/baseUrl';

export const fetchAuthenticatedUser = createAsyncThunk(
  'auth/fetchAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`, getApiRequestConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {} || null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthenticatedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAuthenticatedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
