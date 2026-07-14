
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoyaltyReward {
  id: string;
  reward_id: string;
  name: string;
  description: string;
  points_cost: number;
  category: 'Room' | 'Dining' | 'Wellness' | 'Transportation' | 'Experience';
  availability: string;
  status: 'Active' | 'Inactive' | 'Seasonal';
  created_at?: string;
  updated_at?: string;
}

export const useLoyaltyRewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LoyaltyReward[];
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching rewards',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRewardById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as LoyaltyReward;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching reward',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createReward = async (reward: Omit<LoyaltyReward, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a reward_id if not provided
      if (!reward.reward_id) {
        reward.reward_id = `REW-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      }
      
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .insert([reward])
        .select();

      if (error) throw error;
      
      toast({
        title: 'Reward created',
        description: 'The loyalty reward has been successfully created.',
      });
      
      return data[0] as LoyaltyReward;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error creating reward',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReward = async (id: string, reward: Partial<LoyaltyReward>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .update(reward)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: 'Reward updated',
        description: 'The loyalty reward has been successfully updated.',
      });
      
      return data[0] as LoyaltyReward;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error updating reward',
        description: err.message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReward = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('loyalty_rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Reward deleted',
        description: 'The loyalty reward has been successfully deleted.',
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting reward',
        description: err.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportRewardsToCSV = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rewards = await fetchRewards();
      
      if (rewards.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No data to export',
          description: 'There are no rewards to export.',
        });
        setIsLoading(false);
        return;
      }

      // Convert to CSV
      const headers = ['Reward ID', 'Name', 'Category', 'Points Cost', 'Status', 'Description', 'Availability'];
      const csvRows = [
        headers.join(','),
        ...rewards.map(reward => [
          reward.reward_id,
          `"${reward.name.replace(/"/g, '""')}"`,
          reward.category,
          reward.points_cost,
          reward.status,
          `"${(reward.description || '').replace(/"/g, '""')}"`,
          `"${(reward.availability || '').replace(/"/g, '""')}"`
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `loyalty_rewards_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Rewards data has been exported to CSV.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error exporting rewards',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchRewards,
    fetchRewardById,
    createReward,
    updateReward,
    deleteReward,
    exportRewardsToCSV
  };
};
