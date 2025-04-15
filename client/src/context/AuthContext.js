import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a baseURL that can be easily changed for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Google OAuth Configuration - would typically come from environment variables
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '486416947192-v72oq2gu28e25oqfg5rhnfgfnj85nmlg.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // Reduced timeout for faster error response
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (server not running)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('Network error detected, server might be down');
      error.isNetworkError = true;
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

// Mock users database for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Aarchi Patel',
    email: 'patel.aarchi.sanjay@gmail.com',
    password: 'password',
    role: 'user'
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  },
  {
    id: '3',
    name: 'Raksha',
    email: 'raksha123@gmail.com',
    password: 'password123',
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          setIsAuthenticated(true); // ✅ Mark as authenticated
        } catch (err) {
          // If network error or API not available, try mock authentication
          if (err.isNetworkError || err.response?.status === 404) {
            console.warn('Auth check failed with server, using mock data');
            const mockUser = JSON.parse(localStorage.getItem('user'));
            if (mockUser) {
              setUser(mockUser);
              setIsAuthenticated(true); // ✅ Still authenticated (mock)
            } else {
              setIsAuthenticated(false); // ❌ No user found
              throw new Error('No user session found');
            }
          } else {
            setIsAuthenticated(false); // ❌ Token error or other issue
            throw err;
          }
        }
      } else {
        setIsAuthenticated(false); // ❌ No token at all
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      if (!err.isNetworkError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setIsAuthenticated(false); // ❌ Final fallback
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email, password) => {
    try {
      setError(null);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // For testing/development - check mock database first
      const mockUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (mockUser) {
        // Found user in mock database, verify password
        if (mockUser.password === password) {
          console.log('Mock login successful for:', email);
          
          // Create a clean version without password
          const { password, ...userWithoutPassword } = mockUser;
          const mockToken = `mock-token-${Date.now()}`;
          
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setUser(userWithoutPassword);
          return userWithoutPassword;
        } else {
          // Password doesn't match
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
      }
      
      // If not found in mock database or if we want to try real API
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
      } catch (apiError) {
        // If network error or API not available, use mock login as fallback
        if (apiError.isNetworkError || apiError.response?.status === 404) {
          console.warn('Login API unavailable, using mock login fallback');
          
          // If we already checked mock database above and didn't find match
          // Just throw the error
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (apiError.response?.status === 401) {
          // Handle unauthorized explicitly
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (apiError.response?.status === 429) {
          // Handle rate limiting
          throw new Error('Too many login attempts. Please try again later.');
        } else {
          // Server responded with another error
          throw new Error(apiError.response?.data?.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // In a real implementation, we would get the code from the redirect
      // Here we'll simulate the process for demonstration
      
      try {
        // 1. Redirect users to Google's OAuth page
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&prompt=select_account`;
        
        // For the purpose of this example, we'll open in the same window
        window.location.href = googleAuthUrl;
        
        // The rest of this function would normally be executed after redirect back
        // But for demo purposes we'll simulate a successful authentication
        
        // Mock user for demonstration (would come from the API in real implementation)
        const mockGoogleUser = {
          id: 'google-123456',
          name: 'Google User',
          email: 'googleuser@example.com',
          picture: 'https://via.placeholder.com/150',
          role: 'user',
          authProvider: 'google'
        };
        
        const mockToken = `google-mock-token-${Date.now()}`;
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
        
        return mockGoogleUser;
      } catch (apiError) {
        if (apiError.isNetworkError || apiError.response?.status === 404) {
          console.warn('Google login API unavailable, using mock login');
          
          // Create mock user for Google auth
          const mockGoogleUser = {
            id: 'google-' + Date.now().toString(),
            name: 'Google User',
            email: 'google_user@example.com',
            picture: 'https://via.placeholder.com/150',
            role: 'user',
            authProvider: 'google'
          };
          
          const mockToken = `google-mock-token-${Date.now()}`;
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockGoogleUser));
          setUser(mockGoogleUser);
          
          return mockGoogleUser;
        } else {
          // Server responded with an error
          throw new Error(apiError.response?.data?.message || 'Google authentication failed');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Google login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      try {
        const response = await api.post('/auth/register', userData);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
      } catch (apiError) {
        // If network error or API not available, use mock registration
        if (apiError.isNetworkError || apiError.response?.status === 404) {
          console.warn('Register API unavailable, using mock registration');
          
          // Check if email already exists in mock database
          if (MOCK_USERS.some(u => u.email === userData.email)) {
            throw new Error('Email address is already registered. Please use a different email or try logging in.');
          }
          
          // Create mock user
          const mockUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            role: 'user'
          };
          
          const mockToken = `mock-token-${Date.now()}`;
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          // Add to mock database (would not be needed in real app)
          MOCK_USERS.push({
            ...mockUser,
            password: userData.password
          });
          
          return mockUser;
        } else if (apiError.response?.status === 409) {
          // Conflict - Email already exists
          throw new Error('Email address is already registered. Please use a different email or try logging in.');
        } else if (apiError.response?.data?.message && apiError.response.data.message.includes('Username already taken')) {
          // If it's a username error, convert it to an email error to be consistent
          throw new Error('Email address is already registered. Please use a different email or try logging in.');
        } else {
          // Server responded with an error
          throw new Error(apiError.response?.data?.message || 'Registration failed');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedData) => {
    if (!user) return null;
    
    // Create updated user object
    const updatedUser = {
      ...user,
      ...updatedData
    };
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in state
    setUser(updatedUser);
    
    return updatedUser;
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};