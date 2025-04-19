import { authorizedFetch } from '../../utils/api';

export async function fetchTeachers() {
  const res = await authorizedFetch('/api/teachers');
  if (!res.ok) {
    throw new Error('Error fetching teachers');
  }
  return await res.json();
}

export async function fetchTeacherDetail(id) {
  const res = await authorizedFetch(`/api/teachers/${id}`);

  if (!res.ok) {
    throw new Error('Error fetching teacher detail');
  }

  return await res.json();
}

export async function fetchTeacherAvailability(id) {
  const res = await authorizedFetch(`/api/teachers/${id}/availability`);

  if (!res.ok) {
    throw new Error('Error fetching teacher availability');
  }

  return await res.json();
}
