import React, { useState, useEffect } from 'react';
import { Gift, ArrowUpRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';

interface Reward {
  id: string;
  reward_id: string;
  name: string;
  description: string | null;
  points_cost: number;
  category: string;
  status: string;
  availability: string | null;
}

const ConsumerRewards = () => {
  const { user } = useConsumerAuth();
  const [points, setPoints] = useState(0);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) {
          return;
        }

        // Fetch member profile
        const { data: allMembers, error } = await supabase.rpc('get_all_loyalty_members');
        let member = null;
        if (allMembers && allMembers.length > 0) {
          member = allMembers.find((m: any) => m.email === user.email);
        }
        
        if (member) {
          setPoints(member.points || 0);
          setMemberId(member.id);
        }

        // Fetch real rewards from database
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('loyalty_rewards')
          .select('*')
          .eq('status', 'Active')
          .order('points_cost', { ascending: true });

        if (!rewardsError && rewardsData) {
          setRewards(rewardsData as Reward[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRedeem = async (reward: Reward) => {
    if (!memberId || points < reward.points_cost || redeemingId) return;
    
    setRedeemingId(reward.id);
    try {
      // 1. Deduct points via RPC
      const { error: pointsError } = await supabase.rpc('update_member_points', {
        p_member_id: memberId,
        p_points: -reward.points_cost,
      });
      if (pointsError) throw pointsError;

      // 2. Create redemption record
      const { error: redemptionError } = await supabase
        .from('loyalty_reward_redemptions')
        .insert([{
          member_id: memberId,
          reward_id: reward.id,
          redemption_id: `RED-${Date.now()}`,
          status: 'Pending',
          date: new Date().toISOString(),
        }]);
      if (redemptionError) console.error('Redemption record error:', redemptionError);

      // 3. Log the point transaction
      await supabase.from('loyalty_point_transactions').insert([{
        member_id: memberId,
        amount: -reward.points_cost,
        type: 'redeemed',
        description: `Redeemed: ${reward.name}`,
        date: new Date().toISOString(),
      }]);

      // 4. Update local state
      setPoints(prev => prev - reward.points_cost);
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setRedeemingId(null);
    }
  };

  // Category icon mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Room': return '🛏️';
      case 'Dining': return '🍽️';
      case 'Wellness': return '💆';
      case 'Transportation': return '🚗';
      case 'Experience': return '✨';
      default: return '🎁';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400 font-normal">Loading...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-700 leading-tight">
            Curated experiences
          </h1>
          <p className="text-gray-500 mt-4 text-lg font-normal leading-relaxed">
            Redeem your points for unforgettable moments and exclusive perks during your stay.
          </p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <Gift className="text-gray-400" strokeWidth={1.5} size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">Available Balance</p>
            <p className="text-2xl font-normal text-gray-700">{points.toLocaleString()} pts</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {rewards.length === 0 ? (
          <div className="col-span-full bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
            <Gift className="mx-auto text-gray-300 mb-4" size={48} strokeWidth={1} />
            <p className="text-gray-500 font-medium">No rewards available at the moment.</p>
            <p className="text-gray-400 text-sm mt-1 font-normal">Check back soon for exciting new rewards!</p>
          </div>
        ) : rewards.map((reward) => {
          const canAfford = points >= reward.points_cost;
          const isRedeeming = redeemingId === reward.id;
          
          return (
            <div 
              key={reward.id} 
              className={`bg-white rounded-[2rem] p-8 border shadow-sm flex flex-col h-full transition-all duration-300 group ${
                canAfford ? 'border-gray-100 hover:shadow-md hover:-translate-y-1' : 'border-gray-50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-2xl ${canAfford ? 'bg-gray-50 group-hover:bg-gray-800' : 'bg-gray-50'}`}>
                  {getCategoryIcon(reward.category)}
                </div>
                {canAfford && !isRedeeming && (
                  <button 
                    onClick={() => handleRedeem(reward)}
                    className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-all"
                  >
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </button>
                )}
                {isRedeeming && (
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">{reward.name}</h3>
              <p className="text-gray-500 font-normal text-sm flex-1 leading-relaxed">{reward.description}</p>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="font-medium text-gray-700">{reward.points_cost.toLocaleString()} <span className="text-sm text-gray-400">pts</span></span>
                {isRedeeming ? (
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Redeeming...</span>
                ) : canAfford ? (
                  <button 
                    onClick={() => handleRedeem(reward)}
                    className="text-xs uppercase tracking-widest text-gray-400 font-medium group-hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                ) : (
                  <span className="text-xs uppercase tracking-widest text-gray-300 font-medium">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsumerRewards;
