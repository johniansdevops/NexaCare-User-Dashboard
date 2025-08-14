'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDate, formatTime } from '@/lib/utils';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AppointmentDetails {
  id: string;
  patient_id: string;
  provider_id: string;
  type: 'in_person' | 'telehealth' | 'phone';
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  notes?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  provider?: any;
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
    subscribeToUpdates();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients!patient_id (
            id,
            profiles!inner (
              full_name,
              email,
              phone,
              avatar_url
            )
          ),
          provider:providers!provider_id (
            id,
            specialty,
            consultation_fee,
            profiles!inner (
              full_name,
              email,
              phone,
              avatar_url
            )
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      setAppointment(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`appointment:${appointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `id=eq.${appointmentId}`,
        },
        (payload) => {
          setAppointment(prev => ({ ...prev, ...payload.new } as AppointmentDetails));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCancelAppointment = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    setCancelling(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;

      // Create notification for provider
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: appointment?.provider_id,
            type: 'appointment_reminder',
            title: 'Appointment Cancelled',
            message: `Your appointment on ${formatDate(appointment?.date || '')} has been cancelled by the patient.`,
            priority: 'high',
          }
        ]);

      router.push('/patient/appointments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

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

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      declined: 'bg-red-100 text-red-700',
      in_progress: 'bg-purple-100 text-purple-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-surface-1 min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-6 bg-surface-1 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading appointment</p>
          <p className="text-sm">{error || 'Appointment not found'}</p>
        </div>
        <Link href="/patient/appointments" className="btn-outline mt-4 inline-flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  const AppointmentIcon = getAppointmentIcon(appointment.type);
  const isUpcoming = new Date(appointment.date) >= new Date();
  const canCancel = isUpcoming && ['pending', 'scheduled', 'confirmed'].includes(appointment.status);

  return (
    <div className="p-6 space-y-6 bg-surface-1 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Appointment Details</h1>
          <p className="text-lg text-secondary">View and manage your appointment</p>
        </div>
        <Link href="/patient/appointments" className="btn-outline flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Status Alert */}
      {appointment.status === 'pending' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <div>
            <p className="font-semibold">Pending Confirmation</p>
            <p className="text-sm">This appointment is waiting for provider confirmation.</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Appointment Information</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-secondary">Date & Time</p>
                  <p className="font-medium">{formatDate(appointment.date)}</p>
                  <p className="text-sm">{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3">
                <AppointmentIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-secondary">Type</p>
                  <p className="font-medium capitalize">{appointment.type.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Meeting Link */}
              {appointment.type === 'telehealth' && appointment.meeting_link && (
                <div className="flex items-center gap-3">
                  <VideoCameraIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-secondary">Meeting Link</p>
                    <a
                      href={appointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Join Video Call
                    </a>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-secondary">Reason for Visit</p>
                  <p className="font-medium">{appointment.reason}</p>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="flex items-start gap-3">
                  <DocumentTextIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-secondary">Additional Notes</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {canCancel && (
              <div className="mt-6 pt-6 border-t border-subtle">
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling}
                  className="btn-outline text-red-500 border-red-300 hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Provider Info */}
        <div className="space-y-6">
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Provider Information</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {appointment.provider?.profiles?.avatar_url ? (
                  <img
                    src={appointment.provider.profiles.avatar_url}
                    alt={appointment.provider.profiles.full_name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{appointment.provider?.profiles?.full_name}</h4>
                <p className="text-sm text-secondary">{appointment.provider?.specialty}</p>
              </div>
            </div>

            <div className="space-y-3">
              {appointment.provider?.profiles?.email && (
                <div>
                  <p className="text-sm text-secondary">Email</p>
                  <p className="text-sm">{appointment.provider.profiles.email}</p>
                </div>
              )}
              
              {appointment.provider?.profiles?.phone && (
                <div>
                  <p className="text-sm text-secondary">Phone</p>
                  <p className="text-sm">{appointment.provider.profiles.phone}</p>
                </div>
              )}

              {appointment.provider?.consultation_fee && (
                <div>
                  <p className="text-sm text-secondary">Consultation Fee</p>
                  <p className="text-sm font-semibold">${appointment.provider.consultation_fee}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-2 border border-subtle rounded-xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/patient/appointments/book"
                className="btn-secondary w-full text-center"
              >
                Book Another Appointment
              </Link>
              <Link
                href="/patient/appointments"
                className="btn-outline w-full text-center"
              >
                View All Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
