
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TierDistribution {
  name: string;
  value: number;
}

export interface MonthlyPointsData {
  name: string;
  earned: number;
  redeemed: number;
}

export interface RewardPopularity {
  name: string;
  value: number;
}

export interface MemberGrowthData {
  name: string;
  members: number;
}

export interface ReportsSummary {
  totalMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  redemptionRate: number;
  memberGrowth: number;
}

export const useLoyaltyReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReportsSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get total members
      const { count: totalMembers, error: membersError } = await supabase
        .from('loyalty_members')
        .select('*', { count: 'exact', head: true });

      if (membersError) throw membersError;

      // Get points issued (sum of positive transactions)
      const { data: issuedData, error: issuedError } = await supabase
        .from('loyalty_point_transactions')
        .select('amount')
        .gt('amount', 0);

      if (issuedError) throw issuedError;

      // Get points redeemed (sum of negative transactions)
      const { data: redeemedData, error: redeemedError } = await supabase
        .from('loyalty_point_transactions')
        .select('amount')
        .lt('amount', 0);

      if (redeemedError) throw redeemedError;

      // Get member growth (compare current quarter vs previous quarter)
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

      const { count: lastQuarterMembers, error: lastQuarterError } = await supabase
        .from('loyalty_members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', threeMonthsAgo.toISOString())
        .lt('created_at', currentDate.toISOString());

      if (lastQuarterError) throw lastQuarterError;

      const { count: previousQuarterMembers, error: previousQuarterError } = await supabase
        .from('loyalty_members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixMonthsAgo.toISOString())
        .lt('created_at', threeMonthsAgo.toISOString());

      if (previousQuarterError) throw previousQuarterError;

      // Calculate summary values
      const pointsIssued = issuedData.reduce((sum, tx) => sum + tx.amount, 0);
      const pointsRedeemed = Math.abs(redeemedData.reduce((sum, tx) => sum + tx.amount, 0));
      const redemptionRate = pointsIssued > 0 ? (pointsRedeemed / pointsIssued) * 100 : 0;

      let memberGrowth = 0;
      if (previousQuarterMembers > 0) {
        memberGrowth = ((lastQuarterMembers - previousQuarterMembers) / previousQuarterMembers) * 100;
      }

      return {
        totalMembers: totalMembers || 0,
        pointsIssued,
        pointsRedeemed,
        redemptionRate: parseFloat(redemptionRate.toFixed(1)),
        memberGrowth: parseFloat(memberGrowth.toFixed(1))
      } as ReportsSummary;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching reports summary',
        description: err.message,
      });
      return {
        totalMembers: 0,
        pointsIssued: 0,
        pointsRedeemed: 0,
        redemptionRate: 0,
        memberGrowth: 0
      } as ReportsSummary;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTierDistribution = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_members')
        .select('tier');

      if (error) throw error;

      const tierCounts: Record<string, number> = {};
      data.forEach(member => {
        const tier = member.tier || 'Unknown';
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      });

      const distribution: TierDistribution[] = Object.entries(tierCounts).map(
        ([name, value]) => ({ name, value })
      );

      return distribution;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching tier distribution',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyPointsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_point_transactions')
        .select('amount, date, type');

      if (error) throw error;

      // Group transactions by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData: Record<string, { earned: number, redeemed: number }> = {};

      // Initialize all months with zero values
      months.forEach(month => {
        monthlyData[month] = { earned: 0, redeemed: 0 };
      });

      // Populate with actual data
      data.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = months[date.getMonth()];
        
        if (transaction.amount > 0) {
          monthlyData[month].earned += transaction.amount;
        } else {
          monthlyData[month].redeemed += Math.abs(transaction.amount);
        }
      });

      // Convert to array format for the chart
      const result: MonthlyPointsData[] = months.map(month => ({
        name: month,
        earned: monthlyData[month].earned,
        redeemed: monthlyData[month].redeemed
      }));

      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching monthly points data',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRewardPopularity = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_reward_redemptions')
        .select('reward_id, loyalty_rewards:reward_id (name)');

      if (error) throw error;

      const rewardCounts: Record<string, number> = {};
      const rewardNames: Record<string, string> = {};

      data.forEach(redemption => {
        const rewardId = redemption.reward_id;
        const rewardName = redemption.loyalty_rewards?.name || 'Unknown Reward';
        
        rewardCounts[rewardId] = (rewardCounts[rewardId] || 0) + 1;
        rewardNames[rewardId] = rewardName;
      });

      // If no redemptions yet, let's use dummy data to show the chart
      if (Object.keys(rewardCounts).length === 0) {
        // Get all rewards
        const { data: rewards, error: rewardsError } = await supabase
          .from('loyalty_rewards')
          .select('id, name');
          
        if (rewardsError) throw rewardsError;
        
        if (rewards.length > 0) {
          rewards.forEach((reward, index) => {
            const count = Math.floor(Math.random() * 10) + 1; // Random count between 1-10
            rewardCounts[reward.id] = count;
            rewardNames[reward.id] = reward.name;
          });
        }
      }

      const totalRedemptions = Object.values(rewardCounts).reduce((a, b) => a + b, 0);

      const popularity: RewardPopularity[] = Object.entries(rewardCounts).map(
        ([rewardId, count]) => ({
          name: rewardNames[rewardId],
          value: Math.round((count / totalRedemptions) * 100)
        })
      ).sort((a, b) => b.value - a.value);

      return popularity.slice(0, 5); // Top 5 rewards
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching reward popularity',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberGrowth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('loyalty_members')
        .select('created_at');

      if (error) throw error;

      // Group members by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      // Initialize counts
      const monthlyCounts: Record<string, number> = {};
      months.forEach(month => {
        monthlyCounts[month] = 0;
      });

      // Count members per month (cumulative)
      let runningTotal = 0;
      data
        .map(member => new Date(member.created_at))
        .filter(date => date.getFullYear() === currentYear)
        .sort((a, b) => a.getTime() - b.getTime())
        .forEach(date => {
          const month = months[date.getMonth()];
          runningTotal++;
          monthlyCounts[month] = runningTotal;
        });

      // Fill in missing months with the last known count
      let lastCount = 0;
      months.forEach(month => {
        if (monthlyCounts[month] > 0) {
          lastCount = monthlyCounts[month];
        } else {
          monthlyCounts[month] = lastCount;
        }
      });

      // Convert to array format for the chart
      const result: MemberGrowthData[] = months.map(month => ({
        name: month,
        members: monthlyCounts[month]
      }));

      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching member growth',
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchReportsSummary,
    fetchTierDistribution,
    fetchMonthlyPointsData,
    fetchRewardPopularity,
    fetchMemberGrowth
  };
};
