import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UpcomingBookings from '../features/bookings/UpcomingBookings';
import BookingHistory from '../features/bookings/BookingHistory';
import RequestedBookings from '../features/bookings/RequestedBookings';
import { getMyBookings, getBookingHistory } from '../features/bookings/bookingsSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { upcoming, history, loading, error } = useSelector((state) => state.bookings);
  const studentId = useSelector((state) => state.auth.user?.studentId);
  const currentUser = useSelector((state) => state.auth.user);

  const requestedBookings = upcoming.filter((booking) => booking.status === 'Pending');

  const upcomingBookings = upcoming.filter((booking) => booking.status === 'Accepted');

  useEffect(() => {
    if (studentId) {
      dispatch(getMyBookings());
      dispatch(getBookingHistory());
    }
  }, [studentId, dispatch]);

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Welcome to the Student Dashboard</h1>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">🔔 Requested Classes</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <RequestedBookings
              bookings={requestedBookings}
              loading={loading}
              error={error}
              userRole={currentUser.role}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">📅 Upcoming Classes</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <UpcomingBookings
              bookings={upcomingBookings}
              loading={loading}
              error={error}
              userRole={currentUser.role}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">📜 Past Classes</h2>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <BookingHistory history={history} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;