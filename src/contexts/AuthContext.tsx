import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loginUser, signUpUser, removeToken, getToken, getUserName, getUserId, removeUserId } from '@/utils/auth';
import { router } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean;
  userName: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initializing = useRef(false);

  useEffect(() => {
    const init = async () => {
      // avoid multiple runs in development strict mode
      if (initializing.current) return;
      initializing.current = true;
      try {
        const storedName = await getUserName();
        setUserName(storedName);
        const storedUserId = await getUserId();
        setUserId(storedUserId);
      } catch {
        // ignore
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const data = await loginUser({ email, password });
      setToken(data.token);
      setUserName(data.user.name);
      setUserId(data.user.id);
      router.replace('/');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'ログインに失敗しました';
      setError(message);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const data = await signUpUser({ email, password, name });
      setToken(data.token);
      setUserName(data.user.name);
      setUserId(data.user.id);
      router.replace('/');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'アカウント登録に失敗しました';
      setError(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeToken();
      await removeUserId();
      setToken(null);
      setUserId(null);
      setUserName(null);
      router.replace('/login');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'ログアウトに失敗しました';
      setError(message);
    }
  }, []);

  const isAuthenticated = token !== null && token.length > 0;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        userId,
        login,
        signUp,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
