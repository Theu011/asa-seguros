'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/portal/Sidebar';
import { Header } from '@/components/portal/Header';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c50)' }}>

      {/* Desktop sidebar — animated width */}
      <div
        className="hidden lg:block h-full shrink-0 overflow-hidden"
        style={{
          width: sidebarOpen ? 256 : 0,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ width: 256, height: '100%' }}>
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar — slide-in overlay */}
      <div className="lg:hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="relative z-10 px-6 py-7 lg:px-10 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
