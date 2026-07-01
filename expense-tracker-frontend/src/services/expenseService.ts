import { apiClient, downloadBlob, isMockApi, queryParams } from './apiClient';
import { buildAnalytics, mockExpenses } from './mockDb';
import { AnalyticsSummary } from '../types/analytics';
import { Expense, ExpenseFilters, ExpensePayload } from '../types/expense';
import { User } from '../types/user';

const mapFilters = (filters: ExpenseFilters) => ({
  date: filters.date,
  from_date: filters.fromDate,
  to_date: filters.toDate,
  month: filters.month,
  year: filters.year,
  category: filters.category,
  search: filters.search
});

const mapExpense = (expense: any): Expense => ({
  id: expense.id,
  userId: expense.user_id ?? expense.userId,
  title: expense.title ?? expense.category,
  category: expense.category,
  spendDate: expense.spend_date ?? expense.spendDate,
  amount: Number(expense.amount),
  createdAt: expense.created_at ?? expense.createdAt,
  updatedAt: expense.updated_at ?? expense.updatedAt
});

const mapPayload = (payload: ExpensePayload) => ({
  category: payload.category,
  spend_date: payload.spendDate,
  amount: payload.amount
});

export const expenseService = {
  async list(currentUser: User, filters: ExpenseFilters): Promise<Expense[]> {
    if (isMockApi()) return mockExpenses.list(currentUser.id, filters);
    const response = await apiClient.get(`/expenses?${queryParams(mapFilters(filters))}`);
    return response.data.map(mapExpense);
  },

  async create(currentUser: User, payload: ExpensePayload): Promise<Expense> {
    if (isMockApi()) return mockExpenses.create(currentUser.id, payload);
    const response = await apiClient.post('/expenses', mapPayload(payload));
    return mapExpense(response.data);
  },

  async update(currentUser: User, expenseId: number, payload: ExpensePayload): Promise<Expense> {
    if (isMockApi()) return mockExpenses.update(currentUser.id, expenseId, payload);
    const response = await apiClient.put(`/expenses/${expenseId}`, mapPayload(payload));
    return mapExpense(response.data);
  },

  async remove(currentUser: User, expenseId: number): Promise<void> {
    if (isMockApi()) {
      mockExpenses.remove(currentUser.id, expenseId);
      return;
    }
    await apiClient.delete(`/expenses/${expenseId}`);
  },

  async analytics(currentUser: User, filters: ExpenseFilters): Promise<AnalyticsSummary> {
    if (isMockApi()) return buildAnalytics(mockExpenses.list(currentUser.id, filters));
    const response = await apiClient.get(`/analytics/charts?${queryParams(mapFilters(filters))}`);
    return {
      overallTotal: response.data.overall_total,
      totalEntries: response.data.total_entries,
      averageExpense: response.data.average_expense,
      topCategory: response.data.top_category,
      categoryTotals: response.data.category_totals,
      dailyTrend: response.data.daily_trend,
      monthlyTrend: response.data.monthly_trend
    };
  },

  async exportPdf(filters: ExpenseFilters): Promise<void> {
    if (isMockApi()) {
      const content = 'Mock PDF export is available when backend export API is enabled.';
      downloadBlob(new Blob([content], { type: 'application/pdf' }), `expense_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      return;
    }
    const response = await apiClient.get(`/exports/pdf?${queryParams(mapFilters(filters))}`, { responseType: 'blob' });
    downloadBlob(response.data, `expense_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  },

  async exportExcel(filters: ExpenseFilters): Promise<void> {
    if (isMockApi()) {
      const content = 'Spend Date,Category,Amount\nMock,Mock,0';
      downloadBlob(new Blob([content], { type: 'text/csv' }), `expense_report_${new Date().toISOString().slice(0, 10)}.csv`);
      return;
    }
    const response = await apiClient.get(`/exports/excel?${queryParams(mapFilters(filters))}`, { responseType: 'blob' });
    downloadBlob(response.data, `expense_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
};
