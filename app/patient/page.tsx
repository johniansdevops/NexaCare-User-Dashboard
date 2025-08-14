'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HeartIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
  FireIcon,
  ShieldCheckIcon,
  BeakerIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { calculateAge, formatDateTime, getHealthScoreColor } from '@/lib/utils';

interface HealthMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  unit?: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  gradient?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'medication' | 'assessment' | 'info' | 'alert';
  urgent: boolean;
}

export default function PatientDashboard() {
  // Mock user data for demo purposes
  const user = {
    full_name: 'John Doe',
    date_of_birth: '1990-01-01'
  };

  const [healthScore, setHealthScore] = useState(85);
  const [loading, setLoading] = useState(true);

  // Enhanced health metrics with more detail
  const healthMetrics: HealthMetric[] = [
    { 
      label: 'Blood Pressure', 
      value: '120/80', 
      change: -2, 
      trend: 'down', 
      color: 'text-green-400',
      unit: 'mmHg'
    },
    { 
      label: 'Heart Rate', 
      value: '72', 
      change: 0, 
      trend: 'stable', 
      color: 'text-blue-400',
      unit: 'bpm'
    },
    { 
      label: 'Weight', 
      value: '165', 
      change: -1.5, 
      trend: 'down', 
      color: 'text-green-400',
      unit: 'lbs'
    },
    { 
      label: 'BMI', 
      value: '22.1', 
      change: -0.3, 
      trend: 'down', 
      color: 'text-green-400',
      unit: ''
    },
    { 
      label: 'Sleep Quality', 
      value: '8.2', 
      change: 1.1, 
      trend: 'up', 
      color: 'text-purple-400',
      unit: '/10'
    },
    { 
      label: 'Steps Today', 
      value: '8,450', 
      change: 12, 
      trend: 'up', 
      color: 'text-orange-400',
      unit: ''
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      provider: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      date: '2024-01-15T10:00:00Z',
      type: 'In-person',
      location: 'Medical Center - Room 302',
      avatar: '👩‍⚕️'
    },
    {
      id: '2',
      provider: 'Dr. Michael Rodriguez',
      specialty: 'General Practice',
      date: '2024-01-18T14:30:00Z',
      type: 'Telehealth',
      location: 'Video Call',
      avatar: '👨‍⚕️'
    },
    {
      id: '3',
      provider: 'Dr. Emily Park',
      specialty: 'Dermatology',
      date: '2024-01-22T09:15:00Z',
      type: 'In-person',
      location: 'Dermatology Clinic',
      avatar: '👩‍⚕️'
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'AI Health Chat',
      description: '24/7 AI health assistant',
      href: '/patient/ai-chat',
      icon: '✦',
      color: 'mediva-gradient',
      gradient: true
    },
    {
      title: 'Book Appointment',
      description: 'Schedule with provider',
      href: '/patient/appointments',
      icon: CalendarIcon,
      color: 'bg-blue-500/20 border border-blue-500/30'
    },
    {
      title: 'Health Assessment',
      description: 'Quick health check',
      href: '/patient/assessments',
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500/20 border border-green-500/30'
    },
    {
      title: 'Emergency Help',
      description: 'Urgent assistance',
      href: '/patient/emergency',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500/20 border border-red-500/30'
    },
  ];

  const medicationAdherence = {
    percentage: 94,
    missed: 2,
    total: 28,
    streak: 12,
    nextDose: '8:00 PM',
    medications: ['Lisinopril', 'Metformin', 'Vitamin D']
  };

  const aiInsights = [
    {
      id: '1',
      title: 'Excellent Blood Pressure Trend',
      message: 'Your blood pressure has improved 5% over the last month. Your consistent exercise routine is paying off! Keep maintaining 150+ minutes of moderate activity weekly.',
      time: '2 hours ago',
      type: 'positive',
      confidence: 95
    },
    {
      id: '2',
      title: 'Medication Reminder Alert',
      message: 'You have a 12-day perfect adherence streak! Your evening Lisinopril dose is due at 8:00 PM today. Setting a phone reminder might help maintain this excellent routine.',
      time: '4 hours ago',
      type: 'reminder',
      confidence: 100
    },
    {
      id: '3',
      title: 'Monthly Assessment Ready',
      message: 'Your comprehensive cardiovascular health assessment is available. Based on your recent metrics, this will likely show continued improvement. Takes about 5 minutes.',
      time: '1 day ago',
      type: 'assessment',
      confidence: 88
    },
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Cardiology Appointment Tomorrow',
      message: 'Dr. Chen appointment at 10:00 AM. Bring your blood pressure log and current medications list.',
      time: '30 minutes ago',
      type: 'appointment',
      urgent: false
    },
    {
      id: '2',
      title: 'Lab Results Available',
      message: 'Your comprehensive metabolic panel results are ready for review. All values within normal ranges.',
      time: '2 hours ago',
      type: 'info',
      urgent: true
    },
    {
      id: '3',
      title: 'Medication Refill Due',
      message: 'Lisinopril prescription expires in 5 days. Order refill now to avoid interruption.',
      time: '1 day ago',
      type: 'medication',
      urgent: false
    },
  ];

  useEffect(() => {
    // Simulate loading with realistic delay
    setTimeout(() => setLoading(false), 1200);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>! 👋
        </h1>
            <p className="text-lg text-gray-600">
              Here's your health overview for {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
        </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/patient/ai-chat" className="btn-primary">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Ask AI
            </Link>
          </div>
        </div>
        <div className="text-sm text-gray-500 font-mono">
          Patient Portal • Health Dashboard • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Health Score Card - Enhanced */}
      <div className="card-white p-8 border-2 border-pink-200 animate-slide-up" style={{background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.05))'}}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Overall Health Score</h3>
            <p className="text-gray-600">AI-generated based on your recent data and trends</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getHealthScoreColor(healthScore)} mb-2`}>
              {healthScore}
            </div>
                         <div className="flex items-center justify-end text-green-600 text-sm">
               <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              +3 this week
            </div>
          </div>
        </div>
        
        <div className="relative mb-4">
          <div className="bg-gray-200 rounded-full h-3">
          <div 
              className="h-3 rounded-full mediva-gradient transition-all duration-1000 ease-out"
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
      </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-mono">Health Score Trend</span>
          <span className="text-green-600 font-medium">Improving 📈</span>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="card-white-interactive p-6 text-center group"
          >
            {typeof action.icon === 'string' ? (
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl text-purple-500 font-bold group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
                <action.icon className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
              </div>
            )}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
            <p className="text-sm text-gray-600">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Upcoming Appointments - Enhanced */}
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <Link href="/patient/appointments" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              View all →
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{appointment.avatar}</div>
                  <div>
                      <p className="font-semibold text-gray-900">{appointment.provider}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                      {formatDateTime(appointment.date)}
                    </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.type === 'Telehealth' 
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {appointment.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Adherence - Enhanced */}
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CubeIcon className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">Medication Adherence</h3>
            </div>
            <Link href="/patient/medications" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              Manage →
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {medicationAdherence.percentage}%
              </div>
              <p className="text-sm text-gray-600">This month's adherence</p>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${medicationAdherence.percentage}%` }}
              ></div>
            </div>
            
            <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-mono">Doses taken</span>
                <span className="text-gray-900 font-medium">
                  {medicationAdherence.total - medicationAdherence.missed} of {medicationAdherence.total}
              </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-mono">Streak</span>
                <span className="text-green-500 font-medium flex items-center">
                  <FireIcon className="w-4 h-4 mr-1" />
                  {medicationAdherence.streak} days
              </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-mono">Next dose</span>
                <span className="text-blue-500 font-medium">{medicationAdherence.nextDose}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics - Enhanced */}
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <HeartIcon className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900">Health Metrics</h3>
            </div>
            <Link href="/patient/profile" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              View trends →
            </Link>
          </div>
          
          <div className="space-y-4">
            {healthMetrics.slice(0, 4).map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 text-sm font-mono">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${metric.color}`}>
                    {metric.value}
                    {metric.unit && <span className="text-xs ml-1">{metric.unit}</span>}
                  </span>
                                     {metric.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />}
                   {metric.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />}
                  {metric.trend === 'stable' && (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-3 h-0.5 bg-gray-500 rounded"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Section - Enhanced */}
      <div className="card-white p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 mediva-gradient rounded-2xl flex items-center justify-center ai-glow">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Health Insights</h3>
              <p className="text-xs text-gray-500 font-mono">Powered by advanced health analytics</p>
            </div>
          </div>
          <Link href="/patient/ai-chat" className="btn-primary">
            <BoltIcon className="w-4 h-4 mr-2" />
            Chat with AI
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  insight.type === 'positive' ? 'bg-green-400' : 
                  insight.type === 'reminder' ? 'bg-blue-400' : 
                  insight.type === 'assessment' ? 'bg-yellow-400' : 'bg-purple-400'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{insight.message}</p>
                  <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-mono">{insight.time}</p>
                    <span className="text-xs text-green-600 font-mono">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Panel - Enhanced */}
      <div className="card-white p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Recent Notifications</h3>
          </div>
          <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
            Mark all read →
          </button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-xl border-l-4 transition-colors hover:bg-gray-50 ${
              notification.urgent 
                ? 'bg-red-50 border-red-500' 
                : notification.type === 'appointment'
                ? 'bg-blue-50 border-blue-500'
                : notification.type === 'medication'
                ? 'bg-green-50 border-green-500'
                : 'bg-purple-50 border-purple-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    {notification.urgent && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">URGENT</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500 font-mono">{notification.time}</p>
                </div>
                {notification.urgent && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 ml-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 