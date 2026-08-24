import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoyaltyPoints } from './useLoyaltyPoints';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
    })),
    rpc: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLoyaltyPoints Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches points summary correctly', async () => {
    const mockTransactions = [
      { id: '1', amount: 1000, type: 'earned', date: new Date().toISOString() },
      { id: '2', amount: 500, type: 'earned', date: new Date().toISOString() },
      { id: '3', amount: 300, type: 'redeemed', date: new Date().toISOString() },
    ];

    // Setup mock chain
    const selectMock = vi.fn().mockResolvedValue({ data: mockTransactions, error: null });
    (supabase.from as any).mockReturnValue({ select: selectMock });

    const { result } = renderHook(() => useLoyaltyPoints(), { wrapper });

    await waitFor(() => {
      expect(result.current.summary.totalIssued).toBe(1500);
      expect(result.current.summary.totalRedeemed).toBe(300);
      expect(result.current.summary.currentOutstanding).toBe(1200);
    });
  });

  it('awards points and recalculates summary', async () => {
    // Setup initial fetch
    const selectMock = vi.fn().mockResolvedValue({ data: [], error: null });
    
    // Setup insert mock
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ 
        data: [{ id: '99', member_id: 'm1', amount: 500, type: 'earned' }], 
        error: null 
      })
    });
    
    const rpcMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.rpc as any) = rpcMock;

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'loyalty_point_transactions') {
        return { select: selectMock, insert: insertMock, order: vi.fn().mockReturnThis() };
      }
      if (table === 'loyalty_members') {
        return { 
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { name: 'Test Member' }, error: null })
            })
          })
        };
      }
    });

    const { result } = renderHook(() => useLoyaltyPoints(), { wrapper });
    
    await result.current.addTransaction({
      member_id: 'm1',
      amount: 500,
      type: 'earned',
      description: 'Test points'
    });

    expect(insertMock).toHaveBeenCalled();
    expect(rpcMock).toHaveBeenCalledWith('update_member_points', {
      p_member_id: 'm1',
      p_points: 500
    });
  });
});
