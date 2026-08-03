export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ExamType = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'SEGEM_TPYS'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          exam_type: ExamType
          exam_target_date: string | null
          math_level: number
          stats_level: number
          law_level: number
          weekly_availability: Json
          onboarding_completed: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          exam_type: ExamType
          exam_target_date?: string | null
          math_level?: number
          stats_level?: number
          law_level?: number
          weekly_availability?: Json
          onboarding_completed?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          exam_type?: ExamType
          exam_target_date?: string | null
          math_level?: number
          stats_level?: number
          law_level?: number
          weekly_availability?: Json
          onboarding_completed?: boolean
          is_admin?: boolean
          updated_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          topic: string
          question_text: string
          options_json: Json
          correct_answer: string
          user_answer: string | null
          is_correct: boolean | null
          time_to_answer_sec: number | null
          ai_explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic: string
          question_text: string
          options_json: Json
          correct_answer: string
          user_answer?: string | null
          is_correct?: boolean | null
          time_to_answer_sec?: number | null
          ai_explanation?: string | null
          created_at?: string
        }
        Update: {
          user_answer?: string | null
          is_correct?: boolean | null
          time_to_answer_sec?: number | null
          ai_explanation?: string | null
        }
      }
      progress_logs: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          score_pct: number | null
          time_spent_min: number
          questions_total: number
          questions_correct: number
          ai_feedback: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          score_pct?: number | null
          time_spent_min?: number
          questions_total?: number
          questions_correct?: number
          ai_feedback?: Json
          created_at?: string
        }
        Update: never
      }
      xp_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          xp_amount: number
          ref_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          xp_amount: number
          ref_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: never
      }
      monthly_leaderboard: {
        Row: {
          id: string
          user_id: string
          display_name: string
          avatar_url: string | null
          month: string
          xp_total: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          avatar_url?: string | null
          month: string
          xp_total?: number
          updated_at?: string
        }
        Update: {
          display_name?: string
          avatar_url?: string | null
          xp_total?: number
          updated_at?: string
        }
      }
      question_bank: {
        Row: {
          id: string
          exam_type: string
          subject: string
          topic: string
          difficulty: string
          question_text: string
          question_image_url: string | null
          options_json: Json
          correct_answer: string
          explanation: string | null
          is_active: boolean
          is_starred: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_type: string
          subject: string
          topic: string
          difficulty?: string
          question_text: string
          question_image_url?: string | null
          options_json: Json
          correct_answer: string
          explanation?: string | null
          is_active?: boolean
          is_starred?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          exam_type?: string
          subject?: string
          topic?: string
          difficulty?: string
          question_text?: string
          question_image_url?: string | null
          options_json?: Json
          correct_answer?: string
          explanation?: string | null
          is_active?: boolean
          is_starred?: boolean
          updated_at?: string
        }
      }
      topic_content: {
        Row: {
          id: string
          exam_type: string
          subject: string
          topic: string
          difficulty: string
          content_markdown: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_type: string
          subject: string
          topic: string
          difficulty?: string
          content_markdown: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          exam_type?: string
          subject?: string
          topic?: string
          difficulty?: string
          content_markdown?: string
          updated_at?: string
        }
      }
      exam_calendar: {
        Row: {
          id: string
          exam_type: string
          label: string
          event_date: string
          event_type: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          exam_type: string
          label: string
          event_date: string
          event_type: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          exam_type?: string
          label?: string
          event_date?: string
          event_type?: string
          description?: string | null
          is_active?: boolean
        }
      }
      site_settings: {
        Row: {
          id: string
          primary_color: string
          maintenance_mode: boolean
          maintenance_message: string
          announcement_enabled: boolean
          announcement_text: string
          announcement_type: 'info' | 'warning' | 'success'
          announcement_image_url: string | null
          registration_enabled: boolean
          roadmap_quiz_question_count: number
          roadmap_pass_threshold_pct: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          primary_color?: string
          maintenance_mode?: boolean
          maintenance_message?: string
          announcement_enabled?: boolean
          announcement_text?: string
          announcement_type?: 'info' | 'warning' | 'success'
          announcement_image_url?: string | null
          registration_enabled?: boolean
          roadmap_quiz_question_count?: number
          roadmap_pass_threshold_pct?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          primary_color?: string
          maintenance_mode?: boolean
          maintenance_message?: string
          announcement_enabled?: boolean
          announcement_text?: string
          announcement_type?: 'info' | 'warning' | 'success'
          announcement_image_url?: string | null
          registration_enabled?: boolean
          roadmap_quiz_question_count?: number
          roadmap_pass_threshold_pct?: number
          updated_by?: string | null
        }
      }
      formula_library: {
        Row: {
          id: string
          name: string
          name_en: string
          subject: string
          latex: string
          description: string
          tags: string[]
          example: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_en?: string
          subject: string
          latex: string
          description?: string
          tags?: string[]
          example?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          name_en?: string
          subject?: string
          latex?: string
          description?: string
          tags?: string[]
          example?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
    }
  }
}

export type SiteSettings = Database['public']['Tables']['site_settings']['Row']
export type AnnouncementType = 'info' | 'warning' | 'success'

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
export type ProgressLog = Database['public']['Tables']['progress_logs']['Row']
export type XpEvent = Database['public']['Tables']['xp_events']['Row']
export type LeaderboardEntry = Database['public']['Tables']['monthly_leaderboard']['Row']
export type QuestionBankRow = Database['public']['Tables']['question_bank']['Row']
export type TopicContentRow = Database['public']['Tables']['topic_content']['Row']
export type ExamCalendarRow = Database['public']['Tables']['exam_calendar']['Row']
export type FormulaLibraryRow = Database['public']['Tables']['formula_library']['Row']
