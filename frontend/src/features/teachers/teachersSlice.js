import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeachers, fetchTeacherDetail, fetchTeacherAvailability } from './teachersAPI';

export const getTeachers = createAsyncThunk(
  'teachers/getTeachers',
  fetchTeachers
);
export const getTeacherDetail = createAsyncThunk(
  'teachers/getTeacherDetail',
  fetchTeacherDetail
);

export const getTeacherAvailability = createAsyncThunk(
  'teachers/getTeacherAvailability',
  async (id) => {
    return await fetchTeacherAvailability(id);
  }
);

const initialState = {
  list: [],
  selectedTeacher: null,
  availability: null,
  loading: false,
  error: null,
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.list = action.payload;
    },
    setSelectedTeacher: (state, action) => {
      state.selectedTeacher = action.payload;
    },
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
        state.list = action.payload;
      })
      .addCase(getTeacherDetail.fulfilled, (state, action) => {
        state.selectedTeacher = action.payload;
      })
      .addCase(getTeachers.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getTeacherAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(getTeacherAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelected } = teachersSlice.actions;
export default teachersSlice.reducer;
