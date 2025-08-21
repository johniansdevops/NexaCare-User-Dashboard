import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import GlobalSidebar from '@/components/GlobalSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NexaCare - Intelligent Healthcare Platform',
    template: '%s | NexaCare'
  },
  description: 'AI-powered healthcare platform connecting patients and providers with intelligent health management, assessments, and 24/7 AI assistance.',
  keywords: ['healthcare', 'AI', 'medical', 'telemedicine', 'health assessment', 'patient portal'],
  authors: [{ name: 'NexaCare Team' }],
  creator: 'NexaCare',
  publisher: 'NexaCare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nexacare.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexacare.com',
    title: 'NexaCare - Intelligent Healthcare Platform',
    description: 'AI-powered healthcare platform for modern healthcare management',
    siteName: 'NexaCare',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NexaCare Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaCare - Intelligent Healthcare Platform',
    description: 'AI-powered healthcare platform for modern healthcare management',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white`}>
        <Providers>
          <div className="min-h-screen bg-gradient-light">
            <GlobalSidebar />
            <div className="lg:pl-20">
              <main className="min-h-screen bg-white">
                {children}
              </main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
} 