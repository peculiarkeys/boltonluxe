
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText } from 'lucide-react';

const OpportunitiesPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground">
            Track sales opportunities and deals
          </p>
        </div>
        <Button>Add Opportunity</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Opportunities</CardTitle>
          <CardDescription>Monitor deals through your sales pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <BookOpenText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">Opportunities functionality will be implemented in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunitiesPage;
