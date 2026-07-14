
import React from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  Building2,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Header = () => {
  const [selectedProperty, setSelectedProperty] = React.useState('Grand Bolton Hotel');
  const { user, logout } = useAuth();
  
  const properties = [
    'Grand Bolton Hotel',
    'Bolton Resort & Spa',
    'Bolton Executive Suites',
    'Bolton Boutique Hotel'
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b border-border/50 py-3 px-6 bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:w-72">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          <div className="relative ml-3 md:ml-0">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
            <select 
              className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 text-sm border-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedProperty}
              onChange={(e) => {
                setSelectedProperty(e.target.value);
                if (e.target.value === 'add-new') {
                  toast.info('Redirecting to Properties page');
                  window.location.href = '/properties';
                }
              }}
            >
              {properties.map((property, index) => (
                <option key={index} value={property}>
                  {property}
                </option>
              ))}
              <option value="add-new">+ Add New Property</option>
            </select>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-10 w-full rounded-full border-none bg-secondary/50" 
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative rounded-full bg-secondary/50">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-card"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full bg-secondary/50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  {user?.avatar || user?.name?.substring(0, 2) || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <span className="text-xs capitalize mt-1 px-2 py-0.5 bg-secondary rounded-full w-fit">
                    {user?.role.replace('_', ' ')}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-md cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="rounded-md cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
