import { FormEvent, useState } from 'react';
import { CalendarDays, IndianRupee, ListChecks, PlusCircle, ReceiptText, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES, ExpensePayload } from '../../types/expense';
import { todayISO } from '../../utils/format';
import { Button } from '../common/Button';
import { SelectInput, TextInput } from '../common/FormControls';

const initialForm: ExpensePayload = {
  title: '',
  category: 'Food',
  spendDate: todayISO(),
  amount: 0
};

export const QuickAddExpense = ({ onAdd, onViewExpenses }: { onAdd: (payload: ExpensePayload) => Promise<void>; onViewExpenses: () => void }) => {
  const [form, setForm] = useState<ExpensePayload>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const update = <K extends keyof ExpensePayload>(key: K, value: ExpensePayload[K]) => setForm((current) => ({ ...current, [key]: value }));

  const clear = () => {
    setForm(initialForm);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.spendDate) return setError('Spend date is required.');
    if (!Number(form.amount) || Number(form.amount) <= 0) return setError('Amount must be greater than zero.');
    setSubmitting(true);
    try {
      await onAdd(form);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel quick-add-panel">
      <div className="section-title-row">
        <div className="section-title compact">
          <span className="section-icon"><ReceiptText size={18} /></span>
          <div>
            <h2>Add New Expense</h2>
            <p>Track spending in a few seconds</p>
          </div>
        </div>
        <Button variant="secondary" icon={<ListChecks size={17} />} onClick={onViewExpenses}>View Expenses</Button>
      </div>
      <form className="quick-add-grid" onSubmit={handleSubmit}>
        <TextInput label="Title" placeholder="Enter title" value={form.title} onChange={(e) => update('title', e.target.value)} icon={<ReceiptText size={16} />} />
        <TextInput label="Amount" type="number" min="1" placeholder="Enter amount" value={form.amount || ''} onChange={(e) => update('amount', Number(e.target.value))} icon={<IndianRupee size={16} />} />
        <SelectInput label="Category" value={form.category} onChange={(e) => update('category', e.target.value as ExpensePayload['category'])}>
          {EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </SelectInput>
        <TextInput label="Spend Date" type="date" value={form.spendDate} onChange={(e) => update('spendDate', e.target.value)} icon={<CalendarDays size={16} />} />
        <div className="quick-add-actions">
          <Button type="submit" icon={<PlusCircle size={17} />} disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Expense'}</Button>
          <Button type="button" variant="secondary" icon={<RotateCcw size={17} />} onClick={clear}>Clear</Button>
        </div>
      </form>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
};
