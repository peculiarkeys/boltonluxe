
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Booking } from '@/types/database';

export const useSupabaseBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format dates for Supabase
  const formatDateForSupabase = (date: string | Date | undefined | null) => {
    if (!date) return null;
    return typeof date === 'string' ? date : date.toISOString();
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false });

      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new booking
  const addBooking = async (newBooking: Omit<Booking, 'id'>) => {
    try {
      // Ensure dates are in the correct format
      const formattedBooking = {
        ...newBooking,
        check_in: formatDateForSupabase(newBooking.check_in),
        check_out: formatDateForSupabase(newBooking.check_out),
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([formattedBooking])
        .select();

      if (error) throw error;
      setBookings(prev => [...prev, data[0] as Booking]);
      toast.success('Booking created successfully');
      return data[0] as Booking;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to create booking');
      throw error;
    }
  };

  // Update a booking
  const updateBooking = async (updatedBooking: Booking) => {
    try {
      // Ensure dates are in the correct format
      const formattedBooking = {
        ...updatedBooking,
        check_in: formatDateForSupabase(updatedBooking.check_in),
        check_out: formatDateForSupabase(updatedBooking.check_out),
      };

      const { data, error } = await supabase
        .from('bookings')
        .update(formattedBooking)
        .eq('id', updatedBooking.id)
        .select();

      if (error) throw error;
      setBookings(prev => 
        prev.map(booking => booking.id === updatedBooking.id ? (data[0] as Booking) : booking)
      );
      toast.success('Booking updated successfully');
      return data[0] as Booking;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to update booking');
      throw error;
    }
  };

  // Delete a booking
  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast.success('Booking deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to delete booking');
      throw error;
    }
  };

  // Get a single booking by ID
  const getBooking = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Booking | null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to fetch booking');
      throw error;
    }
  };

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    isLoading,
    error,
    addBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    refreshBookings: fetchBookings
  };
};
