
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Calendar, User, Clock, Flag, CreditCard } from 'lucide-react';

interface GuestDetailsDialogProps {
  guest: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuestDetailsDialog: React.FC<GuestDetailsDialogProps> = ({ 
  guest, 
  open, 
  onOpenChange 
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'blacklisted': 'bg-red-100 text-red-800',
      'vip': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={statusColors[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const stayHistory = guest.stayHistory || [
    { id: 1, roomNumber: '302', checkIn: '2023-02-15', checkOut: '2023-02-18', nights: 3 },
    { id: 2, roomNumber: '205', checkIn: '2023-05-22', checkOut: '2023-05-25', nights: 3 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Guest Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={guest.avatar} alt={guest.name} />
              <AvatarFallback className="text-lg">{getInitials(guest.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{guest.name}</h3>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Flag className="h-4 w-4 mr-1" />
                {guest.nationality}
              </div>
              <div className="mt-2">
                {getStatusBadge(guest.status)}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Contact Information</div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                {guest.email}
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {guest.phone}
              </div>
              {guest.address && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span>{guest.address}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Personal Information</div>
              {guest.passportNumber && (
                <div className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  ID/Passport: {guest.passportNumber}
                </div>
              )}
              {guest.lastStay && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Last Stay: {guest.lastStay}
                </div>
              )}
              {guest.totalStays && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Total Stays: {guest.totalStays}
                </div>
              )}
            </div>
          </div>
          
          {guest.preferences && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Preferences & Notes</div>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {guest.preferences}
                </div>
              </div>
            </>
          )}
          
          {stayHistory.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Stay History</div>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Room</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Check In</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Check Out</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Nights</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {stayHistory.map((stay: any) => (
                        <tr key={stay.id}>
                          <td className="px-4 py-2 text-sm">{stay.roomNumber}</td>
                          <td className="px-4 py-2 text-sm">{stay.checkIn}</td>
                          <td className="px-4 py-2 text-sm">{stay.checkOut}</td>
                          <td className="px-4 py-2 text-sm">{stay.nights}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetailsDialog;
