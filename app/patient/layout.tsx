'use client';

import GlobalSidebar from '@/components/GlobalSidebar';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Global Sidebar */}
      <GlobalSidebar />
      
      {/* Page content */}
      <main className="flex-1 bg-white min-h-screen lg:pl-20">
        {children}
      </main>
    </div>
  );
} 