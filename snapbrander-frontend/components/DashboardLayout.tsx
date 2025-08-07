
'use client';

import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  currentPath?: string;
}

export default function DashboardLayout({ children, title, currentPath }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar currentPath={currentPath} />
      <div className="mr-64">
        <TopNavbar title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
