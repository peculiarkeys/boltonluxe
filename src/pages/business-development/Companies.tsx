
import React, { useState, useEffect } from 'react';
import { useSupabaseCompanies } from '@/hooks/business/use-supabase-companies';
import { useSupabaseRelationshipManagers } from '@/hooks/business/use-supabase-relationship-managers';
import { Company } from '@/types/business';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Building2, PenLine, Trash2, Plus, UserPlus } from 'lucide-react';

const CompaniesPage = () => {
  const { companies, isLoading, error, addCompany, updateCompany, deleteCompany, refreshCompanies } = useSupabaseCompanies();
  const { relationshipManagers, isLoading: isLoadingManagers } = useSupabaseRelationshipManagers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    industry: '',
    size: '',
    website: '',
    address: '',
    revenue: '',
    status: 'active' as 'active' | 'inactive' | 'prospect' | 'client',
    notes: '',
    assigned_to: '',
    relationship_manager: '',
    relationship_manager_name: '',
  });

  useEffect(() => {
    if (currentCompany) {
      setFormData({
        company_id: currentCompany.company_id,
        name: currentCompany.name,
        industry: currentCompany.industry || '',
        size: currentCompany.size || '',
        website: currentCompany.website || '',
        address: currentCompany.address || '',
        revenue: currentCompany.revenue?.toString() || '',
        status: currentCompany.status,
        notes: currentCompany.notes || '',
        assigned_to: currentCompany.assigned_to || '',
        relationship_manager: currentCompany.relationship_manager || '',
        relationship_manager_name: currentCompany.relationship_manager_name || '',
      });
    }
  }, [currentCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRelationshipManagerChange = (managerId: string) => {
    const manager = relationshipManagers.find(m => m.id === managerId);
    setFormData(prev => ({
      ...prev,
      relationship_manager: managerId,
      relationship_manager_name: manager ? manager.name : '',
    }));
  };

  const resetForm = () => {
    setFormData({
      company_id: `COM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: '',
      industry: '',
      size: '',
      website: '',
      address: '',
      revenue: '',
      status: 'active',
      notes: '',
      assigned_to: '',
      relationship_manager: '',
      relationship_manager_name: '',
    });
  };

  const handleAddCompany = async () => {
    try {
      const newCompany: Omit<Company, 'id'> = {
        ...formData,
        revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
      };
      
      await addCompany(newCompany);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Company added successfully');
    } catch (err) {
      console.error('Error adding company:', err);
      toast.error('Failed to add company');
    }
  };

  const handleUpdateCompany = async () => {
    if (!currentCompany) return;
    
    try {
      const updatedCompany: Company = {
        ...currentCompany,
        ...formData,
        revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
      };
      
      await updateCompany(updatedCompany);
      setIsEditDialogOpen(false);
      setCurrentCompany(null);
      toast.success('Company updated successfully');
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error('Failed to update company');
    }
  };

  const handleDeleteCompany = async () => {
    if (!currentCompany) return;
    
    try {
      await deleteCompany(currentCompany.id);
      setIsDeleteDialogOpen(false);
      setCurrentCompany(null);
      toast.success('Company deleted successfully');
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Failed to delete company');
    }
  };

  const openEditDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  if (isLoading || isLoadingManagers) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading companies: {error}</p>
          <Button variant="outline" onClick={refreshCompanies} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            Manage company information and details
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies List</CardTitle>
          <CardDescription>A list of all companies in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
              <div className="mt-6">
                <Button onClick={openAddDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Add Company
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Relationship Manager</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_id}</TableCell>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.industry || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${company.status === 'active' ? 'bg-green-50 text-green-700' : ''}
                          ${company.status === 'inactive' ? 'bg-gray-50 text-gray-700' : ''}
                          ${company.status === 'prospect' ? 'bg-blue-50 text-blue-700' : ''}
                          ${company.status === 'client' ? 'bg-purple-50 text-purple-700' : ''}
                        `}>
                          {company.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {company.relationship_manager_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(company)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(company)}
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

      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>
              Enter the details of the new company.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company_id" className="text-right">
                ID
              </Label>
              <Input
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleInputChange}
                className="col-span-3"
                readOnly
              />
            </div>
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
              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revenue" className="text-right">
                Revenue
              </Label>
              <Input
                id="revenue"
                name="revenue"
                type="number"
                value={formData.revenue}
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
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relationship_manager" className="text-right">
                Relationship Manager
              </Label>
              <Select 
                value={formData.relationship_manager} 
                onValueChange={(value) => handleRelationshipManagerChange(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Assign a relationship manager" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompany} disabled={!formData.name}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_company_id" className="text-right">
                ID
              </Label>
              <Input
                id="edit_company_id"
                name="company_id"
                value={formData.company_id}
                className="col-span-3"
                readOnly
              />
            </div>
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
              <Label htmlFor="edit_industry" className="text-right">
                Industry
              </Label>
              <Input
                id="edit_industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_size" className="text-right">
                Size
              </Label>
              <Input
                id="edit_size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_website" className="text-right">
                Website
              </Label>
              <Input
                id="edit_website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_address" className="text-right">
                Address
              </Label>
              <Input
                id="edit_address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_revenue" className="text-right">
                Revenue
              </Label>
              <Input
                id="edit_revenue"
                name="revenue"
                type="number"
                value={formData.revenue}
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
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_relationship_manager" className="text-right">
                Relationship Manager
              </Label>
              <Select 
                value={formData.relationship_manager} 
                onValueChange={(value) => handleRelationshipManagerChange(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Assign a relationship manager" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_notes" className="text-right">
                Notes
              </Label>
              <Input
                id="edit_notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCompany} disabled={!formData.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesPage;
