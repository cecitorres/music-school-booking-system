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
    return <p className="text-center text-gray-400">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!upcoming || upcoming.length === 0) {
    return (
      <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
        <p className="text-center text-gray-400">You have no upcoming classes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">My Upcoming Bookings</h2>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="text-gray-300 bg-gray-700">
                <th className="px-4 py-2 border border-gray-600">Teacher</th>
                <th className="px-4 py-2 border border-gray-600">Student</th>
                <th className="px-4 py-2 border border-gray-600">Date</th>
                <th className="px-4 py-2 border border-gray-600">Time</th>
                <th className="px-4 py-2 border border-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((booking) => (
                <tr key={booking.id} className="text-gray-300 hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-600">{booking.teacherName}</td>
                  <td className="px-4 py-2 border border-gray-600">{booking.studentName}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    {new Date(booking.startTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-600">
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 border border-gray-600">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;