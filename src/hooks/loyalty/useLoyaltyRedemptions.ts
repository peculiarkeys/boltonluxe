import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Redemption = Database['public']['Tables']['loyalty_reward_redemptions']['Row'];

export const useLoyaltyRedemptions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const redeemReward = async (memberId: string, rewardId: string, propertyId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc('redeem_reward', {
        p_member_id: memberId,
        p_reward_id: rewardId,
        p_property_id: propertyId
      });

      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err; // Let caller handle the specific error message (e.g. insufficient points)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConsumerRedemptions = async (memberId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .select(`
          *,
          loyalty_rewards (
            name,
            description,
            category
          )
        `)
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching redemptions',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchByCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .select(`
          *,
          loyalty_members (
            name,
            email,
            phone,
            tier
          ),
          loyalty_rewards (
            name,
            description,
            points_cost
          )
        `)
        .eq('redemption_code', code)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error finding redemption',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminRedemptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .select(`
          *,
          loyalty_members (
            name,
            email,
            tier
          ),
          loyalty_rewards (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching redemptions',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const markAsUsed = async (id: string, adminId: string, propertyId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .update({
          status: 'USED',
          used_at: new Date().toISOString(),
          used_by: adminId,
          property_id: propertyId || null
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: 'Redemption Used',
        description: 'Successfully marked redemption as used.',
      });
      
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error updating redemption',
        description: err.message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRedemption = async (id: string, adminId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTE: Canceling a redemption should typically refund points.
      // For this phase, we are just marking the status. Refunding points
      // would require a reversal ledger entry.
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .update({
          status: 'CANCELLED',
          metadata: { cancelled_by: adminId, cancelled_at: new Date().toISOString() }
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: 'Redemption Cancelled',
        description: 'Successfully cancelled redemption.',
      });
      
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error cancelling redemption',
        description: err.message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    redeemReward,
    fetchConsumerRedemptions,
    searchByCode,
    fetchAdminRedemptions,
    markAsUsed,
    cancelRedemption
  };
};
