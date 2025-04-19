import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import studentsReducer from '../features/students/studentsSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import availabilityReducer from '../features/availability/availabilitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teachersReducer,
    students: studentsReducer,
    bookings: bookingsReducer,
    availability: availabilityReducer,
  },
});
