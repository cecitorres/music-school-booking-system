import { API_BASE_URL } from '../../config';
import { authorizedFetch } from '../../utils/api';

export async function loginAPI(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
}

export async function registerUser(userData) {
  const response = await authorizedFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(response.error);
  }

  return await response.json();
}

export async function editUser(userData) {
  const response = await authorizedFetch('/api/auth/edit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to edit user');
  }

  return await response.json();
}
