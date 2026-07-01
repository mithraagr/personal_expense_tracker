export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'bearer';
  user: User;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
