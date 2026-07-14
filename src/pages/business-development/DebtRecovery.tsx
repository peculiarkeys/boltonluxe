
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  FileText,
  ArrowUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSupabaseDebtRecovery } from '@/hooks/business/use-supabase-debt-recovery';
import { DebtRecovery } from '@/types/business';
import DebtRecoveryForm from '@/components/business/DebtRecoveryForm';

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'partial':
      return 'bg-blue-500';
    case 'paid':
      return 'bg-green-500';
    case 'overdue':
      return 'bg-red-500';
    case 'in-collection':
      return 'bg-purple-500';
    case 'written-off':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const DebtRecoveryPage = () => {
  const { debts, isLoading, error, addDebt, updateDebt, deleteDebt, refreshDebts } = useSupabaseDebtRecovery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtRecovery | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<string | null>(null);

  const handleCreateDebt = () => {
    setSelectedDebt(null);
    setIsFormOpen(true);
  };

  const handleEditDebt = (debt: DebtRecovery) => {
    setSelectedDebt(debt);
    setIsFormOpen(true);
  };

  const handleDeleteDebt = (id: string) => {
    setDebtToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (debtToDelete) {
      await deleteDebt(debtToDelete);
      setIsConfirmDeleteOpen(false);
      setDebtToDelete(null);
    }
  };

  const handleFormSubmit = async (debtData: any) => {
    try {
      if (selectedDebt) {
        await updateDebt({ ...selectedDebt, ...debtData });
      } else {
        await addDebt(debtData);
      }
      setIsFormOpen(false);
      refreshDebts();
    } catch (error) {
      console.error('Error saving debt:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading debt records...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading debt records: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debt Recovery</h1>
          <p className="text-muted-foreground">Manage outstanding debts and payments</p>
        </div>
        <Button onClick={handleCreateDebt}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Debt
        </Button>
      </div>

      <Table>
        <TableCaption>A list of all outstanding and recovered debts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              <div className="flex items-center">
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No debt records found
              </TableCell>
            </TableRow>
          ) : (
            debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell className="font-medium">{debt.company_name || 'N/A'}</TableCell>
                <TableCell>{debt.contact_name || 'N/A'}</TableCell>
                <TableCell>${debt.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(debt.due_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={getBadgeColor(debt.status)}>
                    {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditDebt(debt)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteDebt(debt.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Debt Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDebt ? 'Edit Debt Record' : 'Add New Debt Record'}</DialogTitle>
            <DialogDescription>
              {selectedDebt
                ? 'Update the debt information below'
                : 'Enter the details for the new debt record'}
            </DialogDescription>
          </DialogHeader>
          <DebtRecoveryForm
            initialData={selectedDebt}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this debt record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DebtRecoveryPage;
