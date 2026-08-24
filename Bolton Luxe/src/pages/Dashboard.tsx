import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Star, TrendingUp, Calendar as CalendarIcon, MapPin, Gift, ArrowUpRight } from 'lucide-react';
import LoyaltyCard from '../components/LoyaltyCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [upcomingStay, setUpcomingStay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.email) {
          setProfile({
            name: 'User',
            tier: 'Bronze',
            points: 0,
            nextTierPoints: 5000,
            stays: 0,
            rewardsUsed: 0
          });
          setUpcomingStay(null);
          return;
        }
        const { data, error } = await supabase
          .from('loyalty_members')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (data) {
          setProfile({
            name: data.name,
            tier: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
            points: data.points,
            nextTierPoints: data.tier === 'bronze' ? 5000 : data.tier === 'silver' ? 15000 : 50000,
            stays: data.stays || 0,
            rewardsUsed: 0, // Will be fetched from redemptions table in future
            memberId: data.member_id
          });

          // Fetch upcoming stay
          const { data: staysData } = await supabase
            .from('loyalty_stays')
            .select('*')
            .eq('member_id', data.id)
            .gte('check_in', new Date().toISOString())
            .order('check_in', { ascending: true })
            .limit(1);
            
          if (staysData && staysData.length > 0) {
            setUpcomingStay(staysData[0]);
          } else {
            setUpcomingStay(null);
          }
        } else {
          setProfile({
            name: user.email.split('@')[0],
            tier: 'Bronze',
            points: 0,
            nextTierPoints: 5000,
            stays: 0,
            rewardsUsed: 0
          });
          setUpcomingStay(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfile({
          name: user?.email ? user.email.split('@')[0] : 'User',
          tier: 'Bronze',
          points: 0,
          nextTierPoints: 5000,
          stays: 0,
          rewardsUsed: 0
        });
        setUpcomingStay(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || !profile) return <div className="p-8 text-center text-gray-400 font-normal">Loading...</div>;

  const progress = Math.min((profile.points / profile.nextTierPoints) * 100, 100);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-800 leading-tight">
          Welcome back, {profile.name}
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-light leading-relaxed">
          Find your perfect stay and explore exclusive benefits curated just for you.
        </p>
      </header>

      {/* Hero Cards Grid (similar to reference) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Loyalty Card */}
        <LoyaltyCard 
          name={profile.name} 
          cardNumber={profile.memberId || 'MEM00000000'} 
          expiryDate="12/30" 
        />

        {/* Explore Image Card (Placeholder for a gorgeous property image) */}
        <div className="bg-gray-100 rounded-[2rem] overflow-hidden relative group h-[300px] md:h-auto">
          {/* We use a subtle gradient and background color to simulate an image if one isn't loaded */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-end">
              <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-colors duration-300">
                <ArrowUpRight size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-light text-white tracking-wide drop-shadow-md">Bolton Luxe Paris</h3>
              <p className="text-white/80 text-sm mt-1 font-light drop-shadow-md">From $450 / night</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Stay */}
        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-6 tracking-wide uppercase">Your Next Journey</p>
          {upcomingStay ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-gray-400">
                <MapPin size={32} strokeWidth={1} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-normal text-gray-800">Bolton Luxe Property #{upcomingStay.property_id}</h3>
                <p className="flex items-center gap-2 text-gray-500 mt-2 font-light text-sm">
                  <CalendarIcon size={16} strokeWidth={1.5} /> {new Date(upcomingStay.check_in).toLocaleDateString()} - {new Date(upcomingStay.check_out).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2 text-gray-500 mt-1 font-light text-sm">
                  <Star size={16} strokeWidth={1.5} /> Status: {upcomingStay.status}
                </p>
              </div>
              <button className="bg-gray-900 text-white rounded-full px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors">
                Manage Booking
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <CalendarIcon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No upcoming stays</h3>
              <p className="text-sm text-gray-500 font-light mb-6">You don't have any upcoming reservations.</p>
              <button className="bg-gray-900 text-white rounded-full px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors">
                Book a Room
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Lifetime Stays</p>
              <p className="text-3xl font-normal text-gray-800">{profile.stays}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <TrendingUp className="text-gray-400" size={20} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Rewards Used</p>
              <p className="text-3xl font-light text-gray-800">{profile.rewardsUsed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Gift className="text-gray-400" size={20} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
