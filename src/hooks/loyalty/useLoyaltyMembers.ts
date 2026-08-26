import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoyaltyMember {
  id: string;
  member_id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Standard';
  points: number;
  join_date: string;
  stays: number;
  status: 'Active' | 'Inactive' | 'Pending';
  address?: string;
  birthdate?: string;
  preferences?: string;
  created_at?: string;
  updated_at?: string;
}

export const useLoyaltyMembers = () => {
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('get_all_loyalty_members');

      if (error) throw error;
      
      setMembers(data as LoyaltyMember[]);
      return data as LoyaltyMember[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching members',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMemberById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: allMembers, error } = await supabase
        .rpc('get_all_loyalty_members');

      if (error) throw error;
      const data = allMembers?.find((m: any) => m.id === id);
      if (!data) throw new Error('Member not found');

      if (error) throw error;
      return data as LoyaltyMember;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching member',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createMember = async (member: Omit<LoyaltyMember, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_members')
        .insert([{ 
          ...member,
          join_date: member.join_date || new Date().toISOString().split('T')[0],
        }])
        .select();

      if (error) throw error;
      
      toast({
        title: 'Member created',
        description: 'The loyalty member has been successfully created.',
      });
      
      return data[0] as LoyaltyMember;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error creating member',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMember = async (id: string, member: Partial<LoyaltyMember>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a clean payload for update, excluding points to enforce RPC
      const { id: _id, created_at, updated_at, points, ...cleanData } = member as any;
      
      // Ensure numeric fields are cast to numbers
      if (cleanData.stays !== undefined) cleanData.stays = Number(cleanData.stays);

      const { data, error } = await supabase
        .from('loyalty_members')
        .update(cleanData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Fallback to RPC if direct update fails due to RLS
        if (cleanData.stays !== undefined) {
           await supabase.rpc('update_member_stays', { p_member_id: id, p_points: 0, p_amount: cleanData.stays });
        }
        
        // Re-fetch to get the updated data
        const { data: refreshed } = await supabase.rpc('get_all_loyalty_members');
        const updatedMember = refreshed?.find((m: any) => m.id === id);
        
        toast({
          title: 'Member updated',
          description: 'The loyalty member has been successfully updated.',
        });
        return updatedMember as LoyaltyMember;
      }
      
      toast({
        title: 'Member updated',
        description: 'The loyalty member has been successfully updated.',
      });
      
      return data[0] as LoyaltyMember;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error updating member',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('loyalty_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Member deleted',
        description: 'The loyalty member has been successfully deleted.',
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting member',
        description: err.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adjustPoints = async (id: string, pointsToAdd: number, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('adjust_member_points', {
        p_member_id: id,
        p_points: pointsToAdd,
        p_description: reason,
        p_admin_id: 'ADMIN' // Could dynamically inject current user id if available
      });

      if (error) throw error;
      
      // Fetch updated member data to return
      const { data: refreshed } = await supabase.rpc('get_all_loyalty_members');
      const updatedMember = refreshed?.find((m: any) => m.id === id);
      
      toast({
        title: 'Points adjusted',
        description: `${Math.abs(pointsToAdd)} points ${pointsToAdd > 0 ? 'added to' : 'deducted from'} member's account.`,
      });
      
      return updatedMember as LoyaltyMember;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error adjusting points',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportMembersToCSV = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const members = await fetchMembers();
      
      if (members.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No data to export',
          description: 'There are no members to export.',
        });
        setIsLoading(false);
        return;
      }

      const headers = ['Member ID', 'Name', 'Email', 'Phone', 'Tier', 'Points', 'Stays', 'Status', 'Join Date', 'Address'];
      const csvRows = [
        headers.join(','),
        ...members.map(member => [
          member.member_id,
          `"${member.name.replace(/"/g, '""')}"`,
          member.email || '',
          member.phone || '',
          member.tier,
          member.points,
          member.stays,
          member.status,
          member.join_date,
          `"${(member.address || '').replace(/"/g, '""')}"`
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `loyalty_members_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Members data has been exported to CSV.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error exporting members',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    fetchMemberById,
    createMember,
    updateMember,
    deleteMember,
    adjustPoints,
    exportMembersToCSV
  };
};
