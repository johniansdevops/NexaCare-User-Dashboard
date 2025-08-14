'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  SparklesIcon,
  BellIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  CalendarIcon,
  FireIcon,
  ChartBarIcon,
  InformationCircleIcon,
  BeakerIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  times: string[];
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  refillsRemaining: number;
  pillsRemaining: number;
  totalPills: number;
  instructions: string;
  sideEffects?: string[];
  foodRestrictions?: string;
  color: string;
  shape: string;
  category: 'prescription' | 'otc' | 'supplement';
  priority: 'high' | 'medium' | 'low';
}

interface DoseSchedule {
  medicationId: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  skipped: boolean;
  skipReason?: string;
}

interface MedicationAlert {
  id: string;
  type: 'interaction' | 'side_effect' | 'refill' | 'adherence' | 'timing';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  medications: string[];
  action?: string;
  timestamp: string;
}

export default function PatientMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<DoseSchedule[]>([]);
  const [alerts, setAlerts] = useState<MedicationAlert[]>([]);
  const [adherenceStats, setAdherenceStats] = useState({
    thisWeek: 94,
    thisMonth: 91,
    streak: 12,
    totalDoses: 168,
    takenDoses: 158,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);

  // Mock data
  const mockMedications: Medication[] = [
    {
      id: '1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      prescribedBy: 'Dr. Sarah Chen',
      startDate: '2024-01-01',
      refillsRemaining: 3,
      pillsRemaining: 45,
      totalPills: 60,
      instructions: 'Take with or without food. Avoid potassium supplements.',
      sideEffects: ['Dry cough', 'Dizziness', 'Fatigue'],
      foodRestrictions: 'Avoid high potassium foods',
      color: 'Pink',
      shape: 'Round',
      category: 'prescription',
      priority: 'high',
    },
    {
      id: '2',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '500mg',
      frequency: 'Three times daily',
      times: ['08:00', '13:00', '18:00'],
      prescribedBy: 'Dr. Emily Park',
      startDate: '2023-12-15',
      refillsRemaining: 2,
      pillsRemaining: 78,
      totalPills: 90,
      instructions: 'Take with meals to reduce stomach upset.',
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      foodRestrictions: 'Take with meals',
      color: 'White',
      shape: 'Oval',
      category: 'prescription',
      priority: 'high',
    },
    {
      id: '3',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      dosage: '1000 IU',
      frequency: 'Once daily',
      times: ['08:00'],
      prescribedBy: 'Dr. Michael Rodriguez',
      startDate: '2024-01-01',
      refillsRemaining: 0,
      pillsRemaining: 28,
      totalPills: 30,
      instructions: 'Take with food for better absorption.',
      color: 'Yellow',
      shape: 'Capsule',
      category: 'supplement',
      priority: 'medium',
    },
    {
      id: '4',
      name: 'Omega-3',
      genericName: 'Fish Oil',
      dosage: '1000mg',
      frequency: 'Twice daily',
      times: ['08:00', '18:00'],
      prescribedBy: 'Self-administered',
      startDate: '2024-01-05',
      refillsRemaining: 0,
      pillsRemaining: 52,
      totalPills: 60,
      instructions: 'Take with meals. Store in refrigerator.',
      color: 'Clear',
      shape: 'Soft gel',
      category: 'supplement',
      priority: 'low',
    },
  ];

  const mockAlerts: MedicationAlert[] = [
    {
      id: '1',
      type: 'refill',
      severity: 'warning',
      title: 'Refill Due Soon',
      message: 'Vitamin D3 prescription expires in 5 days. Only 28 pills remaining.',
      medications: ['Vitamin D3'],
      action: 'Order Refill',
      timestamp: '2024-01-15T09:00:00Z',
    },
    {
      id: '2',
      type: 'interaction',
      severity: 'info',
      title: 'Food Interaction',
      message: 'Metformin should be taken with meals to reduce stomach upset.',
      medications: ['Metformin'],
      timestamp: '2024-01-15T13:00:00Z',
    },
    {
      id: '3',
      type: 'adherence',
      severity: 'critical',
      title: 'Missed Dose Alert',
      message: 'You missed your evening Lisinopril dose yesterday. Consistency is important for blood pressure control.',
      medications: ['Lisinopril'],
      action: 'Set Reminder',
      timestamp: '2024-01-15T08:00:00Z',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMedications(mockMedications);
      setAlerts(mockAlerts);
      
      // Generate today's schedule
      const schedule: DoseSchedule[] = [];
      mockMedications.forEach(med => {
        med.times.forEach(time => {
          schedule.push({
            medicationId: med.id,
            time,
            taken: Math.random() > 0.3, // Random for demo
            takenAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
            skipped: false,
          });
        });
      });
      
      setTodaySchedule(schedule.sort((a, b) => a.time.localeCompare(b.time)));
      setLoading(false);
    }, 1000);
  }, []);

  const markDoseTaken = (medicationId: string, time: string) => {
    setTodaySchedule(prev => prev.map(dose => 
      dose.medicationId === medicationId && dose.time === time
        ? { ...dose, taken: true, takenAt: new Date().toISOString() }
        : dose
    ));
  };

  const markDoseSkipped = (medicationId: string, time: string, reason: string) => {
    setTodaySchedule(prev => prev.map(dose => 
      dose.medicationId === medicationId && dose.time === time
        ? { ...dose, skipped: true, skipReason: reason }
        : dose
    ));
  };

  const getMedicationById = (id: string) => {
    return medications.find(med => med.id === id);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'interaction': return BeakerIcon;
      case 'side_effect': return ExclamationTriangleIcon;
      case 'refill': return ShoppingCartIcon;
      case 'adherence': return ClockIcon;
      case 'timing': return BellIcon;
      default: return InformationCircleIcon;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-300';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300';
      case 'info': return 'border-blue-500/50 bg-blue-500/10 text-blue-300';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const calculateAdherence = () => {
    const totalDoses = todaySchedule.length;
    const takenDoses = todaySchedule.filter(dose => dose.taken).length;
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Medications</h1>
          <p className="text-lg text-gray-600">Track prescriptions, monitor adherence, and manage refills</p>
          <div className="mt-2 text-sm text-gray-500 font-mono">
            {medications.length} active medications • Today's adherence: {calculateAdherence()}%
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Ask AI
          </Link>
          <button className="btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Medication
          </button>
        </div>
      </div>

      {/* Adherence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-500">
              {adherenceStats.thisWeek}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">This Week</h3>
          <p className="text-sm text-gray-600">Adherence rate</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <CalendarIcon className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-500">
              {adherenceStats.thisMonth}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">This Month</h3>
          <p className="text-sm text-gray-600">Overall adherence</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <FireIcon className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">
              {adherenceStats.streak}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Day Streak</h3>
          <p className="text-sm text-gray-600">Perfect adherence</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <CubeIcon className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-500">
              {adherenceStats.takenDoses}/{adherenceStats.totalDoses}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total Doses</h3>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      {/* AI Alerts */}
      {alerts.length > 0 && (
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 mediva-gradient rounded-2xl flex items-center justify-center ai-glow">
                <span className="text-white font-bold">✦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Medication Insights</h3>
            </div>
            <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              View all →
            </button>
          </div>
          
          <div className="space-y-4">
            {alerts.map(alert => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-2 ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
                    alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                    'border-blue-200 bg-blue-50 text-blue-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{alert.title}</h4>
                      <p className="text-sm opacity-90 mb-3">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono opacity-60">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-xs px-2 py-1 bg-black/10 rounded-full">
                            {alert.medications.join(', ')}
                          </span>
                        </div>
                        {alert.action && (
                          <button className="text-xs btn-primary px-3 py-1">
                            {alert.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="card-white p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
          <div className="text-sm text-gray-500 font-mono">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          {todaySchedule.map(dose => {
            const medication = getMedicationById(dose.medicationId);
            if (!medication) return null;
            
            return (
              <div
                key={`${dose.medicationId}-${dose.time}`}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  dose.taken 
                    ? 'border-green-200 bg-green-50' 
                    : dose.skipped
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-gray-900">{dose.time}</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {medication.frequency.split(' ')[0]}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {medication.name} {medication.dosage}
                      </h4>
                      <p className="text-sm text-gray-600">{medication.instructions}</p>
                      {medication.foodRestrictions && (
                        <p className="text-xs text-yellow-600 mt-1">
                          💡 {medication.foodRestrictions}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {dose.taken ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircleIcon className="w-6 h-6" />
                        <span className="text-sm font-mono">
                          {dose.takenAt && new Date(dose.takenAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ) : dose.skipped ? (
                      <div className="flex items-center space-x-2 text-red-600">
                        <XCircleIcon className="w-6 h-6" />
                        <span className="text-sm">Skipped</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => markDoseTaken(medication.id, dose.time)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Take Now
                        </button>
                        <button
                          onClick={() => markDoseSkipped(medication.id, dose.time, 'Manual skip')}
                          className="btn-outline text-sm px-3 py-1"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Medications */}
      <div className="card-white p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">All Medications</h3>
          <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
            Medication history →
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medications.map(medication => (
            <div
              key={medication.id}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMedication === medication.id
                  ? 'border-blue-300 bg-blue-50'
                  : medication.priority === 'high' ? 'border-red-200 bg-red-50' :
                    medication.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
              }`}
              onClick={() => setSelectedMedication(
                selectedMedication === medication.id ? null : medication.id
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{medication.name}</h4>
                  {medication.genericName && medication.genericName !== medication.name && (
                    <p className="text-sm text-gray-600 mb-2">({medication.genericName})</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600 font-medium">{medication.dosage}</span>
                    <span className="text-gray-600">{medication.frequency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      medication.category === 'prescription' ? 'bg-purple-100 text-purple-700' :
                      medication.category === 'otc' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {medication.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-mono mb-1">
                    {medication.pillsRemaining}/{medication.totalPills} pills
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    medication.refillsRemaining === 0 ? 'bg-red-100 text-red-700' :
                    medication.refillsRemaining <= 1 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {medication.refillsRemaining} refills left
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Pills remaining</span>
                  <span className="text-gray-900 font-medium">
                    {Math.round((medication.pillsRemaining / medication.totalPills) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      medication.pillsRemaining / medication.totalPills > 0.5 ? 'bg-green-500' :
                      medication.pillsRemaining / medication.totalPills > 0.2 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(medication.pillsRemaining / medication.totalPills) * 100}%` }}
                  ></div>
                </div>
              </div>

              {selectedMedication === medication.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fade-in">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Instructions</h5>
                    <p className="text-sm text-gray-700">{medication.instructions}</p>
                  </div>
                  
                  {medication.sideEffects && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">Common Side Effects</h5>
                      <div className="flex flex-wrap gap-2">
                        {medication.sideEffects.map(effect => (
                          <span key={effect} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Prescribed by: </span>
                      <span className="text-gray-900">{medication.prescribedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary text-sm px-3 py-1">
                        <ShoppingCartIcon className="w-4 h-4 mr-1" />
                        Refill
                      </button>
                      <button className="btn-outline text-sm px-3 py-1">
                        <DocumentTextIcon className="w-4 h-4 mr-1" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-white p-6 animate-slide-up">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="card-white-interactive p-4 text-center">
            <BellIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Set Reminders</p>
          </button>
          
          <button className="card-white-interactive p-4 text-center">
            <ShoppingCartIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Order Refills</p>
          </button>
          
          <Link href="/patient/ai-chat" className="card-white-interactive p-4 text-center">
            <SparklesIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Ask About Medications</p>
          </Link>
          
          <button className="card-white-interactive p-4 text-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Medication History</p>
          </button>
        </div>
      </div>
    </div>
  );
} 