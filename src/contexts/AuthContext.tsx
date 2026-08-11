import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  storeToken,
  getToken,
  simulateLogin,
  removeToken,
} from '@/utils/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    try {
      const newToken = await simulateLogin(username, password);
      await storeToken(newToken);
      setToken(newToken);
    } catch (_e) {
      setError('ログインに失敗しました。入力内容をご確認ください。');
    }
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setToken(null);
    setError(null);
  }, []);

  const value: AuthContextType = {
    isAuthenticated: token !== null,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
