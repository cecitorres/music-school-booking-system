import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/calendarApi'; // Your API service for calendar

// Async thunk to fetch available slots
export const fetchAvailableSlots = createAsyncThunk(
  'calendar/fetchAvailableSlots',
  async (teacherId) => {
    const response = await api.getAvailableSlots(teacherId);
    return response.data;
  }
);

// Async thunk to add a slot
export const addSlot = createAsyncThunk(
  'calendar/addSlot',
  async ({ teacherId, slotData }) => {
    const response = await api.addSlot(teacherId, slotData);
    return response.data;
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    slots: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.slots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addSlot.fulfilled, (state, action) => {
        state.slots.push(action.payload);
      });
  },
});

export default calendarSlice.reducer;