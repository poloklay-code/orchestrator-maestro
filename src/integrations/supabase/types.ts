export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliate_integrations: {
        Row: {
          api_key: string | null
          client_id: string | null
          config: Json | null
          created_at: string | null
          id: string
          platform: string
          product_id: string | null
          product_name: string | null
          status: string | null
          total_refunds: number | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          platform: string
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          total_refunds?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          platform?: string
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          total_refunds?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_integrations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          business_description: string | null
          client_id: string | null
          conversations: number | null
          created_at: string | null
          design_config: Json | null
          id: string
          knowledge_base: Json | null
          model: string | null
          name: string
          niche_analysis: Json | null
          platform: string
          satisfaction_rate: number | null
          social_urls: Json | null
          status: string | null
          system_prompt: string | null
          type: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          business_description?: string | null
          client_id?: string | null
          conversations?: number | null
          created_at?: string | null
          design_config?: Json | null
          id?: string
          knowledge_base?: Json | null
          model?: string | null
          name: string
          niche_analysis?: Json | null
          platform: string
          satisfaction_rate?: number | null
          social_urls?: Json | null
          status?: string | null
          system_prompt?: string | null
          type: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          business_description?: string | null
          client_id?: string | null
          conversations?: number | null
          created_at?: string | null
          design_config?: Json | null
          id?: string
          knowledge_base?: Json | null
          model?: string | null
          name?: string
          niche_analysis?: Json | null
          platform?: string
          satisfaction_rate?: number | null
          social_urls?: Json | null
          status?: string | null
          system_prompt?: string | null
          type?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_monitoring: {
        Row: {
          agent_id: string | null
          client_id: string | null
          id: string
          metric_data: Json | null
          metric_type: string
          metric_value: number | null
          platform: string | null
          recorded_at: string | null
          service_id: string | null
        }
        Insert: {
          agent_id?: string | null
          client_id?: string | null
          id?: string
          metric_data?: Json | null
          metric_type: string
          metric_value?: number | null
          platform?: string | null
          recorded_at?: string | null
          service_id?: string | null
        }
        Update: {
          agent_id?: string | null
          client_id?: string | null
          id?: string
          metric_data?: Json | null
          metric_type?: string
          metric_value?: number | null
          platform?: string | null
          recorded_at?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_monitoring_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_monitoring_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_monitoring_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          severity: string | null
          source: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          severity?: string | null
          source?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          severity?: string | null
          source?: string | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          client_id: string | null
          config: Json | null
          created_at: string | null
          error_count: number | null
          id: string
          last_run_at: string | null
          name: string
          platform: string
          run_count: number | null
          service_id: string | null
          status: string | null
          success_rate: number | null
          updated_at: string | null
          webhook_url: string | null
          workflow_steps: Json | null
        }
        Insert: {
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_run_at?: string | null
          name: string
          platform: string
          run_count?: number | null
          service_id?: string | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          webhook_url?: string | null
          workflow_steps?: Json | null
        }
        Update: {
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_run_at?: string | null
          name?: string
          platform?: string
          run_count?: number | null
          service_id?: string | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          webhook_url?: string | null
          workflow_steps?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      autoscale_campaigns: {
        Row: {
          auto_scale_enabled: boolean | null
          budget: number | null
          client_id: string | null
          cpl: number | null
          created_at: string | null
          id: string
          leads: number | null
          name: string
          original_budget: number | null
          platform: string
          roas: number | null
          scale_history: Json | null
          scale_limit_pct: number | null
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_scale_enabled?: boolean | null
          budget?: number | null
          client_id?: string | null
          cpl?: number | null
          created_at?: string | null
          id?: string
          leads?: number | null
          name: string
          original_budget?: number | null
          platform: string
          roas?: number | null
          scale_history?: Json | null
          scale_limit_pct?: number | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_scale_enabled?: boolean | null
          budget?: number | null
          client_id?: string | null
          cpl?: number | null
          created_at?: string | null
          id?: string
          leads?: number | null
          name?: string
          original_budget?: number | null
          platform?: string
          roas?: number | null
          scale_history?: Json | null
          scale_limit_pct?: number | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "autoscale_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "autoscale_campaigns_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      briefings: {
        Row: {
          additional_info: string | null
          ai_analysis: Json | null
          auto_started: boolean | null
          budget: string | null
          challenges: string | null
          client_name: string
          company: string | null
          competitors: string | null
          created_at: string | null
          current_revenue: string | null
          email: string | null
          id: string
          instagram: string | null
          main_goal: string | null
          niche: string | null
          payment_confirmed: boolean | null
          payment_confirmed_at: string | null
          phone: string | null
          services: string[] | null
          status: string | null
          target_revenue: string | null
          updated_at: string | null
          urgency: string | null
          website: string | null
        }
        Insert: {
          additional_info?: string | null
          ai_analysis?: Json | null
          auto_started?: boolean | null
          budget?: string | null
          challenges?: string | null
          client_name: string
          company?: string | null
          competitors?: string | null
          created_at?: string | null
          current_revenue?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          main_goal?: string | null
          niche?: string | null
          payment_confirmed?: boolean | null
          payment_confirmed_at?: string | null
          phone?: string | null
          services?: string[] | null
          status?: string | null
          target_revenue?: string | null
          updated_at?: string | null
          urgency?: string | null
          website?: string | null
        }
        Update: {
          additional_info?: string | null
          ai_analysis?: Json | null
          auto_started?: boolean | null
          budget?: string | null
          challenges?: string | null
          client_name?: string
          company?: string | null
          competitors?: string | null
          created_at?: string | null
          current_revenue?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          main_goal?: string | null
          niche?: string | null
          payment_confirmed?: boolean | null
          payment_confirmed_at?: string | null
          phone?: string | null
          services?: string[] | null
          status?: string | null
          target_revenue?: string | null
          updated_at?: string | null
          urgency?: string | null
          website?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          role?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          current_revenue: string | null
          document: string | null
          email: string | null
          id: string
          instagram: string | null
          name: string
          niche: string | null
          notes: string | null
          phone: string | null
          risk_score: number | null
          status: string | null
          target_revenue: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          current_revenue?: string | null
          document?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          name: string
          niche?: string | null
          notes?: string | null
          phone?: string | null
          risk_score?: number | null
          status?: string | null
          target_revenue?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          current_revenue?: string | null
          document?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          name?: string
          niche?: string | null
          notes?: string | null
          phone?: string | null
          risk_score?: number | null
          status?: string | null
          target_revenue?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      deliverable_details: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string | null
          deliverable_id: string
          id: string
          metrics: Json | null
          title: string
          type: string
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          deliverable_id: string
          id?: string
          metrics?: Json | null
          title: string
          type: string
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          deliverable_id?: string
          id?: string
          metrics?: Json | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverable_details_deliverable_id_fkey"
            columns: ["deliverable_id"]
            isOneToOne: false
            referencedRelation: "service_deliverables"
            referencedColumns: ["id"]
          },
        ]
      }
      dominus_actions: {
        Row: {
          action_type: string
          created_at: string | null
          executed_at: string | null
          id: string
          result: Json | null
          revenue_recovered: number | null
          status: string | null
          target_id: string | null
          target_type: string
          tenant_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          result?: Json | null
          revenue_recovered?: number | null
          status?: string | null
          target_id?: string | null
          target_type: string
          tenant_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          result?: Json | null
          revenue_recovered?: number | null
          status?: string | null
          target_id?: string | null
          target_type?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dominus_actions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dominus_insights: {
        Row: {
          ai_analysis: Json | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          impact_value: number | null
          priority: string | null
          status: string | null
          tenant_id: string | null
          title: string
        }
        Insert: {
          ai_analysis?: Json | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_value?: number | null
          priority?: string | null
          status?: string | null
          tenant_id?: string | null
          title: string
        }
        Update: {
          ai_analysis?: Json | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_value?: number | null
          priority?: string | null
          status?: string | null
          tenant_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dominus_insights_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dominus_lead_scores: {
        Row: {
          conversion_probability: number | null
          factors: Json | null
          id: string
          lead_id: string | null
          recommendations: Json | null
          score: number
          scored_at: string | null
          temperature: string
          tenant_id: string | null
        }
        Insert: {
          conversion_probability?: number | null
          factors?: Json | null
          id?: string
          lead_id?: string | null
          recommendations?: Json | null
          score?: number
          scored_at?: string | null
          temperature?: string
          tenant_id?: string | null
        }
        Update: {
          conversion_probability?: number | null
          factors?: Json | null
          id?: string
          lead_id?: string | null
          recommendations?: Json | null
          score?: number
          scored_at?: string | null
          temperature?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dominus_lead_scores_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dominus_lead_scores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string | null
          service_id: string | null
          type: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          service_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          service_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_records_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key_ref: string | null
          auto_reconnect: boolean | null
          config: Json | null
          created_at: string | null
          error_count: number | null
          health_check_at: string | null
          id: string
          last_sync_at: string | null
          name: string
          platform: string
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          api_key_ref?: string | null
          auto_reconnect?: boolean | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          health_check_at?: string | null
          id?: string
          last_sync_at?: string | null
          name: string
          platform: string
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          api_key_ref?: string | null
          auto_reconnect?: boolean | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          health_check_at?: string | null
          id?: string
          last_sync_at?: string | null
          name?: string
          platform?: string
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_agent: string | null
          channel: string | null
          created_at: string | null
          email: string | null
          entry_page: string | null
          id: string
          last_activity: string | null
          name: string
          notes: string | null
          phone: string | null
          score: number | null
          service_interest: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_agent?: string | null
          channel?: string | null
          created_at?: string | null
          email?: string | null
          entry_page?: string | null
          id?: string
          last_activity?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_agent?: string | null
          channel?: string | null
          created_at?: string | null
          email?: string | null
          entry_page?: string | null
          id?: string
          last_activity?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          admin_approved: boolean | null
          admin_approved_at: string | null
          auto_implemented: boolean | null
          category: string
          competition: string | null
          created_at: string | null
          description: string | null
          detected_at: string | null
          growth: string | null
          id: string
          implementation_plan: Json | null
          platforms: string[] | null
          profit_estimate: string | null
          risk_analysis: string | null
          score: number | null
          source: string
          status: string | null
          title: string
          volume: string | null
        }
        Insert: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          auto_implemented?: boolean | null
          category: string
          competition?: string | null
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          growth?: string | null
          id?: string
          implementation_plan?: Json | null
          platforms?: string[] | null
          profit_estimate?: string | null
          risk_analysis?: string | null
          score?: number | null
          source: string
          status?: string | null
          title: string
          volume?: string | null
        }
        Update: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          auto_implemented?: boolean | null
          category?: string
          competition?: string | null
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          growth?: string | null
          id?: string
          implementation_plan?: Json | null
          platforms?: string[] | null
          profit_estimate?: string | null
          risk_analysis?: string | null
          score?: number | null
          source?: string
          status?: string | null
          title?: string
          volume?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          phone: string | null
          pin_code: string | null
          role: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          pin_code?: string | null
          role?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          pin_code?: string | null
          role?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          briefing_id: string | null
          client_id: string | null
          created_at: string | null
          diagnostico: string | null
          escopo: string | null
          estrategia: string | null
          fee_gestao: number | null
          id: string
          kpis: string | null
          pdf_url: string | null
          riscos: string | null
          sent_via: string | null
          status: string | null
          title: string
          total: number | null
          updated_at: string | null
          verba_recomendada: number | null
        }
        Insert: {
          briefing_id?: string | null
          client_id?: string | null
          created_at?: string | null
          diagnostico?: string | null
          escopo?: string | null
          estrategia?: string | null
          fee_gestao?: number | null
          id?: string
          kpis?: string | null
          pdf_url?: string | null
          riscos?: string | null
          sent_via?: string | null
          status?: string | null
          title: string
          total?: number | null
          updated_at?: string | null
          verba_recomendada?: number | null
        }
        Update: {
          briefing_id?: string | null
          client_id?: string | null
          created_at?: string | null
          diagnostico?: string | null
          escopo?: string | null
          estrategia?: string | null
          fee_gestao?: number | null
          id?: string
          kpis?: string | null
          pdf_url?: string | null
          riscos?: string | null
          sent_via?: string | null
          status?: string | null
          title?: string
          total?: number | null
          updated_at?: string | null
          verba_recomendada?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          answers: Json | null
          created_at: string | null
          email: string | null
          estimated_loss: number | null
          id: string
          leads_per_month: number | null
          lost_clients_pct: number | null
          name: string | null
          niche: string | null
          phone: string | null
          response_time: string | null
          status: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          email?: string | null
          estimated_loss?: number | null
          id?: string
          leads_per_month?: number | null
          lost_clients_pct?: number | null
          name?: string | null
          niche?: string | null
          phone?: string | null
          response_time?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          email?: string | null
          estimated_loss?: number | null
          id?: string
          leads_per_month?: number | null
          lost_clients_pct?: number | null
          name?: string | null
          niche?: string | null
          phone?: string | null
          response_time?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          client_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          metrics: Json | null
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          sent_at: string | null
          service_id: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          client_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          service_id?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          client_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          service_id?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_conversations: {
        Row: {
          ai_agent_id: string | null
          channel: string
          created_at: string | null
          deal_value: number | null
          id: string
          last_message: string | null
          lead_id: string | null
          lead_name: string
          messages_count: number | null
          score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_agent_id?: string | null
          channel: string
          created_at?: string | null
          deal_value?: number | null
          id?: string
          last_message?: string | null
          lead_id?: string | null
          lead_name: string
          messages_count?: number | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_agent_id?: string | null
          channel?: string
          created_at?: string | null
          deal_value?: number | null
          id?: string
          last_message?: string | null
          lead_id?: string | null
          lead_name?: string
          messages_count?: number | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_conversations_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_messages: {
        Row: {
          content: string
          content_type: string | null
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          content_type?: string | null
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          content_type?: string | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "sales_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_deliverables: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          name: string
          result: string | null
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          name: string
          result?: string | null
          service_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string
          result?: string | null
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_deliverables_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          client_id: string | null
          config: Json | null
          created_at: string | null
          description: string | null
          end_date: string | null
          fee_gestao: number | null
          ia_agent: string | null
          id: string
          platform: string | null
          priority: string | null
          progress: number | null
          start_date: string | null
          status: string | null
          tasks_done: number | null
          tasks_total: number | null
          type: string
          updated_at: string | null
          verba: number | null
        }
        Insert: {
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          fee_gestao?: number | null
          ia_agent?: string | null
          id?: string
          platform?: string | null
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tasks_done?: number | null
          tasks_total?: number | null
          type: string
          updated_at?: string | null
          verba?: number | null
        }
        Update: {
          client_id?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          fee_gestao?: number | null
          ia_agent?: string | null
          id?: string
          platform?: string | null
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tasks_done?: number | null
          tasks_total?: number | null
          type?: string
          updated_at?: string | null
          verba?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          channels: Json | null
          client_id: string
          competitors: Json | null
          created_at: string | null
          funnel: Json | null
          id: string
          performance_data: Json | null
          recommendations: string[] | null
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          channels?: Json | null
          client_id: string
          competitors?: Json | null
          created_at?: string | null
          funnel?: Json | null
          id?: string
          performance_data?: Json | null
          recommendations?: string[] | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          channels?: Json | null
          client_id?: string
          competitors?: Json | null
          created_at?: string | null
          funnel?: Json | null
          id?: string
          performance_data?: Json | null
          recommendations?: string[] | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategies_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          gateway: string | null
          gateway_subscription_id: string | null
          id: string
          payment_method: string | null
          plan: string
          price: number
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          gateway?: string | null
          gateway_subscription_id?: string | null
          id?: string
          payment_method?: string | null
          plan?: string
          price?: number
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          gateway?: string | null
          gateway_subscription_id?: string | null
          id?: string
          payment_method?: string | null
          plan?: string
          price?: number
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tenant_services: {
        Row: {
          activated_at: string | null
          config: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          service_name: string
          tenant_id: string
        }
        Insert: {
          activated_at?: string | null
          config?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          service_name: string
          tenant_id: string
        }
        Update: {
          activated_at?: string | null
          config?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          service_name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          dominus_active: boolean
          dominus_plan: string | null
          id: string
          max_users: number | null
          name: string
          plan: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dominus_active?: boolean
          dominus_plan?: string | null
          id?: string
          max_users?: number | null
          name: string
          plan?: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dominus_active?: boolean
          dominus_plan?: string | null
          id?: string
          max_users?: number | null
          name?: string
          plan?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          accent_color: string | null
          config: Json | null
          created_at: string | null
          device_id: string | null
          font_size: string | null
          id: string
          synced_at: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          config?: Json | null
          created_at?: string | null
          device_id?: string | null
          font_size?: string | null
          id?: string
          synced_at?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          config?: Json | null
          created_at?: string | null
          device_id?: string | null
          font_size?: string | null
          id?: string
          synced_at?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "user"],
    },
  },
} as const
