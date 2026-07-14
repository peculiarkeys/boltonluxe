
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const LeadsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Track and manage potential sales leads
          </p>
        </div>
        <Button>Add Lead</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads Management</CardTitle>
          <CardDescription>Track and follow up with potential customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <ArrowUpRight className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">Leads functionality will be implemented in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsPage;
