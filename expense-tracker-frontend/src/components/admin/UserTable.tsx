import { ShieldCheck, ShieldOff, UserCog } from 'lucide-react';
import { User, UserRole } from '../../types/user';
import { formatDate } from '../../utils/format';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const UserTable = ({ users, currentUser, onToggleActive, onChangeRole }: {
  users: User[];
  currentUser: User;
  onToggleActive: (user: User) => void;
  onChangeRole: (user: User, role: UserRole) => void;
}) => {
  if (!users.length) return <EmptyState title="No users found" description="Try changing the search or filter options." />;

  return (
    <div className="user-table-wrap panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="Name"><strong>{user.firstName} {user.lastName}</strong></td>
              <td data-label="Email">{user.email}</td>
              <td data-label="City">{user.city}</td>
              <td data-label="Role"><span className={`badge ${user.role}`}>{user.role}</span></td>
              <td data-label="Status"><span className={`badge ${user.isActive ? 'active' : 'disabled'}`}>{user.isActive ? 'Active' : 'Disabled'}</span></td>
              <td data-label="Created">{formatDate(user.createdAt.slice(0, 10))}</td>
              <td data-label="Actions">
                <div className="table-actions">
                  <Button variant="secondary" icon={user.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />} onClick={() => onToggleActive(user)} disabled={user.id === currentUser.id && user.isActive}>
                    {user.isActive ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="secondary" icon={<UserCog size={15} />} onClick={() => onChangeRole(user, user.role === 'admin' ? 'user' : 'admin')} disabled={user.id === currentUser.id && user.role === 'admin'}>
                    Make {user.role === 'admin' ? 'User' : 'Admin'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
