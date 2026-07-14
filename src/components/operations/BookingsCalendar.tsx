
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { addDays, format, isSameDay, startOfMonth } from 'date-fns';
import { useSupabaseBookings } from '@/hooks/operations/use-supabase-bookings';

// Define a color interface for the progress bar
interface ProgressColor {
  color: string;
  bg: string;
}

// Extend the Progress component props
interface ColoredProgressProps extends React.ComponentProps<typeof Progress> {
  indicatorColor?: string;
}

// Create a colored progress component
const ColoredProgress = ({ 
  value, 
  indicatorColor, 
  className, 
  ...props 
}: ColoredProgressProps) => {
  return (
    <Progress 
      value={value} 
      className={className}
      style={{ 
        '--progress-indicator-color': indicatorColor,
      } as React.CSSProperties}
      {...props} 
    />
  );
};

const BookingsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { bookings } = useSupabaseBookings();
  
  // Room types with capacity
  const roomTypes = [
    { id: 'standard', name: 'Standard', capacity: 30 },
    { id: 'deluxe', name: 'Deluxe', capacity: 20 },
    { id: 'suite', name: 'Suite', capacity: 10 },
    { id: 'executive', name: 'Executive', capacity: 5 }
  ];

  // Calculate occupancy for a specific date and room type
  const calculateOccupancy = (date: Date, roomType: string) => {
    const dateBookings = bookings.filter(booking => {
      const checkInDate = booking.check_in || booking.checkIn;
      const checkOutDate = booking.check_out || booking.checkOut;
      const rType = booking.room_type || booking.roomType;

      if (!checkInDate || !checkOutDate || !rType) return false;

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      return (
        rType.toLowerCase().includes(roomType.toLowerCase()) && 
        date >= checkIn && 
        date < checkOut
      );
    });
    
    return dateBookings.length;
  };

  // Get room availability status with color
  const getRoomAvailability = (occupancy: number, capacity: number): { percentage: number, color: ProgressColor } => {
    const percentage = (occupancy / capacity) * 100;
    
    if (percentage >= 90) {
      return { 
        percentage, 
        color: { color: 'red', bg: 'bg-red-100' }
      };
    } else if (percentage >= 60) {
      return { 
        percentage, 
        color: { color: '#FFA500', bg: 'bg-yellow-100' } 
      };
    } 
    return { 
      percentage, 
      color: { color: 'green', bg: 'bg-green-100' } 
    };
  };

  // Generate date cells for the calendar view
  const renderDateCell = (date: Date) => {
    return (
      <div className="p-2 h-full">
        <div className="text-sm font-medium mb-1">{format(date, 'd')}</div>
        <div className="space-y-2">
          {roomTypes.map(roomType => {
            const occupancy = calculateOccupancy(date, roomType.id);
            const { percentage, color } = getRoomAvailability(occupancy, roomType.capacity);
            const remaining = roomType.capacity - occupancy;
            
            return (
              <div key={roomType.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{roomType.name}</span>
                  <span>{remaining} left</span>
                </div>
                <ColoredProgress 
                  value={percentage} 
                  className={`h-2 ${color.bg}`}
                  indicatorColor={color.color}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
      </div>
      
      <Card className="p-4">
        <Calendar 
          mode="default"
          selected={new Date()}
          onMonthChange={setCurrentMonth}
          className="rounded-md border"
          components={{
            Day: ({ date, ...props }) => (
              <div
                className="h-32 w-full border p-0 focus:outline-none"
                tabIndex={0}
                {...props}
              >
                {renderDateCell(date)}
              </div>
            ),
          }}
        />
      </Card>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm">Almost Full</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Full</span>
        </div>
      </div>
    </div>
  );
};

export default BookingsCalendar;
