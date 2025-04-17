import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBooking,
  fetchMyBookings,
  fetchHistory,
  updateBookingStatus,
  cancelBooking,
} from './bookingsAPI';

export const bookClass = createAsyncThunk('bookings/bookClass', createBooking);
export const getMyBookings = createAsyncThunk('bookings/getMyBookings', fetchMyBookings);
export const getBookingHistory = createAsyncThunk('bookings/getBookingHistory', fetchHistory);
export const updateStatus = createAsyncThunk('bookings/updateStatus', updateBookingStatus);
export const cancelClass = createAsyncThunk('bookings/cancel', cancelBooking);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    upcoming: [],
    history: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.upcoming = action.payload;
      })
      .addCase(getBookingHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
