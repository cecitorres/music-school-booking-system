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
    return <p className="text-center text-gray-500">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!upcoming || upcoming.length === 0) {
    return <p className="text-center text-gray-500">You have no upcoming bookings.</p>;
  }

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {upcoming.map((booking) => (
          <li
            key={booking.id}
            className="p-4 transition-shadow border border-gray-300 rounded-lg shadow-sm hover:shadow-md"
          >
            <p className="mb-2">
              <strong>Teacher:</strong> {booking.teacherName}
            </p>
            <p className="mb-2">
              <strong>Student:</strong> {booking.studentName}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {new Date(booking.startTime).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong>Time:</strong>{' '}
              {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="mb-2">
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