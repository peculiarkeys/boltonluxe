
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Hotel, Info, Plus, Filter, Download, MoreHorizontal, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for hotels and room types
const hotels = [
  { id: 1, name: 'Bolton Grand' },
  { id: 2, name: 'Bolton Executive' },
  { id: 3, name: 'Bolton Suites' },
];

const roomTypes = [
  { id: 1, name: 'Standard', totalRooms: 50 },
  { id: 2, name: 'Deluxe', totalRooms: 30 },
  { id: 3, name: 'Suite', totalRooms: 15 },
  { id: 4, name: 'Executive', totalRooms: 10 },
];

// Mock booking data - In a real app, this would come from an API
const generateMockBookings = () => {
  const today = new Date();
  const bookings = {};
  
  // Generate bookings for the next 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    bookings[dateStr] = roomTypes.map(roomType => {
      // Generate random booked rooms (more bookings on weekends)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const randomFactor = isWeekend ? 0.8 : 0.5;
      
      // More bookings for dates closer to today
      const proximityFactor = Math.max(0.2, 1 - (i / 30));
      
      const bookedRooms = Math.floor(roomType.totalRooms * randomFactor * proximityFactor * Math.random());
      
      return {
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        totalRooms: roomType.totalRooms,
        bookedRooms: bookedRooms,
        availableRooms: roomType.totalRooms - bookedRooms
      };
    });
  }
  
  return bookings;
};

const mockBookings = generateMockBookings();

const BookingsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHotel, setSelectedHotel] = useState(hotels[0].id.toString());
  
  const getAvailabilityColor = (percentBooked: number) => {
    if (percentBooked >= 90) return 'bg-red-400'; // Soft red
    if (percentBooked >= 60) return 'bg-amber-400'; // Soft amber
    return 'bg-emerald-400'; // Soft green
  };
  
  const getAvailabilityStatus = (percentBooked: number) => {
    if (percentBooked >= 90) return 'Full';
    if (percentBooked >= 60) return 'Almost Full';
    return 'Available';
  };
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });
  
  const getBookingsForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return mockBookings[dateStr] || [];
  };
  
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header section matching the style exactly */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center text-sm text-zinc-500">
          <span className="text-zinc-400">Operations</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-800 font-medium">Room Availability</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-zinc-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
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
            <Select value={selectedHotel} onValueChange={setSelectedHotel}>
              <SelectTrigger className="w-[180px] rounded-full border-zinc-200 bg-white shadow-sm text-zinc-700 font-medium">
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map(hotel => (
                  <SelectItem key={hotel.id} value={hotel.id.toString()}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button className="flex items-center justify-center w-9 h-9 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-full text-zinc-600 transition-colors shadow-sm">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-full text-zinc-600 transition-colors shadow-sm">
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-zinc-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      
      <Card className="shadow-none border border-zinc-200 bg-white rounded-xl overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 border-b border-zinc-100">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth} className="h-8 w-8 rounded-full border-zinc-200 text-zinc-600 hover:bg-zinc-50">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday} className="h-8 rounded-full border-zinc-200 text-zinc-700 font-medium text-sm hover:bg-zinc-50">
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full border-zinc-200 text-zinc-600 hover:bg-zinc-50">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></div>
              <span className="text-xs font-medium text-zinc-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400"></div>
              <span className="text-xs font-medium text-zinc-600">Almost Full</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400"></div>
              <span className="text-xs font-medium text-zinc-600">Full</span>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-zinc-100">
            {Array(42).fill(null).map((_, i) => {
              const dayOffset = startOfMonth(currentDate).getDay();
              const dayIndex = i - dayOffset;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayIndex + 1);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);
              const dayBookings = isCurrentMonth ? getBookingsForDay(date) : [];
              
              return (
                <div
                  key={i}
                  className={`min-h-[160px] p-2 bg-white transition-colors ${
                    !isCurrentMonth ? 'opacity-40 bg-zinc-50' : 'hover:bg-zinc-50/50'
                  } ${isCurrentDay ? 'ring-1 ring-inset ring-slate-900 bg-slate-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${
                      isCurrentDay 
                        ? 'bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : 'text-zinc-700'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    <span className="text-[10px] font-medium uppercase text-zinc-400 tracking-wider">
                      {format(date, 'EEE')}
                    </span>
                  </div>
                  
                  {isCurrentMonth && (
                    <div className="mt-2 space-y-2.5">
                      {dayBookings.map(booking => {
                        const percentBooked = (booking.bookedRooms / booking.totalRooms) * 100;
                        return (
                          <div key={booking.roomTypeId} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500">
                              <span>{booking.roomTypeName}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center hover:text-zinc-700 transition-colors">
                                      <span>{booking.availableRooms} left</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800 text-xs rounded-lg">
                                    <p>
                                      {booking.bookedRooms} booked of {booking.totalRooms} total rooms
                                      <br />
                                      Status: {getAvailabilityStatus(percentBooked)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Progress 
                              value={percentBooked} 
                              className="h-1.5 rounded-full bg-zinc-100"
                              indicatorClassName={getAvailabilityColor(percentBooked)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingsCalendar;
