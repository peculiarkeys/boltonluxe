
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  FileText, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Calendar, 
  Settings, 
  LogOut,
  Sparkles,
  MessageSquare,
  Image,
  BadgePercent,
  Megaphone,
  PenTool,
  DollarSign,
  UserPlus,
  Briefcase,
  Award
} from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  path: string;
  subItems?: { name: string; path: string }[];
  requiredRole: UserRole;
}

const Sidebar = () => {
  const { user, hasPermission, logout } = useAuth();
  const location = useLocation();
  
  const navigationItems: SidebarItemProps[] = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/boltonadmin', requiredRole: 'staff' },
    { 
      name: 'Loyalty Program', 
      icon: <Award className="w-5 h-5" />, 
      path: '/boltonadmin/loyalty',
      requiredRole: 'staff',
      subItems: [
        { name: 'Member Check-In',  path: '/boltonadmin/loyalty/checkin' },
        { name: 'Enrol New Member', path: '/boltonadmin/loyalty/enroll' },
        { name: 'Members',          path: '/boltonadmin/loyalty/members' },
        { name: 'Points Management',path: '/boltonadmin/loyalty/points' },
        { name: 'Rewards',          path: '/boltonadmin/loyalty/rewards' },
        { name: 'Notifications',    path: '/boltonadmin/loyalty/notifications' },
        { name: 'Activities',       path: '/boltonadmin/loyalty/activities' },
        { name: 'Reports',          path: '/boltonadmin/loyalty/reports' },
      ]
    },
    { 
      name: 'Business Development', 
      icon: <Sparkles className="w-5 h-5" />, 
      path: '/boltonadmin/business-development',
      requiredRole: 'manager',
      subItems: [
        { name: 'Leads', path: '/boltonadmin/business-development/leads' },
        { name: 'Companies', path: '/boltonadmin/business-development/companies' },
        { name: 'Contacts', path: '/boltonadmin/business-development/contacts' },
        { name: 'Opportunities', path: '/boltonadmin/business-development/opportunities' },
        { name: 'Debt Recovery', path: '/boltonadmin/business-development/debt-recovery' },
        { name: 'Relationship Managers', path: '/boltonadmin/business-development/relationship-managers' }
      ]
    },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/boltonadmin/bookings/calendar', requiredRole: 'staff' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/boltonadmin/settings', requiredRole: 'staff' },
  ];

  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    navigationItems.forEach(item => {
      if (item.subItems) {
        const isSubPathActive = item.subItems.some(subItem => 
          location.pathname.startsWith(subItem.path)
        );
        if (isSubPathActive || location.pathname === item.path) {
          setOpenMenus(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <div className="hidden md:flex w-64 flex-col bg-white border-r border-zinc-100 h-screen">
      <div className="px-6 py-6 flex items-center justify-center bg-slate-950">
        <Link to="/boltonadmin" className="flex items-center justify-center">
          <img 
            src="/app_logo.png" 
            alt="Bolton HQ" 
            className="h-10 w-auto object-contain brightness-0 invert" 
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col">
          {navigationItems.map((item, index) => {
            if (!hasPermission(item.requiredRole)) return null;
            
            const isActive = location.pathname === item.path || 
                            (item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.path)));
            
            return (
              <li key={index}>
                {item.subItems ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "flex items-center justify-between w-full pl-6 pr-4 py-3 text-sm transition-colors text-left border-l-2",
                        isActive || openMenus[item.name]
                          ? "bg-zinc-50 text-slate-900 font-medium border-slate-900" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 font-medium border-transparent"
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3 truncate">{item.name}</span>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform ${openMenus[item.name] ? 'rotate-90' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    
                    {openMenus[item.name] && (
                      <ul className="flex flex-col pb-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={cn(
                                  "flex items-center pl-[52px] pr-4 py-2.5 text-sm text-left border-l-2 transition-colors",
                                  isSubActive
                                    ? "bg-zinc-50 text-slate-900 font-medium border-slate-900"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 font-medium border-transparent"
                                )}
                              >
                                <span className="truncate">{subItem.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center pl-6 pr-4 py-3 text-sm text-left border-l-2 transition-colors",
                      isActive
                        ? "bg-zinc-50 text-slate-900 font-medium border-slate-900"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 font-medium border-transparent"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3 truncate">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {user && (
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium text-sm">
              {user.avatar || user.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <button 
              className="p-1.5 rounded-full hover:bg-zinc-200 transition-colors text-zinc-400 hover:text-zinc-600"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
