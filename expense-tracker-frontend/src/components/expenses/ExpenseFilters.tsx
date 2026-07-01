import { Search, SlidersHorizontal, XCircle } from 'lucide-react';
import { EXPENSE_CATEGORIES, ExpenseFilters as ExpenseFiltersType } from '../../types/expense';
import { Button } from '../common/Button';
import { SelectInput, TextInput } from '../common/FormControls';

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onChange: (filters: ExpenseFiltersType) => void;
  onReset: () => void;
}

export const ExpenseFilters = ({ filters, onChange, onReset }: ExpenseFiltersProps) => {
  const update = (patch: Partial<ExpenseFiltersType>) => onChange({ ...filters, ...patch });
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <section className="panel filter-panel">
      <div className="section-title compact">
        <span className="section-icon"><SlidersHorizontal size={18} /></span>
        <div>
          <h2>Filters</h2>
          <p>Filter by date, month, range, category or search</p>
        </div>
      </div>
      <div className="filters-grid">
        <TextInput placeholder="Search expenses..." value={filters.search ?? ''} onChange={(e) => update({ search: e.target.value })} icon={<Search size={16} />} />
        <SelectInput value={filters.category ?? ''} onChange={(e) => update({ category: e.target.value as ExpenseFiltersType['category'] })}>
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </SelectInput>
        <TextInput type="date" value={filters.date ?? ''} onChange={(e) => update({ date: e.target.value, fromDate: '', toDate: '' })} />
        <TextInput type="date" value={filters.fromDate ?? ''} onChange={(e) => update({ fromDate: e.target.value, date: '' })} />
        <TextInput type="date" value={filters.toDate ?? ''} onChange={(e) => update({ toDate: e.target.value, date: '' })} />
        <SelectInput value={filters.month ?? ''} onChange={(e) => update({ month: e.target.value ? Number(e.target.value) : undefined, date: '' })}>
          <option value="">Any Month</option>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => <option key={month} value={month}>{month}</option>)}
        </SelectInput>
        <SelectInput value={filters.year ?? ''} onChange={(e) => update({ year: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Any Year</option>
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </SelectInput>
        <Button type="button" variant="secondary" icon={<XCircle size={17} />} onClick={onReset}>Reset</Button>
      </div>
    </section>
  );
};
