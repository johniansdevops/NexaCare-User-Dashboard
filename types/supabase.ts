export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'patient' | 'provider' | 'admin'
          phone: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'patient' | 'provider' | 'admin'
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'provider' | 'admin'
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          health_id: string
          blood_type: string | null
          allergies: string[] | null
          health_score: number
          last_checkup: string | null
          emergency_contact: Json | null
          insurance_info: Json | null
        }
        Insert: {
          id: string
          health_id: string
          blood_type?: string | null
          allergies?: string[] | null
          health_score?: number
          last_checkup?: string | null
          emergency_contact?: Json | null
          insurance_info?: Json | null
        }
        Update: {
          id?: string
          health_id?: string
          blood_type?: string | null
          allergies?: string[] | null
          health_score?: number
          last_checkup?: string | null
          emergency_contact?: Json | null
          insurance_info?: Json | null
        }
      }
      providers: {
        Row: {
          id: string
          license_number: string
          specialty: string
          hospital_affiliation: string | null
          years_of_experience: number
          education: string[] | null
          certifications: string[] | null
          languages: string[] | null
          consultation_fee: number | null
          availability: Json | null
        }
        Insert: {
          id: string
          license_number: string
          specialty: string
          hospital_affiliation?: string | null
          years_of_experience?: number
          education?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          consultation_fee?: number | null
          availability?: Json | null
        }
        Update: {
          id?: string
          license_number?: string
          specialty?: string
          hospital_affiliation?: string | null
          years_of_experience?: number
          education?: string[] | null
          certifications?: string[] | null
          languages?: string[] | null
          consultation_fee?: number | null
          availability?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 