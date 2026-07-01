import { useEffect, useState } from 'react';
import { AppShell } from '../components/common/AppShell';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Loader } from '../components/common/Loader';
import { UserFilters } from '../components/admin/UserFilters';
import { UserTable } from '../components/admin/UserTable';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminUserService, UserFilters as UserFiltersType } from '../services/adminUserService';
import { User, UserRole } from '../types/user';

export const UserManagementPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFiltersType>({});
  const [isLoading, setLoading] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [roleTarget, setRoleTarget] = useState<{ user: User; role: UserRole } | null>(null);

  const loadUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setUsers(await adminUserService.list(user, filters));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user?.id]);

  const confirmToggle = async () => {
    if (!user || !toggleTarget) return;
    try {
      const updated = toggleTarget.isActive
        ? await adminUserService.disable(user, toggleTarget.id)
        : await adminUserService.enable(user, toggleTarget.id);
      if (updated.id === user.id) updateUser(updated);
      toast.success(`User ${updated.isActive ? 'enabled' : 'disabled'}.`);
      setToggleTarget(null);
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'User update failed.');
    }
  };

  const confirmRoleChange = async () => {
    if (!user || !roleTarget) return;
    try {
      const updated = await adminUserService.changeRole(user, roleTarget.user.id, roleTarget.role);
      if (updated.id === user.id) updateUser(updated);
      toast.success('User role updated.');
      setRoleTarget(null);
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Role update failed.');
    }
  };

  if (!user) return null;

  return (
    <AppShell title="User Management" subtitle="Enable users, disable accounts and manage roles">
      <UserFilters filters={filters} onChange={setFilters} onReset={() => setFilters({})} />
      {isLoading ? <Loader label="Loading users..." /> : <UserTable users={users} currentUser={user} onToggleActive={setToggleTarget} onChangeRole={(target, role) => setRoleTarget({ user: target, role })} />}
      <ConfirmDialog
        isOpen={Boolean(toggleTarget)}
        danger={Boolean(toggleTarget?.isActive)}
        title={toggleTarget?.isActive ? 'Disable User' : 'Enable User'}
        message={toggleTarget?.isActive ? 'Are you sure you want to disable this user?' : 'Are you sure you want to enable this user?'}
        confirmText={toggleTarget?.isActive ? 'Disable' : 'Enable'}
        onCancel={() => setToggleTarget(null)}
        onConfirm={confirmToggle}
      />
      <ConfirmDialog
        isOpen={Boolean(roleTarget)}
        title="Change User Role"
        message="Are you sure you want to change this user's role?"
        confirmText="Change Role"
        onCancel={() => setRoleTarget(null)}
        onConfirm={confirmRoleChange}
      />
    </AppShell>
  );
};
