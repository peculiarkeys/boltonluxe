
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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your hospitality operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/loyalty/checkin')}>
            <CreditCard className="w-4 h-4" />
            Member Check-In
          </Button>
          <Button className="gap-2" onClick={() => navigate('/loyalty/enroll')}>
            <UserPlus className="w-4 h-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Loyalty Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-gray-900">1,284</div>
            <p className="text-xs text-muted-foreground">
              +124 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Points Issued (MTD)
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-gray-900">45,230</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Leads
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-gray-900">42</div>
            <p className="text-xs text-muted-foreground">
              12 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-gray-900">24.5%</div>
            <p className="text-xs text-muted-foreground">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Loyalty Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Date</TableHead>
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
                      <TableRow key={index}>
                        <TableCell className="font-medium">{activity.member}</TableCell>
                        <TableCell>{activity.activity}</TableCell>
                        <TableCell className={activity.points.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {activity.points}
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming BizDev Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { company: 'Apex Inc.', topic: 'Corporate Contract Renewal', time: '10:00 AM', date: 'Tomorrow' },
                    { company: 'Globex Corp', topic: 'Annual Conference Pitch', time: '2:30 PM', date: 'Jun 15' },
                    { company: 'Tech Solutions', topic: 'Partnership Discussion', time: '11:00 AM', date: 'Jun 16' },
                  ].map((meeting, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="bg-primary/10 rounded-md p-2">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                          {meeting.company}
                        </h4>
                        <p className="text-xs text-muted-foreground">{meeting.topic}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
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
