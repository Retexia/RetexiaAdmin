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
      clients: {
        Row: {
          id: string
          company_name: string | null
          contact_name: string | null
          email: string | null
          phone: string | null
          what_happend: string | null
          Available_time: string | null
        }
        Insert: {
          id?: string
          company_name?: string | null
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          what_happend?: string | null
          Available_time?: string | null
        }
        Update: {
          id?: string
          company_name?: string | null
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          what_happend?: string | null
          Available_time?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          project_name: string | null
          current_stage: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          project_name?: string | null
          current_stage?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          project_name?: string | null
          current_stage?: string | null
          created_at?: string
        }
      }
      project_documents: {
        Row: {
          id: string
          project_id: string | null
          document_type: string | null
          content: Json | null
          status: string | null
          created_by: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          document_type?: string | null
          content?: Json | null
          status?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          document_type?: string | null
          content?: Json | null
          status?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
        }
      }
      team_payments: {
        Row: {
          id: string
          user_id: string | null
          amount: number | null
          status: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number | null
          status?: string | null
          created_at?: string
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
