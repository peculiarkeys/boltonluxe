
import React, { useState } from 'react';
import { Plus, Filter, Download, MoreHorizontal, EyeOff } from 'lucide-react';
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
        color: { color: '#f87171', bg: 'bg-red-50/50' } // text-red-400 and faint bg
      };
    } else if (percentage >= 60) {
      return { 
        percentage, 
        color: { color: '#fbbf24', bg: 'bg-amber-50/50' } // text-amber-400 and faint bg
      };
    } 
    return { 
      percentage, 
      color: { color: '#34d399', bg: 'bg-emerald-50/50' } // text-emerald-400 and faint bg
    };
  };

  // Generate date cells for the calendar view
  const renderDateCell = (date: Date) => {
    return (
      <div className="p-2 h-full flex flex-col">
        <div className="text-sm font-medium text-zinc-700 mb-2">{format(date, 'd')}</div>
        <div className="space-y-2.5">
          {roomTypes.map(roomType => {
            const occupancy = calculateOccupancy(date, roomType.id);
            const { percentage, color } = getRoomAvailability(occupancy, roomType.capacity);
            const remaining = roomType.capacity - occupancy;
            
            return (
              <div key={roomType.id} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                  <span>{roomType.name}</span>
                  <span>{remaining} left</span>
                </div>
                <ColoredProgress 
                  value={percentage} 
                  className={`h-1.5 rounded-full ${color.bg}`}
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
    <div className="space-y-6">
      {/* Header section matching the style */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center text-sm text-zinc-500">
          <span className="text-zinc-400">Operations</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-800 font-medium">Bookings Calendar</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              New Booking
            </button>
            <button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
              <Filter className="w-4 h-4 text-zinc-500" />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
              <Download className="w-4 h-4 text-zinc-500" />
              Export
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-9 h-9 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-full text-zinc-600 transition-colors shadow-sm">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-full text-zinc-600 transition-colors shadow-sm">
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-zinc-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
      </div>
      
      <Card className="p-4 shadow-none border border-zinc-200 bg-white rounded-xl">
        <Calendar 
          mode="default"
          selected={new Date()}
          onMonthChange={setCurrentMonth}
          className="rounded-lg border-zinc-100"
          components={{
            Day: ({ date, ...props }) => (
              <div
                className="h-32 w-full border border-zinc-100 p-0 focus:outline-none hover:bg-zinc-50/50 transition-colors"
                tabIndex={0}
                {...props}
              >
                {renderDateCell(date)}
              </div>
            ),
          }}
        />
      </Card>
      
      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm mr-2.5"></div>
          <span className="text-sm font-medium text-zinc-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-sm mr-2.5"></div>
          <span className="text-sm font-medium text-zinc-600">Almost Full</span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 bg-red-400 rounded-sm mr-2.5"></div>
          <span className="text-sm font-medium text-zinc-600">Full</span>
        </div>
      </div>
    </div>
  );
};

export default BookingsCalendar;
