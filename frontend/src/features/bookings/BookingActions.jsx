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
    <div>
      <button onClick={() => handleUpdateStatus('Accepted')} style={{ marginRight: '10px' }}>
        Accept
      </button>
      <button onClick={() => handleUpdateStatus('Rejected')} style={{ color: 'red' }}>
        Reject
      </button>
    </div>
  );
};

export default BookingActions;