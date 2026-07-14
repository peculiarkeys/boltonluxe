
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Hotel, Info } from 'lucide-react';
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
    if (percentBooked >= 90) return 'bg-red-500'; // Full (>= 90%)
    if (percentBooked >= 60) return 'bg-yellow-500'; // Almost full (60-90%)
    return 'bg-green-500'; // Available (< 60%)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Availability</h1>
          <p className="text-muted-foreground mt-1">
            View and manage room bookings across properties
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedHotel} onValueChange={setSelectedHotel}>
            <SelectTrigger className="w-[180px]">
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
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Almost Full</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Full</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-muted">
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
                  className={`min-h-36 p-2 bg-card border-t ${
                    !isCurrentMonth ? 'opacity-40' : ''
                  } ${isCurrentDay ? 'bg-primary/5 border border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${
                      isCurrentDay 
                        ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' 
                        : ''
                    }`}>
                      {format(date, 'd')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(date, 'EEE')}
                    </span>
                  </div>
                  
                  {isCurrentMonth && (
                    <div className="mt-2 space-y-2">
                      {dayBookings.map(booking => {
                        const percentBooked = (booking.bookedRooms / booking.totalRooms) * 100;
                        return (
                          <div key={booking.roomTypeId} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span>{booking.roomTypeName}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center">
                                      <span>{booking.availableRooms} left</span>
                                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
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
                              className="h-2"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsCalendar;
