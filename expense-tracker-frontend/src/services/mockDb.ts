import { AnalyticsSummary } from '../types/analytics';
import { Expense, ExpenseFilters, ExpensePayload } from '../types/expense';
import { MonthlyLimitPayload, UserSettings } from '../types/setting';
import { RegisterPayload, User, UserRole } from '../types/user';
import { currentMonthFilter, monthName, todayISO } from '../utils/format';

type StoredUser = User & { password: string };

const USERS_KEY = 'expense_tracker_mock_users';
const EXPENSES_KEY = 'expense_tracker_mock_expenses';
const SETTINGS_KEY = 'expense_tracker_mock_settings';

const now = () => new Date().toISOString();

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

const dateInCurrentMonth = (dayOffset: number): string => {
  const base = new Date();
  base.setDate(Math.max(1, base.getDate() - dayOffset));
  return base.toISOString().slice(0, 10);
};

export const initMockDatabase = () => {
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  if (!users.length) {
    const seededUsers: StoredUser[] = [
      {
        id: 1,
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@example.com',
        city: 'Default',
        role: 'admin',
        isActive: true,
        createdAt: now(),
        password: 'Admin@123'
      },
      {
        id: 2,
        firstName: 'Demo',
        lastName: 'User',
        email: 'user@example.com',
        city: 'Chennai',
        role: 'user',
        isActive: true,
        createdAt: now(),
        password: 'Password@123'
      }
    ];
    writeJson(USERS_KEY, seededUsers);
  }

  const expenses = readJson<Expense[]>(EXPENSES_KEY, []);
  if (!expenses.length) {
    const seededExpenses: Expense[] = [
      { id: 1, userId: 2, title: 'Lunch', category: 'Food', spendDate: dateInCurrentMonth(0), amount: 250, createdAt: now(), updatedAt: now() },
      { id: 2, userId: 2, title: 'Bus Ticket', category: 'Travel', spendDate: dateInCurrentMonth(0), amount: 80, createdAt: now(), updatedAt: now() },
      { id: 3, userId: 2, title: 'Groceries', category: 'Grocery', spendDate: dateInCurrentMonth(1), amount: 650, createdAt: now(), updatedAt: now() },
      { id: 4, userId: 2, title: 'Online Course', category: 'Education', spendDate: dateInCurrentMonth(2), amount: 1499, createdAt: now(), updatedAt: now() },
      { id: 5, userId: 2, title: 'Coffee', category: 'Food', spendDate: dateInCurrentMonth(2), amount: 120, createdAt: now(), updatedAt: now() },
      { id: 6, userId: 2, title: 'Fuel', category: 'Fuel', spendDate: dateInCurrentMonth(3), amount: 1500, createdAt: now(), updatedAt: now() },
      { id: 7, userId: 1, title: 'Admin Lunch', category: 'Food', spendDate: dateInCurrentMonth(0), amount: 300, createdAt: now(), updatedAt: now() },
      { id: 8, userId: 1, title: 'Software Bill', category: 'Bills', spendDate: dateInCurrentMonth(1), amount: 2500, createdAt: now(), updatedAt: now() }
    ];
    writeJson(EXPENSES_KEY, seededExpenses);
  }

  const settings = readJson<Record<number, UserSettings>>(SETTINGS_KEY, {});
  if (!Object.keys(settings).length) {
    writeJson<Record<number, UserSettings>>(SETTINGS_KEY, {
      1: { monthlyExpenseLimit: 20000, monthlyLimitEnabled: false },
      2: { monthlyExpenseLimit: 5000, monthlyLimitEnabled: true }
    });
  }
};

const users = () => readJson<StoredUser[]>(USERS_KEY, []);
const saveUsers = (value: StoredUser[]) => writeJson(USERS_KEY, value);
const expenses = () => readJson<Expense[]>(EXPENSES_KEY, []);
const saveExpenses = (value: Expense[]) => writeJson(EXPENSES_KEY, value);
const settings = () => readJson<Record<number, UserSettings>>(SETTINGS_KEY, {});
const saveSettings = (value: Record<number, UserSettings>) => writeJson(SETTINGS_KEY, value);

const publicUser = ({ password, ...user }: StoredUser): User => user;

const normalize = (value: string) => value.trim().toLowerCase();

export const mockAuth = {
  register(payload: RegisterPayload) {
    const allUsers = users();
    if (allUsers.some((user) => normalize(user.email) === normalize(payload.email))) {
      throw new Error('Email already registered.');
    }
    const user: StoredUser = {
      id: Date.now(),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      city: payload.city.trim(),
      role: 'user',
      isActive: true,
      createdAt: now(),
      password: payload.password
    };
    saveUsers([...allUsers, user]);
    return publicUser(user);
  },

  login(email: string, password: string) {
    const user = users().find((item) => normalize(item.email) === normalize(email));
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    if (!user.isActive) {
      throw new Error('Your account is disabled. Please contact administrator.');
    }
    return {
      accessToken: `mock-token-${user.id}-${Date.now()}`,
      tokenType: 'bearer' as const,
      user: publicUser(user)
    };
  },

  changePassword(userId: number, currentPassword: string, newPassword: string) {
    const allUsers = users();
    const index = allUsers.findIndex((item) => item.id === userId);
    if (index === -1) throw new Error('User not found.');
    if (allUsers[index].password !== currentPassword) throw new Error('Current password is incorrect.');
    if (allUsers[index].password === newPassword) throw new Error('New password should not be same as current password.');
    allUsers[index] = { ...allUsers[index], password: newPassword };
    saveUsers(allUsers);
  }
};

const passFilter = (expense: Expense, filters: ExpenseFilters) => {
  if (filters.date && expense.spendDate !== filters.date) return false;
  if (filters.fromDate && expense.spendDate < filters.fromDate) return false;
  if (filters.toDate && expense.spendDate > filters.toDate) return false;
  if (filters.month && Number(expense.spendDate.slice(5, 7)) !== Number(filters.month)) return false;
  if (filters.year && Number(expense.spendDate.slice(0, 4)) !== Number(filters.year)) return false;
  if (filters.category && expense.category !== filters.category) return false;
  if (filters.search) {
    const query = normalize(filters.search);
    const haystack = `${expense.title} ${expense.category} ${expense.amount}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
};

export const mockExpenses = {
  list(userId: number, filters: ExpenseFilters = {}) {
    const effectiveFilters = Object.keys(filters).length ? filters : currentMonthFilter();
    return expenses()
      .filter((expense) => expense.userId === userId)
      .filter((expense) => passFilter(expense, effectiveFilters))
      .sort((a, b) => b.spendDate.localeCompare(a.spendDate) || b.id - a.id);
  },

  create(userId: number, payload: ExpensePayload) {
    const allExpenses = expenses();
    const expense: Expense = {
      id: Date.now(),
      userId,
      title: payload.title?.trim() || payload.category,
      category: payload.category,
      spendDate: payload.spendDate || todayISO(),
      amount: Number(payload.amount),
      createdAt: now(),
      updatedAt: now()
    };
    saveExpenses([expense, ...allExpenses]);
    return expense;
  },

  update(userId: number, expenseId: number, payload: ExpensePayload) {
    const allExpenses = expenses();
    const index = allExpenses.findIndex((expense) => expense.id === expenseId && expense.userId === userId);
    if (index === -1) throw new Error('Expense not found.');
    allExpenses[index] = {
      ...allExpenses[index],
      title: payload.title?.trim() || payload.category,
      category: payload.category,
      spendDate: payload.spendDate,
      amount: Number(payload.amount),
      updatedAt: now()
    };
    saveExpenses(allExpenses);
    return allExpenses[index];
  },

  remove(userId: number, expenseId: number) {
    const allExpenses = expenses();
    const expense = allExpenses.find((item) => item.id === expenseId && item.userId === userId);
    if (!expense) throw new Error('Expense not found.');
    saveExpenses(allExpenses.filter((item) => item.id !== expenseId));
  }
};

export const buildAnalytics = (expenseRows: Expense[]): AnalyticsSummary => {
  const overallTotal = expenseRows.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const categoryMap = new Map<string, number>();
  const dayMap = new Map<string, number>();
  const monthMap = new Map<string, number>();

  expenseRows.forEach((expense) => {
    categoryMap.set(expense.category, (categoryMap.get(expense.category) ?? 0) + Number(expense.amount));
    dayMap.set(expense.spendDate, (dayMap.get(expense.spendDate) ?? 0) + Number(expense.amount));
    const date = new Date(`${expense.spendDate}T00:00:00`);
    const label = `${monthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    monthMap.set(label, (monthMap.get(label) ?? 0) + Number(expense.amount));
  });

  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return {
    overallTotal,
    totalEntries: expenseRows.length,
    averageExpense: expenseRows.length ? Math.round(overallTotal / expenseRows.length) : 0,
    topCategory: categoryTotals[0]?.category ?? 'None',
    categoryTotals,
    dailyTrend: Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, total]) => ({ label: label.slice(5), total })),
    monthlyTrend: Array.from(monthMap.entries()).map(([label, total]) => ({ label, total }))
  };
};

export const mockSettings = {
  get(userId: number): UserSettings {
    const allSettings = settings();
    return allSettings[userId] ?? { monthlyExpenseLimit: 0, monthlyLimitEnabled: false };
  },

  update(userId: number, payload: MonthlyLimitPayload): UserSettings {
    const allSettings = settings();
    allSettings[userId] = payload;
    saveSettings(allSettings);
    return allSettings[userId];
  },

  disable(userId: number): UserSettings {
    const allSettings = settings();
    allSettings[userId] = { ...(allSettings[userId] ?? { monthlyExpenseLimit: 0 }), monthlyLimitEnabled: false };
    saveSettings(allSettings);
    return allSettings[userId];
  }
};

const activeAdminCount = (allUsers: StoredUser[]) => allUsers.filter((user) => user.role === 'admin' && user.isActive).length;

export const mockAdmin = {
  list(search = '', role = '', status = '') {
    let allUsers = users().map(publicUser);
    if (search) {
      const query = normalize(search);
      allUsers = allUsers.filter((user) => `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(query));
    }
    if (role) allUsers = allUsers.filter((user) => user.role === role);
    if (status === 'active') allUsers = allUsers.filter((user) => user.isActive);
    if (status === 'disabled') allUsers = allUsers.filter((user) => !user.isActive);
    return allUsers.sort((a, b) => b.id - a.id);
  },

  setActive(currentUserId: number, targetUserId: number, isActive: boolean) {
    const allUsers = users();
    const index = allUsers.findIndex((user) => user.id === targetUserId);
    if (index === -1) throw new Error('User not found.');
    if (!isActive && targetUserId === currentUserId) throw new Error('Admin cannot disable their own account.');
    if (!isActive && allUsers[index].role === 'admin' && activeAdminCount(allUsers) <= 1) {
      throw new Error('Cannot disable the last active admin account.');
    }
    allUsers[index] = { ...allUsers[index], isActive };
    saveUsers(allUsers);
    return publicUser(allUsers[index]);
  },

  setRole(currentUserId: number, targetUserId: number, role: UserRole) {
    const allUsers = users();
    const index = allUsers.findIndex((user) => user.id === targetUserId);
    if (index === -1) throw new Error('User not found.');
    if (targetUserId === currentUserId && role !== 'admin') throw new Error('Admin cannot remove their own admin role.');
    if (allUsers[index].role === 'admin' && role !== 'admin' && allUsers[index].isActive && activeAdminCount(allUsers) <= 1) {
      throw new Error('Cannot remove admin role from the last active admin account.');
    }
    allUsers[index] = { ...allUsers[index], role };
    saveUsers(allUsers);
    return publicUser(allUsers[index]);
  }
};
