import { configureStore } from '@reduxjs/toolkit';
import teacherReducer from '../features/teacher/teacherSlice';
import calendarReducer from '../features/calendar/calendarSlice';

export const store = configureStore({
  reducer: {
    teacher: teacherReducer,
    calendar: calendarReducer,
  },
});