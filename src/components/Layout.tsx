// src/components/Layout.tsx
import React, { useState } from 'react';
import MobileDrawer from './MobileDrawer';
import { Navbar } from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDrawer() {
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenMobile={openDrawer} />

      <div className="max-w-7xl mx-auto  sm:px-0 lg:px-8">
        <div className="flex pt-6">
          {/* Main content */}
          <main className="flex-1 md:ml-6">
            <div className="   shadow-sm ">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </div>
  );
}
