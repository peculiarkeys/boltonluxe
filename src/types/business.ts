
import type { Database } from '@/integrations/supabase/types';

export type RelationshipManager = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  status: 'active' | 'inactive';
  assigned_companies?: number;
  assigned_leads?: number;
  assigned_contacts?: number;
  assigned_opportunities?: number;
  last_activity_date?: string;
  created_at?: string;
  updated_at?: string;
};

export type Lead = {
  id: string;
  lead_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  value?: number;
  description?: string;
  assigned_to?: string;
  relationship_manager?: string;
  relationship_manager_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type Company = {
  id: string;
  company_id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  address?: string;
  revenue?: number;
  status: 'active' | 'inactive' | 'prospect' | 'client';
  notes?: string;
  assigned_to?: string;
  relationship_manager?: string;
  relationship_manager_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type Contact = {
  id: string;
  contact_id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: string;
  company_name?: string;
  status: 'active' | 'inactive';
  notes?: string;
  last_contact_date?: string;
  relationship_manager?: string;
  relationship_manager_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type Opportunity = {
  id: string;
  opportunity_id: string;
  name: string;
  company_id?: string;
  company_name?: string;
  contact_id?: string;
  contact_name?: string;
  value?: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability?: number;
  expected_close_date?: string;
  description?: string;
  assigned_to?: string;
  relationship_manager?: string;
  relationship_manager_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type DebtRecovery = {
  id: string;
  debt_id: string;
  company_id?: string;
  company_name?: string;
  contact_id?: string;
  contact_name?: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'in-collection' | 'written-off';
  description?: string;
  payment_history?: Record<string, any>;
  assigned_to?: string;
  relationship_manager?: string;
  relationship_manager_name?: string;
  created_at?: string;
  updated_at?: string;
};
