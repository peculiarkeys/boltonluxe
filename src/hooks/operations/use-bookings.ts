import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false });
        
      if (error) {
        // Fallback silently if table doesn't exist yet
        console.warn('Bookings table might not exist yet:', error.message);
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const addBooking = async (booking: any) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select();
        
      if (error) throw error;
      setBookings(prev => [data[0], ...prev]);
      toast.success('Booking added successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to add booking: ' + error.message);
      return false;
    }
  };

  const updateBooking = async (updatedBooking: any) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update(updatedBooking)
        .eq('id', updatedBooking.id || updatedBooking.bookingId);
        
      if (error) throw error;
      
      setBookings(prev => 
        prev.map(booking => 
          (booking.id || booking.bookingId) === (updatedBooking.id || updatedBooking.bookingId) 
            ? updatedBooking 
            : booking
        )
      );
      toast.success('Booking updated successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to update booking: ' + error.message);
      return false;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
        
      if (error) throw error;
      
      setBookings(prev => prev.filter(booking => booking.id !== bookingId && booking.bookingId !== bookingId));
      toast.success('Booking deleted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete booking: ' + error.message);
      return false;
    }
  };

  return {
    bookings,
    isLoading,
    addBooking,
    updateBooking,
    deleteBooking,
    refreshBookings: fetchBookings
  };
};
