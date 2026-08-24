import React, { useState, useEffect } from 'react';
import { Building, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Stays = () => {
  const { user } = useAuth();
  const [stays, setStays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        if (!user?.email) {
          return;
        }
        
        const { data: member } = await supabase
          .from('loyalty_members')
          .select('id')
          .eq('email', user.email)
          .single();
          
        if (member) {
          // Fetch stays. In a real schema we might join with properties table
          const { data } = await supabase
            .from('loyalty_stays')
            .select('*')
            .eq('member_id', member.id)
            .order('check_out', { ascending: false });
            
          setStays(data || []);
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-800 leading-tight">
          Your travel history
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-normal leading-relaxed">
          Every journey we organize is built on unforgettable views and comfort.
        </p>
      </header>

      <div className="grid gap-6">
        {stays.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm text-gray-500 font-normal">
            You don't have any stays yet. Time to book your first getaway!
          </div>
        ) : stays.map((stay) => (
          <div key={stay.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Building size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">Bolton Luxe Property #{stay.property_id}</h3>
                <p className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-normal">
                  <Calendar size={14} strokeWidth={1.5} /> {new Date(stay.check_in).toLocaleDateString()} - {new Date(stay.check_out).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-12 w-full md:w-auto pt-6 md:pt-0 border-t border-gray-50 md:border-t-0">
              <div>
                <p className="text-sm text-gray-400 font-normal">Amount</p>
                <p className="font-medium text-gray-800 mt-1 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-gray-400" strokeWidth={1.5} /> ${stay.total_amount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 font-normal">Points Earned</p>
                <p className="font-medium text-gray-800 mt-1">+{stay.points_earned}</p>
              </div>
              <button className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
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

export default Stays;
