import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  isEmailVerified?: boolean;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, picUrl?: string) => Promise<{ requiresVerification: boolean; userId?: number; email?: string }>;
  verifyEmail: (userId: number, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ user: User }>('/auth/me');
        if (response.data) {
          setUser(response.data.user);
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth().catch(error => {
      console.error('Error in auth check:', error);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      if (response.data) {
        // Check if the response indicates email verification is required
        if ('requiresVerification' in response.data && response.data.requiresVerification) {
          // Set a flag in localStorage to indicate verification is required
          localStorage.setItem('verificationRequired', 'true');
          localStorage.setItem('verificationUserId', response.data.userId.toString());
          localStorage.setItem('verificationEmail', response.data.email);

          // Navigate to verification page with userId and email
          navigate(`/verify-email?userId=${response.data.userId}&email=${encodeURIComponent(response.data.email)}&fromSignIn=true`);

          // Throw a specific error to prevent SignIn from showing success
          throw new Error('VERIFICATION_REQUIRED');
        }

        // Normal successful login
        const { user, token } = response.data as { user: User; token: string };
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
        navigate('/dashboard/entries');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      // Clean up verification flags if this isn't a verification error
      if (error.message !== 'VERIFICATION_REQUIRED') {
        localStorage.removeItem('verificationRequired');
        localStorage.removeItem('verificationUserId');
        localStorage.removeItem('verificationEmail');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, picUrl?: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register({ username, email, password, pic_url: picUrl });
      if (response.data) {
        const { requiresVerification, userId, email: registeredEmail } = response.data;
        if (requiresVerification) {
          // Navigate to verification page with userId and email
          navigate(`/verify-email?userId=${userId}&email=${encodeURIComponent(registeredEmail)}`);
          return { requiresVerification: true, userId, email: registeredEmail };
        } else {
          // This shouldn't happen with our new flow, but keeping for compatibility
          const { user, token } = response.data as any;
          localStorage.setItem('token', token);
          setUser(user);
          setToken(token);
          navigate('/dashboard/entries');
          return { requiresVerification: false };
        }
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (userId: number, otp: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.verifyEmail({ userId, otp });
      if (response.data) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
        navigate('/dashboard/entries');
      } else {
        throw new Error(response.error || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await api.auth.resendOTP({ email });
      if (!response.data) {
        throw new Error(response.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/signin');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    verifyEmail,
    resendOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
