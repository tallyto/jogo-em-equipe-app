import { fetchWithTimeout, getApiBaseUrl } from './api';

export const loginService = async (email: string, password: string) => {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetchWithTimeout(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }, 3000);
  return response;
};
