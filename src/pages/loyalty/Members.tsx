import React, { useState, useEffect } from 'react';
import { getLuxePointsReferenceValue, formatNairaValue } from '@/hooks/loyalty/loyaltyUtils';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
            readOnly={!!member}
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
  
  // Sheet state
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

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
      if (selectedMember && selectedMember.id === editingMember.id) {
        setSelectedMember(result);
      }
      loadMembers();
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    
    const result = await deleteMember(deletingMember.id);
    if (result) {
      setDeleteDialogOpen(false);
      if (selectedMember && selectedMember.id === deletingMember.id) {
        setSheetOpen(false);
      }
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
      if (selectedMember && selectedMember.id === adjustPointsMember.id) {
        setSelectedMember(result);
      }
      loadMembers();
    }
  };

  const handleExportMembers = async () => {
    await exportMembersToCSV();
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-zinc-800 text-white';
      case 'gold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver':
        return 'bg-zinc-200 text-zinc-700 border-zinc-300';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-emerald-600';
      case 'inactive':
        return 'text-zinc-500';
      case 'pending':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-zinc-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-800 tracking-tight">Loyalty Members</h1>
          <p className="text-zinc-500 font-medium mt-1">
            Manage members of the Bolton Loyalty Program
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:self-end flex gap-2 font-medium">
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search members..."
            className="pl-9 bg-white border-zinc-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select 
          defaultValue="all" 
          onValueChange={setTierFilter}
          value={tierFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-zinc-200">
            <Filter className="h-4 w-4 mr-2 text-zinc-500" />
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
        <Button variant="outline" size="icon" className="border-zinc-200 bg-white" onClick={handleExportMembers} disabled={isLoading}>
          <DownloadCloud className="h-4 w-4 text-zinc-600" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500 font-medium bg-zinc-50/50 rounded-2xl border border-zinc-200 border-dashed">
            {isLoading ? 'Loading members...' : 'No members found.'}
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => {
                setSelectedMember(member);
                setSheetOpen(true);
              }}
              className="group flex flex-col bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${getTierColor(member.tier)}`}>
                  {member.tier}
                </span>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-200">
                      <DropdownMenuItem className="flex gap-2 cursor-pointer font-medium text-zinc-700 focus:bg-zinc-50 focus:text-zinc-900" onClick={() => { setEditingMember(member); setEditDialogOpen(true); }}>
                        <Edit2 className="h-4 w-4" /> <span>Edit Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer font-medium text-zinc-700 focus:bg-zinc-50 focus:text-zinc-900" onClick={() => { setAdjustPointsMember(member); setPointsDialogOpen(true); }}>
                        <Award className="h-4 w-4" /> <span>Adjust Points</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer text-red-600 font-medium focus:bg-red-50 focus:text-red-700" onClick={() => { setDeletingMember(member); setDeleteDialogOpen(true); }}>
                        <Trash className="h-4 w-4" /> <span>Delete Member</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 text-sm font-semibold ring-1 ring-zinc-200/50">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-zinc-800 text-lg leading-tight">{member.name}</h3>
                  <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    {member.member_id}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 mb-5 flex-1">
                {member.email && (
                  <div className="flex items-center gap-2.5 text-zinc-600 text-sm font-medium">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2.5 text-zinc-600 text-sm font-medium">
                    <Phone className="h-4 w-4 text-zinc-400" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-zinc-600 text-sm font-medium">
                  <BadgeCheck className="h-4 w-4 text-zinc-400" />
                  <span className={`flex items-center gap-1.5 ${getStatusColor(member.status)}`}>
                    {getStatusIcon(member.status)}
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-800 leading-none">{member.points.toLocaleString()} <span className="text-zinc-500 font-medium text-[10px]">pts</span></span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-0.5">≈ {formatNairaValue(getLuxePointsReferenceValue(member.points))}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                  {member.stays} {member.stays === 1 ? 'stay' : 'stays'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Details Side Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto border-l-zinc-200 p-0">
          <div className="p-6">
            <SheetHeader className="pb-6 border-b border-zinc-100 text-left">
              <SheetTitle className="text-2xl font-semibold text-zinc-800">Member Details</SheetTitle>
              <SheetDescription className="text-zinc-500 font-medium">View full profile and activities.</SheetDescription>
            </SheetHeader>
            
            {selectedMember && (
              <div className="py-6 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 text-xl font-semibold shadow-sm ring-1 ring-zinc-200/50">
                    {selectedMember.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-800">{selectedMember.name}</h3>
                    <p className="text-sm font-medium text-zinc-500 flex items-center gap-1.5 mt-1">
                      <User className="h-3.5 w-3.5" />
                      {selectedMember.member_id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Status</p>
                    <p className={`font-semibold text-sm flex items-center gap-1.5 ${getStatusColor(selectedMember.status)}`}>
                      {getStatusIcon(selectedMember.status)}
                      {selectedMember.status}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Tier</p>
                    <span className={`px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-semibold tracking-wide border inline-block ${getTierColor(selectedMember.tier)}`}>
                      {selectedMember.tier}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Points</p>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold text-zinc-800 flex items-center gap-1.5 leading-none">
                        <Award className="h-4 w-4 text-primary" />
                        {selectedMember.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium mt-1 ml-5">
                        ≈ {formatNairaValue(getLuxePointsReferenceValue(selectedMember.points))}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Stays</p>
                    <p className="text-lg font-semibold text-zinc-800">{selectedMember.stays}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider border-b border-zinc-100 pb-2">Contact Information</h4>
                  <div className="space-y-3">
                    {selectedMember.email && (
                      <div className="flex items-start gap-3 text-zinc-600 font-medium text-sm">
                        <Mail className="h-4 w-4 mt-0.5 text-zinc-400" />
                        <span>{selectedMember.email}</span>
                      </div>
                    )}
                    {selectedMember.phone && (
                      <div className="flex items-start gap-3 text-zinc-600 font-medium text-sm">
                        <Phone className="h-4 w-4 mt-0.5 text-zinc-400" />
                        <span>{selectedMember.phone}</span>
                      </div>
                    )}
                    {selectedMember.address && (
                      <div className="flex items-start gap-3 text-zinc-600 font-medium text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-zinc-400" />
                        <span>{selectedMember.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider border-b border-zinc-100 pb-2">Additional Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-zinc-600 font-medium">
                      <CalendarDays className="h-4 w-4 mt-0.5 text-zinc-400" />
                      <div>
                        <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wider">Member Since</p>
                        <p>{new Date(selectedMember.join_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedMember.birthdate && (
                      <div className="flex items-start gap-3 text-zinc-600 font-medium">
                        <User className="h-4 w-4 mt-0.5 text-zinc-400" />
                        <div>
                          <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wider">Birth Date</p>
                          <p>{new Date(selectedMember.birthdate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    {selectedMember.preferences && (
                      <div className="flex items-start gap-3 text-zinc-600 font-medium">
                        <BadgeCheck className="h-4 w-4 mt-0.5 text-zinc-400" />
                        <div>
                          <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wider">Preferences</p>
                          <p>{selectedMember.preferences}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-6 border-t border-zinc-100">
                  <Button className="flex-1 font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => {
                    setEditingMember(selectedMember);
                    setEditDialogOpen(true);
                    setSheetOpen(false);
                  }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1 font-semibold rounded-xl border-zinc-200 hover:bg-zinc-50 text-zinc-700" onClick={() => {
                    setAdjustPointsMember(selectedMember);
                    setPointsDialogOpen(true);
                    setSheetOpen(false);
                  }}>
                    <Award className="w-4 h-4 mr-2 text-zinc-500" />
                    Adjust Points
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 font-semibold">Edit Member</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
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
        <DialogContent className="border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 font-semibold">Adjust Member Points</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              {adjustPointsMember && (
                <>Add or deduct points for <span className="font-semibold">{adjustPointsMember.name}</span> (Current: {adjustPointsMember.points.toLocaleString()} points).</>
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
        <DialogContent className="border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-zinc-800 font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              {deletingMember && (
                <>Are you sure you want to delete <span className="font-semibold text-zinc-800">{deletingMember.name}</span>? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="font-semibold border-zinc-200" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="font-semibold" onClick={handleDeleteMember} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
