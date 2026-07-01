import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => (
  <main className="app-bg standalone-state">
    <section className="panel state-page">
      <SearchX size={48} />
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/expenses"><Button>Go Home</Button></Link>
    </section>
  </main>
);
