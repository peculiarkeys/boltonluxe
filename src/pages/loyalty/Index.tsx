
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  Gift, 
  Activity, 
  BarChart2,
  CreditCard,
  Zap,
  UserPlus,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const modules = [
  {
    title: 'Enrol New Member',
    description: 'Register a new guest — generates unique card number, captures identity details, and fires a welcome notification',
    icon: <UserPlus className="w-8 h-8 text-primary" />,
    link: '/loyalty/enroll',
    color: 'bg-gradient-to-br from-primary/10 to-primary/5',
  },
  {
    title: 'Members',
    description: 'Manage all loyalty programme members, profiles, and card details',
    icon: <Users className="w-8 h-8 text-primary" />,
    link: '/loyalty/members',
    color: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5'
  },
  {
    title: 'Points Management',
    description: 'Track and manage loyalty points earned, adjusted, and redeemed',
    icon: <Activity className="w-8 h-8 text-primary" />,
    link: '/loyalty/points',
    color: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5'
  },
  {
    title: 'Rewards Catalogue',
    description: 'Configure and manage available rewards and member benefits',
    icon: <Gift className="w-8 h-8 text-primary" />,
    link: '/loyalty/rewards',
    color: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5'
  },
  {
    title: 'Notifications',
    description: 'Communications centre — full log of every email, SMS, and alert sent to members',
    icon: <Bell className="w-8 h-8 text-primary" />,
    link: '/loyalty/notifications',
    color: 'bg-gradient-to-br from-rose-500/10 to-rose-600/5',
  },
  {
    title: 'Member Activities',
    description: 'Track stays, services used, and special requests per member',
    icon: <Award className="w-8 h-8 text-primary" />,
    link: '/loyalty/activities',
    color: 'bg-gradient-to-br from-green-500/10 to-green-600/5'
  },
  {
    title: 'Reports',
    description: 'Analytics and performance reports on loyalty programme metrics',
    icon: <BarChart2 className="w-8 h-8 text-primary" />,
    link: '/loyalty/reports',
    color: 'bg-gradient-to-br from-amber-500/10 to-amber-600/5'
  },
];


const LoyaltyIndex = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Luxe Royalty Program</h1>
        <p className="text-muted-foreground mt-2">
          Bolton White Group's guest loyalty platform — rewarding our most valued guests.
        </p>
      </div>

      {/* Hero: Check-In Widget */}
      <Link to="/loyalty/checkin">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/60 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                <CreditCard className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">Member Check-In</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3" /> Primary Action
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Enter a member's card number at check-in to instantly retrieve their profile, stay history, points balance, and apply their tier discount.
                </p>
              </div>
              <Button className="flex-shrink-0 gap-2 h-11 px-6">
                <CreditCard className="w-4 h-4" />
                Open Check-In
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Management Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Link key={index} to={module.link}>
              <Card className={`h-full card-hover border-none ${module.color}`}>
                <CardHeader className="pt-6">
                  <div className="mb-2">{module.icon}</div>
                  <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyIndex;
