import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { AppShell } from '../components/common/AppShell';
import { Button } from '../components/common/Button';

export const UnauthorizedPage = () => (
  <AppShell title="Unauthorized" subtitle="Access denied">
    <section className="panel state-page">
      <ShieldAlert size={48} />
      <h2>You do not have permission to access this page.</h2>
      <p>Please contact an administrator if you think this is a mistake.</p>
      <Link to="/expenses"><Button>Back to Dashboard</Button></Link>
    </section>
  </AppShell>
);
