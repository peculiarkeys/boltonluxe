import React, { useState, useEffect } from 'react';
import { Gift, Coffee, Utensils, BedDouble, Zap, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Rewards = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        if (!user?.email) {
          return;
        }
        const { data } = await supabase
          .from('loyalty_members')
          .select('points')
          .eq('email', user.email)
          .single();
        
        if (data) {
          setPoints(data.points);
        }
      } catch (error) {
        console.error('Error fetching points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user]);

  const rewards = [
    { id: 1, title: 'Complimentary Breakfast', points: 1500, icon: Coffee, description: 'Enjoy a free artisan breakfast for two during your stay.' },
    { id: 2, title: 'Room Upgrade', points: 5000, icon: BedDouble, description: 'Upgrade to the next available room category upon check-in.' },
    { id: 3, title: 'Spa Session (60m)', points: 8000, icon: Zap, description: 'A relaxing 60-minute massage at our luxury spa.' },
    { id: 4, title: 'Fine Dining Experience', points: 12000, icon: Utensils, description: 'A multi-course dinner at our Michelin-starred restaurant.' },
    { id: 5, title: 'Free Weekend Night', points: 25000, icon: Gift, description: 'Redeem a free night stay at any Bolton Luxe property.' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-400 font-normal">Loading...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-800 leading-tight">
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
            <p className="text-2xl font-normal text-gray-800">{points.toLocaleString()} pts</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {rewards.map((reward) => {
          const Icon = reward.icon;
          const canAfford = points >= reward.points;
          
          return (
            <div 
              key={reward.id} 
              className={`bg-white rounded-[2rem] p-8 border shadow-sm flex flex-col h-full transition-all duration-300 group ${
                canAfford ? 'border-gray-100 hover:shadow-md hover:-translate-y-1' : 'border-gray-50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${canAfford ? 'bg-gray-50 text-gray-800 group-hover:bg-gray-900 group-hover:text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                {canAfford && (
                  <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all">
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3">{reward.title}</h3>
              <p className="text-gray-500 font-normal text-sm flex-1 leading-relaxed">{reward.description}</p>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="font-medium text-gray-800">{reward.points.toLocaleString()} <span className="text-sm text-gray-400">pts</span></span>
                {canAfford ? (
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-medium group-hover:text-gray-900 transition-colors">Redeem</span>
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

export default Rewards;
