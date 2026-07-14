
import type { Database } from '@/integrations/supabase/types';

// Type definitions for database entities
export type Booking = {
  id: string;
  booking_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  room_number?: string;
  room_type?: string;
  check_in: string; // Changed from string | Date to string only
  check_out: string; // Changed from string | Date to string only
  nights: number;
  total_amount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  payment_status?: string;
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
};

export type Guest = {
  id: string;
  guest_id: string;
  name: string;
  email?: string;
  phone?: string;
  nationality?: string;
  address?: string;
  passport_number?: string;
  status: 'active' | 'blacklisted' | 'vip';
  preferences?: string;
  total_stays?: number;
  total_spent?: number;
  loyalty_points?: number;
  last_stay?: string | Date;
  created_at?: string;
  updated_at?: string;
};

export type Room = {
  id: string;
  room_id: string;
  room_number: string;
  name?: string;
  type: string;
  floor?: string;
  status: string;
  rate: number;
  max_occupancy: number;
  amenities?: Record<string, any>;
  description?: string;
  maintenance?: boolean;
  smoke_detector?: boolean;
  fire_extinguisher?: boolean;
  last_cleaned?: string | Date;
  last_maintenance?: string | Date;
  created_at?: string;
  updated_at?: string;
};

export type Event = {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  start_date: string | Date;
  end_date: string | Date;
  location?: string;
  organizer?: string;
  attendees?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Campaign = {
  id: string;
  name: string;
  type: string;
  status: string;
  budget?: number;
  spent?: number;
  start_date?: string | Date;
  end_date?: string | Date;
  progress?: number;
  property?: string;
  audience?: string;
  owner?: string;
  created_at?: string;
  updated_at?: string;
};

export type SocialMediaPost = {
  id: string;
  content: string;
  platform: string;
  status: string;
  publish_date?: string | Date;
  image_url?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  property?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
};

export type ContentItem = {
  id: string;
  title: string;
  date: string | Date;
  type: string;
  platform?: string;
  status: string;
  property?: string;
  assignee?: string;
  created_at?: string;
  updated_at?: string;
};
