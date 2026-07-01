import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY, isMockApi } from '../services/apiClient';
import { authService } from '../services/authService';
import { initMockDatabase } from '../services/mockDb';
import { LoginPayload, LoginResponse, RegisterPayload, User } from '../types/user';

const AUTH_USER_KEY = 'expense_tracker_auth_user';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const saveSession = (response: LoginResponse) => {
  localStorage.setItem(TOKEN_KEY, response.accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMockApi()) initMockDatabase();

    const bootstrap = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        if (isMockApi() && savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        }
        setToken(savedToken);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    saveSession(response);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token || isMockApi()) return;
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
  }, [token]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateUser
    }),
    [user, token, isLoading, login, register, logout, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
