import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBookings } from './bookingsSlice';
import BookingActions from './BookingActions';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { upcoming, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  if (loading) {
    return <p>Loading your bookings...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!upcoming || upcoming.length === 0) {
    return <p>You have no upcoming bookings.</p>;
  }

  return (
    <div>
      <h2>My Upcoming Bookings</h2>
      <ul>
        {upcoming.map((booking) => (
          <li key={booking.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <p>
              <strong>Teacher:</strong> {booking.teacherName}
            </p>
            <p>
              <strong>Student:</strong> {booking.studentName}
            </p>
            <p>
              <strong>Date:</strong> {new Date(booking.startTime).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <BookingActions bookingId={booking.id} currentStatus={booking.status} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookingsPage;