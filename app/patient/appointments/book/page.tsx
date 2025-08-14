import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/router';

export default function BookAppointment() {
  const router = useRouter();
  const [providerId, setProviderId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('appointments').insert([
      {
        patient_id: 'your-patient-id',  // Replace with actual patient ID
        provider_id: providerId,
        date: date,
        start_time: time,
        end_time: calculateEndTime(date, time),
        reason: reason,
        notes: notes,
        type: 'in_person',  // Or allow user to select
        status: 'scheduled'
      }
    ]);

    if (error) {
      console.error('Error booking appointment:', error);
    } else {
      console.log('Appointment booked:', data);
      router.push('/patient/appointments');
    }
  };

  const calculateEndTime = (date, startTime) => {
    const [hour, minute] = startTime.split(':');
    const end = new Date(date);
    end.setHours(parseInt(hour) + 1);  // Assuming 1-hour appointments
    end.setMinutes(parseInt(minute));
    return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 bg-surface-1 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary">Provider</label>
          <select value={providerId} onChange={(e) => setProviderId(e.target.value)} className="input">
            {/* Fetch provider list dynamically? */}
            <option value="">Select your provider</option>
            <option value="provider1">Dr. Sarah Chen</option>
            <option value="provider2">Dr. Michael Rodriguez</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary">Reason for Appointment</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary">Additional Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input"></textarea>
        </div>
        <button type="submit" className="btn-primary">Book Appointment</button>
      </form>
    </div>
  );
}
