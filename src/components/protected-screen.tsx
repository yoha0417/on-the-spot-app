import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedScreenProps {
  children: React.ReactNode;
}

export function ProtectedScreen({ children }: ProtectedScreenProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
