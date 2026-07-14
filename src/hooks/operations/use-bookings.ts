
import { useState, useEffect } from 'react';
import { addDays, subDays, format } from 'date-fns';

const generateMockBookings = () => {
  const today = new Date();
  const statuses = ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'];
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];
  const guestNames = [
    'John Smith', 'Sarah Johnson', 'Robert Williams', 'Maria Garcia', 
    'David Brown', 'Jennifer Miller', 'Michael Davis', 'Emma Wilson', 
    'James Taylor', 'Patricia Martinez', 'Christopher Anderson', 'Linda Thomas',
    'Daniel Jackson', 'Elizabeth White', 'Matthew Harris', 'Susan Martin'
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const checkIn = addDays(subDays(today, 15), Math.floor(Math.random() * 30));
    const nights = Math.floor(Math.random() * 7) + 1;
    const checkOut = addDays(checkIn, nights);
    
    return {
      bookingId: `BK-${10000 + i}`,
      guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
      roomNumber: String(100 + Math.floor(Math.random() * 400)),
      roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights,
      totalAmount: (Math.floor(Math.random() * 200) + 100) * nights,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      guestEmail: `guest${i}@example.com`,
      guestPhone: `+1 555-${1000 + Math.floor(Math.random() * 9000)}`,
      paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
      specialRequests: Math.random() > 0.7 ? 'Late check-in requested' : '',
    };
  });
};

export const useMockBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBookings(generateMockBookings());
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  const addBooking = (booking: any) => {
    setBookings(prev => [
      {
        ...booking,
        bookingId: `BK-${10000 + bookings.length}`,
      },
      ...prev
    ]);
  };

  const updateBooking = (updatedBooking: any) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
      )
    );
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
  };

  return {
    bookings,
    isLoading,
    addBooking,
    updateBooking,
    deleteBooking
  };
};
