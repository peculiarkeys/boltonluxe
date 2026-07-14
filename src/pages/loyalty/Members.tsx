
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { 
  Award, 
  Search, 
  UserPlus,
  Filter,
  DownloadCloud,
  MoreHorizontal,
  Edit2,
  Trash,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  Clock,
  BadgeCheck,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoyaltyMember, useLoyaltyMembers } from '@/hooks/loyalty/useLoyaltyMembers';

const MemberForm = ({ 
  member, 
  onSubmit, 
  isLoading 
}: { 
  member?: LoyaltyMember; 
  onSubmit: (data: Partial<LoyaltyMember>) => void; 
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<Partial<LoyaltyMember>>(
    member || {
      member_id: `LM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: '',
      email: '',
      phone: '',
      tier: 'Standard',
      points: 0,
      join_date: new Date().toISOString().split('T')[0],
      stays: 0,
      status: 'Active',
      address: '',
      birthdate: '',
      preferences: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="member_id">Member ID</Label>
          <Input 
            id="member_id" 
            name="member_id" 
            value={formData.member_id || ''} 
            onChange={handleChange}
            required
            readOnly={!!member} // Only editable for new members
            className={member ? "bg-gray-100" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name || ''} 
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tier">Membership Tier</Label>
          <Select 
            name="tier" 
            value={formData.tier} 
            onValueChange={(value) => handleSelectChange('tier', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Platinum">Platinum</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input 
            id="points" 
            name="points" 
            type="number" 
            min="0"
            value={formData.points || 0} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stays">Stays</Label>
          <Input 
            id="stays" 
            name="stays" 
            type="number" 
            min="0"
            value={formData.stays || 0} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="join_date">Join Date</Label>
          <Input 
            id="join_date" 
            name="join_date" 
            type="date" 
            value={formData.join_date || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthdate">Birth Date</Label>
          <Input 
            id="birthdate" 
            name="birthdate" 
            type="date" 
            value={formData.birthdate || ''} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address || ''} 
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preferences">Preferences</Label>
        <Input 
          id="preferences" 
          name="preferences" 
          value={formData.preferences || ''} 
          onChange={handleChange}
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
        </Button>
      </DialogFooter>
    </form>
  );
};

const PointsAdjustmentForm = ({ 
  member, 
  onSubmit, 
  isLoading 
}: { 
  member: LoyaltyMember; 
  onSubmit: (points: number, reason: string) => void; 
  isLoading: boolean;
}) => {
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(points, reason);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="points">Points to {points >= 0 ? 'Add' : 'Deduct'}</Label>
        <Input 
          id="points" 
          type="number" 
          value={points} 
          onChange={(e) => setPoints(parseInt(e.target.value))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Input 
          id="reason" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          required
          placeholder="Provide a reason for this adjustment"
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isLoading || points === 0 || !reason.trim()}>
          {isLoading ? 'Processing...' : 'Adjust Points'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Members = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [editingMember, setEditingMember] = useState<LoyaltyMember | undefined>(undefined);
  const [adjustPointsMember, setAdjustPointsMember] = useState<LoyaltyMember | undefined>(undefined);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pointsDialogOpen, setPointsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<LoyaltyMember | undefined>(undefined);
  
  const { 
    isLoading, 
    fetchMembers, 
    createMember, 
    updateMember, 
    deleteMember,
    adjustPoints,
    exportMembersToCSV
  } = useLoyaltyMembers();
  
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await fetchMembers();
    setMembers(data);
  };

  const filteredMembers = members.filter(member => 
    (tierFilter === 'all' || member.tier === tierFilter) &&
    (
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCreateMember = async (data: Partial<LoyaltyMember>) => {
    const result = await createMember(data as Omit<LoyaltyMember, 'id' | 'created_at' | 'updated_at'>);
    if (result) {
      setAddDialogOpen(false);
      loadMembers();
    }
  };

  const handleUpdateMember = async (data: Partial<LoyaltyMember>) => {
    if (!editingMember) return;
    
    const result = await updateMember(editingMember.id, data);
    if (result) {
      setEditDialogOpen(false);
      setEditingMember(undefined);
      loadMembers();
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    
    const result = await deleteMember(deletingMember.id);
    if (result) {
      setDeleteDialogOpen(false);
      setDeletingMember(undefined);
      loadMembers();
    }
  };

  const handleAdjustPoints = async (pointsToAdd: number, reason: string) => {
    if (!adjustPointsMember) return;
    
    const result = await adjustPoints(adjustPointsMember.id, pointsToAdd, reason);
    if (result) {
      setPointsDialogOpen(false);
      setAdjustPointsMember(undefined);
      loadMembers();
    }
  };

  const handleExportMembers = async () => {
    await exportMembersToCSV();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-indigo-100 text-indigo-800';
      case 'Gold':
        return 'bg-amber-100 text-amber-800';
      case 'Silver':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-500';
      case 'Inactive':
        return 'text-gray-500';
      case 'Pending':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Inactive':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Members</h1>
          <p className="text-muted-foreground mt-2">
            Manage members of the Bolton Loyalty Program
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:self-end flex gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Create a new member in the Bolton Loyalty Program.
              </DialogDescription>
            </DialogHeader>
            <MemberForm onSubmit={handleCreateMember} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select 
          defaultValue="all" 
          onValueChange={setTierFilter}
          value={tierFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="Platinum">Platinum</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={handleExportMembers} disabled={isLoading}>
          <DownloadCloud className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(member.tier)}`}>
                  {member.tier}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="flex gap-2 cursor-pointer"
                      onClick={() => {
                        setEditingMember(member);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex gap-2 cursor-pointer"
                      onClick={() => {
                        setAdjustPointsMember(member);
                        setPointsDialogOpen(true);
                      }}
                    >
                      <Award className="h-4 w-4" />
                      <span>Adjust Points</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex gap-2 cursor-pointer text-destructive"
                      onClick={() => {
                        setDeletingMember(member);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-medium">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" />
                    <span>{member.member_id}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1 text-sm">
                {member.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{member.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Joined: {new Date(member.join_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span className="flex items-center gap-1">
                    Status: 
                    <span className={`flex items-center gap-0.5 ${getStatusColor(member.status)}`}>
                      {getStatusIcon(member.status)}
                      {member.status}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-primary" />
                <span className="font-bold">{member.points.toLocaleString()} points</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {member.stays} {member.stays === 1 ? 'stay' : 'stays'}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update information for this loyalty program member.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <MemberForm 
              member={editingMember} 
              onSubmit={handleUpdateMember} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Adjust Points Dialog */}
      <Dialog open={pointsDialogOpen} onOpenChange={setPointsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Member Points</DialogTitle>
            <DialogDescription>
              {adjustPointsMember && (
                <>Add or deduct points for {adjustPointsMember.name} (Current: {adjustPointsMember.points.toLocaleString()} points).</>
              )}
            </DialogDescription>
          </DialogHeader>
          {adjustPointsMember && (
            <PointsAdjustmentForm 
              member={adjustPointsMember} 
              onSubmit={handleAdjustPoints} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deletingMember && (
                <>Are you sure you want to delete {deletingMember.name}? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteMember} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
