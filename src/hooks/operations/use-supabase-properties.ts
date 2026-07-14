
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id: string;
  name: string;
  location: string;
  rooms: number;
  capacity: number;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export const useSupabaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all properties
  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch properties');
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new property
  const addProperty = async (newProperty: Omit<Property, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select();

      if (error) throw error;
      setProperties(prev => [data[0] as Property, ...prev]);
      toast.success('Property added successfully');
      return data[0] as Property;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to add property');
      console.error('Error adding property:', error);
      throw error;
    }
  };

  // Update a property
  const updateProperty = async (updatedProperty: Property) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updatedProperty)
        .eq('id', updatedProperty.id)
        .select();

      if (error) throw error;
      setProperties(prev => 
        prev.map(property => property.id === updatedProperty.id ? (data[0] as Property) : property)
      );
      toast.success('Property updated successfully');
      return data[0] as Property;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update property');
      console.error('Error updating property:', error);
      throw error;
    }
  };

  // Delete a property
  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(prev => prev.filter(property => property.id !== id));
      toast.success('Property deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete property');
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: fetchProperties
  };
};
