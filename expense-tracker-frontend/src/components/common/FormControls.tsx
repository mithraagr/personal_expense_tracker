import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

interface FieldProps {
  label?: string;
  error?: string | null;
  icon?: ReactNode;
}

export const TextInput = ({ label, error, icon, className = '', ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="field">
    {label && <span className="field-label">{label}</span>}
    <span className={`input-shell ${error ? 'input-error' : ''}`}>
      {icon && <span className="input-icon">{icon}</span>}
      <input className={className} {...props} />
    </span>
    {error && <span className="field-error">{error}</span>}
  </label>
);

export const SelectInput = ({ label, error, children, className = '', ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) => (
  <label className="field">
    {label && <span className="field-label">{label}</span>}
    <span className={`input-shell ${error ? 'input-error' : ''}`}>
      <select className={className} {...props}>
        {children}
      </select>
    </span>
    {error && <span className="field-error">{error}</span>}
  </label>
);
