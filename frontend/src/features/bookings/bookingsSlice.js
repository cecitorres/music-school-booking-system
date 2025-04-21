import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBooking,
  fetchMyBookings,
  fetchHistory,
  updateBookingStatus,
  cancelBooking,
  fetchAllBookings, // Import the fetchAllBookings function
} from './bookingsAPI';

export const bookClass = createAsyncThunk('bookings/bookClass', createBooking);
export const getMyBookings = createAsyncThunk('bookings/getMyBookings', fetchMyBookings);
export const getBookingHistory = createAsyncThunk('bookings/getBookingHistory', fetchHistory);
export const updateStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }) => {
    return await updateBookingStatus({ id, status });
  }
);
export const cancelClass = createAsyncThunk('bookings/cancel', cancelBooking);

// Add the new async thunk for fetching all bookings
export const getAllBookings = createAsyncThunk('bookings/getAllBookings', fetchAllBookings);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    upcoming: [],
    history: [],
    allBookings: [], // Add a new state for all bookings
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.upcoming = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.upcoming.findIndex((b) => b.id === updatedBooking.id);
        if (index !== -1) {
          state.upcoming[index] = updatedBooking;
        }
      })
      .addCase(getBookingHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      // Handle getAllBookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.allBookings = action.payload;
        state.loading = false;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookingsSlice.reducer;
