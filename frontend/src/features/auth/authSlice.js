import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerUser, editUser } from './authAPI';

// Load user and token from localStorage
const userFromStorage = JSON.parse(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginAPI(credentials);

    // Save token and user info in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  } catch (e) {
    return rejectWithValue(e.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', registerUser);

// Async thunk for editing a user
export const editUserThunk = createAsyncThunk(
  'auth/editUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await editUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage || null, // Load user from localStorage
    token: tokenFromStorage || null, // Load token from localStorage
    isAuthenticated: tokenFromStorage || false,
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); // Clear user from localStorage
      localStorage.removeItem('token'); // Clear token from localStorage
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
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      })
      .addCase(editUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Update the user data
      })
      .addCase(editUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
