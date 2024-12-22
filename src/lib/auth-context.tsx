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

type User = {
  username: string;
  password: string;
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

  // Load user data from cookies on initial render
  useEffect(() => {
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      const parsedUser = JSON.parse(userFromCookie);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    const userData = { username, password };
    // Store user data in cookie (expires in 7 days)
    // Should include token
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    //redirect to /dashboard
    router.push('/dashboard');

    setUser(userData);
    setIsLoggedIn(true);
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
