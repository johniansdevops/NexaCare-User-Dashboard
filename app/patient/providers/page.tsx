'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  VideoCameraIcon,
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
  consultation_fee?: number;
  next_available?: string;
}

const specialtyCategories = [
  { value: 'all', label: 'All Specialties' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'general practice', label: 'General Practice' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'oncology', label: 'Oncology' },
];

const statusFilters = [
  { value: 'all', label: 'All Providers' },
  { value: 'Available', label: 'Available Now' },
  { value: 'Busy', label: 'Busy' },
];

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee', label: 'Lowest Fee' },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data with consultation fees and next available times
  const enhancedProviders: Provider[] = [
    ...sampleProviders.map(provider => ({
      ...provider,
      consultation_fee: Math.floor(Math.random() * 150) + 75, // $75-$225
      next_available: provider.status === 'Available' ? 'Today' : 'Tomorrow'
    })),
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
      status: 'Available',
      consultation_fee: 180,
      next_available: 'Today'
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
      avatar: '��‍⚕️',
      rating: 4.9,
      total_patients: 73,
      status: 'Available',
      consultation_fee: 165,
      next_available: 'Today'
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
      status: 'Available',
      consultation_fee: 195,
      next_available: 'Today'
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
      status: 'Busy',
      consultation_fee: 135,
      next_available: 'Tomorrow'
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
      status: 'Available',
      consultation_fee: 160,
      next_available: 'Today'
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
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.years_experience - a.years_experience;
        case 'fee':
          return (a.consultation_fee || 0) - (b.consultation_fee || 0);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  }, [providers, searchQuery, specialtyFilter, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center mb-2">
          <VideoCameraIcon className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Telehealth Providers
          </h1>
        </div>
        <p className="text-gray-600">Book secure video consultations with qualified healthcare professionals</p>
        <div className="mt-2 text-sm text-gray-500">
          {providers.length} providers available for video consultations • {providers.filter(p => p.status === 'Available').length} available now
        </div>
      </div>

      {/* Telehealth Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <VideoCameraIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">Video Consultations via Google Meet</h3>
            <p className="text-blue-700 text-sm">All appointments are conducted through secure Google Meet video calls. You'll receive your meeting link after booking confirmation.</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            Filters
            {(specialtyFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'name') && (
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {specialtyCategories.map((specialty) => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {statusFilters.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(searchQuery || specialtyFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'name') && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSpecialtyFilter('all');
                    setStatusFilter('all');
                    setSortBy('name');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredProviders.length} of {providers.length} providers available for video consultations
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No providers found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSpecialtyFilter('all');
                setStatusFilter('all');
                setSortBy('name');
              }}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                {/* Provider Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {provider.full_name}
                      </h3>
                      <p className="text-purple-600 font-medium">{provider.specialty}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="font-medium text-yellow-600">{provider.rating}</span>
                      <span className="ml-1">({Math.floor(Math.random() * 200 + 50)} reviews)</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>{provider.years_experience} years experience</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                      <span>${provider.consultation_fee} video consultation</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <VideoCameraIcon className="w-4 h-4 mr-2" />
                      <span>Next: {provider.next_available}</span>
                    </div>
                  </div>

                  <div className="flex items-start text-sm text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{provider.location} • Video consultations available</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-6 flex-shrink-0">
                  <Link
                    href={`/patient/appointments/book?provider=${provider.id}`}
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      provider.status === 'Available'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <VideoCameraIcon className="w-4 h-4 mr-2" />
                    {provider.status === 'Available' ? 'Book Video Call' : 'Not Available'}
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 