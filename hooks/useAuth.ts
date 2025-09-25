"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    status: 'loading'
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/nextauth', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json() as { user: User };
        setAuthState({
          user: data.user,
          status: 'authenticated'
        });
      } else {
        setAuthState({
          user: null,
          status: 'unauthenticated'
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        status: 'unauthenticated'
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/nextauth', {
        method: 'DELETE',
      });
      setAuthState({
        user: null,
        status: 'unauthenticated'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    data: authState.user,
    status: authState.status,
    logout
  };
}
