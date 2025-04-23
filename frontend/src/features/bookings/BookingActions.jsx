import React from 'react';
import { useDispatch } from 'react-redux';
import { updateStatus } from './bookingsSlice';

const BookingActions = ({ bookingId, currentStatus }) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = (status) => {
    dispatch(updateStatus({ id: bookingId, status }))
      .unwrap()
      .then(() => alert(`Booking ${status.toLowerCase()} successfully!`))
      .catch((err) => alert(`Failed to update booking: ${err.message}`));
  };

  if (currentStatus !== 'Pending') {
    return null; // Only show actions for pending bookings
  }

  return (
    <div className="flex mt-2 space-x-2">
      <button
        onClick={() => handleUpdateStatus('Accepted')}
        className="px-4 py-2 text-sm font-medium text-white transition bg-green-500 rounded hover:bg-green-600"
        title="Accept this booking"
      >
        ✅ Accept
      </button>
      <button
        onClick={() => handleUpdateStatus('Rejected')}
        className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded hover:bg-red-600"
        title="Reject this booking"
      >
        ❌ Reject
      </button>
    </div>
  );
};

export default BookingActions;