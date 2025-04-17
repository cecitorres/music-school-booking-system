import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import availabilityReducer from '../features/availability/availabilitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teachersReducer,
    bookings: bookingsReducer,
    availability: availabilityReducer,
  },
});
