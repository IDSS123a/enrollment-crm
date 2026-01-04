export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
export type AppRole = 'admin' | 'manager' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  budget: number;
  spent: number;
  leads_count: number;
  conversions: number;
  revenue: number;
  start_date: string | null;
  end_date: string | null;
  channels: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  type: string;
  icon: string;
  related_id: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface DashboardStats {
  totalLeads: number;
  conversionRate: number;
  activeCampaigns: number;
  revenue: number;
  leadsThisMonth: number;
  conversionsThisMonth: number;
}

export interface ChartDataPoint {
  name: string;
  leads: number;
  conversions: number;
}
