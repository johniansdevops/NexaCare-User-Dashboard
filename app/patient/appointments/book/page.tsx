'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate, formatTime } from '@/lib/utils';
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

export default function BookAppointment() {
  const router = useRouter();
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

  // Fetch available slots when provider and date are selected
  useEffect(() => {
    if (selectedProvider && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedProvider, selectedDate]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          providers!inner (
            specialty,
            consultation_fee,
            years_of_experience,
            languages,
            availability
          )
        `)
        .eq('role', 'provider');

      if (error) throw error;

      const formattedProviders = data?.map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        specialty: p.providers?.specialty || p.providers?.[0]?.specialty,
        consultation_fee: p.providers?.consultation_fee || p.providers?.[0]?.consultation_fee,
        years_of_experience: p.providers?.years_of_experience || p.providers?.[0]?.years_of_experience,
        languages: p.providers?.languages || p.providers?.[0]?.languages,
        availability: p.providers?.availability || p.providers?.[0]?.availability,
      })) || [];

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers');
    }
  };

  const fetchAvailableSlots = async () => {
    // In a real implementation, this would check existing appointments
    // and provider availability to generate available time slots
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push({
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${hour.toString().padStart(2, '0')}:30`,
        available: true,
      });
      slots.push({
        start: `${hour.toString().padStart(2, '0')}:30`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: true,
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
    <div className="p-6 space-y-8 bg-surface-1 min-h-screen animate-fade-in">
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

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Provider */}
        <div className="bg-surface-2 border border-subtle rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-blue-500" />
            Select Provider
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
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {provider.avatar_url ? (
                      <img src={provider.avatar_url} alt={provider.full_name} className="w-full h-full rounded-full" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{provider.full_name}</h3>
                    <p className="text-sm text-secondary">{provider.specialty}</p>
                  </div>
                </div>
                <div className="text-sm text-secondary space-y-1">
                  <p>{provider.years_of_experience} years experience</p>
                  {provider.consultation_fee && (
                    <p className="font-semibold text-primary">${provider.consultation_fee}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Appointment Type */}
        <div className="bg-surface-2 border border-subtle rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Appointment Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'in_person', label: 'In-Person', icon: '🏥' },
              { value: 'telehealth', label: 'Telehealth', icon: '💻' },
              { value: 'phone', label: 'Phone Call', icon: '📞' },
            ].map((type) => (
              <label
                key={type.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                  appointmentType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-subtle hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="appointmentType"
                  value={type.value}
                  checked={appointmentType === type.value}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="sr-only"
                />
                <span className="text-2xl">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Select Date & Time */}
        {selectedProvider && (
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              Select Date & Time Range
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date</label>
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
                  <label className="block text-sm font-medium text-secondary mb-2">Preferred Time Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={selectedTimeRange.start}
                      onChange={(e) => setSelectedTimeRange({ ...selectedTimeRange, start: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="time"
                      value={selectedTimeRange.end}
                      onChange={(e) => setSelectedTimeRange({ ...selectedTimeRange, end: e.target.value })}
                      min={selectedTimeRange.start}
                      className="input"
                      required
                    />
                  </div>
                  <p className="text-xs text-secondary mt-1">Provider will confirm exact time</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Appointment Details */}
        {selectedProvider && selectedDate && selectedTimeRange.start && (
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              Appointment Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Reason for Visit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Annual checkup, Follow-up consultation"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or information for the provider"
                  rows={4}
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedProvider || !selectedDate || !selectedTimeRange.start || !selectedTimeRange.end || !reason || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Send Booking Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
