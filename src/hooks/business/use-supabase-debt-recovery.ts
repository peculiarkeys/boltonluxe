
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DebtRecovery } from '@/types/business';

export const useSupabaseDebtRecovery = () => {
  const [debts, setDebts] = useState<DebtRecovery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all debts
  const fetchDebts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('debt_recovery')
        .select('*')
        .order('due_date', { ascending: false });

      if (error) throw error;
      setDebts(data as unknown as DebtRecovery[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch debts: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new debt
  const addDebt = async (newDebt: Omit<DebtRecovery, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('debt_recovery')
        .insert([newDebt])
        .select();

      if (error) throw error;
      setDebts(prev => [...prev, data[0] as unknown as DebtRecovery]);
      toast.success('Debt record created successfully');
      return data[0] as unknown as DebtRecovery;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create debt record: ' + errorMessage);
      throw error;
    }
  };

  // Update a debt
  const updateDebt = async (updatedDebt: DebtRecovery) => {
    try {
      const { data, error } = await supabase
        .from('debt_recovery')
        .update(updatedDebt)
        .eq('id', updatedDebt.id)
        .select();

      if (error) throw error;
      setDebts(prev => 
        prev.map(debt => debt.id === updatedDebt.id ? (data[0] as unknown as DebtRecovery) : debt)
      );
      toast.success('Debt record updated successfully');
      return data[0] as unknown as DebtRecovery;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update debt record: ' + errorMessage);
      throw error;
    }
  };

  // Delete a debt
  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debt_recovery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDebts(prev => prev.filter(debt => debt.id !== id));
      toast.success('Debt record deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete debt record: ' + errorMessage);
      throw error;
    }
  };

  // Get a single debt by ID
  const getDebt = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('debt_recovery')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as DebtRecovery | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch debt record: ' + errorMessage);
      throw error;
    }
  };

  // Fetch debts on mount
  useEffect(() => {
    fetchDebts();
  }, []);

  return {
    debts,
    isLoading,
    error,
    addDebt,
    updateDebt,
    deleteDebt,
    getDebt,
    refreshDebts: fetchDebts
  };
};
