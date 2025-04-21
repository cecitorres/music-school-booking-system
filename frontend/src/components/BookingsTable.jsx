import React from 'react';

const BookingsTable = ({ bookings, loading, error }) => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">📅 All Bookings</h2>
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        {loading && <p className="text-center text-gray-400">Loading bookings...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
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
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-700">
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
        ) : (
          <p className="text-center text-gray-400">No bookings available.</p>
        )}
      </div>
    </section>
  );
};

export default BookingsTable;