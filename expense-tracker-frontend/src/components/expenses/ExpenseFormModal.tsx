import { FormEvent, useEffect, useState } from 'react';
import { CalendarDays, IndianRupee, ReceiptText } from 'lucide-react';
import { EXPENSE_CATEGORIES, Expense, ExpensePayload } from '../../types/expense';
import { todayISO } from '../../utils/format';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SelectInput, TextInput } from '../common/FormControls';

const emptyForm: ExpensePayload = {
  title: '',
  category: 'Food',
  spendDate: todayISO(),
  amount: 0
};

interface ExpenseFormModalProps {
  isOpen: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
}

export const ExpenseFormModal = ({ isOpen, expense, onClose, onSubmit }: ExpenseFormModalProps) => {
  const [form, setForm] = useState<ExpensePayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({ title: expense.title, category: expense.category, spendDate: expense.spendDate, amount: expense.amount });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [expense, isOpen]);

  const update = <K extends keyof ExpensePayload>(key: K, value: ExpensePayload[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.category) return setError('Category is required.');
    if (!form.spendDate) return setError('Spend date is required.');
    if (!Number(form.amount) || Number(form.amount) <= 0) return setError('Amount must be greater than zero.');

    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={expense ? 'Edit Expense' : 'Add Expense'} isOpen={isOpen} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <TextInput label="Title" placeholder="Lunch, bus ticket, groceries" value={form.title} onChange={(e) => update('title', e.target.value)} icon={<ReceiptText size={16} />} />
        <TextInput label="Amount" type="number" min="1" placeholder="Enter amount" value={form.amount || ''} onChange={(e) => update('amount', Number(e.target.value))} icon={<IndianRupee size={16} />} />
        <SelectInput label="Category" value={form.category} onChange={(e) => update('category', e.target.value as ExpensePayload['category'])}>
          {EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </SelectInput>
        <TextInput label="Spend Date" type="date" value={form.spendDate} onChange={(e) => update('spendDate', e.target.value)} icon={<CalendarDays size={16} />} />
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Expense'}</Button>
        </div>
      </form>
    </Modal>
  );
};
