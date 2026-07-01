import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Brand, Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/expenses" replace />;

  return (
    <div className="auth-page app-bg">
      <div className="auth-sidebar"><Sidebar /></div>
      <main className="auth-content register-content">
        <div className="auth-mobile-brand"><Brand /></div>
        <section className="hero-copy">
          <span className="welcome-pill">Start Tracking ✨</span>
          <h1>Create an account <span>Today</span></h1>
          <p>Register to add expenses, view analytics, export reports and configure spending limits.</p>
          <div className="mini-gradient-line" />
          <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
        </section>
        <section className="auth-card register-card">
          <RegisterForm onSuccess={() => { toast.success('Registration successful. Please login.'); navigate('/login'); }} />
        </section>
      </main>
    </div>
  );
};
