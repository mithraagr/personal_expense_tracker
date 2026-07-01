export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value || 0);

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`));

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const currentMonthFilter = () => {
  const today = new Date();
  return {
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };
};

export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'U';
};

export const monthName = (month: number): string =>
  new Date(2026, month - 1, 1).toLocaleString('en-IN', { month: 'short' });
