import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign, 
  Award,
  Clock,
  ChevronRight,
  UserPlus,
  CreditCard,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch total loyalty members
  const { data: totalMembers, isLoading: isMembersLoading } = useQuery({
    queryKey: ['total-loyalty-members'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('loyalty_members')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch MTD points issued
  const { data: pointsIssued, isLoading: isPointsLoading } = useQuery({
    queryKey: ['points-issued-mtd'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('loyalty_point_transactions')
        .select('amount')
        .gte('date', startOfMonth.toISOString());
      
      if (error) throw error;
      // Filter out negative amounts if you only want 'issued' points
      return data?.reduce((acc, curr) => acc + (curr.amount > 0 ? curr.amount : 0), 0) || 0;
    }
  });

  // Fetch active leads and calculate conversion rate
  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['leads-dashboard-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('status');
      
      if (error) throw error;
      
      const totalLeads = data?.length || 0;
      const activeLeads = data?.filter(l => l.status !== 'Converted' && l.status !== 'Closed').length || 0;
      const convertedLeads = data?.filter(l => l.status === 'Converted').length || 0;
      
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

      return { activeLeads, conversionRate };
    }
  });

  // Fetch recent loyalty activities
  const { data: recentActivities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['recent-loyalty-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_point_transactions')
        .select(`
          *,
          loyalty_members(name)
        `)
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const isLoadingStats = isMembersLoading || isPointsLoading || isLeadsLoading;

  return (
    <div className="space-y-6">
      {/* Header section matching the style exactly */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center text-sm text-zinc-500">
          <span className="text-zinc-400">Home</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-800 font-medium">Overview</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-zinc-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors" onClick={() => navigate('/boltonadmin/loyalty/enroll')}>
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
            <button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm" onClick={() => navigate('/boltonadmin/loyalty/checkin')}>
              <CreditCard className="w-4 h-4 text-zinc-500" />
              Member Check-In
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-none border border-zinc-200 bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-zinc-100">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Total Loyalty Members
            </CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-zinc-800">
              {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" /> : totalMembers?.toLocaleString()}
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-zinc-200 bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-zinc-100">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Points Issued (MTD)
            </CardTitle>
            <Award className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-zinc-800">
              {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" /> : pointsIssued?.toLocaleString()}
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-zinc-200 bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-zinc-100">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Active Leads
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-zinc-800">
              {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" /> : leadsData?.activeLeads}
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-1">
              In pipeline
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-zinc-200 bg-white rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-zinc-100">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Conversion Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-zinc-800">
              {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" /> : `${leadsData?.conversionRate}%`}
            </div>
            <p className="text-xs font-medium text-zinc-400 mt-1">
              Historical average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="bizdev">Business Development</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 shadow-none border border-zinc-200 bg-white rounded-xl overflow-hidden">
              <CardHeader className="p-4 border-b border-zinc-100 bg-zinc-50/30">
                <CardTitle className="text-sm font-medium text-zinc-800">Recent Loyalty Activities</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-50/50">
                    <TableRow className="border-zinc-100">
                      <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-10">Member</TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-10">Activity</TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-10">Points</TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-10">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isActivitiesLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading activities...
                        </TableCell>
                      </TableRow>
                    ) : recentActivities?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                          No recent activities found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentActivities?.map((activity, index) => {
                        const memberData = activity.loyalty_members as any;
                        const memberName = memberData?.name || 'Unknown Member';
                        const pointsStr = activity.amount > 0 ? `+${activity.amount}` : `${activity.amount}`;
                        const displayDate = activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A';
                        
                        return (
                          <TableRow key={activity.id || index} className="border-zinc-100 hover:bg-zinc-50/50">
                            <TableCell className="font-medium text-zinc-700 text-sm py-3">{memberName}</TableCell>
                            <TableCell className="text-zinc-600 text-sm py-3">{activity.description || activity.type}</TableCell>
                            <TableCell className={`text-sm font-medium py-3 ${activity.amount > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                              {pointsStr}
                            </TableCell>
                            <TableCell className="text-zinc-500 text-sm py-3">{displayDate}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3 shadow-none border border-zinc-200 bg-white rounded-xl overflow-hidden">
              <CardHeader className="p-4 border-b border-zinc-100 bg-zinc-50/30">
                <CardTitle className="text-sm font-medium text-zinc-800">Upcoming BizDev Meetings</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {/* Kept as mock data since no meeting table exists yet */}
                  {[
                    { company: 'Apex Inc.', topic: 'Corporate Contract Renewal', time: '10:00 AM', date: 'Tomorrow' },
                    { company: 'Globex Corp', topic: 'Annual Conference Pitch', time: '2:30 PM', date: 'Jun 15' },
                    { company: 'Tech Solutions', topic: 'Partnership Discussion', time: '11:00 AM', date: 'Jun 16' },
                  ].map((meeting, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                      <div className="bg-slate-100 rounded-full p-2.5 mt-0.5">
                        <CalendarCheck className="h-4 w-4 text-slate-700" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none text-zinc-800">
                          {meeting.company}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500">{meeting.topic}</p>
                        <div className="flex items-center text-[11px] font-medium text-zinc-400 mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {meeting.date} at {meeting.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed loyalty metrics and member growth charts will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bizdev" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Visual sales funnel and opportunity tracking will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

