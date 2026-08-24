
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Booking } from '@/types/database';

export const useSupabaseBookings = () => {
  const queryClient = useQueryClient();

  const formatDateForSupabase = (date: string | Date | undefined | null) => {
    if (!date) return null;
    return typeof date === 'string' ? date : date.toISOString();
  };

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });

  const addBookingMutation = useMutation({
    mutationFn: async (newBooking: Omit<Booking, 'id'>) => {
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
      return data[0] as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create booking');
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (updatedBooking: Booking) => {
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
      return data[0] as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking updated successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update booking');
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete booking');
    }
  });

  return {
    bookings,
    isLoading,
    error: error instanceof Error ? error.message : null,
    addBooking: addBookingMutation.mutateAsync,
    updateBooking: updateBookingMutation.mutateAsync,
    deleteBooking: deleteBookingMutation.mutateAsync,
    refreshBookings: () => queryClient.invalidateQueries({ queryKey: ['bookings'] })
  };
};
