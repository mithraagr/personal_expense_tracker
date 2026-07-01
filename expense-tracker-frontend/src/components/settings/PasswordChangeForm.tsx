import { FormEvent, useState } from 'react';
import { Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { validatePassword } from '../../utils/validators';
import { Button } from '../common/Button';
import { TextInput } from '../common/FormControls';

export const PasswordChangeForm = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    if (!currentPassword) return setError('Current password is required.');
    const passwordError = validatePassword(newPassword);
    if (passwordError) return setError(passwordError);
    if (newPassword !== confirmNewPassword) return setError('New password and confirm password must match.');
    setSubmitting(true);
    try {
      await authService.changePassword(user.id, { currentPassword, newPassword, confirmNewPassword });
      toast.success('Password changed successfully.');
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <TextInput label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} icon={<Lock size={16} />} />
      <TextInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<Lock size={16} />} />
      <TextInput label="Confirm New Password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} icon={<Lock size={16} />} />
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" icon={<Save size={17} />} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Change Password'}</Button>
    </form>
  );
};
