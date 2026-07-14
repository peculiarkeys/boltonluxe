
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, PenLine, Trash2, Plus, UsersRound } from 'lucide-react';
import { RelationshipManager } from '@/types/business';

const RelationshipManagersPage = () => {
  // Mock data for demonstration
  const [managers, setManagers] = useState<RelationshipManager[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567',
      position: 'Senior Relationship Manager',
      status: 'active',
      assigned_companies: 12,
      assigned_leads: 8,
      assigned_contacts: 25,
      assigned_opportunities: 5,
      last_activity_date: '2023-07-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 555-987-6543',
      position: 'Relationship Manager',
      status: 'active',
      assigned_companies: 8,
      assigned_leads: 15,
      assigned_contacts: 30,
      assigned_opportunities: 7,
      last_activity_date: '2023-07-18',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 555-456-7890',
      position: 'Junior Relationship Manager',
      status: 'active',
      assigned_companies: 5,
      assigned_leads: 10,
      assigned_contacts: 15,
      assigned_opportunities: 3,
      last_activity_date: '2023-07-14',
    },
    {
      id: '4',
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      phone: '+1 555-789-0123',
      position: 'Senior Relationship Manager',
      status: 'inactive',
      assigned_companies: 0,
      assigned_leads: 0,
      assigned_contacts: 0,
      assigned_opportunities: 0,
      last_activity_date: '2023-06-30',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState<RelationshipManager | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      status: 'active',
    });
  };

  const handleAddManager = () => {
    const newManager: RelationshipManager = {
      id: `RM-${Math.floor(Math.random() * 10000)}`,
      ...formData,
      assigned_companies: 0,
      assigned_leads: 0,
      assigned_contacts: 0,
      assigned_opportunities: 0,
      last_activity_date: new Date().toISOString().split('T')[0],
    };

    setManagers(prev => [...prev, newManager]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Relationship Manager added successfully');
  };

  const handleUpdateManager = () => {
    if (!currentManager) return;

    const updatedManagers = managers.map(manager => 
      manager.id === currentManager.id 
        ? { 
            ...manager, 
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            status: formData.status,
          } 
        : manager
    );

    setManagers(updatedManagers);
    setIsEditDialogOpen(false);
    setCurrentManager(null);
    toast.success('Relationship Manager updated successfully');
  };

  const handleDeleteManager = () => {
    if (!currentManager) return;

    const updatedManagers = managers.filter(manager => manager.id !== currentManager.id);
    setManagers(updatedManagers);
    setIsDeleteDialogOpen(false);
    setCurrentManager(null);
    toast.success('Relationship Manager deleted successfully');
  };

  const openEditDialog = (manager: RelationshipManager) => {
    setCurrentManager(manager);
    setFormData({
      name: manager.name,
      email: manager.email || '',
      phone: manager.phone || '',
      position: manager.position || '',
      status: manager.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (manager: RelationshipManager) => {
    setCurrentManager(manager);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relationship Managers</h1>
          <p className="text-muted-foreground">
            Manage team members responsible for business relationships
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Manager
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Managers</CardTitle>
          <CardDescription>View and manage staff who handle client relationships</CardDescription>
        </CardHeader>
        <CardContent>
          {managers.length === 0 ? (
            <div className="text-center py-10">
              <UsersRound className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No managers</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a relationship manager.</p>
              <div className="mt-6">
                <Button onClick={openAddDialog}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Manager
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell className="font-medium">{manager.name}</TableCell>
                      <TableCell>{manager.position || '-'}</TableCell>
                      <TableCell>{manager.email || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${manager.status === 'active' ? 'bg-green-50 text-green-700' : ''}
                          ${manager.status === 'inactive' ? 'bg-gray-50 text-gray-700' : ''}
                        `}>
                          {manager.status}
                        </span>
                      </TableCell>
                      <TableCell>{manager.assigned_companies}</TableCell>
                      <TableCell>{manager.assigned_leads}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(manager)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(manager)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Manager Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Relationship Manager</DialogTitle>
            <DialogDescription>
              Enter the details of the new relationship manager.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status"
                value={formData.status} 
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddManager} disabled={!formData.name}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Manager Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Relationship Manager</DialogTitle>
            <DialogDescription>
              Update the details of this relationship manager.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name" className="text-right">
                Name
              </Label>
              <Input
                id="edit_name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email" className="text-right">
                Email
              </Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit_phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_position" className="text-right">
                Position
              </Label>
              <Input
                id="edit_position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_status" className="text-right">
                Status
              </Label>
              <Select 
                name="status"
                value={formData.status} 
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateManager} disabled={!formData.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Manager Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Relationship Manager</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this relationship manager? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteManager}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelationshipManagersPage;
