'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  UserIcon,
  DocumentTextIcon,
  SparklesIcon,
  BoltIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime, formatTime } from '@/lib/utils';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  experience: string;
  availability: string;
  nextAvailable: string;
  consultationFee: number;
  languages: string[];
  acceptsInsurance: boolean;
}

interface Appointment {
  id: string;
  provider: {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    rating: number;
    experience: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  type: 'in_person' | 'telehealth' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  canReschedule: boolean;
  canCancel: boolean;
  urgency?: 'routine' | 'urgent' | 'emergency';
  duration: number;
}

const appointmentTypes = [
  { value: 'all', label: 'All Types', icon: '🔗' },
  { value: 'in_person', label: 'In-Person', icon: '🏥' },
  { value: 'telehealth', label: 'Telehealth', icon: '💻' },
  { value: 'phone', label: 'Phone Call', icon: '📞' },
];

const appointmentStatuses = [
  { value: 'all', label: 'All Statuses', icon: '📋' },
  { value: 'scheduled', label: 'Scheduled', icon: '⏳' },
  { value: 'confirmed', label: 'Confirmed', icon: '✅' },
  { value: 'completed', label: 'Completed', icon: '✔️' },
  { value: 'cancelled', label: 'Cancelled', icon: '❌' },
];

export default function PatientAppointments() {
  // Mock user data for demo purposes
  const user = {
    full_name: 'John Doe',
    email: 'john.doe@email.com'
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [showProviders, setShowProviders] = useState(false);

  // Enhanced mock data with more realistic details
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      provider: {
        id: 'dr1',
        name: 'Dr. Sarah Chen',
        specialty: 'Cardiology',
        avatar: '👩‍⚕️',
        rating: 4.9,
        experience: '15 years'
      },
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '10:30',
      type: 'in_person',
      status: 'confirmed',
      reason: 'Annual Cardiac Checkup & Echo Assessment',
      location: 'Mediva Medical Center - Cardiology Wing, Room 302',
      canReschedule: true,
      canCancel: true,
      urgency: 'routine',
      duration: 30,
    },
    {
      id: '2',
      provider: {
        id: 'dr2',
        name: 'Dr. Michael Rodriguez',
        specialty: 'General Practice',
        avatar: '👨‍⚕️',
        rating: 4.8,
        experience: '12 years'
      },
      date: '2024-01-18',
      startTime: '14:30',
      endTime: '15:00',
      type: 'telehealth',
      status: 'scheduled',
      reason: 'Follow-up Consultation & Lab Results Review',
      meetingLink: 'https://meet.mediva.ai/room/abc123',
      notes: 'Please have your recent blood pressure readings and current medications list ready for discussion.',
      canReschedule: true,
      canCancel: true,
      urgency: 'routine',
      duration: 30,
    },
    {
      id: '3',
      provider: {
        id: 'dr3',
        name: 'Dr. Emily Park',
        specialty: 'Dermatology',
        avatar: '👩‍⚕️',
        rating: 4.7,
        experience: '8 years'
      },
      date: '2024-01-10',
      startTime: '09:15',
      endTime: '09:45',
      type: 'in_person',
      status: 'completed',
      reason: 'Annual Skin Cancer Screening & Mole Check',
      location: 'Mediva Dermatology Clinic - Room 105',
      canReschedule: false,
      canCancel: false,
      urgency: 'routine',
      duration: 30,
    },
    {
      id: '4',
      provider: {
        id: 'dr4',
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        avatar: '👨‍⚕️',
        rating: 4.6,
        experience: '20 years'
      },
      date: '2024-01-22',
      startTime: '11:00',
      endTime: '11:30',
      type: 'phone',
      status: 'scheduled',
      reason: 'X-Ray Results Discussion & Treatment Plan',
      canReschedule: true,
      canCancel: true,
      urgency: 'urgent',
      duration: 30,
    },
    {
      id: '5',
      provider: {
        id: 'dr5',
        name: 'Dr. Lisa Thompson',
        specialty: 'Endocrinology',
        avatar: '👩‍⚕️',
        rating: 4.9,
        experience: '18 years'
      },
      date: '2024-01-25',
      startTime: '16:00',
      endTime: '17:00',
      type: 'in_person',
      status: 'scheduled',
      reason: 'Diabetes Management & Insulin Adjustment',
      location: 'Mediva Endocrine Center - Room 201',
      canReschedule: true,
      canCancel: true,
      urgency: 'routine',
      duration: 60,
    },
  ];

  // Mock providers data
  const mockProviders: Provider[] = [
    {
      id: 'dr1',
      name: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      avatar: '👩‍⚕️',
      rating: 4.9,
      experience: '15 years',
      availability: 'Mon-Fri',
      nextAvailable: 'Tomorrow, 10:00 AM',
      consultationFee: 150,
      languages: ['English', 'Mandarin'],
      acceptsInsurance: true,
    },
    {
      id: 'dr2',
      name: 'Dr. Michael Rodriguez',
      specialty: 'General Practice',
      avatar: '👨‍⚕️',
      rating: 4.8,
      experience: '12 years',
      availability: 'Mon-Sat',
      nextAvailable: 'Today, 3:30 PM',
      consultationFee: 100,
      languages: ['English', 'Spanish'],
      acceptsInsurance: true,
    },
    {
      id: 'dr3',
      name: 'Dr. Emily Park',
      specialty: 'Dermatology',
      avatar: '👩‍⚕️',
      rating: 4.7,
      experience: '8 years',
      availability: 'Tue-Fri',
      nextAvailable: 'Wednesday, 2:00 PM',
      consultationFee: 120,
      languages: ['English', 'Korean'],
      acceptsInsurance: true,
    },
    {
      id: 'dr4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      avatar: '👨‍⚕️',
      rating: 4.6,
      experience: '20 years',
      availability: 'Mon-Thu',
      nextAvailable: 'Thursday, 11:00 AM',
      consultationFee: 180,
      languages: ['English'],
      acceptsInsurance: true,
    },
    {
      id: 'dr5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Endocrinology',
      avatar: '👩‍⚕️',
      rating: 4.9,
      experience: '18 years',
      availability: 'Mon-Wed, Fri',
      nextAvailable: 'Friday, 9:00 AM',
      consultationFee: 160,
      languages: ['English', 'French'],
      acceptsInsurance: true,
    },
    {
      id: 'dr6',
      name: 'Dr. Robert Chang',
      specialty: 'Neurology',
      avatar: '👨‍⚕️',
      rating: 4.8,
      experience: '22 years',
      availability: 'Mon-Fri',
      nextAvailable: 'Monday, 1:00 PM',
      consultationFee: 200,
      languages: ['English', 'Cantonese'],
      acceptsInsurance: true,
    },
    {
      id: 'dr7',
      name: 'Dr. Maria Santos',
      specialty: 'Pediatrics',
      avatar: '👩‍⚕️',
      rating: 4.9,
      experience: '10 years',
      availability: 'Mon-Sat',
      nextAvailable: 'Today, 4:00 PM',
      consultationFee: 90,
      languages: ['English', 'Portuguese', 'Spanish'],
      acceptsInsurance: true,
    },
    {
      id: 'dr8',
      name: 'Dr. Ahmed Hassan',
      specialty: 'Psychiatry',
      avatar: '👨‍⚕️',
      rating: 4.7,
      experience: '14 years',
      availability: 'Mon-Fri',
      nextAvailable: 'Tuesday, 10:30 AM',
      consultationFee: 175,
      languages: ['English', 'Arabic'],
      acceptsInsurance: true,
    },
  ];

  useEffect(() => {
    // Simulate API call with realistic delay
    setTimeout(() => {
      setAppointments(mockAppointments);
      setProviders(mockProviders);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filter by time
    const now = new Date();
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter((apt) => new Date(apt.date) >= now);
    } else if (timeFilter === 'past') {
      filtered = filtered.filter((apt) => new Date(apt.date) < now);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, typeFilter, statusFilter, timeFilter]);

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'telehealth':
        return VideoCameraIcon;
      case 'phone':
        return PhoneIcon;
      default:
        return MapPinIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'scheduled':
        return 'text-blue-400';
      case 'completed':
        return 'text-gray-400';
      case 'cancelled':
        return 'text-red-400';
      case 'in_progress':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'badge-success',
      scheduled: 'badge-info',
      completed: 'badge-neutral',
      cancelled: 'badge-error',
      in_progress: 'badge-warning',
      no_show: 'badge-error',
    };
    return styles[status as keyof typeof styles] || 'badge-neutral';
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case 'urgent':
        return 'badge-warning';
      case 'emergency':
        return 'badge-error';
      default:
        return '';
    }
  };

  const upcomingCount = appointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  ).length;

  const completedCount = appointments.filter(apt => apt.status === 'completed').length;
  const todayCount = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status !== 'cancelled';
  }).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-lg text-gray-600">Manage your healthcare appointments and consultations</p>
          <div className="mt-2 text-sm text-gray-500 font-mono">
            Total: {appointments.length} appointments • Last updated: {new Date().toLocaleTimeString()}
          </div>
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

      {/* Toggle View Button */}
      <div className="flex justify-center animate-slide-up">
        <button
          onClick={() => setShowProviders(!showProviders)}
          className="btn-secondary px-6 py-3"
        >
          {showProviders ? (
            <>
              <CalendarIcon className="w-5 h-5 mr-2" />
              View Appointments
            </>
          ) : (
            <>
              <UserIcon className="w-5 h-5 mr-2" />
              Browse Providers
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="card-white p-6">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-gray-500">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{upcomingCount}</p>
              <p className="text-xs text-gray-500 font-mono">Next 30 days</p>
            </div>
          </div>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
              <p className="text-xs text-gray-500 font-mono">This year</p>
            </div>
          </div>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-gray-500">Today</p>
              <p className="text-3xl font-bold text-gray-900">{todayCount}</p>
              <p className="text-xs text-gray-500 font-mono">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="card-white p-6 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search appointments, doctors, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 py-3 w-full"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="input px-4 py-2 min-w-[120px]"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All Time</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input px-4 py-2 min-w-[140px]"
            >
              {appointmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input px-4 py-2 min-w-[140px]"
            >
              {appointmentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'upcoming') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Search: "{searchQuery}"</span>
            )}
            {typeFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Type: {appointmentTypes.find(t => t.value === typeFilter)?.label}</span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Status: {appointmentStatuses.find(s => s.value === statusFilter)?.label}</span>
            )}
            {timeFilter !== 'upcoming' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Time: {timeFilter}</span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setStatusFilter('all');
                setTimeFilter('upcoming');
              }}
              className="text-xs text-pink-500 hover:text-pink-600 ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Providers List or Appointments List */}
      {showProviders ? (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Healthcare Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="card-white p-6 hover:shadow-lg transition-all duration-300 group">
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{provider.avatar}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600">{provider.specialty}</p>
                    </div>
                  </div>
                </div>

                {/* Rating and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-yellow-600">{provider.rating}</span>
                    <span className="text-xs text-gray-500">({Math.floor(Math.random() * 200 + 50)} reviews)</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{provider.experience}</span>
                </div>

                {/* Provider Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Next Available:</span>
                    <span className="font-medium text-green-600">{provider.nextAvailable}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Consultation Fee:</span>
                    <span className="font-medium">${provider.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Availability:</span>
                    <span className="font-medium">{provider.availability}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insurance Badge */}
                {provider.acceptsInsurance && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Accepts Insurance
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    href={`/patient/appointments/book?provider=${provider.id}`}
                    className="btn-primary text-sm px-4 py-2 flex-1 text-center"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2 inline" />
                    Book Appointment
                  </Link>
                  <button className="btn-outline text-sm px-4 py-2">
                    <UserIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="space-y-6 animate-slide-up">
        {filteredAppointments.length === 0 ? (
          <div className="card-white p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria or filters.' : 'You don\'t have any appointments yet.'}
            </p>
            <Link href="/patient/appointments/book" className="btn-primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            const AppointmentIcon = getAppointmentIcon(appointment.type);
            const isUpcoming = new Date(appointment.date) >= new Date();
            const isToday = appointment.date === new Date().toISOString().split('T')[0];
            
            return (
              <div key={appointment.id} className="card-white p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Date & Time Section */}
                    <div className="text-center min-w-[80px]">
                      <div className={`text-3xl font-bold mb-1 ${isToday ? 'text-yellow-500' : 'text-gray-900'}`}>
                        {new Date(appointment.date).getDate()}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(appointment.date).toLocaleDateString('en', { month: 'short' })}
                      </div>
                      <div className={`text-sm font-semibold px-2 py-1 rounded-md ${
                        isToday ? 'bg-yellow-100 text-yellow-600' : 'text-blue-500'
                      }`}>
                        {formatTime(appointment.startTime)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {appointment.duration}min
                      </div>
                    </div>

                    <div className="w-px h-24 bg-gray-300"></div>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{appointment.provider.avatar}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {appointment.provider.name}
                            </h3>
                            <p className="text-sm text-gray-600">{appointment.provider.specialty}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center space-x-1">
                                <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-yellow-600 font-medium">
                                  {appointment.provider.rating}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 font-mono">
                                {appointment.provider.experience} experience
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Urgency Badges */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            appointment.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {appointment.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {appointment.urgency && appointment.urgency !== 'routine' && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {appointment.urgency.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-gray-900 font-semibold mb-3">{appointment.reason}</h4>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-2">
                          <AppointmentIcon className="w-4 h-4" />
                          <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                        </div>
                        
                        {appointment.location && (
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="truncate max-w-xs">{appointment.location}</span>
                          </div>
                        )}
                      </div>

                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <DocumentTextIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 ml-6">
                    {isUpcoming && appointment.status !== 'cancelled' && (
                      <div className="flex flex-col space-y-2">
                        {appointment.type === 'telehealth' && appointment.meetingLink && (
                          <Link
                            href={appointment.meetingLink}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            <VideoCameraIcon className="w-4 h-4 mr-2" />
                            Join Call
                          </Link>
                        )}
                        
                        {appointment.canReschedule && (
                          <button className="btn-secondary text-sm px-4 py-2">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            Reschedule
                          </button>
                        )}
                        
                        {appointment.canCancel && (
                          <button className="btn-outline text-sm px-4 py-2 text-red-500 border-red-300 hover:bg-red-50">
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {appointment.status === 'completed' && (
                      <div className="flex flex-col space-y-2">
                        <button className="btn-secondary text-sm px-4 py-2">
                          <DocumentTextIcon className="w-4 h-4 mr-2" />
                          View Summary
                        </button>
                        <button className="btn-outline text-sm px-4 py-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Book Follow-up
                        </button>
                      </div>
                    )}

                    <Link href={`/patient/appointments/${appointment.id}`} className="btn-ghost text-sm px-4 py-2">
                      <ChevronRightIcon className="w-4 h-4 mr-2" />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Quick Actions Panel */}
      <div className="card-white p-6 animate-slide-up">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/appointments/book" className="card-white-interactive p-4 text-center">
            <PlusIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Book New Appointment</p>
          </Link>
          
          <Link href="/patient/ai-chat" className="card-white-interactive p-4 text-center">
            <BoltIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Ask AI About Appointments</p>
          </Link>
          
          <Link href="/patient/appointments/history" className="card-white-interactive p-4 text-center">
            <DocumentTextIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Appointment History</p>
          </Link>
          
          <Link href="/patient/providers" className="card-white-interactive p-4 text-center">
            <UserIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Find New Providers</p>
          </Link>
        </div>
      </div>
    </div>
  );
}