
import { useState, useEffect } from 'react';
import { addDays, addHours, subDays } from 'date-fns';

const generateMockEvents = () => {
  const today = new Date();
  const statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
  const eventTypes = ['Conference', 'Wedding', 'Corporate Meeting', 'Birthday Party', 'Exhibition', 'Seminar', 'Workshop', 'Gala Dinner'];
  const locations = ['Grand Ballroom', 'Conference Room A', 'Conference Room B', 'Garden Terrace', 'Sky Lounge', 'Executive Boardroom', 'Poolside Pavilion'];

  return Array.from({ length: 30 }, (_, i) => {
    const startDate = addDays(subDays(today, 15), Math.floor(Math.random() * 30));
    const startHour = 8 + Math.floor(Math.random() * 10); // Events between 8 AM and 6 PM
    const durationHours = Math.floor(Math.random() * 6) + 2; // 2-8 hours
    
    startDate.setHours(startHour, 0, 0);
    const endDate = addHours(new Date(startDate), durationHours);
    
    return {
      id: `event-${1000 + i}`,
      name: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]} ${1000 + i}`,
      description: 'Event description and details go here. This includes information about the event, requirements, and special notes.',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      organizer: 'Hotel Events Team',
      attendees: Math.floor(Math.random() * 100) + 20,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      contactPerson: 'Jane Smith',
      contactEmail: 'contact@example.com',
      contactPhone: '+1 555-123-4567',
      notes: Math.random() > 0.5 ? 'Special setup required' : '',
    };
  });
};

export const useMockEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setEvents(generateMockEvents());
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const addEvent = (event: any) => {
    setEvents(prev => [
      {
        ...event,
        id: `event-${1000 + events.length}`,
      },
      ...prev
    ]);
  };

  const updateEvent = (updatedEvent: any) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
