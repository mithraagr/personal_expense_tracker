export interface CategoryTotal {
  category: string;
  total: number;
}

export interface TrendPoint {
  label: string;
  total: number;
}

export interface AnalyticsSummary {
  overallTotal: number;
  totalEntries: number;
  averageExpense: number;
  topCategory: string;
  categoryTotals: CategoryTotal[];
  dailyTrend: TrendPoint[];
  monthlyTrend: TrendPoint[];
}
