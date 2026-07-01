export const EXPENSE_CATEGORIES = [
  'Food',
  'Grocery',
  'Travel',
  'Rent',
  'Bills',
  'Shopping',
  'Entertainment',
  'Medical',
  'Education',
  'Fuel',
  'Others'
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: number;
  userId: number;
  title: string;
  category: ExpenseCategory;
  spendDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePayload {
  title: string;
  category: ExpenseCategory;
  spendDate: string;
  amount: number;
}

export interface ExpenseFilters {
  date?: string;
  fromDate?: string;
  toDate?: string;
  month?: number;
  year?: number;
  category?: ExpenseCategory | '';
  search?: string;
}
