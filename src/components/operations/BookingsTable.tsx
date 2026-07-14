
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText,
  Check,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingsTableProps {
  bookings: any[];
  isLoading: boolean;
  onUpdate: (booking: any) => void;
  onDelete: (id: string) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ 
  bookings, 
  isLoading,
  onUpdate,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      'confirmed': { 
        color: 'bg-green-100 text-green-800', 
        icon: <Check className="h-4 w-4 mr-1" /> 
      },
      'checked-in': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <Check className="h-4 w-4 mr-1" /> 
      },
      'checked-out': { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <Check className="h-4 w-4 mr-1" /> 
      },
      'cancelled': { 
        color: 'bg-red-100 text-red-800', 
        icon: <XCircle className="h-4 w-4 mr-1" /> 
      },
      'no-show': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <XCircle className="h-4 w-4 mr-1" /> 
      },
    };
    
    const config = statusConfig[status] || { color: '', icon: null };
    
    return (
      <Badge className={config.color} variant="outline">
        <div className="flex items-center">
          {config.icon}
          <span>{status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
        </div>
      </Badge>
    );
  };

  const handleCheckIn = (booking: any) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          onUpdate({ ...booking, status: 'checked-in' });
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Processing check-in...',
        success: 'Guest checked in successfully',
        error: 'Failed to check in guest',
      }
    );
  };

  const handleCheckOut = (booking: any) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          onUpdate({ ...booking, status: 'checked-out' });
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Processing check-out...',
        success: 'Guest checked out successfully',
        error: 'Failed to check out guest',
      }
    );
  };

  const handleCancelBooking = (id: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          onDelete(id);
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Cancelling booking...',
        success: 'Booking cancelled successfully',
        error: 'Failed to cancel booking',
      }
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Guest Name</TableHead>
          <TableHead className="hidden md:table-cell">Room</TableHead>
          <TableHead>Check-in</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Loading bookings...</div>
            </TableCell>
          </TableRow>
        ) : bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <div className="text-muted-foreground">No bookings found</div>
            </TableCell>
          </TableRow>
        ) : (
          bookings.map((booking) => (
            <TableRow key={booking.bookingId}>
              <TableCell className="font-medium">
                {booking.bookingId}
              </TableCell>
              <TableCell>
                {booking.guestName}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {booking.roomNumber} - {booking.roomType}
              </TableCell>
              <TableCell>
                {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {getStatusBadge(booking.status)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {booking.status === 'confirmed' && (
                      <DropdownMenuItem onClick={() => handleCheckIn(booking)}>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Check In</span>
                      </DropdownMenuItem>
                    )}
                    {booking.status === 'checked-in' && (
                      <DropdownMenuItem onClick={() => handleCheckOut(booking)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Check Out</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => {}}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Cancel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BookingsTable;
