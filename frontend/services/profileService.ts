import { apiClient } from './apiClient';
import type { User } from '../types';

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  state: string;
  district: string;
  preferredCrop: string;
  language: string;
  profilePicture: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  getProfile: async (): Promise<User> => {
    return apiClient.get('/profile');
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<{ message: string; user: User }> => {
    return apiClient.put('/profile', data);
  },

  changePassword: async (data: ChangePasswordPayload): Promise<{ message: string }> => {
    return apiClient.put('/profile/password', data);
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    return apiClient.delete('/profile');
  },
};
