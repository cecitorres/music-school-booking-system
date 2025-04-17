import { authorizedFetch } from '../../utils/api';
import { API_BASE_URL } from '../../config';


export async function fetchTeachers() {
    const res = await authorizedFetch('/api/teachers');
    // if (!res.ok) throw new Error('Error fetching teachers');
    return res;
  }
  
  export async function fetchTeacherDetail(id) {
    const res = await fetch(`${API_BASE_URL}/api/teachers/${id}`);
    if (!res.ok) throw new Error('Error fetching teacher detail');
    return await res.json();
  }
  