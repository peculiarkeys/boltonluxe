
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Building2, MapPin, Users, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseProperties, Property } from '@/hooks/operations/use-supabase-properties';

const Properties: React.FC = () => {
  const { 
    properties, 
    isLoading, 
    addProperty, 
    updateProperty, 
    deleteProperty 
  } = useSupabaseProperties();

  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    name: '',
    location: '',
    rooms: 0,
    capacity: 0,
    description: '',
    image: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddProperty = async () => {
    if (!newProperty.name || !newProperty.location) {
      toast.error('Please fill out all required fields');
      return;
    }

    try {
      if (isEditing && editingId) {
        await updateProperty({ ...newProperty, id: editingId });
      } else {
        await addProperty(newProperty);
      }

      setNewProperty({
        name: '',
        location: '',
        rooms: 0,
        capacity: 0,
        description: '',
        image: ''
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error handling property:', error);
    }
  };

  const handleEditProperty = (property: Property) => {
    setNewProperty({
      name: property.name,
      location: property.location,
      rooms: property.rooms,
      capacity: property.capacity,
      description: property.description,
      image: property.image
    });
    setIsEditing(true);
    setEditingId(property.id);
    setIsDialogOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your hospitality properties.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Property' : 'Add New Property'}</DialogTitle>
              <DialogDescription>
                Fill in the details to {isEditing ? 'update the' : 'add a new'} property.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location*
                </Label>
                <Input
                  id="location"
                  className="col-span-3"
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rooms" className="text-right">
                  Rooms
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  className="col-span-3"
                  value={newProperty.rooms}
                  onChange={(e) => setNewProperty({ ...newProperty, rooms: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  className="col-span-3"
                  value={newProperty.capacity}
                  onChange={(e) => setNewProperty({ ...newProperty, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  className="col-span-3"
                  value={newProperty.image}
                  onChange={(e) => setNewProperty({ ...newProperty, image: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProperty}>
                {isEditing ? 'Save Changes' : 'Add Property'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground mb-4">No properties found</p>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add your first property
              </Button>
            </div>
          ) : (
            properties.map((property) => (
              <Card key={property.id}>
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={property.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"}
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{property.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{property.rooms} Rooms</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {property.capacity}</span>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEditProperty(property)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
