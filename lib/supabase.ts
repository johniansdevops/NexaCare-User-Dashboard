import { createClient } from '@supabase/supabase-js';

// Use environment variables with hardcoded fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zorrkhnussfbfhzyioxi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcnJraG51c3NmYmZoenlpb3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTkwNTAsImV4cCI6MjA3MDY3NTA1MH0.pwnpRXp9fuUGVbkM9JpqGBgd4DnmCmEHL-a9K_jTVX0';

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables');
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For components, create a new client instance
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (requires service role key)
export const createSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found, admin functions will not work');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Database schema definition for reference
export const DATABASE_SCHEMA = {
  // User profile table
  profiles: {
    id: 'uuid PRIMARY KEY',
    email: 'text UNIQUE NOT NULL',
    full_name: 'text',
    avatar_url: 'text',
    role: "text CHECK (role IN ('patient', 'provider', 'admin'))",
    phone: 'text',
    date_of_birth: 'date',
    gender: "text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'))",
    created_at: 'timestamptz DEFAULT now()',
    updated_at: 'timestamptz DEFAULT now()',
  },

  // Patient-specific information
  patients: {
    id: 'uuid PRIMARY KEY REFERENCES profiles(id)',
    health_id: 'text UNIQUE NOT NULL',
    blood_type: 'text',
    allergies: 'text[]',
    health_score: 'integer DEFAULT 0',
    last_checkup: 'timestamptz',
    emergency_contact: 'jsonb',
    insurance_info: 'jsonb',
  },

  // Provider-specific information
  providers: {
    id: 'uuid PRIMARY KEY REFERENCES profiles(id)',
    license_number: 'text UNIQUE NOT NULL',
    specialty: 'text NOT NULL',
    hospital_affiliation: 'text',
    years_of_experience: 'integer DEFAULT 0',
    education: 'text[]',
    certifications: 'text[]',
    languages: 'text[]',
    consultation_fee: 'decimal(10,2)',
    availability: 'jsonb',
  },

  // Appointments
  appointments: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    patient_id: 'uuid REFERENCES patients(id)',
    provider_id: 'uuid REFERENCES providers(id)',
    type: "text CHECK (type IN ('in_person', 'telehealth', 'phone'))",
    status: "text CHECK (status IN ('pending', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined', 'no_show'))",
    date: 'date NOT NULL',
    start_time: 'time NOT NULL',
    end_time: 'time NOT NULL',
    reason: 'text NOT NULL',
    notes: 'text',
    meeting_link: 'text',
    created_at: 'timestamptz DEFAULT now()',
    updated_at: 'timestamptz DEFAULT now()',
  },

  // Medical records
  medical_records: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    patient_id: 'uuid REFERENCES patients(id)',
    provider_id: 'uuid REFERENCES providers(id)',
    type: "text CHECK (type IN ('lab_result', 'imaging', 'prescription', 'visit_note', 'assessment'))",
    title: 'text NOT NULL',
    description: 'text',
    file_url: 'text',
    metadata: 'jsonb',
    created_at: 'timestamptz DEFAULT now()',
    updated_at: 'timestamptz DEFAULT now()',
  },

  // Medications
  medications: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    patient_id: 'uuid REFERENCES patients(id)',
    name: 'text NOT NULL',
    dosage: 'text NOT NULL',
    frequency: 'text NOT NULL',
    start_date: 'date NOT NULL',
    end_date: 'date',
    prescribing_provider: 'uuid REFERENCES providers(id)',
    instructions: 'text',
    side_effects: 'text[]',
    is_active: 'boolean DEFAULT true',
    created_at: 'timestamptz DEFAULT now()',
  },

  // Medical conditions
  medical_conditions: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    patient_id: 'uuid REFERENCES patients(id)',
    name: 'text NOT NULL',
    diagnosis_date: 'date NOT NULL',
    severity: "text CHECK (severity IN ('mild', 'moderate', 'severe'))",
    status: "text CHECK (status IN ('active', 'resolved', 'chronic'))",
    description: 'text',
    treatment_plan: 'text',
    created_at: 'timestamptz DEFAULT now()',
  },

  // AI conversations
  ai_conversations: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES profiles(id)',
    title: 'text NOT NULL',
    type: "text CHECK (type IN ('general', 'symptom_check', 'medication', 'lab_results', 'preventive_care'))",
    status: "text CHECK (status IN ('active', 'archived'))",
    summary: 'text',
    created_at: 'timestamptz DEFAULT now()',
    updated_at: 'timestamptz DEFAULT now()',
  },

  // AI chat messages
  ai_messages: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    conversation_id: 'uuid REFERENCES ai_conversations(id)',
    sender: "text CHECK (sender IN ('user', 'ai'))",
    content: 'text NOT NULL',
    metadata: 'jsonb',
    timestamp: 'timestamptz DEFAULT now()',
  },

  // Health assessments
  assessments: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    type: "text CHECK (type IN ('general_health', 'mental_health', 'cardiovascular', 'diabetes', 'nutrition', 'fitness', 'sleep', 'stress', 'pain', 'cognitive', 'preventive', 'symptom_tracker'))",
    title: 'text NOT NULL',
    description: 'text',
    questions: 'jsonb NOT NULL',
    scoring_method: "text CHECK (scoring_method IN ('numeric', 'categorical', 'composite'))",
    status: "text CHECK (status IN ('draft', 'active', 'archived'))",
    created_at: 'timestamptz DEFAULT now()',
    updated_at: 'timestamptz DEFAULT now()',
  },

  // Assessment responses
  assessment_responses: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    assessment_id: 'uuid REFERENCES assessments(id)',
    patient_id: 'uuid REFERENCES patients(id)',
    responses: 'jsonb NOT NULL',
    score: 'integer',
    interpretation: 'text',
    ai_recommendations: 'text[]',
    completed_at: 'timestamptz DEFAULT now()',
    next_recommended_date: 'date',
  },

  // Vital signs
  vital_signs: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    patient_id: 'uuid REFERENCES patients(id)',
    recorded_at: 'timestamptz DEFAULT now()',
    blood_pressure_systolic: 'integer',
    blood_pressure_diastolic: 'integer',
    heart_rate: 'integer',
    temperature: 'decimal(4,1)',
    weight: 'decimal(5,2)',
    height: 'decimal(5,2)',
    bmi: 'decimal(4,1)',
    oxygen_saturation: 'integer',
    blood_glucose: 'integer',
    notes: 'text',
  },

  // Notifications
  notifications: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES profiles(id)',
    type: "text CHECK (type IN ('appointment_reminder', 'medication_reminder', 'assessment_due', 'lab_results', 'message', 'system'))",
    title: 'text NOT NULL',
    message: 'text NOT NULL',
    priority: "text CHECK (priority IN ('low', 'medium', 'high', 'urgent'))",
    is_read: 'boolean DEFAULT false',
    action_url: 'text',
    scheduled_for: 'timestamptz',
    created_at: 'timestamptz DEFAULT now()',
  },
}; 