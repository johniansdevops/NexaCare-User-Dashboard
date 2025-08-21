'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate, formatTime } from '@/lib/utils';
import { sampleProviders } from '@/data/sample-data';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Provider {
  id: string;
  full_name: string;
  specialty: string;
  avatar_url?: string;
  consultation_fee?: number;
  years_of_experience?: number;
  languages?: string[];
  availability?: any;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in_person' | 'telehealth' | 'phone'>('in_person');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: '', end: '' });
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Handle pre-selected provider from URL params
  useEffect(() => {
    const providerId = searchParams.get('provider');
    if (providerId && providers.length > 0) {
      const provider = providers.find(p => p.id === providerId);
      if (provider) {
        setSelectedProvider(provider);
      }
    }
  }, [searchParams, providers]);

  // Fetch available slots when provider and date are selected
  useEffect(() => {
    if (selectedProvider && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedProvider, selectedDate]);

  const fetchProviders = async () => {
    try {
      // Use sample data for now - in production this would be a real API call
      const formattedProviders = sampleProviders.map((provider) => ({
        id: provider.id,
        full_name: provider.full_name,
        specialty: provider.specialty,
        avatar_url: provider.avatar, // Using emoji avatar from sample data
        consultation_fee: Math.floor(Math.random() * 100) + 50, // Mock fee
        years_of_experience: provider.years_experience,
        languages: ['English'], // Mock languages
        availability: provider.status === 'Available',
      }));

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders([]);
    }
  };

  const fetchAvailableSlots = async () => {
    // Mock available slots - in real app, this would check actual availability
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push({
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${hour.toString().padStart(2, '0')}:30`,
        available: Math.random() > 0.3, // 70% chance slot is available
      });
      slots.push({
        start: `${hour.toString().padStart(2, '0')}:30`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3,
      });
    }
    setAvailableSlots(slots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Create appointment with pending status
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: user.id,
            provider_id: selectedProvider?.id,
            type: appointmentType,
            status: 'pending', // Provider needs to accept
            date: selectedDate,
            start_time: selectedTimeRange.start,
            end_time: selectedTimeRange.end,
            reason: reason,
            notes: notes,
          }
        ])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create notification for provider
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedProvider?.id,
            type: 'appointment_reminder',
            title: 'New Appointment Request',
            message: `${user.email} has requested an appointment on ${formatDate(selectedDate)} from ${formatTime(selectedTimeRange.start)} to ${formatTime(selectedTimeRange.end)}`,
            priority: 'high',
            action_url: `/provider/appointments/${appointment.id}`,
          }
        ]);

      if (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/patient/appointments');
      }, 2000);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface-1 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Book Appointment</h1>
          <p className="text-lg text-secondary">Schedule a consultation with your healthcare provider</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn-outline flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircleIcon className="w-6 h-6" />
          <div>
            <p className="font-semibold">Appointment request sent!</p>
            <p className="text-sm">You'll be notified once the provider confirms your appointment.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <p>{error}</p>
        </div>
      )}

      {/* Workflow Steps Indicator */}
      <div className="bg-surface-2 border border-subtle rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Booking Steps</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${!selectedProvider ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            <span className="font-medium">1</span>
            <span>Select Provider</span>
            {selectedProvider && <span>✓</span>}
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${selectedProvider && !selectedDate ? 'bg-blue-100 text-blue-700' : selectedProvider && selectedDate && !selectedTimeRange.start ? 'bg-blue-100 text-blue-700' : selectedProvider && selectedDate && selectedTimeRange.start ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="font-medium">2</span>
            <span>Pick Date & Time</span>
            {selectedProvider && selectedDate && selectedTimeRange.start && <span>✓</span>}
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${selectedProvider && selectedDate && selectedTimeRange.start && !reason ? 'bg-blue-100 text-blue-700' : selectedProvider && selectedDate && selectedTimeRange.start && reason ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="font-medium">3</span>
            <span>Add Details</span>
            {selectedProvider && selectedDate && selectedTimeRange.start && reason && <span>✓</span>}
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-500`}>
            <span className="font-medium">4</span>
            <span>Book (Pending)</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Provider */}
        <div className={`bg-surface-2 border rounded-xl p-6 ${!selectedProvider ? 'border-blue-500 shadow-lg' : 'border-subtle'}`}>
          <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-blue-500" />
            Step 1: Select Provider
            {selectedProvider && <span className="text-green-500">✓</span>}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(provider)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProvider?.id === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-subtle hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {provider.avatar_url || '👨‍⚕️'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{provider.full_name}</h3>
                    <p className="text-sm text-secondary">{provider.specialty}</p>
                  </div>
                </div>
                <div className="text-sm text-secondary space-y-1">
                  {provider.years_of_experience && (
                    <p>{provider.years_of_experience} years experience</p>
                  )}
                  {provider.consultation_fee && (
                    <p>Fee: ${provider.consultation_fee}</p>
                  )}
                  {provider.languages && provider.languages.length > 0 && (
                    <p>Languages: {provider.languages.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rest of the form - only show if provider is selected */}
        {selectedProvider && (
          <>
            {/* Step 2: Select Appointment Type */}
            <div className={`bg-surface-2 border rounded-xl p-6 ${selectedProvider && !selectedDate ? 'border-blue-500 shadow-lg' : 'border-subtle'}`}>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-green-500" />
                Step 2: Appointment Type
                {appointmentType && <span className="text-green-500">✓</span>}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['in_person', 'telehealth', 'phone'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="appointmentType"
                      value={type}
                      checked={appointmentType === type}
                      onChange={(e) => setAppointmentType(e.target.value as any)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="capitalize text-primary">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Select Date and Time */}
            <div className={`bg-surface-2 border rounded-xl p-6 ${selectedProvider && (!selectedDate || !selectedTimeRange.start) ? 'border-blue-500 shadow-lg' : 'border-subtle'}`}>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-green-500" />
                Step 3: Pick Date & Time
                {selectedDate && selectedTimeRange.start && <span className="text-green-500">✓</span>}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="input w-full"
                    required
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.filter(slot => slot.available).map((slot) => (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          onClick={() => setSelectedTimeRange({ start: slot.start, end: slot.end })}
                          className={`p-2 text-sm border rounded transition-all ${
                            selectedTimeRange.start === slot.start
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Reason and Notes */}
            <div className={`bg-surface-2 border rounded-xl p-6 ${selectedProvider && selectedDate && selectedTimeRange.start && !reason ? 'border-blue-500 shadow-lg' : 'border-subtle'}`}>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-purple-500" />
                Step 4: Add Details & Questions
                {reason && <span className="text-green-500">✓</span>}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Reason for Appointment *
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Annual checkup, follow-up consultation..."
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={3}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-surface-2 border border-subtle rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-orange-500" />
                Step 5: Confirm & Book (Pending)
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Booking Summary:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  {selectedProvider && <p><strong>Provider:</strong> {selectedProvider.full_name} ({selectedProvider.specialty})</p>}
                  {selectedDate && <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>}
                  {selectedTimeRange.start && <p><strong>Time:</strong> {formatTime(selectedTimeRange.start)} - {formatTime(selectedTimeRange.end)}</p>}
                  {appointmentType && <p><strong>Type:</strong> {appointmentType.replace('_', ' ')}</p>}
                  {reason && <p><strong>Reason:</strong> {reason}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !selectedProvider || !selectedDate || !selectedTimeRange.start || !reason}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Request...' : 'Book Appointment (Pending Approval)'}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

// Loading fallback component
function BookAppointmentLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface-1 min-h-screen animate-fade-in">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function BookAppointment() {
  return (
    <Suspense fallback={<BookAppointmentLoading />}>
      <BookAppointmentContent />
    </Suspense>
  );
}
