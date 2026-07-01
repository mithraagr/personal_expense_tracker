import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/format';

export const Header = ({ title, subtitle, onMenuClick }: { title: string; subtitle?: string; onMenuClick: () => void }) => {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button mobile-menu-button" type="button" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="user-pill">
          <span className="avatar">{getInitials(user?.firstName, user?.lastName)}</span>
          <span>{user ? `${user.firstName}` : 'User'}</span>
        </div>
      </div>
    </header>
  );
};
