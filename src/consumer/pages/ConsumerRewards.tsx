import React, { useState, useEffect } from 'react';
import { Gift, ArrowUpRight, Loader2, CheckCircle2, Ticket, Clock, XCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';
import { useLoyaltyRedemptions } from '@/hooks/loyalty/useLoyaltyRedemptions';
import { getLuxePointsReferenceValue, formatNairaValue } from '@/hooks/loyalty/loyaltyUtils';
import { LoyaltyReward } from '@/hooks/loyalty/useLoyaltyRewards';

const ConsumerRewards = () => {
  const { user } = useConsumerAuth();
  const [points, setPoints] = useState(0);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'my_redemptions'>('available');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Modals state
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [successRedemption, setSuccessRedemption] = useState<any | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const { redeemReward, fetchConsumerRedemptions } = useLoyaltyRedemptions();
  
  const fetchMemberAndData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      // Fetch member profile
      const { data: allMembers } = await supabase.rpc('get_all_loyalty_members');
      const member = allMembers?.find((m: any) => m.email === user.email);
      
      let mId = null;
      if (member) {
        setPoints(member.points || 0);
        setMemberId(member.id);
        mId = member.id;
      }

      // Fetch active rewards
      const { data: rewardsData } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('status', 'Active')
        .order('points_cost', { ascending: true });

      if (rewardsData) {
        setRewards(rewardsData as LoyaltyReward[]);
      }

      if (mId) {
        const reds = await fetchConsumerRedemptions(mId);
        setRedemptions(reds || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberAndData();
  }, [user]);

  const handleConfirmRedeem = async () => {
    if (!memberId || !selectedReward) return;
    
    setIsRedeeming(true);
    try {
      const result: any = await redeemReward(memberId, selectedReward.id);
      setPoints(result.balance_after);
      setSuccessRedemption(result);
      setSelectedReward(null);
      
      // Refresh redemptions list
      const reds = await fetchConsumerRedemptions(memberId);
      setRedemptions(reds || []);
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  // Category mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Room': return '🛏️';
      case 'Room Upgrade': return '⭐';
      case 'Stay Credit': return '💳';
      case 'Stay Experience': return '✨';
      default: return '🎁';
    }
  };

  // Filter out non-stay categories
  const allowedCategories = ['Room', 'Room Upgrade', 'Stay Credit', 'Stay Experience'];
  const filteredRewards = rewards.filter(r => 
    allowedCategories.includes(r.category) && 
    (categoryFilter === 'All' || r.category === categoryFilter)
  );

  const referenceValue = getLuxePointsReferenceValue(points);

  if (loading) return <div className="p-8 text-center text-zinc-500 font-sans font-medium">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-800 leading-tight">
            Rewards
          </h1>
          <p className="text-zinc-600 mt-2 text-base font-normal leading-relaxed">
            Redeem your points for unforgettable moments and exclusive perks during your stay.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full inline-flex">
            <Info size={14} />
            <span>Luxe Points have no cash value. Reference values are for comparison only.</span>
          </div>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-zinc-200 shadow-sm flex flex-col md:items-end gap-1">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Available Balance</p>
          <p className="text-3xl font-semibold text-zinc-800">{points.toLocaleString()} <span className="text-lg font-normal text-zinc-500">pts</span></p>
          <p className="text-sm font-medium text-emerald-600">≈ {formatNairaValue(referenceValue)}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto border-b border-zinc-200 flex gap-8">
        <button 
          onClick={() => setActiveTab('available')}
          className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'available' ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Available Rewards
        </button>
        <button 
          onClick={() => setActiveTab('my_redemptions')}
          className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'my_redemptions' ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          My Redemptions
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', ...allowedCategories].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${categoryFilter === cat ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.length === 0 ? (
              <div className="col-span-full bg-white rounded-[2rem] p-12 text-center border border-zinc-200 shadow-sm">
                <Gift className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
                <p className="text-zinc-600 font-medium">No rewards available in this category.</p>
              </div>
            ) : filteredRewards.map((reward) => {
              const canAfford = points >= reward.points_cost;
              
              return (
                <div 
                  key={reward.id} 
                  className={`bg-white rounded-[2rem] p-8 border shadow-sm flex flex-col h-full transition-all duration-300 group ${
                    canAfford ? 'border-zinc-200 hover:shadow-md hover:-translate-y-1' : 'border-zinc-100 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-2xl ${canAfford ? 'bg-zinc-100 group-hover:bg-zinc-800' : 'bg-zinc-50'}`}>
                      {getCategoryIcon(reward.category)}
                    </div>
                    {canAfford && (
                      <button 
                        onClick={() => setSelectedReward(reward)}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:border-zinc-800 group-hover:bg-zinc-800 group-hover:text-white transition-all cursor-pointer"
                      >
                        <ArrowUpRight size={14} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-800 mb-3">{reward.name}</h3>
                  <p className="text-zinc-600 font-normal text-sm flex-1 leading-relaxed">{reward.description}</p>
                  
                  <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-800">{reward.points_cost.toLocaleString()} <span className="text-xs font-medium text-zinc-500">pts</span></div>
                      {reward.reference_naira_value && (
                        <div className="text-xs text-zinc-500 mt-1">≈ {formatNairaValue(reward.reference_naira_value)}</div>
                      )}
                    </div>
                    {canAfford ? (
                      <button 
                        onClick={() => setSelectedReward(reward)}
                        className="text-xs uppercase tracking-widest text-zinc-500 font-medium hover:text-zinc-800 transition-colors cursor-pointer"
                      >
                        Redeem
                      </button>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium block">Locked</span>
                        <span className="text-xs text-zinc-500 mt-1">Need {(reward.points_cost - points).toLocaleString()} more</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'my_redemptions' && (
        <div className="max-w-6xl mx-auto">
          {redemptions.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-zinc-200 shadow-sm">
              <Ticket className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1} />
              <p className="text-zinc-600 font-medium">You haven't redeemed any rewards yet.</p>
              <button 
                onClick={() => setActiveTab('available')}
                className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                Browse Rewards
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redemptions.map((red) => (
                <div key={red.id} className="bg-white rounded-[1.5rem] p-6 border border-zinc-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {red.status === 'AVAILABLE' && <Ticket className="text-emerald-500" size={20} />}
                      {red.status === 'USED' && <CheckCircle2 className="text-zinc-400" size={20} />}
                      {red.status === 'CANCELLED' && <XCircle className="text-red-400" size={20} />}
                      {red.status === 'EXPIRED' && <Clock className="text-amber-500" size={20} />}
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{red.status}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">{new Date(red.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-zinc-800 mb-1">{red.loyalty_rewards?.name || 'Unknown Reward'}</h3>
                  <p className="text-sm text-zinc-600 mb-4">{red.points_spent.toLocaleString()} pts</p>
                  
                  <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex justify-center items-center">
                    <span className={`font-mono text-xl tracking-wider ${red.status === 'AVAILABLE' ? 'text-zinc-800 font-semibold' : 'text-zinc-400 line-through'}`}>
                      {red.redemption_code}
                    </span>
                  </div>
                  
                  {red.status === 'AVAILABLE' && (
                    <p className="text-xs text-center text-zinc-500 mt-4">Present this code to hotel staff to claim.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-semibold text-zinc-800 mb-2">Confirm Redemption</h2>
            <p className="text-zinc-600 mb-6 font-normal">Are you sure you want to redeem your points for this reward?</p>
            
            <div className="bg-zinc-50 rounded-2xl p-5 mb-8 border border-zinc-100">
              <h3 className="font-semibold text-zinc-800 mb-1">{selectedReward.name}</h3>
              <p className="text-sm text-zinc-600 mb-4">{selectedReward.description}</p>
              
              <div className="flex justify-between items-center text-sm border-t border-zinc-200 pt-3">
                <span className="text-zinc-500 font-medium">Cost</span>
                <span className="font-semibold text-zinc-800">{selectedReward.points_cost.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-zinc-500 font-medium">Balance After</span>
                <span className="font-semibold text-zinc-800">{(points - selectedReward.points_cost).toLocaleString()} pts</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedReward(null)}
                className="flex-1 px-6 py-3 rounded-full border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                disabled={isRedeeming}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRedeem}
                className="flex-1 px-6 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors flex justify-center items-center"
                disabled={isRedeeming}
              >
                {isRedeeming ? <Loader2 className="animate-spin" size={20} /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successRedemption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-800 mb-2">Success!</h2>
            <p className="text-zinc-600 mb-6 font-normal">You have successfully redeemed <strong>{successRedemption.reward_name}</strong>.</p>
            
            <div className="bg-zinc-50 rounded-2xl p-6 mb-8 border border-zinc-100">
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-2">Your Redemption Code</p>
              <p className="font-mono text-3xl font-semibold text-zinc-800 tracking-wider">
                {successRedemption.redemption_code}
              </p>
            </div>
            
            <p className="text-sm text-zinc-500 mb-8 px-4">
              Please present this code to our hotel staff during your stay to claim your reward. You can always view this code in the "My Redemptions" tab.
            </p>
            
            <button 
              onClick={() => {
                setSuccessRedemption(null);
                setActiveTab('my_redemptions');
              }}
              className="w-full px-6 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
            >
              View My Redemptions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerRewards;
