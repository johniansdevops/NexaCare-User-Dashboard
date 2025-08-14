'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  DocumentMagnifyingGlassIcon,
  UserIcon,
  UserGroupIcon,
  ChartBarIcon,
  HeartIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }> | string;
  isAI?: boolean;
}

const userNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/patient', icon: HomeIcon },
  { name: 'AI Chat', href: '/patient/ai-chat', icon: '✦', isAI: true },
  { name: 'Appointments', href: '/patient/appointments', icon: CalendarIcon },
  { name: 'Calendar', href: '/patient/calendar', icon: CalendarIcon },
  { name: 'Medications', href: '/patient/medications', icon: HeartIcon },
  { name: 'Assessments', href: '/patient/assessments', icon: ClipboardDocumentListIcon },
  { name: 'Health Records', href: '/patient/records-chat', icon: DocumentMagnifyingGlassIcon },
  { name: 'Profile', href: '/patient/profile', icon: UserIcon },
];

interface GlobalSidebarProps {
  className?: string;
}

export default function GlobalSidebar({ className }: GlobalSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use only user navigation - this is a pure user dashboard
  const navigation = userNavigation;

  // Mock user data - in real app this would come from auth context
  const user = {
    full_name: 'John Doe',
    role: 'patient'
  };

  const signOut = () => {
    console.log('Sign out clicked');
    // Add actual sign out logic here
  };

  return (
    <>
      {/* Mobile sidebar backdrop and sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 border-r border-gray-800" style={{ backgroundColor: '#1f1f1f' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 mediva-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">✦</span>
              </div>
              <span className="text-xl font-bold gradient-text">Medi Ai</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:text-pink-400 transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = typeof item.icon === 'string' ? null : item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "mediva-gradient text-white shadow-lg"
                      : "text-white hover:text-pink-400"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.isAI ? (
                    <span className={cn("text-lg font-bold", isActive ? "text-white" : "ai-text")}>
                      ✦
                    </span>
                  ) : Icon ? (
                    <Icon className="w-6 h-6" />
                  ) : null}
                  <span className={item.isAI && !isActive ? "ai-text" : ""}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:fixed lg:inset-y-0 lg:flex lg:w-20 lg:flex-col", className)}>
        <div className="flex flex-col h-full border-r border-gray-800" style={{ backgroundColor: '#1f1f1f' }}>
          {/* Top Icon - Logo/AI */}
          <div className="flex items-center justify-center h-16">
            <div className="w-10 h-10 mediva-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 flex flex-col items-center py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = typeof item.icon === 'string' ? null : item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center transition-all duration-200 group relative rounded-xl",
                    isActive
                      ? "text-white"
                      : "text-white hover:text-pink-400"
                  )}
                  title={item.name}
                >
                  {item.isAI ? (
                    <span className={cn("text-xl font-bold", isActive ? "text-white ai-glow" : "ai-text")}>
                      ✦
                    </span>
                  ) : Icon ? (
                    <Icon className={cn("w-6 h-6", isActive ? "text-white ai-glow" : "")} />
                  ) : null}
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700" style={{ backgroundColor: '#1f1f1f' }}>
                    {item.name}
                    <div className="absolute top-1/2 left-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700 transform -translate-y-1/2 -translate-x-full"></div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Icons */}
          <div className="flex flex-col items-center py-4 space-y-2 border-t border-gray-800">
            {/* Settings */}
            <button
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:text-pink-400 transition-all duration-200 group relative"
              title="Settings"
            >
              <CogIcon className="w-6 h-6" />
              <div className="absolute left-full ml-3 px-3 py-2 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700" style={{ backgroundColor: '#1f1f1f' }}>
                Settings
                <div className="absolute top-1/2 left-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700 transform -translate-y-1/2 -translate-x-full"></div>
              </div>
            </button>

            {/* Help */}
            <button
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:text-pink-400 transition-all duration-200 group relative"
              title="Help"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute left-full ml-3 px-3 py-2 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700" style={{ backgroundColor: '#1f1f1f' }}>
                Help
                <div className="absolute top-1/2 left-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700 transform -translate-y-1/2 -translate-x-full"></div>
              </div>
            </button>

            {/* User Profile */}
            <button
              onClick={signOut}
              className="w-12 h-12 rounded-xl mediva-gradient flex items-center justify-center group relative"
              title={`${user.full_name} - Sign out`}
            >
              <span className="text-sm font-medium text-white">
                {user.full_name?.charAt(0) || 'U'}
              </span>
              <div className="absolute left-full ml-3 px-3 py-2 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700" style={{ backgroundColor: '#1f1f1f' }}>
                Sign out
                <div className="absolute top-1/2 left-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700 transform -translate-y-1/2 -translate-x-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-12 h-12 rounded-xl text-white border border-gray-800 flex items-center justify-center"
        style={{ backgroundColor: '#1f1f1f' }}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
    </>
  );
} 