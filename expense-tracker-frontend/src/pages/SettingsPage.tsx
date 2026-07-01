import { useEffect, useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { AppShell } from '../components/common/AppShell';
import { Loader } from '../components/common/Loader';
import { MonthlyLimitForm } from '../components/settings/MonthlyLimitForm';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { settingService } from '../services/settingService';
import { UserSettings } from '../types/setting';

export const SettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'password' | 'limit'>('password');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        setSettings(await settingService.get(user));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unable to load settings.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, toast]);

  return (
    <AppShell title="Settings" subtitle="Manage password and monthly spending limit">
      <section className="panel settings-panel">
        <div className="settings-tabs">
          <button className={activeTab === 'password' ? 'active' : ''} onClick={() => setActiveTab('password')} type="button"><Lock size={17} /> Password Change</button>
          <button className={activeTab === 'limit' ? 'active' : ''} onClick={() => setActiveTab('limit')} type="button"><CreditCard size={17} /> Monthly Expense Limit</button>
        </div>
        {isLoading ? <Loader label="Loading settings..." /> : (
          <div className="settings-tab-content">
            {activeTab === 'password' ? <PasswordChangeForm /> : <MonthlyLimitForm settings={settings} onSaved={setSettings} />}
          </div>
        )}
      </section>
    </AppShell>
  );
};
