'use client';

export default function AIChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-white fixed inset-0 z-30">
      {children}
    </div>
  );
}
