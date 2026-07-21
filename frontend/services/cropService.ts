import { apiClient } from './apiClient';

export interface Crop {
  _id?: string;
  cropName: string;
  soilType: string;
  temperature: string;
  fertilizer: string;
  irrigation: string;
  season: string;
}

export const cropService = {
  getAllCrops: async (): Promise<Crop[]> => {
    return apiClient.get('/crops');
  },

  createCrop: async (crop: Omit<Crop, '_id'>): Promise<Crop> => {
    return apiClient.post('/crops', crop);
  },

  updateCrop: async (id: string, crop: Omit<Crop, '_id'>): Promise<Crop> => {
    return apiClient.put(`/crops/${id}`, crop);
  },

  deleteCrop: async (id: string): Promise<void> => {
    return apiClient.delete(`/crops/${id}`);
  },
};
