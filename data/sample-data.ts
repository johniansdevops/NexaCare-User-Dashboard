// Sample data for NexaCare Dashboard Prototype
// This data is used consistently across both patient and provider dashboards

export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  age: number;
  address: string;
  insurance: string;
  emergency_contact: string;
  health_score: number;
  status: 'Active' | 'Inactive';
}

export interface Provider {
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

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  patient_name: string;
  provider_name: string;
  specialty: string;
  date: string;
  type: 'In-person' | 'Telehealth';
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  location: string;
  reason: string;
  notes: string;
  avatar: string;
}

export interface HealthMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  unit?: string;
  status: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

export interface MedicationAdherence {
  percentage: number;
  missed: number;
  total: number;
  streak: number;
  next_dose: string;
  medications: string[];
}

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'positive' | 'reminder' | 'assessment' | 'warning';
  confidence: number;
  priority?: 'High' | 'Medium' | 'Low' | 'Info';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'medication' | 'assessment' | 'info' | 'alert';
  urgent: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Assessment {
  id: string;
  name: string;
  questions: number;
  duration: string;
  category: string;
}

export interface AssessmentResult {
  patient_id: string;
  assessment_name: string;
  score: number;
  risk_level: string;
  recommendations: string;
  completed_date: string;
  next_due: string;
}

export interface LabResult {
  patient_id: string;
  test_name: string;
  value: string;
  unit: string;
  reference_range: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
  date: string;
}

// Sample Patients
export const samplePatients: Patient[] = [
  {
    id: 'patient-001',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    date_of_birth: '1985-03-15',
    age: 39,
    address: '123 Health Street, Medical City, MC 12345',
    insurance: 'BlueCross BlueShield - Premium Plan',
    emergency_contact: 'Michael Johnson (Spouse) - +1 (555) 987-6543',
    health_score: 85,
    status: 'Active'
  },
  {
    id: 'patient-002',
    full_name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    date_of_birth: '1978-11-22',
    age: 45,
    address: '456 Wellness Ave, Health City, HC 54321',
    insurance: 'Aetna - Gold Plan',
    emergency_contact: 'Lisa Chen (Wife) - +1 (555) 876-5432',
    health_score: 92,
    status: 'Active'
  },
  {
    id: 'patient-003',
    full_name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    date_of_birth: '1992-07-08',
    age: 32,
    address: '789 Care Blvd, Medical Town, MT 98765',
    insurance: 'United Healthcare - Silver Plan',
    emergency_contact: 'Carlos Rodriguez (Brother) - +1 (555) 765-4321',
    health_score: 78,
    status: 'Active'
  }
];

// Sample Providers
export const sampleProviders: Provider[] = [
  {
    id: 'provider-001',
    full_name: 'Dr. Sarah Chen',
    email: 'sarah.chen@nexacare.com',
    phone: '+1 (555) 111-2222',
    specialty: 'Cardiology',
    license_number: 'MD123456',
    years_experience: 12,
    location: 'Medical Center - Room 302',
    avatar: '👩‍⚕️',
    rating: 4.8,
    total_patients: 47,
    status: 'Available'
  },
  {
    id: 'provider-002',
    full_name: 'Dr. Michael Rodriguez',
    email: 'michael.rodriguez@nexacare.com',
    phone: '+1 (555) 222-3333',
    specialty: 'General Practice',
    license_number: 'MD789012',
    years_experience: 8,
    location: 'Primary Care Center - Suite 205',
    avatar: '👨‍⚕️',
    rating: 4.9,
    total_patients: 62,
    status: 'Available'
  },
  {
    id: 'provider-003',
    full_name: 'Dr. Emily Park',
    email: 'emily.park@nexacare.com',
    phone: '+1 (555) 333-4444',
    specialty: 'Dermatology',
    license_number: 'MD345678',
    years_experience: 15,
    location: 'Dermatology Clinic - Floor 3',
    avatar: '👩‍⚕️',
    rating: 4.7,
    total_patients: 38,
    status: 'Available'
  }
];

// Sample Appointments
export const sampleAppointments: Appointment[] = [
  {
    id: 'appt-001',
    patient_id: 'patient-001',
    provider_id: 'provider-001',
    patient_name: 'Sarah Johnson',
    provider_name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    date: '2024-01-15T10:00:00Z',
    type: 'In-person',
    duration: 30,
    status: 'Scheduled',
    location: 'Medical Center - Room 302',
    reason: 'Cardiology Consultation',
    notes: 'Follow-up for blood pressure management',
    avatar: '👩‍⚕️'
  },
  {
    id: 'appt-002',
    patient_id: 'patient-001',
    provider_id: 'provider-002',
    patient_name: 'Sarah Johnson',
    provider_name: 'Dr. Michael Rodriguez',
    specialty: 'General Practice',
    date: '2024-01-18T14:30:00Z',
    type: 'Telehealth',
    duration: 15,
    status: 'Scheduled',
    location: 'Video Call',
    reason: 'General Check-up',
    notes: 'Routine wellness exam',
    avatar: '👨‍⚕️'
  },
  {
    id: 'appt-003',
    patient_id: 'patient-001',
    provider_id: 'provider-003',
    patient_name: 'Sarah Johnson',
    provider_name: 'Dr. Emily Park',
    specialty: 'Dermatology',
    date: '2024-01-22T09:15:00Z',
    type: 'In-person',
    duration: 20,
    status: 'Scheduled',
    location: 'Dermatology Clinic',
    reason: 'Skin Check',
    notes: 'Annual skin cancer screening',
    avatar: '👩‍⚕️'
  },
  {
    id: 'appt-004',
    patient_id: 'patient-002',
    provider_id: 'provider-001',
    patient_name: 'Michael Chen',
    provider_name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    date: '2024-01-16T11:00:00Z',
    type: 'In-person',
    duration: 45,
    status: 'Scheduled',
    location: 'Medical Center - Room 302',
    reason: 'Cardiology Follow-up',
    notes: 'Review stress test results',
    avatar: '👩‍⚕️'
  },
  {
    id: 'appt-005',
    patient_id: 'patient-003',
    provider_id: 'provider-002',
    patient_name: 'Emily Rodriguez',
    provider_name: 'Dr. Michael Rodriguez',
    specialty: 'General Practice',
    date: '2024-01-17T15:00:00Z',
    type: 'Telehealth',
    duration: 20,
    status: 'Scheduled',
    location: 'Video Call',
    reason: 'Medication Review',
    notes: 'Discuss current prescriptions',
    avatar: '👨‍⚕️'
  }
];

// Sample Health Metrics by Patient
export const sampleHealthMetrics: Record<string, HealthMetric[]> = {
  'patient-001': [
    { label: 'Blood Pressure', value: '120/80', change: -2, trend: 'down', color: 'text-green-400', unit: 'mmHg', status: 'Good' },
    { label: 'Heart Rate', value: '72', change: 0, trend: 'stable', color: 'text-blue-400', unit: 'bpm', status: 'Normal' },
    { label: 'Weight', value: '165', change: -1.5, trend: 'down', color: 'text-green-400', unit: 'lbs', status: 'Improving' },
    { label: 'BMI', value: '22.1', change: -0.3, trend: 'down', color: 'text-green-400', unit: '', status: 'Normal' },
    { label: 'Sleep Quality', value: '8.2', change: 1.1, trend: 'up', color: 'text-purple-400', unit: '/10', status: 'Excellent' },
    { label: 'Steps Today', value: '8,450', change: 12, trend: 'up', color: 'text-orange-400', unit: '', status: 'Active' }
  ],
  'patient-002': [
    { label: 'Blood Pressure', value: '118/75', change: -3, trend: 'down', color: 'text-green-400', unit: 'mmHg', status: 'Excellent' },
    { label: 'Heart Rate', value: '68', change: -2, trend: 'down', color: 'text-green-400', unit: 'bpm', status: 'Good' },
    { label: 'Weight', value: '180', change: 0, trend: 'stable', color: 'text-blue-400', unit: 'lbs', status: 'Stable' },
    { label: 'BMI', value: '23.5', change: 0, trend: 'stable', color: 'text-blue-400', unit: '', status: 'Normal' },
    { label: 'Sleep Quality', value: '9.1', change: 0.8, trend: 'up', color: 'text-purple-400', unit: '/10', status: 'Excellent' },
    { label: 'Steps Today', value: '12,350', change: 18, trend: 'up', color: 'text-orange-400', unit: '', status: 'Very Active' }
  ],
  'patient-003': [
    { label: 'Blood Pressure', value: '125/85', change: 2, trend: 'up', color: 'text-yellow-400', unit: 'mmHg', status: 'Monitor' },
    { label: 'Heart Rate', value: '76', change: 1, trend: 'up', color: 'text-blue-400', unit: 'bpm', status: 'Normal' },
    { label: 'Weight', value: '140', change: -0.5, trend: 'down', color: 'text-green-400', unit: 'lbs', status: 'Improving' },
    { label: 'BMI', value: '21.8', change: -0.2, trend: 'down', color: 'text-green-400', unit: '', status: 'Normal' },
    { label: 'Sleep Quality', value: '7.5', change: 0.5, trend: 'up', color: 'text-purple-400', unit: '/10', status: 'Good' },
    { label: 'Steps Today', value: '6,200', change: -8, trend: 'down', color: 'text-red-400', unit: '', status: 'Low' }
  ]
};

// Sample Medication Adherence by Patient
export const sampleMedicationAdherence: Record<string, MedicationAdherence> = {
  'patient-001': {
    percentage: 94,
    missed: 2,
    total: 30,
    streak: 12,
    next_dose: '8:00 PM',
    medications: ['Lisinopril', 'Metformin', 'Vitamin D']
  },
  'patient-002': {
    percentage: 98,
    missed: 1,
    total: 30,
    streak: 18,
    next_dose: '9:00 PM',
    medications: ['Atorvastatin', 'Metoprolol', 'Omega-3']
  },
  'patient-003': {
    percentage: 87,
    missed: 4,
    total: 30,
    streak: 4,
    next_dose: '7:00 AM',
    medications: ['Sertraline', 'Levothyroxine', 'Multivitamin']
  }
};

// Sample Medications by Patient
export const sampleMedications: Record<string, Medication[]> = {
  'patient-001': [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'daily', purpose: 'Blood pressure' },
    { name: 'Metformin', dosage: '500mg', frequency: 'twice daily', purpose: 'Diabetes prevention' },
    { name: 'Vitamin D', dosage: '2000 IU', frequency: 'daily', purpose: 'Supplement' }
  ],
  'patient-002': [
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'daily', purpose: 'Cholesterol' },
    { name: 'Metoprolol', dosage: '25mg', frequency: 'twice daily', purpose: 'Blood pressure' },
    { name: 'Omega-3', dosage: '1000mg', frequency: 'daily', purpose: 'Supplement' }
  ],
  'patient-003': [
    { name: 'Sertraline', dosage: '50mg', frequency: 'daily', purpose: 'Depression/Anxiety' },
    { name: 'Levothyroxine', dosage: '75mcg', frequency: 'daily', purpose: 'Thyroid' },
    { name: 'Multivitamin', dosage: '1', frequency: 'daily', purpose: 'Supplement' }
  ]
};

// Sample AI Insights
export const sampleAIInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Excellent Blood Pressure Trend',
    message: 'Your blood pressure has improved 5% over the last month. Your consistent exercise routine is paying off! Keep maintaining 150+ minutes of moderate activity weekly.',
    time: '2 hours ago',
    type: 'positive',
    confidence: 95
  },
  {
    id: '2',
    title: 'Medication Reminder Alert',
    message: 'You have a 12-day perfect adherence streak! Your evening Lisinopril dose is due at 8:00 PM today. Setting a phone reminder might help maintain this excellent routine.',
    time: '4 hours ago',
    type: 'reminder',
    confidence: 100
  },
  {
    id: '3',
    title: 'Monthly Assessment Ready',
    message: 'Your comprehensive cardiovascular health assessment is available. Based on your recent metrics, this will likely show continued improvement. Takes about 5 minutes.',
    time: '1 day ago',
    type: 'assessment',
    confidence: 88
  },
  {
    id: '4',
    title: 'Sleep Pattern Optimization',
    message: 'Your sleep quality has increased by 15% this week! Going to bed 30 minutes earlier seems to be working. Consider maintaining this 10:30 PM bedtime routine.',
    time: '6 hours ago',
    type: 'positive',
    confidence: 92
  },
  {
    id: '5',
    title: 'Hydration Goal Achievement',
    message: 'Congratulations! You\'ve met your daily water intake goal for 5 consecutive days. This is contributing to your improved energy levels and skin health.',
    time: '8 hours ago',
    type: 'positive',
    confidence: 87
  }
];

// Sample Provider AI Insights
export const sampleProviderAIInsights: AIInsight[] = [
  {
    id: 'p1',
    title: 'Patient Risk Alert - Emily Rodriguez',
    message: 'Patient shows slightly elevated blood pressure trend and decreased activity levels. Consider follow-up within 2 weeks.',
    time: '1 hour ago',
    type: 'warning',
    confidence: 85,
    priority: 'Medium'
  },
  {
    id: 'p2',
    title: 'Medication Adherence Concern - Emily Rodriguez',
    message: 'Patient\'s medication adherence has dropped to 87%. Consider medication review or adherence counseling.',
    time: '3 hours ago',
    type: 'warning',
    confidence: 92,
    priority: 'Low'
  },
  {
    id: 'p3',
    title: 'Positive Outcome - Michael Chen',
    message: 'Patient showing excellent health improvements across all metrics. Continue current treatment plan.',
    time: '5 hours ago',
    type: 'positive',
    confidence: 96,
    priority: 'Info'
  }
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Cardiology Appointment Tomorrow',
    message: 'Dr. Chen appointment at 10:00 AM. Bring your blood pressure log and current medications list.',
    time: '30 minutes ago',
    type: 'appointment',
    urgent: false
  },
  {
    id: '2',
    title: 'Lab Results Available',
    message: 'Your comprehensive metabolic panel results are ready for review. All values within normal ranges.',
    time: '2 hours ago',
    type: 'info',
    urgent: true
  },
  {
    id: '3',
    title: 'Medication Refill Due',
    message: 'Lisinopril prescription expires in 5 days. Order refill now to avoid interruption.',
    time: '1 day ago',
    type: 'medication',
    urgent: false
  },
  {
    id: '4',
    title: 'Annual Physical Due',
    message: 'Your annual wellness exam is due this month. Schedule with Dr. Rodriguez for comprehensive health screening.',
    time: '3 days ago',
    type: 'appointment',
    urgent: false
  },
  {
    id: '5',
    title: 'Insurance Coverage Update',
    message: 'Your insurance plan has been updated with new benefits. Review your updated coverage details.',
    time: '1 week ago',
    type: 'info',
    urgent: false
  }
];

// Sample Provider Notifications
export const sampleProviderNotifications: Notification[] = [
  {
    id: 'pn1',
    title: 'Patient Check-in',
    message: 'Sarah Johnson has checked in for her 10:00 AM appointment',
    time: '5 minutes ago',
    type: 'info',
    urgent: false
  },
  {
    id: 'pn2',
    title: 'Lab Results Critical',
    message: 'Emily Rodriguez lab results require review - elevated blood pressure markers',
    time: '1 hour ago',
    type: 'alert',
    urgent: true,
    priority: 'High'
  },
  {
    id: 'pn3',
    title: 'Schedule Update',
    message: 'Tomorrow\'s schedule has been updated with 2 new appointments',
    time: '3 hours ago',
    type: 'info',
    urgent: false
  }
];

// Sample Assessments
export const sampleAssessments: Assessment[] = [
  {
    id: 'assess-001',
    name: 'Cardiovascular Health Assessment',
    questions: 15,
    duration: '5-7 minutes',
    category: 'Heart Health'
  },
  {
    id: 'assess-002',
    name: 'Mental Health Screening',
    questions: 12,
    duration: '4-6 minutes',
    category: 'Mental Wellness'
  },
  {
    id: 'assess-003',
    name: 'Diabetes Risk Assessment',
    questions: 10,
    duration: '3-5 minutes',
    category: 'Metabolic Health'
  },
  {
    id: 'assess-004',
    name: 'Sleep Quality Evaluation',
    questions: 8,
    duration: '2-4 minutes',
    category: 'Sleep Health'
  }
];

// Sample Assessment Results
export const sampleAssessmentResults: AssessmentResult[] = [
  {
    patient_id: 'patient-001',
    assessment_name: 'Cardiovascular Health Assessment',
    score: 88,
    risk_level: 'Low',
    recommendations: 'Continue current exercise routine, maintain healthy diet',
    completed_date: '2 days ago',
    next_due: 'Due in 3 months'
  },
  {
    patient_id: 'patient-002',
    assessment_name: 'Mental Health Screening',
    score: 92,
    risk_level: 'Very Low',
    recommendations: 'Excellent mental health, continue stress management practices',
    completed_date: '1 week ago',
    next_due: 'Due in 6 months'
  }
];

// Helper function to get current user data (Sarah Johnson by default)
export const getCurrentUser = (): Patient => {
  return samplePatients[0]; // Sarah Johnson
};

// Helper function to get appointments for a specific patient
export const getPatientAppointments = (patientId: string): Appointment[] => {
  return sampleAppointments.filter(apt => apt.patient_id === patientId);
};

// Helper function to get appointments for a specific provider
export const getProviderAppointments = (providerId: string): Appointment[] => {
  return sampleAppointments.filter(apt => apt.provider_id === providerId);
};

// Helper function to get health metrics for a patient
export const getPatientHealthMetrics = (patientId: string): HealthMetric[] => {
  return sampleHealthMetrics[patientId] || [];
};

// Helper function to get medication adherence for a patient
export const getPatientMedicationAdherence = (patientId: string): MedicationAdherence => {
  return sampleMedicationAdherence[patientId] || sampleMedicationAdherence['patient-001'];
};

// Helper function to get medications for a patient
export const getPatientMedications = (patientId: string): Medication[] => {
  return sampleMedications[patientId] || [];
}; 