'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type User = {
  username: string;
  // password: string;
  token: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Use your API base URL from environment variables
    timeout: 10000, // Optional: Set a timeout for requests
  });

  // Load user data from cookies on initial render
  useEffect(() => {
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      const parsedUser = JSON.parse(userFromCookie);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Store user data in cookie (expires in 7 days)
    // Should include token

    try {
      const response = await api.post('/auth/super-admin', {
        username,
        password,
      });

      if (response) {
        const userData = { username, token: response.data.access_token };
        console.log(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        setUser(userData);
        router.push('/dashboard');
        setIsLoggedIn(true);
      }

      return response.data; // Return the response data (e.g., user info, tokens)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Login failed');
      } else {
        throw new Error('Network error');
      }
    }

    // Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    // //redirect to /dashboard
    // router.push('/dashboard');

    // setUser(userData);
    // setIsLoggedIn(true);
  };

  const logout = () => {
    // Remove user data from cookie
    Cookies.remove('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
