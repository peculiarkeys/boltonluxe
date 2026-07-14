
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MemberStay {
  id: string;
  stay_id: string;
  member_id: string;
  member_name?: string;
  property: string;
  room_type: string;
  check_in: string;
  check_out: string;
  nights: number;
  points_earned: number;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface MemberService {
  id: string;
  service_id: string;
  member_id: string;
  member_name?: string;
  property: string;
  service_type: string;
  date: string;
  points_earned: number;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export const useLoyaltyActivities = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStays = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_stays')
        .select(`
          *,
          loyalty_members:member_id (name)
        `)
        .order('check_in', { ascending: false });

      if (error) throw error;

      // Format the data to include member_name
      const stays = data.map(stay => ({
        ...stay,
        member_name: stay.loyalty_members?.name || 'Unknown Member'
      }));
      
      return stays as MemberStay[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching stays',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_services')
        .select(`
          *,
          loyalty_members:member_id (name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      // Format the data to include member_name
      const services = data.map(service => ({
        ...service,
        member_name: service.loyalty_members?.name || 'Unknown Member'
      }));
      
      return services as MemberService[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching services',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberStays = async (memberId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_stays')
        .select(`
          *,
          loyalty_members:member_id (name)
        `)
        .eq('member_id', memberId)
        .order('check_in', { ascending: false });

      if (error) throw error;

      // Format the data to include member_name
      const stays = data.map(stay => ({
        ...stay,
        member_name: stay.loyalty_members?.name || 'Unknown Member'
      }));
      
      return stays as MemberStay[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching member stays',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberServices = async (memberId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_services')
        .select(`
          *,
          loyalty_members:member_id (name)
        `)
        .eq('member_id', memberId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Format the data to include member_name
      const services = data.map(service => ({
        ...service,
        member_name: service.loyalty_members?.name || 'Unknown Member'
      }));
      
      return services as MemberService[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching member services',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addStay = async (stay: Omit<MemberStay, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add the stay
      const { data, error } = await supabase
        .from('loyalty_stays')
        .insert([stay])
        .select();

      if (error) throw error;
      
      // Add points transaction
      if (stay.points_earned > 0) {
        await supabase
          .from('loyalty_point_transactions')
          .insert([{
            member_id: stay.member_id,
            amount: stay.points_earned,
            type: 'Earn',
            description: `Stay at ${stay.property} - ${stay.room_type}`,
            date: new Date().toISOString()
          }]);
        
        // Update member's points and stays count
        await supabase.rpc('update_member_stays', {
          p_member_id: stay.member_id,
          p_points: stay.points_earned,
          p_amount: stay.amount
        });
      }
      
      toast({
        title: 'Stay recorded',
        description: 'The member stay has been successfully recorded.',
      });
      
      return data[0] as MemberStay;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error recording stay',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addService = async (service: Omit<MemberService, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add the service
      const { data, error } = await supabase
        .from('loyalty_services')
        .insert([service])
        .select();

      if (error) throw error;
      
      // Add points transaction
      if (service.points_earned > 0) {
        await supabase
          .from('loyalty_point_transactions')
          .insert([{
            member_id: service.member_id,
            amount: service.points_earned,
            type: 'Earn',
            description: `${service.service_type} at ${service.property}`,
            date: new Date().toISOString()
          }]);
        
        // Update member's points
        await supabase.rpc('update_member_points', {
          p_member_id: service.member_id,
          p_points: service.points_earned
        });
      }
      
      toast({
        title: 'Service recorded',
        description: 'The member service has been successfully recorded.',
      });
      
      return data[0] as MemberService;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error recording service',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportStaysToCSV = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stays = await fetchStays();
      
      if (stays.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No data to export',
          description: 'There are no stays to export.',
        });
        setIsLoading(false);
        return;
      }

      // Convert to CSV
      const headers = ['Stay ID', 'Member Name', 'Property', 'Room Type', 'Check-in', 'Check-out', 'Nights', 'Points Earned', 'Amount'];
      const csvRows = [
        headers.join(','),
        ...stays.map(stay => [
          stay.stay_id,
          `"${(stay.member_name || '').replace(/"/g, '""')}"`,
          `"${stay.property.replace(/"/g, '""')}"`,
          `"${stay.room_type.replace(/"/g, '""')}"`,
          new Date(stay.check_in).toLocaleDateString(),
          new Date(stay.check_out).toLocaleDateString(),
          stay.nights,
          stay.points_earned,
          stay.amount.toFixed(2)
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `loyalty_stays_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Stays data has been exported to CSV.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error exporting stays',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportServicesToCSV = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const services = await fetchServices();
      
      if (services.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No data to export',
          description: 'There are no services to export.',
        });
        setIsLoading(false);
        return;
      }

      // Convert to CSV
      const headers = ['Service ID', 'Member Name', 'Property', 'Service Type', 'Date', 'Points Earned', 'Amount'];
      const csvRows = [
        headers.join(','),
        ...services.map(service => [
          service.service_id,
          `"${(service.member_name || '').replace(/"/g, '""')}"`,
          `"${service.property.replace(/"/g, '""')}"`,
          `"${service.service_type.replace(/"/g, '""')}"`,
          new Date(service.date).toLocaleDateString(),
          service.points_earned,
          service.amount.toFixed(2)
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `loyalty_services_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Services data has been exported to CSV.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error exporting services',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchStays,
    fetchServices,
    fetchMemberStays,
    fetchMemberServices,
    addStay,
    addService,
    exportStaysToCSV,
    exportServicesToCSV
  };
};
