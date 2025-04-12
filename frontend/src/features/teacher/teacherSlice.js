import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/teacherApi'; // Your API service for teachers

// Async thunk to fetch teacher info
export const fetchTeacherInfo = createAsyncThunk(
  'teacher/fetchTeacherInfo',
  async (teacherId) => {
    const response = await api.getTeacherInfo(teacherId);
    return response.data;
  }
);

// Async thunk to add a teacher
export const addTeacher = createAsyncThunk(
  'teacher/addTeacher',
  async (teacherData) => {
    const response = await api.addTeacher(teacherData);
    return response.data;
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    data: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeacherInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTeacherInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default teacherSlice.reducer;