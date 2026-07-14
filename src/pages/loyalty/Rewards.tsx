
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Gift, Plus, Edit, Archive, Clock, Tag } from 'lucide-react';
import { LoyaltyReward, useLoyaltyRewards } from '@/hooks/loyalty/useLoyaltyRewards';

const RewardForm = ({ 
  reward, 
  onSubmit, 
  isLoading 
}: { 
  reward?: LoyaltyReward; 
  onSubmit: (data: Partial<LoyaltyReward>) => void; 
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<Partial<LoyaltyReward>>(
    reward || {
      reward_id: `RW${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: '',
      description: '',
      points_cost: 1000,
      category: 'Room',
      availability: 'All Properties',
      status: 'Active'
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
          <Label htmlFor="reward_id">Reward ID</Label>
          <Input 
            id="reward_id" 
            name="reward_id" 
            value={formData.reward_id || ''} 
            onChange={handleChange}
            required
            readOnly={!!reward} // Only editable for new rewards
            className={reward ? "bg-gray-100" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Reward Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name || ''} 
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="points_cost">Points Cost</Label>
          <Input 
            id="points_cost" 
            name="points_cost" 
            type="number" 
            min="1"
            value={formData.points_cost || 1000} 
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            name="category" 
            value={formData.category as string} 
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Room">Room</SelectItem>
              <SelectItem value="Dining">Dining</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Input 
            id="availability" 
            name="availability" 
            value={formData.availability || ''} 
            onChange={handleChange}
            placeholder="e.g., All Properties, Specific Hotels"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            name="status" 
            value={formData.status as string} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description || ''} 
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (reward ? 'Update Reward' : 'Add Reward')}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Rewards = () => {
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [editingReward, setEditingReward] = useState<LoyaltyReward | undefined>(undefined);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReward, setDeletingReward] = useState<LoyaltyReward | undefined>(undefined);
  
  const { 
    isLoading, 
    fetchRewards,
    createReward,
    updateReward,
    deleteReward
  } = useLoyaltyRewards();

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    const data = await fetchRewards();
    setRewards(data);
  };

  const handleCreateReward = async (data: Partial<LoyaltyReward>) => {
    const result = await createReward(data as Omit<LoyaltyReward, 'id' | 'created_at' | 'updated_at'>);
    if (result) {
      setAddDialogOpen(false);
      loadRewards();
    }
  };

  const handleUpdateReward = async (data: Partial<LoyaltyReward>) => {
    if (!editingReward) return;
    
    const result = await updateReward(editingReward.id, data);
    if (result) {
      setEditDialogOpen(false);
      setEditingReward(undefined);
      loadRewards();
    }
  };

  const handleDeleteReward = async () => {
    if (!deletingReward) return;
    
    const result = await deleteReward(deletingReward.id);
    if (result) {
      setDeleteDialogOpen(false);
      setDeletingReward(undefined);
      loadRewards();
    }
  };

  // Category colors for badges
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Room':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Dining':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Wellness':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Transportation':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Experience':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Status colors for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'Seasonal':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Rewards</h1>
          <p className="text-muted-foreground mt-2">
            Manage rewards and benefits available to loyalty program members
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 sm:self-end">
              <Plus className="w-4 h-4" />
              <span>Add New Reward</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Reward</DialogTitle>
              <DialogDescription>
                Create a new reward that members can redeem with their loyalty points.
              </DialogDescription>
            </DialogHeader>
            <RewardForm onSubmit={handleCreateReward} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className={getCategoryColor(reward.category)}>
                  {reward.category}
                </Badge>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingReward(reward);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setDeletingReward(reward);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-2 text-xl">
                {reward.name}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {reward.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Reward ID: {reward.reward_id}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Available at: {reward.availability}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4 flex justify-between items-center">
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-primary" />
                <span className="font-bold text-lg">{reward.points_cost.toLocaleString()} points</span>
              </div>
              <Badge variant="outline" className={getStatusColor(reward.status)}>
                {reward.status}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Reward Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogDescription>
              Update information for this loyalty reward.
            </DialogDescription>
          </DialogHeader>
          {editingReward && (
            <RewardForm 
              reward={editingReward} 
              onSubmit={handleUpdateReward} 
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
              {deletingReward && (
                <>Are you sure you want to delete the "{deletingReward.name}" reward? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteReward} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Reward'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
