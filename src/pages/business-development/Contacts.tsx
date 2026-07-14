
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ContactsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your business contacts
          </p>
        </div>
        <Button>Add Contact</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts Database</CardTitle>
          <CardDescription>View and manage your network of contacts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">Contacts functionality will be implemented in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;
