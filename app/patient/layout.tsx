'use client';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Page content - sidebar is already rendered in root layout */}
      <main className="flex-1 bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
} 