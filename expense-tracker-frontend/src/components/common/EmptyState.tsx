import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No data found', description }: { title?: string; description?: string }) => (
  <div className="empty-state">
    <Inbox size={34} />
    <h3>{title}</h3>
    {description && <p>{description}</p>}
  </div>
);
