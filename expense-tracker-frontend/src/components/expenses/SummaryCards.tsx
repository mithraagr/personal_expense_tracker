import { IndianRupee, ReceiptText, Star, Tags } from 'lucide-react';
import { AnalyticsSummary } from '../../types/analytics';
import { formatCurrency } from '../../utils/format';

const cards = (summary: AnalyticsSummary) => [
  { label: 'Total Expenses', value: formatCurrency(summary.overallTotal), hint: 'This Month', icon: <IndianRupee size={20} />, className: 'green' },
  { label: 'Total Entries', value: String(summary.totalEntries), hint: 'Filtered Data', icon: <ReceiptText size={20} />, className: 'purple' },
  { label: 'Average Expense', value: formatCurrency(summary.averageExpense), hint: 'Per Entry', icon: <Star size={20} />, className: 'orange' },
  { label: 'Top Category', value: summary.topCategory, hint: 'Highest Spend', icon: <Tags size={20} />, className: 'blue' }
];

export const SummaryCards = ({ summary }: { summary: AnalyticsSummary }) => (
  <div className="summary-grid">
    {cards(summary).map((card) => (
      <article key={card.label} className="summary-card panel">
        <span className={`summary-icon ${card.className}`}>{card.icon}</span>
        <div>
          <p>{card.label}</p>
          <h3>{card.value}</h3>
          <span>{card.hint}</span>
        </div>
      </article>
    ))}
  </div>
);
