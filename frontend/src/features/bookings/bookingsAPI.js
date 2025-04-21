import { authorizedFetch } from '../../utils/api';
import { API_BASE_URL } from '../../config';

const baseUrl = `${API_BASE_URL}/api/bookings`;

export async function createBooking(data) {
  const res = await authorizedFetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Error booking class');
  }
  return await res.json();
}

export async function fetchMyBookings() {
  const res = await authorizedFetch('/api/bookings/me');
  if (!res.ok) throw new Error('Error fetching my bookings');
  return await res.json();
}

export async function fetchHistory() {
  const res = await authorizedFetch('/api/bookings/history');
  if (!res.ok) throw new Error('Error fetching history');
  return await res.json();
}

export async function updateBookingStatus({ id, status }) {
  const res = await authorizedFetch(`/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error updating booking status');
  return await res.json();
}

export async function cancelBooking(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error cancelling booking');
  return await res.json();
}

export async function fetchAllBookings() {
  const res = await authorizedFetch('/api/bookings');
  if (!res.ok) throw new Error('Error fetching all bookings');
  return await res.json();
}
