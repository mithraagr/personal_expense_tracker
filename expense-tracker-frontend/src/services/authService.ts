import { apiClient, isMockApi } from './apiClient';
import { mockAuth } from './mockDb';
import { ChangePasswordPayload, LoginPayload, LoginResponse, RegisterPayload, User } from '../types/user';

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

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    if (isMockApi()) return mockAuth.register(payload);
    const response = await apiClient.post('/auth/register', {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      city: payload.city,
      password: payload.password,
      confirm_password: payload.confirmPassword
    });
    return mapUser(response.data);
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    if (isMockApi()) return mockAuth.login(payload.email, payload.password);
    const response = await apiClient.post('/auth/login', payload);
    return {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      user: mapUser(response.data.user)
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return mapUser(response.data);
  },

  async changePassword(userId: number, payload: ChangePasswordPayload): Promise<void> {
    if (isMockApi()) {
      mockAuth.changePassword(userId, payload.currentPassword, payload.newPassword);
      return;
    }
    await apiClient.post('/auth/change-password', {
      current_password: payload.currentPassword,
      new_password: payload.newPassword,
      confirm_new_password: payload.confirmNewPassword
    });
  },

  async logout(): Promise<void> {
    if (!isMockApi()) {
      await apiClient.post('/auth/logout').catch(() => undefined);
    }
  }
};
