
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoyaltyMember } from './useLoyaltyMembers';
import { toast } from 'sonner';

export interface LoyaltyService {
  id: string;
  service_id: string;
  member_id: string;
  memberName?: string;
  service_type: string;
  amount: number;
  property: string;
  date: string;
  points_earned: number;
  created_at?: string;
  updated_at?: string;
}

export const useLoyaltyServices = () => {
  const [services, setServices] = useState<LoyaltyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // Fetch services with member data
      const { data: servicesData, error: servicesError } = await supabase
        .from('loyalty_services')
        .select('*')
        .order('date', { ascending: false });

      if (servicesError) throw servicesError;

      // Fetch member data to get names
      const { data: membersData, error: membersError } = await supabase
        .from('loyalty_members')
        .select('id, name');

      if (membersError) throw membersError;

      // Create a map of member IDs to names
      const memberMap = new Map();
      membersData.forEach(member => {
        memberMap.set(member.id, member.name);
      });

      // Combine the data
      const servicesWithNames = servicesData.map(service => ({
        ...service,
        memberName: memberMap.get(service.member_id) || 'Unknown Member'
      }));

      setServices(servicesWithNames);
    } catch (error) {
      console.error('Error fetching loyalty services:', error);
      toast.error('Failed to load loyalty services');
    } finally {
      setIsLoading(false);
    }
  };

  const addService = async (serviceData: Omit<LoyaltyService, 'id' | 'points_earned'>) => {
    try {
      // Calculate points earned (simple calculation: 1 point per dollar)
      const pointsEarned = Math.floor(serviceData.amount);
      
      // Insert service
      const { data, error } = await supabase
        .from('loyalty_services')
        .insert([{ 
          ...serviceData, 
          service_id: `SRV-${Date.now()}`,
          points_earned: pointsEarned 
        }])
        .select();

      if (error) throw error;

      // Update member points
      const { error: updateError } = await supabase
        .rpc('update_member_points', { 
          p_member_id: serviceData.member_id, 
          p_points: pointsEarned 
        });

      if (updateError) throw updateError;
      
      // Fetch the member name
      const { data: memberData, error: memberError } = await supabase
        .from('loyalty_members')
        .select('name')
        .eq('id', serviceData.member_id)
        .single();

      if (memberError) throw memberError;

      // Add the new service with the member name
      setServices(prev => [
        { 
          ...data[0], 
          memberName: memberData.name 
        } as LoyaltyService, 
        ...prev
      ]);

      toast.success('Service added successfully');
      return data[0];
    } catch (error) {
      console.error('Error adding loyalty service:', error);
      toast.error('Failed to add service');
      throw error;
    }
  };

  const refreshServices = () => {
    fetchServices();
  };

  // Load services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    addService,
    refreshServices
  };
};
