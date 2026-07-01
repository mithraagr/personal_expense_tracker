import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogIn, LogOut, Settings, Shield, UserCog, WalletCards } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/expenses', label: 'Dashboard', icon: <LayoutDashboard size={17} />, end: true },
  { to: '/expenses/history', label: 'Expenses', icon: <BarChart3 size={17} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={17} /> },
  { to: '/users', label: 'Users', icon: <UserCog size={17} />, adminOnly: true }
];

export const Brand = () => (
  <div className="brand">
    <span className="brand-icon"><WalletCards size={19} /></span>
    <span>Expense Tracker</span>
  </div>
);

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <Brand />
      <nav className="sidebar-nav">
        {!isAuthenticated && (
          <NavLink to="/login" className="nav-item" onClick={onNavigate}>
            <LogIn size={17} />
            <span>Login</span>
          </NavLink>
        )}
        {isAuthenticated && navItems
          .filter((item) => !item.adminOnly || user?.role === 'admin')
          .map((item) => (
            <NavLink key={`${item.to}-${item.label}`} to={item.to} end={item.end} className="nav-item" onClick={onNavigate}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        {isAuthenticated && (
          <button className="nav-item nav-button danger-nav" type="button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        )}
      </nav>
      <div className="sidebar-art">
        <div className="wallet-art">
          <span className="coin coin-a" />
          <span className="coin coin-b" />
          <span className="coin coin-c" />
        </div>
      </div>
      <div className="quote-card">
        <Shield size={15} />
        <p>Don&apos;t save what is left after spending, but spend what is left after saving.</p>
      </div>
    </aside>
  );
};
