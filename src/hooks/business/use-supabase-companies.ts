
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Company } from '@/types/business';

export const useSupabaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all companies
  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      // Cast data to the correct type
      setCompanies(data as unknown as Company[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch companies: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new company
  const addCompany = async (newCompany: Omit<Company, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select();

      if (error) throw error;
      setCompanies(prev => [...prev, data[0] as unknown as Company]);
      toast.success('Company created successfully');
      return data[0] as unknown as Company;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create company: ' + errorMessage);
      throw error;
    }
  };

  // Update a company
  const updateCompany = async (updatedCompany: Company) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updatedCompany)
        .eq('id', updatedCompany.id)
        .select();

      if (error) throw error;
      setCompanies(prev => 
        prev.map(company => company.id === updatedCompany.id ? (data[0] as unknown as Company) : company)
      );
      toast.success('Company updated successfully');
      return data[0] as unknown as Company;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update company: ' + errorMessage);
      throw error;
    }
  };

  // Delete a company
  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCompanies(prev => prev.filter(company => company.id !== id));
      toast.success('Company deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete company: ' + errorMessage);
      throw error;
    }
  };

  // Get a single company by ID
  const getCompany = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Company | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch company: ' + errorMessage);
      throw error;
    }
  };

  // Fetch companies on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    isLoading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    refreshCompanies: fetchCompanies
  };
};
