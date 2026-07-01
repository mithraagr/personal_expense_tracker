import { FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { TextInput } from '../common/FormControls';

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <span className="lock-orb"><Lock size={17} /></span>
        <h2>Login to your account</h2>
      </div>
      <TextInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        icon={<Mail size={16} />}
        required
      />
      <label className="field">
        <span className="field-label">Password</span>
        <span className="input-shell">
          <span className="input-icon"><Lock size={16} /></span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="input-action" type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </label>
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</Button>
      <p className="secure-text"><Lock size={14} /> Secure &amp; Protected</p>
    </form>
  );
};
