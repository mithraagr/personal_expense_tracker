import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({ variant = 'primary', icon, fullWidth, className = '', children, ...props }: ButtonProps) => (
  <button className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`} {...props}>
    {icon}
    <span>{children}</span>
  </button>
);
