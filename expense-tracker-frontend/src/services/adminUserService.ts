import { apiClient, isMockApi, queryParams } from './apiClient';
import { mockAdmin } from './mockDb';
import { User, UserRole } from '../types/user';

const mapUser = (user: any): User => ({
  id: user.id,
  firstName: user.first_name ?? user.firstName,
  lastName: user.last_name ?? user.lastName,
  email: user.email,
  city: user.city,
  role: user.role,
  isActive: user.is_active ?? user.isActive,
  createdAt: user.created_at ?? user.createdAt
});

export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  status?: 'active' | 'disabled' | '';
}

export const adminUserService = {
  async list(currentUser: User, filters: UserFilters): Promise<User[]> {
    if (isMockApi()) return mockAdmin.list(filters.search, filters.role, filters.status);
    const response = await apiClient.get(`/admin/users?${queryParams(filters as Record<string, unknown>)}`);
    return response.data.map(mapUser);
  },

  async enable(currentUser: User, userId: number): Promise<User> {
    if (isMockApi()) return mockAdmin.setActive(currentUser.id, userId, true);
    const response = await apiClient.put(`/admin/users/${userId}/enable`);
    return mapUser(response.data);
  },

  async disable(currentUser: User, userId: number): Promise<User> {
    if (isMockApi()) return mockAdmin.setActive(currentUser.id, userId, false);
    const response = await apiClient.put(`/admin/users/${userId}/disable`);
    return mapUser(response.data);
  },

  async changeRole(currentUser: User, userId: number, role: UserRole): Promise<User> {
    if (isMockApi()) return mockAdmin.setRole(currentUser.id, userId, role);
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return mapUser(response.data);
  }
};
