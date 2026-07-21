import { apiClient } from './apiClient';

export const authService = {
  login: async (email: string, password: string) => {
      // The backend auth endpoint doesn't include /api prefix in the current controller setup but let's check. 
      // Actually, LoginPage calls `/api/auth/login`. Since apiClient's BASE_URL is `/api`, we just use `/auth/login`.
      return apiClient.post('/auth/login', { email, password });
  },

  register: async (name: string, email: string, password: string) => {
      return apiClient.post('/auth/register', { name, email, password });
  }
};
