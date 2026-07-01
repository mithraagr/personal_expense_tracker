export interface UserSettings {
  monthlyExpenseLimit: number;
  monthlyLimitEnabled: boolean;
}

export interface MonthlyLimitPayload {
  monthlyExpenseLimit: number;
  monthlyLimitEnabled: boolean;
}
