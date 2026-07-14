
import React, { useState } from 'react';
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
import { Loader2, Download, PlusCircle, Heart, CreditCard, Info } from 'lucide-react';
import { useLoyaltyMembers } from '@/hooks/loyalty/useLoyaltyMembers';
import { useLoyaltyServices } from '@/hooks/loyalty/useLoyaltyServices';
import { toast } from 'sonner';

const LoyaltyActivities: React.FC = () => {
  const { members, isLoading: isLoadingMembers } = useLoyaltyMembers();
  const { services, isLoading, addService, refreshServices } = useLoyaltyServices();

  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceData, setServiceData] = useState({
    member_id: '',
    service_type: '',
    amount: 0,
    property: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const handleAddService = async () => {
    if (!serviceData.member_id || !serviceData.service_type || !serviceData.property) {
      toast.error('Please fill out all required fields');
      return;
    }

    if (serviceData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    try {
      await addService(serviceData);
      setServiceData({
        member_id: '',
        service_type: '',
        amount: 0,
        property: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      setIsAddingService(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const downloadServices = () => {
    const csvHeader = "Date,Member,Service Type,Amount,Property,Points Earned\n";
    const csvData = services.map(s => 
      `${format(new Date(s.date), 'yyyy-MM-dd')},${s.memberName},"${s.service_type}",${s.amount},"${s.property}",${s.points_earned}`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `loyalty-services-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Service data downloaded successfully');
  };

  const handleRefresh = () => {
    refreshServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Activities</h1>
          <p className="text-muted-foreground">
            Track member activities and services that earn loyalty points.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={downloadServices} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Restaurant Visits</CardTitle>
              <CardDescription>Dining experiences</CardDescription>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.service_type === 'Restaurant').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total spend: ${services
                .filter(s => s.service_type === 'Restaurant')
                .reduce((sum, s) => sum + s.amount, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Spa Treatments</CardTitle>
              <CardDescription>Wellness services</CardDescription>
            </div>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.service_type === 'Spa').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total spend: ${services
                .filter(s => s.service_type === 'Spa')
                .reduce((sum, s) => sum + s.amount, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Other Services</CardTitle>
              <CardDescription>Additional amenities</CardDescription>
            </div>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => !['Restaurant', 'Spa'].includes(s.service_type)).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total spend: ${services
                .filter(s => !['Restaurant', 'Spa'].includes(s.service_type))
                .reduce((sum, s) => sum + s.amount, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Member Activity</DialogTitle>
              <DialogDescription>
                Record a service or activity that earns loyalty points.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member">Member</Label>
                <Select onValueChange={(value) => setServiceData({...serviceData, member_id: value})}>
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
                <Label htmlFor="service-type">Service Type</Label>
                <Select onValueChange={(value) => setServiceData({...serviceData, service_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Spa">Spa</SelectItem>
                    <SelectItem value="Golf">Golf</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                    <SelectItem value="Pool">Pool</SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Room Service">Room Service</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={serviceData.amount}
                  onChange={(e) => setServiceData({...serviceData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property">Property</Label>
                <Input 
                  id="property" 
                  placeholder="e.g., Grand Hotel"
                  value={serviceData.property}
                  onChange={(e) => setServiceData({...serviceData, property: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={serviceData.date}
                  onChange={(e) => setServiceData({...serviceData, date: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingService(false)}>Cancel</Button>
              <Button onClick={handleAddService}>
                Add Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="spa">Spa</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Activities Recorded Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 mb-4">
                Start by recording member activities that earn loyalty points.
              </p>
              <Button onClick={() => setIsAddingService(true)}>Record First Activity</Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A history of all member activities and services.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Points Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{format(new Date(service.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{service.memberName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {service.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell>${service.amount.toFixed(2)}</TableCell>
                    <TableCell>{service.property}</TableCell>
                    <TableCell>{service.points_earned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="restaurant">
          <Table>
            <TableCaption>Restaurant visits and dining experiences.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services
                .filter(service => service.service_type === 'Restaurant')
                .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{format(new Date(service.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{service.memberName}</TableCell>
                    <TableCell>${service.amount.toFixed(2)}</TableCell>
                    <TableCell>{service.property}</TableCell>
                    <TableCell>{service.points_earned}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="spa">
          <Table>
            <TableCaption>Spa treatments and wellness services.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services
                .filter(service => service.service_type === 'Spa')
                .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{format(new Date(service.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{service.memberName}</TableCell>
                    <TableCell>${service.amount.toFixed(2)}</TableCell>
                    <TableCell>{service.property}</TableCell>
                    <TableCell>{service.points_earned}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="other">
          <Table>
            <TableCaption>Other services and amenities.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services
                .filter(service => !['Restaurant', 'Spa'].includes(service.service_type))
                .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{format(new Date(service.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{service.memberName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {service.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell>${service.amount.toFixed(2)}</TableCell>
                    <TableCell>{service.property}</TableCell>
                    <TableCell>{service.points_earned}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyActivities;
