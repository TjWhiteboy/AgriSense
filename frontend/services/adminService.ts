import { apiClient } from './apiClient';

export interface AdminStats {
    users: number;
    chats: number;
    crops: number;
    systemLogs: any[];
    weatherLogs: any[];
}

export const adminService = {
    getStats: async (): Promise<AdminStats> => {
        return apiClient.get('/admin/stats');
    },

    getUsers: async () => {
        return apiClient.get('/admin/users');
    },

    deleteUser: async (id: string) => {
        return apiClient.delete(`/admin/users/${id}`);
    },

    getChats: async () => {
        return apiClient.get('/admin/chats');
    }
};
