
import { useState, useEffect } from 'react';

const generateMockRooms = () => {
  const statuses = ['available', 'occupied', 'maintenance', 'cleaning', 'out-of-order'];
  const types = ['standard', 'deluxe', 'suite', 'executive', 'penthouse'];
  const amenities = [
    'Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Coffee Machine', 
    'Safe', 'Desk', 'Bathtub', 'Shower', 'Hairdryer', 'Iron', 'Balcony', 'Ocean View',
    'City View', 'King Bed', 'Queen Bed', 'Twin Beds'
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const roomNumber = 100 + i;
    const floor = Math.floor(roomNumber / 100);
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Rate based on room type
    let baseRate = 0;
    switch(type) {
      case 'standard': baseRate = 100; break;
      case 'deluxe': baseRate = 180; break;
      case 'suite': baseRate = 300; break;
      case 'executive': baseRate = 450; break;
      case 'penthouse': baseRate = 800; break;
    }
    
    // Random rate variation
    const rate = baseRate + Math.floor(Math.random() * 50);
    
    // Random amenities based on room type
    const roomAmenities = [];
    const amenityCount = Math.floor(Math.random() * 5) + 
                         (type === 'standard' ? 3 : 
                         type === 'deluxe' ? 5 : 
                         type === 'suite' ? 7 : 
                         type === 'executive' ? 9 : 11);
    
    // Always include basic amenities
    roomAmenities.push('Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV');
    
    // Add random amenities
    const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
    for (let j = 0; roomAmenities.length < amenityCount && j < shuffledAmenities.length; j++) {
      if (!roomAmenities.includes(shuffledAmenities[j])) {
        roomAmenities.push(shuffledAmenities[j]);
      }
    }
    
    return {
      id: `room-${roomNumber}`,
      roomNumber: roomNumber,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Room ${roomNumber}`,
      floor,
      type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      rate,
      capacity: type === 'standard' ? 2 : type === 'deluxe' ? 2 : type === 'suite' ? 4 : type === 'executive' ? 2 : 6,
      amenities: roomAmenities,
      description: `A comfortable ${type} room with all the amenities needed for a pleasant stay.`,
      size: type === 'standard' ? '25 m²' : type === 'deluxe' ? '35 m²' : type === 'suite' ? '55 m²' : type === 'executive' ? '45 m²' : '100 m²',
      bedType: type === 'standard' ? 'Queen Bed' : type === 'deluxe' ? 'King Bed' : type === 'suite' ? 'King Bed + Sofa Bed' : type === 'executive' ? 'King Bed' : 'King Bed + Twin Beds',
      lastCleaned: Math.random() > 0.8 ? null : new Date().toISOString(),
      lastMaintenance: Math.random() > 0.9 ? null : new Date().toISOString(),
      notes: Math.random() > 0.8 ? 'Recent renovation completed' : '',
      image: `https://source.unsplash.com/random/300x200?hotel,room,${type}`,
    };
  });
};

export const useMockRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRooms(generateMockRooms());
      setIsLoading(false);
    };

    fetchRooms();
  }, []);

  const addRoom = (room: any) => {
    setRooms(prev => [
      {
        ...room,
        id: `room-${100 + rooms.length}`,
      },
      ...prev
    ]);
  };

  const updateRoom = (updatedRoom: any) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  return {
    rooms,
    isLoading,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
