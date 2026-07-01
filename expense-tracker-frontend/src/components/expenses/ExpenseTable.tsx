import { Edit3, Trash2 } from 'lucide-react';
import { Expense } from '../../types/expense';
import { formatCurrency, formatDate } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';

const categoryIcon = (category: string) => {
  const map: Record<string, string> = {
    Food: '🍴',
    Grocery: '🛍️',
    Travel: '🚌',
    Rent: '🏠',
    Bills: '🧾',
    Shopping: '🛒',
    Entertainment: '🎬',
    Medical: '💊',
    Education: '📘',
    Fuel: '⛽',
    Others: '✨'
  };
  return map[category] ?? '✨';
};

export const ExpenseTable = ({ expenses, onEdit, onDelete }: { expenses: Expense[]; onEdit: (expense: Expense) => void; onDelete: (expense: Expense) => void }) => {
  if (!expenses.length) {
    return <EmptyState title="No expenses found" description="No expenses found for the selected filter." />;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <article className="expense-row" key={expense.id}>
          <div className="expense-name">
            <span className="category-badge">{categoryIcon(expense.category)}</span>
            <div>
              <h3>{expense.title}</h3>
              <p>{expense.category}</p>
            </div>
          </div>
          <strong className="expense-amount">{formatCurrency(expense.amount)}</strong>
          <time>{formatDate(expense.spendDate)}</time>
          <div className="row-actions">
            <button className="icon-button edit" type="button" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}>
              <Edit3 size={16} />
            </button>
            <button className="icon-button delete" type="button" onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`}>
              <Trash2 size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};
