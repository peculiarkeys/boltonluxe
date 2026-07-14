
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle } from 'lucide-react';

interface RoomDetailsDialogProps {
  room: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({ 
  room, 
  open, 
  onOpenChange 
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'available': 'bg-green-100 text-green-800',
      'occupied': 'bg-blue-100 text-blue-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'cleaning': 'bg-purple-100 text-purple-800',
      'out-of-order': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status]} variant="outline">
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const amenityLabels: Record<string, string> = {
    'wifi': 'WiFi',
    'tv': 'TV',
    'ac': 'Air Conditioning',
    'minibar': 'Mini Bar',
    'safe': 'Safe',
    'bathtub': 'Bathtub',
    'balcony': 'Balcony',
    'oceanView': 'Ocean View',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Room {room.roomNumber} Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </Badge>
                <span className="hidden sm:inline">•</span>
                <span>Floor {room.floor}</span>
                <span className="hidden sm:inline">•</span>
                <span>Max {room.maxOccupancy} Guests</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">${room.rate}</div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium">Status</div>
            <div className="mt-1">{getStatusBadge(room.status)}</div>
          </div>
          
          {room.description && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Description</div>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {room.description}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <div className="text-sm font-medium mb-2">Room Amenities</div>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities && room.amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {amenityLabels[amenity] || amenity}
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-sm font-medium mb-2">Safety & Maintenance</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm">
                {room.maintenance ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    <span>Needs Maintenance</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span>No Maintenance Needed</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-sm">
                {room.smokeDetector ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span>Smoke Detector</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    <span>No Smoke Detector</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-sm">
                {room.fireExtinguisher ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span>Fire Extinguisher</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    <span>No Fire Extinguisher</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsDialog;
