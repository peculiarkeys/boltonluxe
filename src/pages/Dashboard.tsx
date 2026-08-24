
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign, 
  Award,
  Clock,
  ChevronRight,
  UserPlus,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const navigate = useNavigate();
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
            <button className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors" onClick={() => navigate('/loyalty/enroll')}>
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
            <button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm" onClick={() => navigate('/loyalty/checkin')}>
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
            <div className="text-2xl font-medium text-zinc-800">1,284</div>
            <p className="text-xs font-medium text-emerald-500 mt-1">
              +124 from last month
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
            <div className="text-2xl font-medium text-zinc-800">45,230</div>
            <p className="text-xs font-medium text-emerald-500 mt-1">
              +8.2% from last month
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
            <div className="text-2xl font-medium text-zinc-800">42</div>
            <p className="text-xs font-medium text-emerald-500 mt-1">
              12 new this week
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
            <div className="text-2xl font-medium text-zinc-800">24.5%</div>
            <p className="text-xs font-medium text-emerald-500 mt-1">
              +2.1% from last month
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
                    {[
                      { member: 'Sarah Johnson', activity: 'Room Booking', points: '+450', date: 'Today' },
                      { member: 'Michael Chen', activity: 'Spa Service', points: '+120', date: 'Yesterday' },
                      { member: 'Emily Wilson', activity: 'Reward Redemption', points: '-2000', date: '2 days ago' },
                      { member: 'James Martin', activity: 'Dining', points: '+85', date: '2 days ago' },
                      { member: 'Olivia Thompson', activity: 'Room Booking', points: '+600', date: '3 days ago' },
                    ].map((activity, index) => (
                      <TableRow key={index} className="border-zinc-100 hover:bg-zinc-50/50">
                        <TableCell className="font-medium text-zinc-700 text-sm py-3">{activity.member}</TableCell>
                        <TableCell className="text-zinc-600 text-sm py-3">{activity.activity}</TableCell>
                        <TableCell className={`text-sm font-medium py-3 ${activity.points.startsWith('+') ? 'text-emerald-500' : 'text-zinc-500'}`}>
                          {activity.points}
                        </TableCell>
                        <TableCell className="text-zinc-500 text-sm py-3">{activity.date}</TableCell>
                      </TableRow>
                    ))}
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
