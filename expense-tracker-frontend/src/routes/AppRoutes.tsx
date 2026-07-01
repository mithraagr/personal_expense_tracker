import { Navigate, Route, Routes } from 'react-router-dom';
import { ExpensePage } from '../pages/ExpensePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SettingsPage } from '../pages/SettingsPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to={import.meta.env.VITE_DEFAULT_ROUTE || '/expenses'} replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
      <Route path="/dashboard" element={<Navigate to="/expenses" replace />} />
      <Route path="/expenses" element={<ExpensePage />} />
      <Route path="/expenses/history" element={<ExpensePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/users" element={<UserManagementPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
