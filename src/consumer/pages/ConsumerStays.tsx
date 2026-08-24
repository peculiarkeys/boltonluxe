import React, { useState, useEffect } from 'react';
import { Building, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';

const ConsumerStays = () => {
  const { user } = useConsumerAuth();
  const [stays, setStays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        if (!user?.email) {
          return;
        }
        
        const { data: allMembers, error } = await supabase.rpc('get_all_loyalty_members');
        let member = null;
        if (allMembers && allMembers.length > 0) {
          member = allMembers.find((m: any) => m.email === user.email);
        }
          
        if (member) {
          const { data } = await supabase
            .from('loyalty_bookings')
            .select('*')
            .eq('member_id', member.id)
            .order('check_in_date', { ascending: false });
            
          // Map to match the expected format
          const mappedStays = (data || []).map(b => ({
            ...b,
            hotel_name: 'Bolton Luxe Hotel',
            check_in: b.check_in_date,
            check_out: b.check_out_date,
            amount: b.amount_spent,
            status: new Date(b.check_in_date) > new Date() ? 'Upcoming' : 'Completed'
          }));
          
          setStays(mappedStays);
        }
      } catch (error) {
        console.error('Error fetching stays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-400 font-normal">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-800">My Stays</h1>
      </div>
      <header className="max-w-2xl text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-800 leading-tight">
          Your travel history
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium leading-relaxed">
          Every journey we organize is built on unforgettable views and comfort.
        </p>
      </header>

      <div className="grid gap-6">
        {stays.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm text-gray-500 font-medium">
            You don't have any stays yet. Time to book your first getaway!
          </div>
        ) : stays.map((stay) => (
          <div key={stay.id} className="bg-white rounded-2xl p-5 md:p-6 border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-4 md:gap-6 w-full md:w-auto">
              <div className="w-16 h-16 rounded-xl bg-[#f8fafc] border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <Building size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">{stay.hotel_name}</h3>
                <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-gray-500 mt-1 font-medium">
                  <Calendar size={14} strokeWidth={2} /> {new Date(stay.check_in).toLocaleDateString()} - {new Date(stay.check_out).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 w-full md:w-auto pt-6 md:pt-0 border-t border-gray-100 md:border-t-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500 font-medium">Amount</p>
                <p className="font-semibold text-gray-800 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                  <CreditCard size={14} className="text-gray-400" strokeWidth={2} /> ${stay.amount}
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-500 font-medium">Points Earned</p>
                <p className="font-semibold text-gray-800 mt-1">+{stay.points_earned}</p>
              </div>
              <button className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center text-gray-500 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors shadow-sm">
                <span className="sr-only">View Details</span>
                &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerStays;
