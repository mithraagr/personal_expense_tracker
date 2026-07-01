import { AlertTriangle } from 'lucide-react';
import { UserSettings } from '../../types/setting';
import { formatCurrency } from '../../utils/format';

export const LimitAlert = ({ settings, currentSpend }: { settings: UserSettings | null; currentSpend: number }) => {
  if (!settings?.monthlyLimitEnabled || !settings.monthlyExpenseLimit || currentSpend < settings.monthlyExpenseLimit) return null;

  return (
    <div className="limit-alert">
      <AlertTriangle size={20} />
      <div>
        <strong>Your monthly expense limit has been reached.</strong>
        <p>Current spending: {formatCurrency(currentSpend)}. Monthly limit: {formatCurrency(settings.monthlyExpenseLimit)}.</p>
      </div>
    </div>
  );
};
