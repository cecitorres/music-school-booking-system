import { authorizedFetch } from '../../utils/api';

export async function createAvailability({teacherId, data}) {
  const res = await authorizedFetch(`/api/teachers/${teacherId}/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error adding availability');
  return await res.json();
}

export async function deleteAvailability({teacherId, id}) {
  const res = await authorizedFetch(`/api/teachers/${teacherId}/availability/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error deleting availability');
}

