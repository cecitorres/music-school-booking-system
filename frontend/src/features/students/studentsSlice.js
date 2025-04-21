import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllStudents } from './studentsAPI';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all students
export const getStudents = createAsyncThunk('students/getStudents', async () => {
  return await fetchAllStudents();
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
