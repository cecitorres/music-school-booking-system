const baseUrl = '/api/availability';

export async function createAvailability(data) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error adding availability');
  return await res.json();
}

export async function deleteAvailability(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error deleting availability');
}

export async function fetchTeacherAvailability(teacherId) {
  const res = await fetch(`/api/teachers/${teacherId}/availability`);
  if (!res.ok) throw new Error('Error fetching teacher availability');
  return await res.json();
}
