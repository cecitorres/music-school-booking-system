import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAvailability,
  deleteAvailability,
} from './availabilityAPI';

export const addAvailability = createAsyncThunk('availability/add', createAvailability);
export const removeAvailability = createAsyncThunk('availability/remove', deleteAvailability);

const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {
    slots: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
  },
});

export default availabilitySlice.reducer;
