import { render, screen } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import Sidebar from './Sidebar';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContextModule from '@/contexts/AuthContext';
import React from 'react';

// Mock the AuthContext hook
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual as any,
    useAuth: vi.fn(),
  };
});

const renderSidebar = () => {
  return render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('renders dashboard for staff', () => {
  // Staff should see Dashboard but not Business Development
  vi.mocked(AuthContextModule.useAuth).mockReturnValue({
    user: { id: '1', name: 'Staff', email: 'staff@test.com', role: 'staff' },
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasPermission: (role) => role === 'staff', // Only staff permission
  });

  renderSidebar();
  
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.queryByText('Business Development')).not.toBeInTheDocument();
});

test('renders business development for manager', () => {
  // Manager should see Business Development
  vi.mocked(AuthContextModule.useAuth).mockReturnValue({
    user: { id: '1', name: 'Manager', email: 'manager@test.com', role: 'manager' },
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasPermission: (role) => role === 'staff' || role === 'manager', 
  });

  renderSidebar();
  
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Business Development')).toBeInTheDocument();
});
