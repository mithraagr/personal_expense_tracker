import { Search } from 'lucide-react';
import { UserFilters as UserFiltersType } from '../../services/adminUserService';
import { Button } from '../common/Button';
import { SelectInput, TextInput } from '../common/FormControls';

export const UserFilters = ({ filters, onChange, onReset }: { filters: UserFiltersType; onChange: (filters: UserFiltersType) => void; onReset: () => void }) => {
  const update = (patch: Partial<UserFiltersType>) => onChange({ ...filters, ...patch });

  return (
    <section className="panel filter-panel">
      <div className="filters-grid user-filters-grid">
        <TextInput placeholder="Search users by name or email" value={filters.search ?? ''} onChange={(e) => update({ search: e.target.value })} icon={<Search size={16} />} />
        <SelectInput value={filters.role ?? ''} onChange={(e) => update({ role: e.target.value as UserFiltersType['role'] })}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </SelectInput>
        <SelectInput value={filters.status ?? ''} onChange={(e) => update({ status: e.target.value as UserFiltersType['status'] })}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </SelectInput>
        <Button type="button" variant="secondary" onClick={onReset}>Reset</Button>
      </div>
    </section>
  );
};
