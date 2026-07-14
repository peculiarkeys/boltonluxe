
import { useState, useEffect } from 'react';
import { addDays, subDays, format } from 'date-fns';

const generateMockGuests = () => {
  const today = new Date();
  const statuses = ['active', 'blacklisted', 'vip'];
  const nationalities = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'South Africa'];
  const preferredRooms = ['Standard', 'Deluxe', 'Suite', 'Executive'];
  
  const firstNames = ['John', 'Sarah', 'Robert', 'Maria', 'David', 'Jennifer', 'Michael', 'Emma', 'James', 'Patricia', 'Christopher', 'Linda', 'Daniel', 'Elizabeth', 'Matthew', 'Susan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Garcia', 'Brown', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];

  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const lastStayDate = addDays(subDays(today, Math.floor(Math.random() * 100) + 1), Math.floor(Math.random() * 10));
    
    return {
      id: `guest-${10000 + i}`,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      address: `${Math.floor(Math.random() * 9000) + 1000} Main St, Anytown, USA`,
      dob: format(subDays(today, Math.floor(Math.random() * 20000) + 7300), 'yyyy-MM-dd'), // 20-60 years ago
      status: statuses[Math.floor(Math.random() * statuses.length)],
      passportNumber: `P${Math.floor(Math.random() * 10000000)}`,
      lastStay: format(lastStayDate, 'MMM dd, yyyy'),
      totalStays: Math.floor(Math.random() * 10) + 1,
      totalSpent: Math.floor(Math.random() * 5000) + 500,
      preferredRoom: preferredRooms[Math.floor(Math.random() * preferredRooms.length)],
      notes: Math.random() > 0.7 ? 'Prefers quiet rooms away from elevator' : '',
      avatar: Math.random() > 0.7 ? `https://i.pravatar.cc/150?u=${i}` : '',
      loyaltyPoints: Math.floor(Math.random() * 5000),
      specialRequests: Math.random() > 0.7 ? 'Extra pillows, late checkout' : '',
      paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Debit Card',
    };
  });
};

export const useMockGuests = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGuests(generateMockGuests());
      setIsLoading(false);
    };

    fetchGuests();
  }, []);

  const addGuest = (guest: any) => {
    setGuests(prev => [
      {
        ...guest,
        id: `guest-${10000 + guests.length}`,
      },
      ...prev
    ]);
  };

  const updateGuest = (updatedGuest: any) => {
    setGuests(prev => 
      prev.map(guest => 
        guest.id === updatedGuest.id ? updatedGuest : guest
      )
    );
  };

  const deleteGuest = (guestId: string) => {
    setGuests(prev => prev.filter(guest => guest.id !== guestId));
  };

  return {
    guests,
    isLoading,
    addGuest,
    updateGuest,
    deleteGuest
  };
};
