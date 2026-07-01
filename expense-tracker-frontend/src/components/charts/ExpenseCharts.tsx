import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, CartesianGrid } from 'recharts';
import { AnalyticsSummary } from '../../types/analytics';
import { formatCurrency } from '../../utils/format';

const COLORS = ['#d451d9', '#7c5cff', '#2ed88b', '#1aa9ff', '#f7a323', '#eb4c77', '#7de3ff', '#a66bff'];

const tooltipFormatter = (value: number | string) => formatCurrency(Number(value));

export const ExpenseCharts = ({ summary }: { summary: AnalyticsSummary }) => {
  const hasChartData = summary.categoryTotals.length > 0;

  if (!hasChartData) return null;

  return (
    <section className="charts-grid">
      <article className="panel chart-card">
        <div className="section-title compact">
          <div>
            <h2>Category Distribution</h2>
            <p>Spending by category</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={summary.categoryTotals} dataKey="total" nameKey="category" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {summary.categoryTotals.map((entry, index) => <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#131a3a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </article>
      <article className="panel chart-card">
        <div className="section-title compact">
          <div>
            <h2>Daily Trend</h2>
            <p>Amount spent by date</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={summary.dailyTrend} margin={{ top: 16, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,.08)" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#131a3a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
            <Line type="monotone" dataKey="total" stroke="#d451d9" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </article>
      <article className="panel chart-card chart-card-wide">
        <div className="section-title compact">
          <div>
            <h2>Category Summary</h2>
            <p>Total amount per category</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={summary.categoryTotals} margin={{ top: 16, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,.08)" />
            <XAxis dataKey="category" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#131a3a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
            <Bar dataKey="total" fill="#7c5cff" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
};
