'use client';

export default function AIChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-gradient-light fixed inset-0 z-50">
      {children}
    </div>
  );
}
