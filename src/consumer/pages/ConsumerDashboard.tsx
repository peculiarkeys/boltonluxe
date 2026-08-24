import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';
import { Star, TrendingUp, Calendar as CalendarIcon, MapPin, Gift, ArrowUpRight } from 'lucide-react';
import LoyaltyCard from '../components/LoyaltyCard';
import Preloader from '../components/Preloader';
import ImageCarousel from '../components/ImageCarousel';

const ConsumerDashboard = () => {
  const { user } = useConsumerAuth();
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

  if (loading || !profile) return <Preloader />;

  const progress = Math.min((profile.points / profile.nextTierPoints) * 100, 100);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10">
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
      </div>

      {/* Main Profile Area (Gradient Card) */}
      <div className="bg-gradient-to-r from-[#eef2f6] via-[#f4f7f4] to-[#dfe7f0] rounded-[1.5rem] p-6 md:p-8 border border-white relative shadow-sm flex flex-col gap-8">
        {/* Top half: Initials, % and buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full border border-[#cbd5e1] flex items-center justify-center text-xl md:text-2xl font-light text-gray-800 shrink-0 bg-transparent">
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'BL'}
            </div>
            <div>
              <div className="text-4xl md:text-[40px] font-medium text-gray-900 flex items-baseline gap-1 tracking-tight">
                {Math.round(progress)}<span className="text-xl md:text-xl text-gray-600 font-medium">%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 font-normal">Improving this unlocks exclusive rewards</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">Update profile</button>
             <button className="flex-1 md:flex-none bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:bg-gray-50 transition-colors">View stays</button>
          </div>
        </div>

        {/* Bottom half: Metric Cards inside */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
           {/* Lifetime Stays */}
           <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2">
             <div className="flex items-center justify-between">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5"><TrendingUp size={14} className="text-blue-500" /> Lifetime Stays</p>
             </div>
             <p className="text-xl md:text-[22px] font-semibold text-gray-800">{profile.stays} <span className="text-xs font-medium text-emerald-600 ml-1">↑ 12% vs last year</span></p>
           </div>
           
           {/* Rewards Used */}
           <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2">
             <div className="flex items-center justify-between">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5"><Gift size={14} className="text-orange-500" /> Rewards Used</p>
             </div>
             <p className="text-xl md:text-[22px] font-semibold text-gray-800">{profile.rewardsUsed} <span className="text-xs font-medium text-emerald-600 ml-1">↑ 2% vs last year</span></p>
           </div>

           {/* Current Points */}
           <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2">
             <div className="flex items-center justify-between">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5"><Star size={14} className="text-yellow-500" /> Current Points</p>
             </div>
             <p className="text-xl md:text-[22px] font-semibold text-gray-800">{profile.points}</p>
           </div>

           {/* Next Tier */}
           <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2">
             <div className="flex items-center justify-between">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5"><ArrowUpRight size={14} className="text-purple-500" /> Next Tier Goal</p>
             </div>
             <p className="text-xl md:text-[22px] font-semibold text-gray-800">{profile.nextTierPoints}</p>
           </div>
        </div>
      </div>

      {/* Horizontal Cards Area (Explore / Loyalty) */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-gray-700 text-base font-medium">Explore Properties</h3>
          <span className="bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-full">New</span>
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
           {/* Card 1: Bolton White Hotel */}
           <div className="min-w-[320px] max-w-[320px] bg-white rounded-[1.25rem] border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
             <div className="h-44 w-full shrink-0">
               <ImageCarousel 
                 images={[
                   '/hotels/bolton_white_hotel/BC3I7813.webp',
                   '/hotels/bolton_white_hotel/BC3I7828.webp',
                   '/hotels/bolton_white_hotel/IMG-20260617-WA0013.webp'
                 ]} 
                 alt="Bolton White Hotel" 
               />
             </div>
             <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
               <div>
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-medium text-gray-800 text-base leading-tight">Bolton White Hotel</h4>
                   <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium shrink-0">Top Rated</span>
                 </div>
                 <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-normal">Our flagship hotel offering premium luxury, exquisite dining, and world-class amenities in the heart of the city.</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-medium">Starting at</p>
                   <p className="text-sm font-semibold text-gray-800 mt-0.5">$180 / night</p>
                 </div>
                 <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm">
                   Book Now
                 </button>
               </div>
             </div>
           </div>

           {/* Card 2: Bolton White Residence */}
           <div className="min-w-[320px] max-w-[320px] bg-white rounded-[1.25rem] border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
             <div className="h-44 w-full shrink-0">
               <ImageCarousel 
                 images={[
                   '/hotels/bolton_white_residence/Gemini_Generated_Image_jccyigjccyigjccy 1_compressed.webp',
                   '/hotels/bolton_white_residence/Gemini_Generated_Image_n8lg59n8lg59n8lg 1_compressed.webp',
                   '/hotels/bolton_white_residence/Gemini_Generated_Image_rbj9mdrbj9mdrbj9 1_compressed.webp'
                 ]} 
                 alt="Bolton White Residence" 
               />
             </div>
             <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
               <div>
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-medium text-gray-800 text-base leading-tight">Bolton White Residence</h4>
                 </div>
                 <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-normal">Experience the comfort of home with the luxury of a hotel in our fully serviced premium residences.</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-medium">Starting at</p>
                   <p className="text-sm font-semibold text-gray-800 mt-0.5">$220 / night</p>
                 </div>
                 <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm">
                   Book Now
                 </button>
               </div>
             </div>
           </div>

           {/* Card 3: Johnwood Hotel by Bolton */}
           <div className="min-w-[320px] max-w-[320px] bg-white rounded-[1.25rem] border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
             <div className="h-44 w-full shrink-0">
               <ImageCarousel 
                 images={[
                   '/hotels/johnwood_hotel/7K4A0289-Edit_compressed.webp',
                   '/hotels/johnwood_hotel/7K4A0310-Edit_compressed.webp',
                   '/hotels/johnwood_hotel/7K4A0327-Edit_compressed.webp'
                 ]} 
                 alt="Johnwood Hotel by Bolton" 
               />
             </div>
             <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
               <div>
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-medium text-gray-800 text-base leading-tight">Johnwood Hotel by Bolton</h4>
                 </div>
                 <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-normal">A boutique hotel experience blending contemporary design with unrivaled personalized service.</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-medium">Starting at</p>
                   <p className="text-sm font-semibold text-gray-800 mt-0.5">$250 / night</p>
                 </div>
                 <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm">
                   Book Now
                 </button>
               </div>
             </div>
           </div>
           
        </div>
      </div>

      {/* Dedicated Loyalty Card Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-gray-700 text-base font-medium">Your Loyalty Card</h3>
        </div>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            {/* Left: The Card */}
            <div className="flex justify-center w-full lg:w-auto shrink-0 relative py-2">
                 <LoyaltyCard name={profile.name} cardNumber={profile.memberId || 'MEM00000000'} expiryDate="12/30" />
            </div>
            
            {/* Right: Details and Instructions */}
            <div className="flex flex-col gap-5 w-full flex-1">
               <div>
                 <h4 className="text-xl font-medium text-gray-800 mb-2">Digital Member Card</h4>
                 <p className="text-sm text-gray-600 leading-relaxed font-normal">Present this card at any Bolton property to unlock your tier benefits, earn points on your stays, and enjoy seamless check-ins.</p>
               </div>
               
               <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-4">
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                     <span className="text-xs font-medium text-gray-600">1</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-800">Scan at check-in</p>
                     <p className="text-sm text-gray-600 mt-0.5 font-normal">Show this card to the receptionist upon arrival.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                     <span className="text-xs font-medium text-gray-600">2</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-800">Earn & Redeem Points</p>
                     <p className="text-sm text-gray-600 mt-0.5 font-normal">Every booking automatically adds points to your account.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                     <span className="text-xs font-medium text-gray-600">3</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-800">Enjoy {profile.tier} Tier Perks</p>
                     <p className="text-sm text-gray-600 mt-0.5 font-normal">Access priority services and complimentary upgrades.</p>
                   </div>
                 </div>
               </div>
               
               <div className="pt-2 flex flex-col sm:flex-row gap-3">
                 <button className="w-full sm:flex-1 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                   Add to Apple Wallet
                 </button>
                 <button className="w-full sm:flex-1 bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                   View Full Benefits
                 </button>
               </div>
            </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
          <span className="bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-full">{upcomingStay ? '1' : '0'}</span>
        </div>
        
        <div className="bg-white rounded-[1.5rem] border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="col-span-4 text-sm font-medium text-gray-500">Property</div>
            <div className="col-span-3 text-sm font-medium text-gray-500">Dates</div>
            <div className="col-span-2 text-sm font-medium text-gray-500">Status</div>
            <div className="col-span-3 text-sm font-medium text-gray-500 text-right">Action</div>
          </div>
          
          {upcomingStay ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0">
              <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Bolton Luxe #{upcomingStay.property_id}</p>
                  <p className="text-xs text-gray-500">Suite</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-3">
                <p className="text-sm text-gray-700 font-medium">
                  {new Date(upcomingStay.check_in).toLocaleDateString()} - {new Date(upcomingStay.check_out).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                  upcomingStay.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {upcomingStay.status}
                </span>
              </div>
              <div className="col-span-1 md:col-span-3 text-left md:text-right mt-2 md:mt-0">
                <button className="text-sm font-medium text-gray-600 hover:text-black border border-gray-200 bg-white rounded-full px-4 py-1.5 shadow-sm transition-colors">
                  Manage
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center flex flex-col items-center">
               <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-100">
                 <CalendarIcon size={20} strokeWidth={1.5} />
               </div>
               <p className="text-sm font-medium text-gray-800 mb-1">No upcoming stays</p>
               <p className="text-sm text-gray-500 mb-4">You don't have any upcoming reservations.</p>
               <button className="text-sm font-medium text-white hover:bg-gray-700 border border-transparent bg-gray-800 rounded-full px-5 py-2 shadow-sm transition-colors">
                 Book a Room
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
