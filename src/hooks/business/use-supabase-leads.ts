
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from '@/types/business';

export const useSupabaseLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leads
  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data as unknown as Lead[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch leads: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new lead
  const addLead = async (newLead: Omit<Lead, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select();

      if (error) throw error;
      setLeads(prev => [...prev, data[0] as unknown as Lead]);
      toast.success('Lead created successfully');
      return data[0] as unknown as Lead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create lead: ' + errorMessage);
      throw error;
    }
  };

  // Update a lead
  const updateLead = async (updatedLead: Lead) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', updatedLead.id)
        .select();

      if (error) throw error;
      setLeads(prev => 
        prev.map(lead => lead.id === updatedLead.id ? (data[0] as unknown as Lead) : lead)
      );
      toast.success('Lead updated successfully');
      return data[0] as unknown as Lead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update lead: ' + errorMessage);
      throw error;
    }
  };

  // Delete a lead
  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLeads(prev => prev.filter(lead => lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete lead: ' + errorMessage);
      throw error;
    }
  };

  // Get a single lead by ID
  const getLead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Lead | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch lead: ' + errorMessage);
      throw error;
    }
  };

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    isLoading,
    error,
    addLead,
    updateLead,
    deleteLead,
    getLead,
    refreshLeads: fetchLeads
  };
};
