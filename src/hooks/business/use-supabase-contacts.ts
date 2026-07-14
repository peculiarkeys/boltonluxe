
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Contact } from '@/types/business';

export const useSupabaseContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setContacts(data as unknown as Contact[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch contacts: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new contact
  const addContact = async (newContact: Omit<Contact, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select();

      if (error) throw error;
      setContacts(prev => [...prev, data[0] as unknown as Contact]);
      toast.success('Contact created successfully');
      return data[0] as unknown as Contact;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create contact: ' + errorMessage);
      throw error;
    }
  };

  // Update a contact
  const updateContact = async (updatedContact: Contact) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updatedContact)
        .eq('id', updatedContact.id)
        .select();

      if (error) throw error;
      setContacts(prev => 
        prev.map(contact => contact.id === updatedContact.id ? (data[0] as unknown as Contact) : contact)
      );
      toast.success('Contact updated successfully');
      return data[0] as unknown as Contact;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update contact: ' + errorMessage);
      throw error;
    }
  };

  // Delete a contact
  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast.success('Contact deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete contact: ' + errorMessage);
      throw error;
    }
  };

  // Get a single contact by ID
  const getContact = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Contact | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch contact: ' + errorMessage);
      throw error;
    }
  };

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    getContact,
    refreshContacts: fetchContacts
  };
};
