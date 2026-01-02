import React, { ReactElement, useState, useEffect, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import AuthContext, { User } from '../contexts/AuthContext';
import { EntriesProvider } from '../contexts/EntriesContext';

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialAuthState?: {
    user: User | null;
    token?: string | null;
    isLoading?: boolean;
  };
  routerProps?: MemoryRouterProps;
}

const TestAuthProvider: React.FC<{ 
  children: React.ReactNode;
  initialAuthState?: {
    user: User | null;
    token?: string | null;
    isLoading?: boolean;
  };
}> = ({ children, initialAuthState }) => {
  const [user, setUser] = useState<User | null>(initialAuthState?.user || null);
  const [token, setToken] = useState<string | null>(
    initialAuthState?.token !== undefined 
      ? initialAuthState.token 
      : localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(initialAuthState?.isLoading ?? false);

  // Mock functions
  const login = async (email: string, password: string) => {};
  const register = async (username: string, email: string, password: string) => {
    return { requiresVerification: false, userId: 1, email };
  };
  const verifyEmail = async (userId: number, otp: string) => {};
  const resendOTP = async (email: string) => {};
  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        verifyEmail,
        resendOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialAuthState,
  routerProps = { initialEntries: ['/'] },
}) => {
  return (
    <MemoryRouter {...routerProps}>
      <TestAuthProvider initialAuthState={initialAuthState}>
        <EntriesProvider>
          {children}
        </EntriesProvider>
      </TestAuthProvider>
    </MemoryRouter>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuthState?: {
    user: User | null;
    token?: string | null;
    isLoading?: boolean;
  };
  routerProps?: MemoryRouterProps;
}

const customRender = (
  ui: ReactElement,
  {
    initialAuthState,
    routerProps,
    ...options
  }: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        initialAuthState={initialAuthState} 
        routerProps={routerProps}
        {...props} 
      />
    ),
    ...options,
  });
};

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };