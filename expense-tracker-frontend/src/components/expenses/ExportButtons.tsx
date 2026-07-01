import { FileSpreadsheet, FileText } from 'lucide-react';
import { ExpenseFilters } from '../../types/expense';
import { expenseService } from '../../services/expenseService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

export const ExportButtons = ({ filters }: { filters: ExpenseFilters }) => {
  const toast = useToast();

  const runExport = async (type: 'pdf' | 'excel') => {
    try {
      if (type === 'pdf') await expenseService.exportPdf(filters);
      else await expenseService.exportExcel(filters);
      toast.success(`${type === 'pdf' ? 'PDF' : 'Excel'} export started.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed.');
    }
  };

  return (
    <div className="export-actions">
      <Button variant="secondary" icon={<FileText size={17} />} onClick={() => runExport('pdf')}>PDF</Button>
      <Button variant="secondary" icon={<FileSpreadsheet size={17} />} onClick={() => runExport('excel')}>Excel</Button>
    </div>
  );
};
