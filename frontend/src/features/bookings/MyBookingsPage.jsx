import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBookings } from './bookingsSlice';

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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Teacher</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Student</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {upcoming.map((booking) => (
            <tr key={booking.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.teacherName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.studentName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(booking.startTime).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookingsPage;