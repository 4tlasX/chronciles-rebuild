import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="app-header">
          <span className="app-logo">CHRONICLES</span>
        </header>
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
