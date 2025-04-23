import { useDispatch } from 'react-redux';
import { cancelClass, getMyBookings } from './bookingsSlice'; // Import getMyBookings to re-fetch classes

const UpcomingBookings = ({ bookings, loading, error, userRole }) => {
  const dispatch = useDispatch();

  const handleCancel = async (bookingId) => {
    try {
      await dispatch(cancelClass(bookingId)); // Dispatch cancelClass action
      alert('Class canceled successfully'); // Show success alert
      dispatch(getMyBookings()); // Re-fetch the bookings
    } catch (err) {
      alert(`Failed to cancel class: ${err.message}`); // Show error alert
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!bookings || bookings.length === 0) {
    return <p className="text-center text-gray-500">You have no upcoming classes.</p>;
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
              <>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="mt-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Cancel Class
                </button>
              </>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingBookings;