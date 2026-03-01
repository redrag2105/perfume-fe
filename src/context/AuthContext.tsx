/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { membersApi } from '@/api';
import type { DecodedToken, User, AuthContextType } from '@/types';

// Re-export types for backward compatibility
export type { DecodedToken, User } from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    const savedName = localStorage.getItem('userName');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          return null;
        }
        return { ...decoded, token, name: savedName || undefined };
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        return null;
      }
    }
    return null;
  });

  // Fetch user name on initial load if logged in but no name
  useEffect(() => {
    if (user && !user.name) {
      membersApi.getProfile()
        .then(profile => {
          if (profile.name) {
            localStorage.setItem('userName', profile.name);
            setUser(prev => prev ? { ...prev, name: profile.name } : null);
          }
        })
        .catch(() => {
          // Silently fail - user will just see "Account" instead of their name
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.memberId]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({ ...decoded, token });
    
    // Fetch name after login
    membersApi.getProfile()
      .then(profile => {
        if (profile.name) {
          localStorage.setItem('userName', profile.name);
          setUser(prev => prev ? { ...prev, name: profile.name } : null);
        }
      })
      .catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const updateUserName = (name: string) => {
    localStorage.setItem('userName', name);
    setUser(prev => prev ? { ...prev, name } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};