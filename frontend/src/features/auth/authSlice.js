import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerUser } from './authAPI';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginAPI(credentials);

    localStorage.setItem('token', response.token);

    return response;
  } catch (e) {
    return rejectWithValue(e.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', registerUser);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
