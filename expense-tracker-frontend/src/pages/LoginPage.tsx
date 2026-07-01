import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { Brand, Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/expenses" replace />;

  return (
    <div className="auth-page app-bg">
      <div className="auth-sidebar"><Sidebar /></div>
      <main className="auth-content">
        <div className="auth-mobile-brand"><Brand /></div>
        <section className="hero-copy">
          <span className="welcome-pill">Welcome Back! 👋</span>
          <h1>Track Your Expenses <span>Smartly</span></h1>
          <p>Stay on top of your spending and manage money like a pro.</p>
          <div className="mini-gradient-line" />
          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </section>
        <section className="auth-card">
          <LoginForm onSuccess={() => navigate('/expenses')} />
          <p className="demo-note"><Sparkles size={14} /> Demo: user@example.com / Password@123 · admin@example.com / Admin@123</p>
        </section>
      </main>
    </div>
  );
};
