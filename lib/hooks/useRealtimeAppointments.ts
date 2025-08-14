import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  type: 'in_person' | 'telehealth' | 'phone';
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'declined' | 'no_show';
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  notes?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export function useRealtimeAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchAppointments() {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .or(`patient_id.eq.${userId},provider_id.eq.${userId}`)
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    function subscribeToChanges() {
      channel = supabase
        .channel(`appointments:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `patient_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAppointments(prev => [...prev, payload.new as Appointment]);
            } else if (payload.eventType === 'UPDATE') {
              setAppointments(prev =>
                prev.map(apt => apt.id === payload.new.id ? payload.new as Appointment : apt)
              );
            } else if (payload.eventType === 'DELETE') {
              setAppointments(prev => prev.filter(apt => apt.id !== payload.old.id));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `provider_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAppointments(prev => [...prev, payload.new as Appointment]);
            } else if (payload.eventType === 'UPDATE') {
              setAppointments(prev =>
                prev.map(apt => apt.id === payload.new.id ? payload.new as Appointment : apt)
              );
            } else if (payload.eventType === 'DELETE') {
              setAppointments(prev => prev.filter(apt => apt.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    fetchAppointments();
    subscribeToChanges();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return { appointments, loading, error };
}

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.is_read).length || 0);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }

    function subscribeToNotifications() {
      channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(payload.new.title, {
                body: payload.new.message,
                icon: '/icon-192x192.png',
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
            if (payload.old.is_read === false && payload.new.is_read === true) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe();
    }

    fetchNotifications();
    subscribeToNotifications();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return { notifications, unreadCount, markAsRead };
}
