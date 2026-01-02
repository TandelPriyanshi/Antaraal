// src/__tests__/components/DashboardLayout.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock the API module
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

// Create a test wrapper that provides the auth context
const TestWrapper = ({ children, authValue }: { 
  children: React.ReactNode;
  authValue: any;
}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

// Mock the auth context
const mockAuth = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
};

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(() => mockAuth),
  };
});

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return {
    ...render(
      <Router>
        {ui}
      </Router>
    ),
  };
};

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ... rest of your test cases remain the same
  it('renders the dashboard with navigation', () => {
    renderWithRouter(
      <TestWrapper authValue={mockAuth}>
        <DashboardLayout />
      </TestWrapper>,
      { route: '/dashboard' }
    );

    expect(screen.getByText('Antaraal')).toBeInTheDocument();
    expect(screen.getByText('Entry Details')).toBeInTheDocument();
    // ... rest of the assertions
  });

  // Update other test cases to use TestWrapper
  it('handles logout', () => {
    renderWithRouter(
      <TestWrapper authValue={mockAuth}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </TestWrapper>,
      { route: '/dashboard' }
    );

    const logoutButton = screen.getByText('Sign Out');
    fireEvent.click(logoutButton);
    expect(mockAuth.logout).toHaveBeenCalledTimes(1);
  });

  // ... rest of your test cases
});