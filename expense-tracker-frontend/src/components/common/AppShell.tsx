import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppShell = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-shell app-bg">
      <Sidebar />
      <div className="mobile-backdrop" data-open={isOpen} onClick={() => setIsOpen(false)} />
      <div className="mobile-sidebar" data-open={isOpen}>
        <Sidebar onNavigate={() => setIsOpen(false)} />
      </div>
      <main className="app-main">
        <Header title={title} subtitle={subtitle} onMenuClick={() => setIsOpen(true)} />
        {children}
      </main>
    </div>
  );
};
