
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isSameDay, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventCalendarViewProps {
  events: any[];
  onEditEvent: (event: any) => void;
}

const EventCalendarView: React.FC<EventCalendarViewProps> = ({ events, onEditEvent }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateDialogOpen, setSelectedDateDialogOpen] = useState(false);

  const eventsForDate = (date: Date) => {
    if (!date) return [];
    return events.filter(event => isSameDay(new Date(event.startDate), date));
  };

  const allEventsForDate = selectedDate ? eventsForDate(selectedDate) : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && eventsForDate(date).length > 0) {
      setSelectedDateDialogOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    
    return statusColors[status] || '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {format(date, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const prevMonth = new Date(date);
              prevMonth.setMonth(date.getMonth() - 1);
              setDate(prevMonth);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setDate(new Date());
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const nextMonth = new Date(date);
              nextMonth.setMonth(date.getMonth() + 1);
              setDate(nextMonth);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="border rounded-md p-3"
        month={date}
        onMonthChange={setDate}
        modifiers={{
          hasEvents: (date) => eventsForDate(date).length > 0,
          today: (date) => isToday(date),
        }}
        modifiersClassNames={{
          hasEvents: 'font-bold bg-primary/10',
          today: 'ring-2 ring-primary',
        }}
      />

      <Dialog open={selectedDateDialogOpen} onOpenChange={setSelectedDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
              {allEventsForDate.length} event{allEventsForDate.length !== 1 ? 's' : ''} scheduled for this day
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {allEventsForDate.map(event => (
              <Card key={event.id} className="mb-4">
                <CardHeader className="p-4 pb-2 flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{event.name}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                    </div>
                  </div>
                  <Badge className={getStatusColor(event.status)} variant="outline">
                    {event.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm mt-2">Location: {event.location}</div>
                  <div className="text-sm text-muted-foreground mt-1">Attendees: {event.attendees}</div>
                  {event.description && (
                    <div className="mt-2 text-sm border-t pt-2">
                      {event.description}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedDateDialogOpen(false);
                      onEditEvent(event);
                    }}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendarView;
