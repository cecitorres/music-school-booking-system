import { useSelector } from 'react-redux';
import TeacherInfo from './TeacherInfo';
import BookingsList from '../features/bookings/BookingsList';
import TeacherAvailability from '../features/teachers/TeacherAvailability';
import { useDispatch } from 'react-redux';
import { getBookingHistory } from '../features/bookings/bookingsSlice';
import { useEffect } from 'react';
import BookingHistory from '../features/bookings/BookingHistory';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.bookings);
  const teacherId = useSelector((state) => state.auth.user?.teacherId);

  useEffect(() => {
    if (teacherId) {
      dispatch(getBookingHistory(teacherId));
    }
  }, [teacherId, dispatch]);

  return (
    <div className="container p-6 mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-100">Welcome to the Teacher Dashboard</h1>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-300">📅 Upcoming Classes</h2>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <BookingsList teacherId={teacherId} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-300">📜 Past Classes</h2>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <BookingHistory history={history} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-300">🕐 My Availability</h2>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <TeacherAvailability teacherId={teacherId} />
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;