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
  BoltIcon,
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
  appointment: 'bg-blue-100 border-blue-300 text-blue-700',
  medication: 'bg-green-100 border-green-300 text-green-700',
  assessment: 'bg-purple-100 border-purple-300 text-purple-700',
  reminder: 'bg-yellow-100 border-yellow-300 text-yellow-700',
};

const viewTypes = [
  { id: 'month', label: 'Month', icon: CalendarIcon, color: 'text-purple-500' },
  { id: 'week', label: 'Week', icon: ClockIcon, color: 'text-blue-500' },
  { id: 'day', label: 'Day', icon: DocumentTextIcon, color: 'text-green-500' },
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
      <div className="card-white p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center py-3 text-sm font-semibold text-gray-600 mono-text">
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
                    ? 'border-pink-300 bg-pink-50' 
                    : isSelectedDate
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isTodayDate ? 'text-pink-600' : isSelectedDate ? 'text-blue-600' : 'text-gray-700'
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
                    <div className="text-xs text-gray-500 mono-text">
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
      <div className="card-white p-6">
        <div className="grid grid-cols-8 gap-2">
          {/* Time column */}
          <div className="space-y-12">
            <div className="h-12"></div>
            {hours.map(hour => (
              <div key={hour} className="h-12 text-xs text-gray-500 mono-text">
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
                  isTodayDate ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'text-gray-600'
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
        <div className="lg:col-span-2 card-white p-6">
          <h3 className="heading-small text-gray-900 mb-6">
            {formatDate(selectedDate)}
          </h3>
          
          <div className="space-y-2">
            {hours.map(hour => {
              const hourEvents = dayEvents.filter(event => 
                parseInt(event.time.split(':')[0]) === hour
              );
              
              return (
                <div key={hour} className="flex items-start space-x-4 min-h-[48px]">
                  <div className="w-16 text-sm text-gray-500 mono-text mt-2">
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
        <div className="card-white p-6">
          <h3 className="heading-small text-gray-900 mb-6">Today's Medications</h3>
          
          <div className="space-y-4">
            {medicationSchedule.map(med => (
              <div key={med.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{med.name}</h4>
                  <span className="text-sm text-gray-600 mono-text">{med.dosage}</span>
                </div>
                
                <div className="space-y-2">
                  {med.times.map((time, index) => (
                    <div key={time} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 mono-text">{time}</span>
                      <button
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          med.taken[index]
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-400 hover:border-green-400'
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
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-light min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="heading-large text-gray-900 mb-2">Calendar</h1>
          <p className="body-large text-gray-600">Manage appointments, medications, and health activities</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
            Ask AI
          </Link>
          <Link href="/patient/appointments/book" className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Enhanced Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-slide-up">
        {/* Enhanced View Type Selector with Colored Icons */}
        <div className="flex items-center space-x-2">
          {viewTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setViewType(type.id)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewType === type.id
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <type.icon className={`w-4 h-4 ${viewType === type.id ? 'text-white' : type.color}`} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Enhanced Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (viewType === 'month') navigateMonth('prev');
              else if (viewType === 'week') navigateWeek('prev');
              else navigateDay('prev');
            }}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-all duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h2 className="heading-small text-gray-900 min-w-[200px] text-center">
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
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-all duration-200"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Today Button */}
        <button
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            setSelectedDate(today);
          }}
          className="btn-secondary px-4 py-3"
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

      {/* Enhanced Event Legend */}
      <div className="card-white p-6 animate-slide-up">
        <h3 className="heading-small text-gray-900 mb-4 flex items-center">
          <EyeIcon className="w-5 h-5 mr-2 text-gray-500" />
          Event Types
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Appointments</span>
          </div>
          <div className="flex items-center space-x-2">
            <CubeIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">Medications</span>
          </div>
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-700">Assessments</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Reminders</span>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions with Colored Icons */}
      <div className="card-white p-6 animate-slide-up">
        <h3 className="heading-small text-gray-900 mb-4 flex items-center">
          <BoltIcon className="w-5 h-5 mr-2 text-purple-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/appointments/book" className="card-white-interactive p-4 text-center group">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Book Appointment</p>
          </Link>
          
          <Link href="/patient/medications" className="card-white-interactive p-4 text-center group">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <CubeIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Manage Medications</p>
          </Link>
          
          <Link href="/patient/assessments" className="card-white-interactive p-4 text-center group">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Take Assessment</p>
          </Link>
          
          <button className="card-white-interactive p-4 text-center group">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Log Symptoms</p>
          </button>
        </div>
      </div>
    </div>
  );
} 