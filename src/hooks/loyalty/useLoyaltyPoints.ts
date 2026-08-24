
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const fetchPointsSummary = async (): Promise<PointsSummary> => {
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('loyalty_point_transactions')
      .select('*');

    if (transactionsError) throw transactionsError;

    const totalIssued = transactionsData
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRedeemed = transactionsData
      .filter(t => t.type === 'redeemed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentOutstanding = totalIssued - totalRedeemed;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyGrowth = transactionsData
      .filter(t => t.type === 'earned' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIssued,
      totalRedeemed,
      currentOutstanding,
      monthlyGrowth,
      redemptionRate: 25
    };
  };

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['loyalty_point_transactions'],
    queryFn: async () => {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_point_transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      const { data: membersData, error: membersError } = await supabase
        .from('loyalty_members')
        .select('id, name');

      if (membersError) throw membersError;

      const memberMap = new Map();
      membersData.forEach(member => {
        memberMap.set(member.id, member.name);
      });

      return transactionsData.map(transaction => ({
        ...transaction,
        memberName: memberMap.get(transaction.member_id) || 'Unknown Member'
      })) as PointTransaction[];
    }
  });

  const { data: summary = {
    totalIssued: 0,
    totalRedeemed: 0,
    currentOutstanding: 0,
    monthlyGrowth: 0,
    redemptionRate: 25
  }, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['loyalty_points_summary'],
    queryFn: fetchPointsSummary
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (transactionData: {
      member_id: string;
      amount: number;
      type: 'earned' | 'redeemed';
      description: string;
    }) => {
      const { data, error } = await supabase
        .from('loyalty_point_transactions')
        .insert([{
          ...transactionData,
          date: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      const pointsChange = transactionData.type === 'earned' 
        ? transactionData.amount 
        : -transactionData.amount;

      const { error: updateError } = await supabase
        .rpc('update_member_points', {
          p_member_id: transactionData.member_id,
          p_points: pointsChange
        });

      if (updateError) throw updateError;

      const { data: memberData, error: memberError } = await supabase
        .from('loyalty_members')
        .select('name')
        .eq('id', transactionData.member_id)
        .single();

      if (memberError) throw memberError;

      return {
        ...data[0],
        memberName: memberData.name
      } as PointTransaction;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['loyalty_point_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty_points_summary'] });
      toast.success(
        variables.type === 'earned'
          ? 'Points awarded successfully'
          : 'Points redeemed successfully'
      );
    },
    onError: (error, variables) => {
      console.error(error);
      toast.error(`Failed to ${variables.type === 'earned' ? 'award' : 'redeem'} points`);
    }
  });

  return {
    transactions,
    isLoading: isLoadingTransactions || isLoadingSummary,
    summary,
    addTransaction: addTransactionMutation.mutateAsync,
    refreshTransactions: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty_point_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty_points_summary'] });
    }
  };
};
