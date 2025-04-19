import { API_BASE_URL } from '../../config';

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

  }
  