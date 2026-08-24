import { render, screen, act } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import { ConsumerAuthProvider, useConsumerAuth } from './ConsumerAuthContext';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: 'test-user', email: 'test@boltonhq.com' }
            }
          }
        }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } }
        }),
        signOut: vi.fn().mockResolvedValue({ error: null })
      }
    }
  };
});

const TestConsumerComponent = () => {
  const { user, isLoading, signOut } = useConsumerAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? `Logged in as ${user.email}` : 'Not logged in'}</div>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

test('loads session on mount', async () => {
  render(
    <ConsumerAuthProvider>
      <TestConsumerComponent />
    </ConsumerAuthProvider>
  );
  
  // Wait for session to load
  await screen.findByText('Logged in as test@boltonhq.com');
  
  expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@boltonhq.com');
});
