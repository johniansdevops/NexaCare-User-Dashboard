'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SparklesIcon,
  CubeIcon,
  HeartIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'appointment' | 'medication' | 'assessment' | 'reminder';
  date: string;
  time: string;
  duration?: number;
  provider?: string;
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  color: string;
  urgency?: 'routine' | 'urgent' | 'emergency';
}

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  taken: boolean[];
  color: string;
}

const eventColors = {
  appointment: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  medication: 'bg-green-500/20 border-green-500/50 text-green-300',
  assessment: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  reminder: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
};

const viewTypes = [
  { id: 'month', label: 'Month', icon: '📅' },
  { id: 'week', label: 'Week', icon: '📊' },
  { id: 'day', label: 'Day', icon: '🗓️' },
];

export default function PatientCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [medicationSchedule, setMedicationSchedule] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Dr. Sarah Chen - Cardiology',
      type: 'appointment',
      date: '2024-01-15',
      time: '10:00',
      duration: 30,
      provider: 'Dr. Sarah Chen',
      location: 'Medical Center - Room 302',
      status: 'scheduled',
      color: eventColors.appointment,
      urgency: 'routine'
    },
    {
      id: '2',
      title: 'Dr. Rodriguez - Telehealth',
      type: 'appointment',
      date: '2024-01-18',
      time: '14:30',
      duration: 30,
      provider: 'Dr. Michael Rodriguez',
      meetingLink: 'https://meet.mediva.ai/room/abc123',
      status: 'scheduled',
      color: eventColors.appointment,
      urgency: 'routine'
    },
    {
      id: '3',
      title: 'Cardiovascular Assessment',
      type: 'assessment',
      date: '2024-01-20',
      time: '09:00',
      duration: 45,
      status: 'scheduled',
      color: eventColors.assessment,
      urgency: 'routine'
    },
    {
      id: '4',
      title: 'Monthly Health Check-in',
      type: 'reminder',
      date: '2024-01-25',
      time: '16:00',
      status: 'scheduled',
      color: eventColors.reminder,
      urgency: 'routine'
    },
  ];

  const mockMedicationSchedule: MedicationSchedule[] = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      times: ['08:00', '20:00'],
      taken: [true, false],
      color: 'bg-green-500'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      times: ['08:00', '13:00', '18:00'],
      taken: [true, true, false],
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: 'Vitamin D',
      dosage: '1000 IU',
      times: ['08:00'],
      taken: [true],
      color: 'bg-yellow-500'
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setMedicationSchedule(mockMedicationSchedule);
      setLoading(false);
    }, 1000);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="card p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center py-3 text-sm font-semibold text-gray-400 mono-text">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24"></div>;
            }
            
            const dayEvents = getEventsForDate(day);
            const isTodayDate = isToday(day);
            const isSelectedDate = isSelected(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`h-24 p-2 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  isTodayDate 
                    ? 'border-pink-500/50 bg-pink-500/10' 
                    : isSelectedDate
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-gray-700/30 hover:border-gray-600/50'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isTodayDate ? 'text-pink-400' : isSelectedDate ? 'text-blue-400' : 'text-white'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border truncate ${event.color}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-400 mono-text">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="card p-6">
        <div className="grid grid-cols-8 gap-2">
          {/* Time column */}
          <div className="space-y-12">
            <div className="h-12"></div>
            {hours.map(hour => (
              <div key={hour} className="h-12 text-xs text-gray-400 mono-text">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {weekDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isTodayDate = isToday(day);
            
            return (
              <div key={day.toISOString()} className="space-y-1">
                <div className={`text-center p-3 rounded-xl ${
                  isTodayDate ? 'bg-pink-500/20 text-pink-400' : 'text-gray-300'
                }`}>
                  <div className="text-xs mono-text">
                    {day.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2 min-h-[600px]">
                  {dayEvents.map(event => {
                    const timeSlot = parseInt(event.time.split(':')[0]);
                    return (
                      <div
                        key={event.id}
                        className={`p-2 rounded-lg border text-xs ${event.color}`}
                        style={{ marginTop: `${timeSlot * 48 + 48}px` }}
                      >
                        <div className="font-semibold">{event.time}</div>
                        <div className="truncate">{event.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Schedule */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="heading-small text-white mb-6">
            {formatDate(selectedDate)}
          </h3>
          
          <div className="space-y-2">
            {hours.map(hour => {
              const hourEvents = dayEvents.filter(event => 
                parseInt(event.time.split(':')[0]) === hour
              );
              
              return (
                <div key={hour} className="flex items-start space-x-4 min-h-[48px]">
                  <div className="w-16 text-sm text-gray-400 mono-text mt-2">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 space-y-2">
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-xl border ${event.color} hover:shadow-lg transition-shadow cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{event.title}</h4>
                          <span className="text-xs mono-text">{event.time}</span>
                        </div>
                        {event.provider && (
                          <p className="text-sm opacity-80">{event.provider}</p>
                        )}
                        {event.location && (
                          <p className="text-xs opacity-60 mt-1">{event.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="card p-6">
          <h3 className="heading-small text-white mb-6">Today's Medications</h3>
          
          <div className="space-y-4">
            {medicationSchedule.map(med => (
              <div key={med.id} className="p-4 glass rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{med.name}</h4>
                  <span className="text-sm text-gray-400 mono-text">{med.dosage}</span>
                </div>
                
                <div className="space-y-2">
                  {med.times.map((time, index) => (
                    <div key={time} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 mono-text">{time}</span>
                      <button
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          med.taken[index]
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-500 hover:border-green-400'
                        }`}
                      >
                        {med.taken[index] && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-mesh min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 dark-elevated rounded w-1/3 mb-6"></div>
          <div className="h-96 dark-elevated rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-mesh min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="heading-large text-white mb-2">Calendar</h1>
          <p className="body-large">Manage appointments, medications, and health activities</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Ask AI
          </Link>
          <Link href="/patient/appointments/book" className="btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-slide-up">
        {/* View Type Selector */}
        <div className="flex items-center space-x-2">
          {viewTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setViewType(type.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewType === type.id
                  ? 'mediva-gradient text-white'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (viewType === 'month') navigateMonth('prev');
              else if (viewType === 'week') navigateWeek('prev');
              else navigateDay('prev');
            }}
            className="btn-ghost p-2"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h2 className="heading-small text-white min-w-[200px] text-center">
            {viewType === 'month' && formatMonthYear(currentDate)}
            {viewType === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewType === 'day' && formatDate(selectedDate)}
          </h2>
          
          <button
            onClick={() => {
              if (viewType === 'month') navigateMonth('next');
              else if (viewType === 'week') navigateWeek('next');
              else navigateDay('next');
            }}
            className="btn-ghost p-2"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            setSelectedDate(today);
          }}
          className="btn-secondary px-4 py-2"
        >
          Today
        </button>
      </div>

      {/* Calendar View */}
      <div className="animate-slide-up">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>

      {/* Event Legend */}
      <div className="card p-6 animate-slide-up">
        <h3 className="heading-small text-white mb-4">Event Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/50 rounded"></div>
            <span className="text-sm text-gray-300">Appointments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded"></div>
            <span className="text-sm text-gray-300">Medications</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500/20 border border-purple-500/50 rounded"></div>
            <span className="text-sm text-gray-300">Assessments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500/50 rounded"></div>
            <span className="text-sm text-gray-300">Reminders</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6 animate-slide-up">
        <h3 className="heading-small text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/appointments/book" className="card-interactive p-4 text-center">
            <CalendarIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Book Appointment</p>
          </Link>
          
          <Link href="/patient/medications" className="card-interactive p-4 text-center">
            <CubeIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Manage Medications</p>
          </Link>
          
          <Link href="/patient/assessments" className="card-interactive p-4 text-center">
            <DocumentTextIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Take Assessment</p>
          </Link>
          
          <button className="card-interactive p-4 text-center">
            <HeartIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Log Symptoms</p>
          </button>
        </div>
      </div>
    </div>
  );
} 