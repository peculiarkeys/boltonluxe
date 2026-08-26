import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Gift, LogOut } from 'lucide-react';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ConsumerLayout = () => {
  const location = useLocation();
  const { user, signOut } = useConsumerAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      try {
        const { data: allMembers, error } = await supabase.rpc('get_all_loyalty_members');
        let data = null;
        if (allMembers && allMembers.length > 0) {
          data = allMembers.find((m: any) => m.email === user.email);
        }
        
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [user]);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Guest Account';
  const displayTier = profile?.tier ? profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1) : 'Member';
  const initials = displayName.substring(0, 2).toUpperCase();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Stays', path: '/stays', icon: Calendar },
    { name: 'Rewards', path: '/rewards', icon: Gift },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="consumer-app flex h-screen bg-[#f7f7f9] font-sans font-normal text-gray-600 overflow-hidden overscroll-none w-full max-w-full">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white flex-col border-r border-gray-200 shrink-0">
        <div className="p-6">
          <img src="/logo.png" alt="Bolton Luxe Logo" className="h-8 object-contain" />
        </div>
        
        <div className="mx-4 mb-6 p-3 bg-[#f8fafc] rounded-xl flex items-center gap-3 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-medium text-sm text-gray-700 shrink-0">
            {initials}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-zinc-800 truncate">{displayName}</p>
            <p className="text-sm text-gray-600 font-normal truncate">{displayTier} Tier</p>
          </div>
        </div>
        
        <div className="px-6 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-[1rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gray-100 text-zinc-800 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-zinc-800 font-normal'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <button 
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="font-normal">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] pb-20 md:pb-0 relative flex flex-col w-full max-w-full">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-10 sticky top-0 z-40 shrink-0 gap-4">
          <div className="md:hidden shrink-0">
            <img src="/logo.png" alt="Bolton Luxe Logo" className="h-6 object-contain" />
          </div>
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search properties, bookings, rewards..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button 
              onClick={() => toast.info('No new notifications')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 relative"
            >
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${
                  isActive ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "animate-pulse" : ""} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ConsumerLayout;
