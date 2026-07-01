import { FormEvent, useState } from 'react';
import { Building2, Lock, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegisterPayload } from '../../types/user';
import { isValidEmail, validatePassword } from '../../utils/validators';
import { Button } from '../common/Button';
import { TextInput } from '../common/FormControls';

const initialForm: RegisterPayload = {
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  password: '',
  confirmPassword: ''
};

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const update = (key: keyof RegisterPayload, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim()) return 'Last name is required.';
    if (!isValidEmail(form.email)) return 'Valid email is required.';
    if (!form.city.trim()) return 'City is required.';
    const passwordError = validatePassword(form.password);
    if (passwordError) return passwordError;
    if (form.password !== form.confirmPassword) return 'Password and confirm password must match.';
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form auth-form-wide" onSubmit={handleSubmit}>
      <div className="form-title compact">
        <span className="lock-orb"><UserRound size={17} /></span>
        <h2>Create your account</h2>
      </div>
      <div className="two-column">
        <TextInput label="First Name" placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} icon={<UserRound size={16} />} />
        <TextInput label="Last Name" placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} icon={<UserRound size={16} />} />
      </div>
      <TextInput label="Email" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => update('email', e.target.value)} icon={<Mail size={16} />} />
      <TextInput label="City" placeholder="Enter your city" value={form.city} onChange={(e) => update('city', e.target.value)} icon={<Building2 size={16} />} />
      <div className="two-column">
        <TextInput label="Password" type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} icon={<Lock size={16} />} />
        <TextInput label="Confirm" type="password" placeholder="Confirm" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} icon={<Lock size={16} />} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Account'}</Button>
    </form>
  );
};
