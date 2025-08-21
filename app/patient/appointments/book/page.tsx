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
  VideoCameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  rating?: number;
  location?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
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
        setCurrentStep(2);
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
      const formattedProviders = sampleProviders.map((provider) => ({
        id: provider.id,
        full_name: provider.full_name,
        specialty: provider.specialty,
        avatar_url: provider.avatar,
        consultation_fee: Math.floor(Math.random() * 100) + 75,
        years_of_experience: provider.years_experience,
        languages: ['English'],
        availability: provider.status === 'Available',
        rating: provider.rating,
        location: provider.location,
      }));

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders([]);
    }
  };

  const fetchAvailableSlots = async () => {
    const slots: TimeSlot[] = [];
    const currentDate = new Date(selectedDate);
    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    for (let hour = 9; hour < 17; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${hour.toString().padStart(2, '0')}:30`;
      const startTime30 = `${hour.toString().padStart(2, '0')}:30`;
      const endTime30 = `${(hour + 1).toString().padStart(2, '0')}:00`;

      // Skip past time slots if it's today
      const isSlot1Available = !isToday || hour > currentHour;
      const isSlot2Available = !isToday || hour > currentHour;

      if (isSlot1Available) {
        slots.push({
          start: startTime,
          end: endTime,
          available: Math.random() > 0.3,
        });
      }

      if (isSlot2Available) {
        slots.push({
          start: startTime30,
          end: endTime30,
          available: Math.random() > 0.3,
        });
      }
    }
    setAvailableSlots(slots);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: user.id,
            provider_id: selectedProvider?.id,
            type: 'telehealth', // Always telehealth/video call
            status: 'pending',
            date: selectedDate,
            start_time: selectedTimeSlot?.start,
            end_time: selectedTimeSlot?.end,
            reason: reason,
            notes: notes,
          }
        ])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedProvider?.id,
            type: 'appointment_reminder',
            title: 'New Video Consultation Request',
            message: `${user.email} has requested a video consultation on ${formatDate(selectedDate)} from ${formatTime(selectedTimeSlot?.start || '')} to ${formatTime(selectedTimeSlot?.end || '')}`,
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
      }, 3000);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1: return selectedProvider !== null;
      case 2: return selectedDate !== '' && selectedTimeSlot !== null;
      case 3: return reason !== '';
      default: return false;
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Providers
          </button>
          <div className="flex items-center mb-2">
            <VideoCameraIcon className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Book Video Consultation
            </h1>
          </div>
          <p className="text-gray-600">Schedule a secure video call with your healthcare provider via Google Meet</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Video Consultation Request Sent!</h3>
                <p className="text-green-700 text-sm">You'll receive a Google Meet link once the provider confirms your appointment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => {
              const status = getStepStatus(step);
              const stepTitles = ['Select Provider', 'Date & Time', 'Details'];
              
              return (
                <div key={step} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      status === 'completed' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                        : status === 'current'
                        ? 'bg-white border-2 border-purple-500 text-purple-600'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
                    }`}>
                      {status === 'completed' ? '✓' : step}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${
                        status === 'current' ? 'text-purple-600' : status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {stepTitles[step - 1]}
                      </p>
                    </div>
                  </div>
                  {step < 3 && (
                    <div className={`hidden sm:block w-16 h-1 mx-4 rounded ${
                      status === 'completed' ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Step 1: Select Provider */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Provider</h2>
              {selectedProvider ? (
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                        {selectedProvider.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedProvider.full_name}</h3>
                        <p className="text-purple-600">{selectedProvider.specialty}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="mr-4">{selectedProvider.years_of_experience} years experience</span>
                          <span>${selectedProvider.consultation_fee} consultation</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProvider(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Change provider</span>
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider)}
                      className="text-left border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                          {provider.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{provider.full_name}</h3>
                          <p className="text-purple-600 text-sm">{provider.specialty}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="mr-3">{provider.years_of_experience} years</span>
                            <span>${provider.consultation_fee}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Date & Time</h2>
              
              {/* Video Call Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <VideoCameraIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Video Consultation via Google Meet</h3>
                    <p className="text-blue-700 text-sm">You'll receive a secure Google Meet link once your appointment is confirmed</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Times
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {availableSlots.filter(slot => slot.available).map((slot) => (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 text-sm border rounded-lg transition-all duration-200 ${
                            selectedTimeSlot?.start === slot.start
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h2>
              
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Video Consultation Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedProvider?.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium flex items-center">
                      <VideoCameraIcon className="w-4 h-4 mr-1" />
                      Video Call via Google Meet
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {selectedTimeSlot && `${formatTime(selectedTimeSlot.start)} - ${formatTime(selectedTimeSlot.end)}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-semibold">${selectedProvider?.consultation_fee}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Consultation *
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Follow-up consultation, health concern discussion..."
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information you'd like to share before the video call..."
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceedFromStep(currentStep)}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    canProceedFromStep(currentStep)
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canProceedFromStep(currentStep)}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    canProceedFromStep(currentStep) && !loading
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Booking...' : 'Book Video Consultation'}
                  {!loading && <VideoCameraIcon className="w-4 h-4 ml-2" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookAppointmentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointment() {
  return (
    <Suspense fallback={<BookAppointmentLoading />}>
      <BookAppointmentContent />
    </Suspense>
  );
}
