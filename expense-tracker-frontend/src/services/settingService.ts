import { apiClient, isMockApi } from './apiClient';
import { mockSettings } from './mockDb';
import { MonthlyLimitPayload, UserSettings } from '../types/setting';
import { User } from '../types/user';

const mapSettings = (data: any): UserSettings => ({
  monthlyExpenseLimit: Number(data.monthly_expense_limit ?? data.monthlyExpenseLimit ?? 0),
  monthlyLimitEnabled: Boolean(data.monthly_limit_enabled ?? data.monthlyLimitEnabled)
});

export const settingService = {
  async get(currentUser: User): Promise<UserSettings> {
    if (isMockApi()) return mockSettings.get(currentUser.id);
    const response = await apiClient.get('/settings');
    return mapSettings(response.data);
  },

  async updateMonthlyLimit(currentUser: User, payload: MonthlyLimitPayload): Promise<UserSettings> {
    if (isMockApi()) return mockSettings.update(currentUser.id, payload);
    const response = await apiClient.put('/settings/monthly-limit', {
      monthly_expense_limit: payload.monthlyExpenseLimit,
      monthly_limit_enabled: payload.monthlyLimitEnabled
    });
    return mapSettings(response.data);
  },

  async disableMonthlyLimit(currentUser: User): Promise<UserSettings> {
    if (isMockApi()) return mockSettings.disable(currentUser.id);
    const response = await apiClient.delete('/settings/monthly-limit');
    return mapSettings(response.data);
  }
};
