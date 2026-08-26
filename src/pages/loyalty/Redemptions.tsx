import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoyaltyRedemptions } from '@/hooks/loyalty/useLoyaltyRedemptions';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchAdminRedemptions, searchByCode, markAsUsed, cancelRedemption, isLoading } = useLoyaltyRedemptions();
  
  // Admin mock ID for now
  const adminId = 'ADMIN_USER';

  const loadData = async () => {
    const data = await fetchAdminRedemptions();
    setRedemptions(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return loadData();
    }
    
    // Check if it looks like a code (e.g. LUXE-XXXXX)
    if (searchQuery.trim().toUpperCase().startsWith('LUXE-')) {
      const result = await searchByCode(searchQuery.trim().toUpperCase());
      if (result) {
        setRedemptions([result]);
      } else {
        setRedemptions([]);
      }
    } else {
      // Fallback: local filter on the full list by member name or email
      const data = await fetchAdminRedemptions();
      if (data) {
        const filtered = data.filter(r => 
          r.loyalty_members?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.loyalty_members?.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setRedemptions(filtered);
      }
    }
  };

  const handleMarkUsed = async (id: string) => {
    if (window.confirm('Mark this redemption as used by the guest?')) {
      await markAsUsed(id, adminId);
      loadData();
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Cancel this redemption? This will just mark it cancelled for now.')) {
      await cancelRedemption(id, adminId);
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">AVAILABLE</Badge>;
      case 'USED': return <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100">USED</Badge>;
      case 'CANCELLED': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">CANCELLED</Badge>;
      case 'EXPIRED': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">EXPIRED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-800">Redemptions</h2>
          <p className="text-sm text-zinc-500">Manage member reward redemptions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verify & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search by LUXE-XXXXX code, member name, or email..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={() => { setSearchQuery(''); loadData(); }}>
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 font-medium text-zinc-500">Code</th>
                  <th className="px-6 py-4 font-medium text-zinc-500">Member</th>
                  <th className="px-6 py-4 font-medium text-zinc-500">Reward</th>
                  <th className="px-6 py-4 font-medium text-zinc-500">Points</th>
                  <th className="px-6 py-4 font-medium text-zinc-500">Status</th>
                  <th className="px-6 py-4 font-medium text-zinc-500">Date</th>
                  <th className="px-6 py-4 font-medium text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {redemptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'No redemptions found'}
                    </td>
                  </tr>
                ) : redemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 font-mono font-medium">{red.redemption_code}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-800">{red.loyalty_members?.name}</div>
                      <div className="text-zinc-500 text-xs">{red.loyalty_members?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-700">{red.loyalty_rewards?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-zinc-700">{red.points_spent?.toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(red.status)}</td>
                    <td className="px-6 py-4 text-zinc-500">{format(new Date(red.created_at), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      {red.status === 'AVAILABLE' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleMarkUsed(red.id)}
                            disabled={isLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Use
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleCancel(red.id)}
                            disabled={isLoading}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
