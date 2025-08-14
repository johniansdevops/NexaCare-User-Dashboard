'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to patient dashboard
    router.replace('/patient');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mediva-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">✦</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Mediva AI</h1>
        <p className="text-gray-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 