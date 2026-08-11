import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';
const USER_NAME_KEY = 'userName';

export type AuthToken = string | null;

export async function storeToken(token: AuthToken): Promise<void> {
  if (token) {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }
}

export function getToken(): AuthToken {
  // SecureStore is synchronous only with getItem, but on some platforms it may throw if not available.
  // We use a sync wrapper for convenience; the actual retrieval on app start will use asynchronous version.
  try {
    return SecureStore.getItem(AUTH_TOKEN_KEY);
  } catch (_e) {
    return null;
  }
}

export async function getTokenAsync(): Promise<AuthToken> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (_e) {
    return null;
  }
}

export async function simulateLogin(
  username: string,
  password: string,
): Promise<{ token: string; userName: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.length > 0 && password.length > 0) {
        const token = `token_${username}_${Date.now()}`;
        // ユーザー名は入力されたものをそのまま保存（実際のAPIではレスポンスから取得）
        const userName = username;
        resolve({ token, userName });
      } else {
        reject(new Error('ユーザー名またはパスワードが空です'));
      }
    }, 800);
  });
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export async function saveUserName(name: string): Promise<void> {
  await SecureStore.setItemAsync(USER_NAME_KEY, name);
}

export async function getUserName(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(USER_NAME_KEY);
  } catch (_e) {
    return null;
  }
}

export async function removeUserName(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_NAME_KEY);
}
