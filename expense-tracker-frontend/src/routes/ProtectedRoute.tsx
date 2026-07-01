import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <main className="app-bg standalone-state"><Loader label="Checking session..." /></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRoles?.length && user && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};
