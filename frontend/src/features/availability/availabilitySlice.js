import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAvailability,
  deleteAvailability,
  fetchTeacherAvailability,
} from './availabilityAPI';

export const addAvailability = createAsyncThunk('availability/add', createAvailability);
export const removeAvailability = createAsyncThunk('availability/remove', deleteAvailability);
export const getTeacherAvailability = createAsyncThunk('availability/get', fetchTeacherAvailability);

const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {
    slots: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherAvailability.fulfilled, (state, action) => {
        state.slots = action.payload;
      });
  },
});

export default availabilitySlice.reducer;
