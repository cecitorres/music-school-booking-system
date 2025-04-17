import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeachers, fetchTeacherDetail } from './teachersAPI';

export const getTeachers = createAsyncThunk('teachers/getTeachers', fetchTeachers);
export const getTeacherDetail = createAsyncThunk('teachers/getTeacherDetail', fetchTeacherDetail);

const teachersSlice = createSlice({
  name: 'teachers',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeachers.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action, "payload")
        state.list = action.payload;
      })
      .addCase(getTeacherDetail.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(getTeachers.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearSelected } = teachersSlice.actions;
export default teachersSlice.reducer;
