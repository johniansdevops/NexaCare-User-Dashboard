'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  StarIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  ChevronRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  LanguageIcon,
  SparklesIcon,
  HeartIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { sampleProviders } from '@/data/sample-data';

interface Provider {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  years_experience: number;
  location: string;
  avatar: string;
  rating: number;
  total_patients: number;
  status: 'Available' | 'Busy' | 'Offline';
}

const specialtyCategories = [
  { value: 'all', label: 'All Specialties', icon: '🏥' },
  { value: 'cardiology', label: 'Cardiology', icon: '❤️' },
  { value: 'general practice', label: 'General Practice', icon: '👨‍⚕️' },
  { value: 'dermatology', label: 'Dermatology', icon: '🧴' },
  { value: 'orthopedics', label: 'Orthopedics', icon: '🦴' },
  { value: 'endocrinology', label: 'Endocrinology', icon: '🔬' },
  { value: 'neurology', label: 'Neurology', icon: '🧠' },
  { value: 'pediatrics', label: 'Pediatrics', icon: '👶' },
  { value: 'psychiatry', label: 'Psychiatry', icon: '🧘' },
  { value: 'oncology', label: 'Oncology', icon: '🎗️' },
];

const statusFilters = [
  { value: 'all', label: 'All Providers', icon: '👥' },
  { value: 'Available', label: 'Available Now', icon: '🟢' },
  { value: 'Busy', label: 'Busy', icon: '🟡' },
  { value: 'Offline', label: 'Offline', icon: '🔴' },
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'patients', label: 'Most Patients' },
  { value: 'name', label: 'Alphabetical' },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data with additional providers for better showcase
  const enhancedProviders: Provider[] = [
    ...sampleProviders,
    {
      id: 'provider-004',
      full_name: 'Dr. James Wilson',
      email: 'james.wilson@nexacare.com',
      phone: '+1 (555) 444-5555',
      specialty: 'Orthopedics',
      license_number: 'MD456789',
      years_experience: 20,
      location: 'Orthopedic Center - Suite 401',
      avatar: '👨‍⚕️',
      rating: 4.6,
      total_patients: 95,
      status: 'Available'
    },
    {
      id: 'provider-005',
      full_name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@nexacare.com',
      phone: '+1 (555) 555-6666',
      specialty: 'Endocrinology',
      license_number: 'MD567890',
      years_experience: 18,
      location: 'Endocrine Center - Room 201',
      avatar: '👩‍⚕️',
      rating: 4.9,
      total_patients: 73,
      status: 'Available'
    },
    {
      id: 'provider-006',
      full_name: 'Dr. Robert Chang',
      email: 'robert.chang@nexacare.com',
      phone: '+1 (555) 666-7777',
      specialty: 'Neurology',
      license_number: 'MD678901',
      years_experience: 22,
      location: 'Neurology Center - Floor 4',
      avatar: '👨‍⚕️',
      rating: 4.8,
      total_patients: 88,
      status: 'Available'
    },
    {
      id: 'provider-007',
      full_name: 'Dr. Maria Santos',
      email: 'maria.santos@nexacare.com',
      phone: '+1 (555) 777-8888',
      specialty: 'Pediatrics',
      license_number: 'MD789012',
      years_experience: 10,
      location: 'Pediatric Wing - Room 150',
      avatar: '👩‍⚕️',
      rating: 4.9,
      total_patients: 142,
      status: 'Busy'
    },
    {
      id: 'provider-008',
      full_name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@nexacare.com',
      phone: '+1 (555) 888-9999',
      specialty: 'Psychiatry',
      license_number: 'MD890123',
      years_experience: 14,
      location: 'Mental Health Center - Suite 300',
      avatar: '👨‍⚕️',
      rating: 4.7,
      total_patients: 67,
      status: 'Available'
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProviders(enhancedProviders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = providers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialty
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter((provider) => 
        provider.specialty.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((provider) => provider.status === statusFilter);
    }

    // Sort providers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.years_experience - a.years_experience;
        case 'patients':
          return b.total_patients - a.total_patients;
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  }, [providers, searchQuery, specialtyFilter, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-500';
      case 'Busy':
        return 'text-yellow-500';
      case 'Offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-700';
      case 'Offline':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const availableCount = providers.filter(p => p.status === 'Available').length;
  const busyCount = providers.filter(p => p.status === 'Busy').length;
  const avgRating = providers.length > 0 ? 
    (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-surface-1 min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface-1 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Healthcare Providers</h1>
          <p className="text-lg text-secondary">Find and book appointments with qualified healthcare professionals</p>
          <div className="mt-2 text-sm text-secondary font-mono">
            {providers.length} providers available • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Ask AI
          </Link>
          <Link href="/patient/appointments" className="btn-secondary focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200">
            <CalendarIcon className="w-5 h-5 mr-2" />
            My Appointments
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-secondary">Available</p>
              <p className="text-3xl font-bold text-primary">{availableCount}</p>
              <p className="text-xs text-secondary font-mono">Ready to book</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-secondary">Busy</p>
              <p className="text-3xl font-bold text-primary">{busyCount}</p>
              <p className="text-xs text-secondary font-mono">In appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center">
            <StarIcon className="w-8 h-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase text-secondary">Avg Rating</p>
              <p className="text-3xl font-bold text-primary">{avgRating}</p>
              <p className="text-xs text-secondary font-mono">Out of 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Search providers, specialties, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 py-3 w-full focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-4 py-3 focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-subtle">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Specialty</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="input w-full focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
                >
                  {specialtyCategories.map((specialty) => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.icon} {specialty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Availability</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input w-full focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
                >
                  {statusFilters.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input w-full focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSpecialtyFilter('all');
                    setStatusFilter('all');
                    setSortBy('rating');
                  }}
                  className="btn-outline w-full px-4 py-2 focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(searchQuery || specialtyFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'rating') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">Search: "{searchQuery}"</span>
            )}
            {specialtyFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
                Specialty: {specialtyCategories.find(s => s.value === specialtyFilter)?.label}
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
                Status: {statusFilters.find(s => s.value === statusFilter)?.label}
              </span>
            )}
            {sortBy !== 'rating' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
                Sort: {sortOptions.find(s => s.value === sortBy)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-secondary animate-slide-up">
        <span>Showing {filteredProviders.length} of {providers.length} providers</span>
        <span className="font-mono">
          {filteredProviders.filter(p => p.status === 'Available').length} available for booking
        </span>
      </div>

      {/* Providers Grid */}
      <div className="animate-slide-up">
        {filteredProviders.length === 0 ? (
          <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-12 text-center">
            <UserIcon className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-primary mb-4">No providers found</h3>
            <p className="text-secondary mb-6">
              Try adjusting your search criteria or filters to find more providers.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSpecialtyFilter('all');
                setStatusFilter('all');
                setSortBy('rating');
              }}
              className="btn-primary focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6 group">
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{provider.avatar}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:text-blue-600 transition-colors duration-200">
                        {provider.full_name}
                      </h3>
                      <p className="text-sm text-secondary">{provider.specialty}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(provider.status)}`}>
                    {provider.status}
                  </span>
                </div>

                {/* Rating and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-yellow-600">{provider.rating}</span>
                    <span className="text-xs text-secondary">({Math.floor(Math.random() * 200 + 50)} reviews)</span>
                  </div>
                  <span className="text-xs text-secondary font-mono">{provider.years_experience} years</span>
                </div>

                {/* Provider Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <UserGroupIcon className="w-4 h-4 text-secondary mr-2" />
                    <span className="text-secondary">{provider.total_patients} patients</span>
                  </div>
                  
                  <div className="flex items-start text-sm">
                    <MapPinIcon className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary">{provider.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="w-4 h-4 text-secondary mr-2" />
                    <span className="text-secondary">{provider.phone}</span>
                  </div>
                </div>

                {/* License Info */}
                <div className="mb-4 p-3 bg-surface-1 rounded-lg">
                  <div className="flex items-center text-xs text-secondary">
                    <AcademicCapIcon className="w-4 h-4 mr-2" />
                    <span>License: {provider.license_number}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    href={`/patient/appointments/book?provider=${provider.id}`}
                    className={`btn-primary text-sm px-4 py-2 flex-1 text-center focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200 ${
                      provider.status !== 'Available' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2 inline" />
                    {provider.status === 'Available' ? 'Book Appointment' : 'Not Available'}
                  </Link>
                  <button className="btn-outline text-sm px-4 py-2 focus-visible:ring-2 ring-focus focus-visible:outline-none transition-colors duration-200">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-surface-2 border border-subtle rounded-xl shadow-sm hover:shadow-md transition-all p-6 animate-slide-up">
        <h3 className="text-xl font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/patient/appointments/book" className="bg-surface-1 border border-subtle rounded-lg hover:shadow-md transition-all p-4 text-center focus-visible:ring-2 ring-focus focus-visible:outline-none">
            <CalendarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">Book Appointment</p>
          </Link>
          
          <Link href="/patient/ai-chat" className="bg-surface-1 border border-subtle rounded-lg hover:shadow-md transition-all p-4 text-center focus-visible:ring-2 ring-focus focus-visible:outline-none">
            <SparklesIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">Ask AI About Providers</p>
          </Link>
          
          <Link href="/patient/appointments" className="bg-surface-1 border border-subtle rounded-lg hover:shadow-md transition-all p-4 text-center focus-visible:ring-2 ring-focus focus-visible:outline-none">
            <ClockIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">My Appointments</p>
          </Link>
          
          <div className="bg-surface-1 border border-subtle rounded-lg hover:shadow-md transition-all p-4 text-center opacity-50">
            <HeartIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">Emergency Care</p>
            <p className="text-xs text-secondary mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
} 