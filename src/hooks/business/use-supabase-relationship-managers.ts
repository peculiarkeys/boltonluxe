
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RelationshipManager } from '@/types/business';

export const useSupabaseRelationshipManagers = () => {
  const [relationshipManagers, setRelationshipManagers] = useState<RelationshipManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all relationship managers
  const fetchRelationshipManagers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('relationship_managers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      // Cast data to the correct type
      setRelationshipManagers(data as unknown as RelationshipManager[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch relationship managers: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new relationship manager
  const addRelationshipManager = async (newManager: Omit<RelationshipManager, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('relationship_managers')
        .insert([newManager])
        .select();

      if (error) throw error;
      setRelationshipManagers(prev => [...prev, data[0] as unknown as RelationshipManager]);
      toast.success('Relationship manager added successfully');
      return data[0] as unknown as RelationshipManager;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to add relationship manager: ' + errorMessage);
      throw error;
    }
  };

  // Update a relationship manager
  const updateRelationshipManager = async (updatedManager: RelationshipManager) => {
    try {
      const { data, error } = await supabase
        .from('relationship_managers')
        .update(updatedManager)
        .eq('id', updatedManager.id)
        .select();

      if (error) throw error;
      setRelationshipManagers(prev => 
        prev.map(manager => manager.id === updatedManager.id ? (data[0] as unknown as RelationshipManager) : manager)
      );
      toast.success('Relationship manager updated successfully');
      return data[0] as unknown as RelationshipManager;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update relationship manager: ' + errorMessage);
      throw error;
    }
  };

  // Delete a relationship manager
  const deleteRelationshipManager = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relationship_managers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRelationshipManagers(prev => prev.filter(manager => manager.id !== id));
      toast.success('Relationship manager deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete relationship manager: ' + errorMessage);
      throw error;
    }
  };

  // Get a single relationship manager by ID
  const getRelationshipManager = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('relationship_managers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as RelationshipManager | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch relationship manager: ' + errorMessage);
      throw error;
    }
  };

  // Fetch relationship managers on mount
  useEffect(() => {
    fetchRelationshipManagers();
  }, []);

  return {
    relationshipManagers,
    isLoading,
    error,
    addRelationshipManager,
    updateRelationshipManager,
    deleteRelationshipManager,
    getRelationshipManager,
    refreshRelationshipManagers: fetchRelationshipManagers
  };
};
