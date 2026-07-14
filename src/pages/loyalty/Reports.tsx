
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon,
  Users,
  TrendingUp
} from 'lucide-react';
import { 
  useLoyaltyReports, 
  TierDistribution, 
  MonthlyPointsData, 
  RewardPopularity, 
  MemberGrowthData, 
  ReportsSummary 
} from '@/hooks/loyalty/useLoyaltyReports';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#1569DA', '#50A5F9', '#3E87CD', '#0D4EAC', '#82BAFB'];

const Reports = () => {
  const [summary, setSummary] = useState<ReportsSummary>({
    totalMembers: 0,
    pointsIssued: 0,
    pointsRedeemed: 0,
    redemptionRate: 0,
    memberGrowth: 0
  });
  const [tierDistribution, setTierDistribution] = useState<TierDistribution[]>([]);
  const [monthlyPointsData, setMonthlyPointsData] = useState<MonthlyPointsData[]>([]);
  const [rewardPopularity, setRewardPopularity] = useState<RewardPopularity[]>([]);
  const [memberGrowth, setMemberGrowth] = useState<MemberGrowthData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const { 
    isLoading,
    fetchReportsSummary,
    fetchTierDistribution,
    fetchMonthlyPointsData,
    fetchRewardPopularity,
    fetchMemberGrowth
  } = useLoyaltyReports();
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const summaryData = await fetchReportsSummary();
    setSummary(summaryData);
    
    const tierData = await fetchTierDistribution();
    setTierDistribution(tierData);
    
    const pointsData = await fetchMonthlyPointsData();
    setMonthlyPointsData(pointsData);
    
    const rewardsData = await fetchRewardPopularity();
    setRewardPopularity(rewardsData);
    
    const growthData = await fetchMemberGrowth();
    setMemberGrowth(growthData);
  };

  const exportToCsv = async () => {
    setIsExporting(true);
    try {
      const summaryCSV = `Metric,Value
Total Members,${summary.totalMembers}
Points Issued,${summary.pointsIssued}
Points Redeemed,${summary.pointsRedeemed}
Redemption Rate,${summary.redemptionRate}%
Member Growth,${summary.memberGrowth}%`;

      const distributionCSV = `Tier,Members\n${tierDistribution.map(item => `${item.name},${item.value}`).join('\n')}`;
      
      const csvContent = summaryCSV + '\n\n' + distributionCSV;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `loyalty_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Report exported',
        description: 'The report has been exported to CSV successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: error.message || 'Failed to export report',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Program Reports</h1>
          <p className="text-muted-foreground mt-2">
            Analytics and insights for the Bolton Loyalty Program
          </p>
        </div>
        <div className="flex space-x-2 sm:self-end">
          <Button variant="outline" className="flex gap-1" onClick={() => toast({ description: "Period selection feature coming soon." })}>
            <Calendar className="h-4 w-4" />
            <span>Change Period</span>
          </Button>
          <Button variant="outline" className="flex gap-1" onClick={exportToCsv} disabled={isExporting}>
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {summary.memberGrowth > 0 ? `+${summary.memberGrowth}%` : `${summary.memberGrowth}%`} from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points Issued (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pointsIssued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all member accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pointsRedeemed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total points redeemed for rewards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.redemptionRate}%</div>
            <p className="text-xs text-muted-foreground">Of total issued points</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Program Overview</span>
          </TabsTrigger>
          <TabsTrigger value="points" className="flex gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Points Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span>Rewards Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex gap-1">
            <Users className="h-4 w-4" />
            <span>Member Growth</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Member Tier Distribution</CardTitle>
                <CardDescription>
                  Distribution of loyalty program members by tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {tierDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tierDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {tierDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      {isLoading ? 'Loading data...' : 'No tier data available'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Rewards</CardTitle>
                <CardDescription>
                  Distribution of reward redemptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {rewardPopularity.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rewardPopularity}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {rewardPopularity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      {isLoading ? 'Loading data...' : 'No reward redemption data available'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Points Activity</CardTitle>
              <CardDescription>
                Points earned vs. redeemed by month (current year)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {monthlyPointsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyPointsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="earned" name="Points Earned" fill="#1569DA" />
                      <Bar dataKey="redeemed" name="Points Redeemed" fill="#50A5F9" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {isLoading ? 'Loading data...' : 'No monthly points data available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Reward Redemption Trends</CardTitle>
              <CardDescription>
                The most popular reward types being redeemed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {rewardPopularity.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rewardPopularity}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {rewardPopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {isLoading ? 'Loading data...' : 'No reward redemption data available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
              <CardDescription>
                Total loyalty program members by month (current year)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {memberGrowth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={memberGrowth}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="members" name="Total Members" fill="#1569DA" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {isLoading ? 'Loading data...' : 'No member growth data available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
