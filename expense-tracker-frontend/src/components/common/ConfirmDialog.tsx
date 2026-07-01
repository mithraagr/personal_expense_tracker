import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Confirm', onConfirm, onCancel, danger }: ConfirmDialogProps) => (
  <Modal title={title} isOpen={isOpen} onClose={onCancel}>
    <div className="confirm-body">
      <div className={`confirm-icon ${danger ? 'danger' : ''}`}>
        <AlertTriangle size={22} />
      </div>
      <p>{message}</p>
    </div>
    <div className="modal-actions">
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
    </div>
  </Modal>
);
