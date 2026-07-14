
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PointTransaction {
  id: string;
  member_id: string;
  memberName?: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  date: string;
  created_at?: string;
}

export interface PointsSummary {
  totalIssued: number;
  totalRedeemed: number;
  currentOutstanding: number;
  monthlyGrowth: number;
  redemptionRate: number;
}

export const useLoyaltyPoints = () => {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<PointsSummary>({
    totalIssued: 0,
    totalRedeemed: 0,
    currentOutstanding: 0,
    monthlyGrowth: 0,
    redemptionRate: 25 // Default value: 25 points = $1
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_point_transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch member data
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
      const transactionsWithNames = transactionsData.map(transaction => ({
        ...transaction,
        memberName: memberMap.get(transaction.member_id) || 'Unknown Member'
      }));

      setTransactions(transactionsWithNames);
      
      // Calculate summary data
      await fetchPointsSummary();
    } catch (error) {
      console.error('Error fetching loyalty points transactions:', error);
      toast.error('Failed to load loyalty points data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPointsSummary = async () => {
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_point_transactions')
        .select('*');

      if (transactionsError) throw transactionsError;

      // Calculate totals
      const totalIssued = transactionsData
        .filter(t => t.type === 'earned')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalRedeemed = transactionsData
        .filter(t => t.type === 'redeemed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const currentOutstanding = totalIssued - totalRedeemed;
      
      // Calculate monthly growth
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyGrowth = transactionsData
        .filter(t => t.type === 'earned' && new Date(t.date) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);

      setSummary({
        totalIssued,
        totalRedeemed,
        currentOutstanding,
        monthlyGrowth,
        redemptionRate: 25 // Default value: 25 points = $1
      });

      return {
        totalIssued,
        totalRedeemed,
        currentOutstanding,
        monthlyGrowth,
        redemptionRate: 25
      };
    } catch (error) {
      console.error('Error calculating loyalty points summary:', error);
      return {
        totalIssued: 0,
        totalRedeemed: 0,
        currentOutstanding: 0,
        monthlyGrowth: 0,
        redemptionRate: 25
      };
    }
  };

  const addTransaction = async (transactionData: {
    member_id: string;
    amount: number;
    type: 'earned' | 'redeemed';
    description: string;
  }) => {
    try {
      // Insert transaction
      const { data, error } = await supabase
        .from('loyalty_point_transactions')
        .insert([{
          ...transactionData,
          date: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      // Update member points
      const pointsChange = transactionData.type === 'earned' 
        ? transactionData.amount 
        : -transactionData.amount;

      const { error: updateError } = await supabase
        .rpc('update_member_points', {
          p_member_id: transactionData.member_id,
          p_points: pointsChange
        });

      if (updateError) throw updateError;

      // Fetch the member name
      const { data: memberData, error: memberError } = await supabase
        .from('loyalty_members')
        .select('name')
        .eq('id', transactionData.member_id)
        .single();

      if (memberError) throw memberError;

      // Add to local state
      setTransactions(prev => [
        {
          ...data[0],
          memberName: memberData.name
        } as PointTransaction,
        ...prev
      ]);

      // Update summary
      fetchPointsSummary();

      toast.success(
        transactionData.type === 'earned'
          ? 'Points awarded successfully'
          : 'Points redeemed successfully'
      );

      return data[0];
    } catch (error) {
      console.error('Error processing points transaction:', error);
      toast.error(`Failed to ${transactionData.type === 'earned' ? 'award' : 'redeem'} points`);
      throw error;
    }
  };

  const refreshTransactions = () => {
    fetchTransactions();
  };

  // Load data on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    summary,
    addTransaction,
    refreshTransactions
  };
};
