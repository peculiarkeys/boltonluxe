import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Gift, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ConsumerLayout = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Stays', path: '/stays', icon: Calendar },
    { name: 'Rewards', path: '/rewards', icon: Gift },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="flex h-screen bg-background font-light">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-card flex flex-col border-r border-border/50">
        <div className="p-8">
          <h1 className="text-2xl font-normal tracking-tight text-gray-800">Bolton Luxe</h1>
          <p className="text-sm text-gray-500 mt-1">Guest Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="font-normal">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <button 
            onClick={() => signOut()}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="font-normal">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ConsumerLayout;
