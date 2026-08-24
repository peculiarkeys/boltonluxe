import { render, screen, act } from '@testing-library/react';
import { expect, test, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

const TestComponent = () => {
  const { user, login, logout, hasPermission, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? `Logged in as ${user.name}` : 'Not logged in'}</div>
      <div data-testid="role">{user?.role || 'none'}</div>
      <button onClick={() => login('director@boltonhq.com', 'password')}>Login Director</button>
      <button onClick={() => logout()}>Logout</button>
      <div data-testid="is-director">{hasPermission('director') ? 'Yes' : 'No'}</div>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
});

test('starts unauthenticated', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  
  expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  expect(screen.getByTestId('is-director')).toHaveTextContent('No');
});

test('logs in correctly and stores in localStorage', async () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  
  await act(async () => {
    screen.getByText('Login Director').click();
  });
  
  expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as John Doe');
  expect(screen.getByTestId('role')).toHaveTextContent('director');
  expect(screen.getByTestId('is-director')).toHaveTextContent('Yes');
  
  const stored = JSON.parse(localStorage.getItem('boltonhq_user') || '{}');
  expect(stored.email).toBe('director@boltonhq.com');
});

test('logs out correctly', async () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  
  await act(async () => {
    screen.getByText('Login Director').click();
  });
  
  expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as John Doe');
  
  await act(async () => {
    screen.getByText('Logout').click();
  });
  
  expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  expect(localStorage.getItem('boltonhq_user')).toBeNull();
});
