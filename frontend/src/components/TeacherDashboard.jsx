import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BookingsList from '../features/bookings/BookingsList';
import TeacherAvailability from '../features/teachers/TeacherAvailability';
import BookingHistory from '../features/bookings/BookingHistory';
import { getBookingHistory } from '../features/bookings/bookingsSlice';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.bookings);
  const teacherId = useSelector((state) => state.auth.user?.teacherId);

  useEffect(() => {
    if (teacherId) {
      dispatch(getBookingHistory());
    }
  }, [teacherId, dispatch]);

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Welcome to the Teacher Dashboard</h1>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">📅 Upcoming Classes</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <BookingsList teacherId={teacherId} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">📜 Past Classes</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <BookingHistory history={history} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">🕐 My Availability</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <TeacherAvailability teacherId={teacherId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;