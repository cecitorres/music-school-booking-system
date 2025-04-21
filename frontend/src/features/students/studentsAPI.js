import { authorizedFetch } from '../../utils/api';

export async function fetchAllStudents() {
  const res = await authorizedFetch('/api/students');
  if (!res.ok) throw new Error('Error fetching students');
  return await res.json();
}