// User & Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'patient' | 'provider' | 'admin';
  created_at: string;
  updated_at: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  emergency_contact?: EmergencyContact;
  insurance_info?: InsuranceInfo;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface InsuranceInfo {
  provider: string;
  policy_number: string;
  group_number?: string;
  member_id: string;
}

// Patient Types
export interface Patient extends User {
  role: 'patient';
  health_id: string;
  blood_type?: string;
  allergies?: string[];
  medications?: Medication[];
  conditions?: MedicalCondition[];
  health_score?: number;
  last_checkup?: string;
}

// Provider Types
export interface Provider extends User {
  role: 'provider';
  license_number: string;
  specialty: string;
  hospital_affiliation?: string;
  years_of_experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  consultation_fee?: number;
  availability?: ProviderAvailability[];
}

export interface ProviderAvailability {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_available: boolean;
}

// Medical Records Types
export interface MedicalRecord {
  id: string;
  patient_id: string;
  provider_id?: string;
  type: 'lab_result' | 'imaging' | 'prescription' | 'visit_note' | 'assessment';
  title: string;
  description?: string;
  file_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  prescribing_provider?: string;
  instructions?: string;
  side_effects?: string[];
  is_active: boolean;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosis_date: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'chronic';
  description?: string;
  treatment_plan?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  type: 'in_person' | 'telehealth' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  notes?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  provider?: Provider;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: {
    confidence_score?: number;
    sources?: string[];
    intent?: string;
    entities?: Record<string, any>;
  };
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  type: 'general' | 'symptom_check' | 'medication' | 'lab_results' | 'preventive_care';
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  summary?: string;
}

// Assessment Types
export interface Assessment {
  id: string;
  patient_id: string;
  type: 'general_health' | 'mental_health' | 'cardiovascular' | 'diabetes' | 'nutrition' | 'fitness' | 'sleep' | 'stress' | 'pain' | 'cognitive' | 'preventive' | 'symptom_tracker';
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoring_method: 'numeric' | 'categorical' | 'composite';
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'scale' | 'yes_no' | 'text' | 'date' | 'number';
  options?: string[];
  required: boolean;
  weight?: number;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  patient_id: string;
  responses: Record<string, any>;
  score?: number;
  interpretation?: string;
  ai_recommendations?: string[];
  completed_at: string;
  next_recommended_date?: string;
}

// Vitals & Health Metrics Types
export interface VitalSigns {
  id: string;
  patient_id: string;
  recorded_at: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  oxygen_saturation?: number;
  blood_glucose?: number;
  notes?: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'appointment_reminder' | 'medication_reminder' | 'assessment_due' | 'lab_results' | 'message' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  action_url?: string;
  scheduled_for?: string;
  created_at: string;
}

// Analytics Types
export interface HealthMetrics {
  patient_id: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    appointment_count: number;
    medication_adherence: number;
    assessment_completion_rate: number;
    health_score_trend: number[];
    vitals_logged: number;
    ai_interactions: number;
  };
  trends: {
    improving: string[];
    concerning: string[];
    stable: string[];
  };
}

// UI Component Types
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  priority: number;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  description?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: 'patient' | 'provider';
  phone?: string;
  dateOfBirth?: string;
}

export interface AppointmentForm {
  provider_id: string;
  date: string;
  time: string;
  type: 'in_person' | 'telehealth';
  reason: string;
  notes?: string;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  type?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  provider?: string;
  status?: string[];
  priority?: string[];
}

// AI Analysis Types
export interface AIAnalysis {
  type: 'symptom_analysis' | 'risk_assessment' | 'trend_analysis' | 'recommendation';
  confidence: number;
  insights: string[];
  recommendations: string[];
  risk_factors?: string[];
  follow_up_needed?: boolean;
  urgency_level: 'low' | 'medium' | 'high' | 'urgent';
  generated_at: string;
} 