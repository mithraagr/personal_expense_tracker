import { useEffect, useMemo, useRef, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { AppShell } from '../components/common/AppShell';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Loader } from '../components/common/Loader';
import { ExpenseCharts } from '../components/charts/ExpenseCharts';
import { ExportButtons } from '../components/expenses/ExportButtons';
import { ExpenseFilters } from '../components/expenses/ExpenseFilters';
import { ExpenseFormModal } from '../components/expenses/ExpenseFormModal';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { LimitAlert } from '../components/expenses/LimitAlert';
import { QuickAddExpense } from '../components/expenses/QuickAddExpense';
import { SummaryCards } from '../components/expenses/SummaryCards';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { expenseService } from '../services/expenseService';
import { settingService } from '../services/settingService';
import { AnalyticsSummary } from '../types/analytics';
import { Expense, ExpenseFilters as ExpenseFiltersType, ExpensePayload } from '../types/expense';
import { UserSettings } from '../types/setting';
import { currentMonthFilter } from '../utils/format';

const emptySummary: AnalyticsSummary = {
  overallTotal: 0,
  totalEntries: 0,
  averageExpense: 0,
  topCategory: 'None',
  categoryTotals: [],
  dailyTrend: [],
  monthlyTrend: []
};

export const ExpensePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const historyRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<ExpenseFiltersType>(currentMonthFilter());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>(emptySummary);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [expenseRows, analytics, userSettings] = await Promise.all([
        expenseService.list(user, filters),
        expenseService.analytics(user, filters),
        settingService.get(user)
      ]);
      setExpenses(expenseRows);
      setSummary(analytics);
      setSettings(userSettings);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user?.id]);

  const resetFilters = () => setFilters(currentMonthFilter());

  const handleSaveExpense = async (payload: ExpensePayload) => {
    if (!user) return;
    if (editingExpense) {
      await expenseService.update(user, editingExpense.id, payload);
      toast.success('Expense updated.');
    } else {
      await expenseService.create(user, payload);
      toast.success('Expense added.');
    }
    await loadData();
  };

  const handleQuickAdd = async (payload: ExpensePayload) => {
    if (!user) return;
    await expenseService.create(user, payload);
    toast.success('Expense added.');
    await loadData();
  };

  const handleDelete = async () => {
    if (!user || !deleteTarget) return;
    try {
      await expenseService.remove(user, deleteTarget.id);
      toast.success('Expense deleted.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete expense.');
    }
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const subtitle = useMemo(() => 'Add, filter, analyze and export your expense data', []);

  return (
    <AppShell title="Dashboard" subtitle={subtitle}>
      <LimitAlert settings={settings} currentSpend={summary.overallTotal} />
      <QuickAddExpense onAdd={handleQuickAdd} onViewExpenses={() => historyRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <SummaryCards summary={summary} />
      <ExpenseCharts summary={summary} />
      <section className="history-section" ref={historyRef}>
        <div className="section-title-row history-title-row">
          <div className="section-title">
            <h2>Expense History</h2>
            <p>All your expenses</p>
          </div>
          <div className="history-actions">
            <ExportButtons filters={filters} />
            <Button icon={<PlusCircle size={17} />} onClick={openAdd}>Add Expense</Button>
          </div>
        </div>
        <ExpenseFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
        <div className="panel list-panel">
          {isLoading ? <Loader label="Loading expenses..." /> : <ExpenseTable expenses={expenses} onEdit={openEdit} onDelete={setDeleteTarget} />}
        </div>
      </section>
      <ExpenseFormModal isOpen={isModalOpen} expense={editingExpense} onClose={() => setModalOpen(false)} onSubmit={handleSaveExpense} />
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        danger
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AppShell>
  );
};
