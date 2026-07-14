
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
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/', requiredRole: 'staff' },
    { 
      name: 'Loyalty Program', 
      icon: <Award className="w-5 h-5" />, 
      path: '/loyalty',
      requiredRole: 'staff',
      subItems: [
        { name: 'Member Check-In',  path: '/loyalty/checkin' },
        { name: 'Enrol New Member', path: '/loyalty/enroll' },
        { name: 'Members',          path: '/loyalty/members' },
        { name: 'Points Management',path: '/loyalty/points' },
        { name: 'Rewards',          path: '/loyalty/rewards' },
        { name: 'Notifications',    path: '/loyalty/notifications' },
        { name: 'Activities',       path: '/loyalty/activities' },
        { name: 'Reports',          path: '/loyalty/reports' },
      ]
    },
    { 
      name: 'Business Development', 
      icon: <Sparkles className="w-5 h-5" />, 
      path: '/business-development',
      requiredRole: 'manager',
      subItems: [
        { name: 'Leads', path: '/business-development/leads' },
        { name: 'Companies', path: '/business-development/companies' },
        { name: 'Contacts', path: '/business-development/contacts' },
        { name: 'Opportunities', path: '/business-development/opportunities' },
        { name: 'Debt Recovery', path: '/business-development/debt-recovery' },
        { name: 'Relationship Managers', path: '/business-development/relationship-managers' }
      ]
    },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/bookings/calendar', requiredRole: 'staff' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings', requiredRole: 'staff' },
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
    <div className="hidden md:flex w-64 flex-col bg-white shadow-xl h-screen">
      <div className="px-6 py-6 flex items-center justify-center border-b border-gray-200">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/app_logo.png" 
            alt="Bolton HQ" 
            className="h-10 w-auto object-contain" 
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item, index) => {
            if (!hasPermission(item.requiredRole)) return null;
            
            const isActive = location.pathname === item.path || 
                            (item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.path)));
            
            return (
              <li key={index}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                        isActive || openMenus[item.name]
                          ? "bg-blue-50 text-primary" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
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
                      <ul className="pl-6 space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm rounded-md text-left",
                                  isSubActive
                                    ? "bg-blue-50 text-primary"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                                )}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
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
                      "flex items-center px-3 py-2 text-sm rounded-md text-left",
                      isActive
                        ? "bg-blue-50 text-primary"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary"
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
              {user.avatar || user.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <button 
              className="p-1 rounded-md hover:bg-gray-200"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
