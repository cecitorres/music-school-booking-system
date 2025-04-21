import BookingActions from './BookingActions';

const RequestedBookings = ({ bookings, loading, error, userRole }) => {
  if (loading) {
    return <p className="text-center text-gray-500">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!bookings || bookings.length === 0) {
    return <p className="text-center text-gray-500">You have no requested classes.</p>;
  }

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="p-4 transition-shadow border border-gray-300 rounded-lg shadow-sm hover:shadow-md"
          >
            {userRole === 'Student' && (
              <p className="mb-2">
                <strong>Teacher:</strong> {booking.teacherName}
              </p>
            )}
            {userRole === 'Teacher' && (
              <p className="mb-2">
                <strong>Student:</strong> {booking.studentName}
              </p>
            )}
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
            {userRole === 'Teacher' && (
              <BookingActions bookingId={booking.id} currentStatus={booking.status} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestedBookings;