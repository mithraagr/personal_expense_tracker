import { FormEvent, useEffect, useState } from 'react';
import { IndianRupee, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { settingService } from '../../services/settingService';
import { UserSettings } from '../../types/setting';
import { Button } from '../common/Button';
import { TextInput } from '../common/FormControls';

export const MonthlyLimitForm = ({ settings, onSaved }: { settings: UserSettings | null; onSaved: (settings: UserSettings) => void }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [monthlyExpenseLimit, setMonthlyExpenseLimit] = useState(0);
  const [monthlyLimitEnabled, setMonthlyLimitEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMonthlyExpenseLimit(settings?.monthlyExpenseLimit ?? 0);
    setMonthlyLimitEnabled(Boolean(settings?.monthlyLimitEnabled));
  }, [settings]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    if (monthlyLimitEnabled && (!monthlyExpenseLimit || monthlyExpenseLimit <= 0)) return setError('Monthly limit must be greater than zero.');
    setSubmitting(true);
    try {
      const saved = await settingService.updateMonthlyLimit(user, { monthlyExpenseLimit: Number(monthlyExpenseLimit), monthlyLimitEnabled });
      onSaved(saved);
      toast.success('Monthly limit updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update monthly limit.');
    } finally {
      setSubmitting(false);
    }
  };

  const disableLimit = async () => {
    if (!user) return;
    const saved = await settingService.disableMonthlyLimit(user);
    onSaved(saved);
    toast.success('Monthly limit disabled.');
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label className="toggle-row">
        <span>
          <strong>Limit Enabled</strong>
          <small>Show alert when current month total reaches the limit.</small>
        </span>
        <input type="checkbox" checked={monthlyLimitEnabled} onChange={(e) => setMonthlyLimitEnabled(e.target.checked)} />
      </label>
      <TextInput label="Monthly Spend Limit" type="number" min="1" value={monthlyExpenseLimit || ''} onChange={(e) => setMonthlyExpenseLimit(Number(e.target.value))} icon={<IndianRupee size={16} />} />
      {error && <p className="form-error">{error}</p>}
      <div className="settings-actions">
        <Button type="submit" icon={<Save size={17} />} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Limit'}</Button>
        <Button type="button" variant="secondary" onClick={disableLimit}>Disable Limit</Button>
      </div>
    </form>
  );
};
