
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Opportunity } from '@/types/business';

export const useSupabaseOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all opportunities
  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data as unknown as Opportunity[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch opportunities: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new opportunity
  const addOpportunity = async (newOpportunity: Omit<Opportunity, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([newOpportunity])
        .select();

      if (error) throw error;
      setOpportunities(prev => [...prev, data[0] as unknown as Opportunity]);
      toast.success('Opportunity created successfully');
      return data[0] as unknown as Opportunity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create opportunity: ' + errorMessage);
      throw error;
    }
  };

  // Update an opportunity
  const updateOpportunity = async (updatedOpportunity: Opportunity) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update(updatedOpportunity)
        .eq('id', updatedOpportunity.id)
        .select();

      if (error) throw error;
      setOpportunities(prev => 
        prev.map(opportunity => opportunity.id === updatedOpportunity.id ? (data[0] as unknown as Opportunity) : opportunity)
      );
      toast.success('Opportunity updated successfully');
      return data[0] as unknown as Opportunity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update opportunity: ' + errorMessage);
      throw error;
    }
  };

  // Delete an opportunity
  const deleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOpportunities(prev => prev.filter(opportunity => opportunity.id !== id));
      toast.success('Opportunity deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete opportunity: ' + errorMessage);
      throw error;
    }
  };

  // Get a single opportunity by ID
  const getOpportunity = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Opportunity | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch opportunity: ' + errorMessage);
      throw error;
    }
  };

  // Fetch opportunities on mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunity,
    refreshOpportunities: fetchOpportunities
  };
};
