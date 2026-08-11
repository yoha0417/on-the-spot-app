import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  storeToken,
  getToken,
  simulateLogin,
  removeToken,
  saveUserName,
  getUserName,
  removeUserName,
} from '@/utils/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  userName: string | null;
  login: (email: string, password: string) => Promise<void>;
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
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 起動時に保存されたユーザー名を読み込む
  useEffect(() => {
    (async () => {
      try {
        const savedName = await getUserName();
        if (savedName) {
          setUserName(savedName);
        }
      } catch (_e) {
        // ignore
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const { token: newToken, userName: receivedName } = await simulateLogin(
        email,
        password,
      );
      await storeToken(newToken);
      setToken(newToken);
      await saveUserName(receivedName);
      setUserName(receivedName);
    } catch (_e) {
      setError('ログインに失敗しました。入力内容をご確認ください。');
    }
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    await removeUserName();
    setToken(null);
    setUserName(null);
    setError(null);
  }, []);

  const value: AuthContextType = {
    isAuthenticated: token !== null,
    userName,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
