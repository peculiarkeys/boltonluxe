
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, Download, PlusCircle, TrendingUp, Award, CreditCard, Info } from 'lucide-react';
import { useLoyaltyMembers } from '@/hooks/loyalty/useLoyaltyMembers';
import { useLoyaltyPoints, PointTransaction } from '@/hooks/loyalty/useLoyaltyPoints';
import { toast } from 'sonner';

const LoyaltyPoints: React.FC = () => {
  const { members, isLoading: isLoadingMembers } = useLoyaltyMembers();
  const { transactions, isLoading, summary, addTransaction, refreshTransactions } = useLoyaltyPoints();

  const [isAwarding, setIsAwarding] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [transactionData, setTransactionData] = useState({
    member_id: '',
    amount: 0,
    type: 'earned' as 'earned' | 'redeemed',
    description: ''
  });
  const [selectedTab, setSelectedTab] = useState('transactions');

  const handleAddTransaction = async () => {
    if (!transactionData.member_id) {
      toast.error('Please select a member');
      return;
    }

    if (transactionData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    try {
      await addTransaction(transactionData);
      setTransactionData({
        member_id: '',
        amount: 0,
        type: 'earned',
        description: ''
      });
      setIsAwarding(false);
      setIsRedeeming(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const downloadTransactions = () => {
    const csvHeader = "Date,Member,Type,Amount,Description\n";
    const csvData = transactions.map(t => 
      `${format(new Date(t.date), 'yyyy-MM-dd')},${t.memberName},"${t.type === 'earned' ? 'Earned' : 'Redeemed'}",${t.amount},"${t.description}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `loyalty-points-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transaction data downloaded successfully');
  };

  const handleRefresh = () => {
    refreshTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Points</h1>
          <p className="text-muted-foreground">
            Manage and track loyalty points for members.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={downloadTransactions} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Points Issued</CardTitle>
              <CardDescription>Lifetime points issued</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalIssued.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Current Outstanding</CardTitle>
              <CardDescription>Points to be redeemed</CardDescription>
            </div>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <CardDescription>Points issued this month</CardDescription>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.monthlyGrowth.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Redemption rate: {summary.redemptionRate} points = $1
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Dialog open={isAwarding} onOpenChange={setIsAwarding}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Award Points
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Award Loyalty Points</DialogTitle>
              <DialogDescription>
                Award points to a member for their loyalty or specific purchases.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member">Member</Label>
                <Select onValueChange={(value) => setTransactionData({...transactionData, member_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Members</SelectLabel>
                      {isLoadingMembers ? (
                        <SelectItem value="loading" disabled>Loading members...</SelectItem>
                      ) : (
                        members.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.member_id})
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input 
                  id="points" 
                  type="number"
                  min="0"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="e.g., Stay at Grand Hotel, Restaurant purchase"
                  value={transactionData.description}
                  onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAwarding(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  setTransactionData(prev => ({...prev, type: 'earned'}));
                  handleAddTransaction();
                }}
              >
                Award Points
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRedeeming} onOpenChange={setIsRedeeming}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Award className="h-4 w-4" /> Redeem Points
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redeem Loyalty Points</DialogTitle>
              <DialogDescription>
                Record a redemption when a member uses their points.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member">Member</Label>
                <Select onValueChange={(value) => setTransactionData({...transactionData, member_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Members</SelectLabel>
                      {isLoadingMembers ? (
                        <SelectItem value="loading" disabled>Loading members...</SelectItem>
                      ) : (
                        members.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.member_id}) - Available: {member.points || 0} pts
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points">Points to Redeem</Label>
                <Input 
                  id="points" 
                  type="number"
                  min="0"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: parseInt(e.target.value) || 0})}
                />
                <div className="text-xs text-muted-foreground">
                  Cash value: ${(transactionData.amount / summary.redemptionRate).toFixed(2)}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Redemption Description</Label>
                <Input 
                  id="description" 
                  placeholder="e.g., Room upgrade, Free night"
                  value={transactionData.description}
                  onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRedeeming(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  setTransactionData(prev => ({...prev, type: 'redeemed'}));
                  handleAddTransaction();
                }}
              >
                Redeem Points
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="transactions" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="analysis">Points Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Transactions Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 mb-4">
                Start by awarding points to members for their stays or purchases.
              </p>
              <Button onClick={() => setIsAwarding(true)}>Award First Points</Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A history of all loyalty point transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{transaction.memberName}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'earned' ? 'default' : 'secondary'}>
                        {transaction.type === 'earned' ? 'Earned' : 'Redeemed'}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Points Liability Analysis</CardTitle>
              <CardDescription>
                Overview of outstanding points and potential financial liability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Points Issued</div>
                  <div className="text-2xl font-bold">{summary.totalIssued.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Points Redeemed</div>
                  <div className="text-2xl font-bold">{summary.totalRedeemed.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((summary.totalRedeemed / summary.totalIssued) * 100 || 0)}% redemption rate
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Financial Liability</div>
                  <div className="text-2xl font-bold">
                    ${((summary.currentOutstanding / summary.redemptionRate) || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on {summary.redemptionRate} points = $1
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Points Activity</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Total issued this month</span>
                    <span className="font-medium">{summary.monthlyGrowth.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Average per transaction</span>
                    <span className="font-medium">
                      {
                        transactions.length > 0 
                          ? Math.round(
                              transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                            ).toLocaleString() 
                          : 0
                      } pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Highest transaction</span>
                    <span className="font-medium">
                      {
                        transactions.length > 0 
                          ? Math.max(...transactions.map(t => t.amount)).toLocaleString()
                          : 0
                      } pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Points expiring this month</span>
                    <span className="font-medium">0 pts</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-2" onClick={downloadTransactions}>
                <Download className="h-4 w-4" /> Export Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyPoints;
