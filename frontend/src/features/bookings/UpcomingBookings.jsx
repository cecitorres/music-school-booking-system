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
    <div className="p-4 bg-gray-900 text-gray-100">
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="rounded-xl bg-gray-800 p-6 shadow-md border border-gray-700 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">
                  {userRole === 'Student' ? `Teacher: ${booking.teacherName}` : `Student: ${booking.studentName}`}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  📅 {new Date(booking.startTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  🕒 {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                  {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="mt-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Accepted'
                        ? 'bg-green-700 text-green-200'
                        : 'bg-yellow-700 text-yellow-200'
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleCancel(booking.id)}
                className="mt-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                title="Cancel this class"
              >
                🗑 Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingBookings;