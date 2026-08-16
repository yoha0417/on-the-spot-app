import * as SecureStore from 'expo-secure-store';
import { apiClient } from './apiClient';

const AUTH_TOKEN_KEY = 'user_token';
const USER_NAME_KEY = 'user_name';

export type AuthToken = string | null;

// -------------- token management --------------

export async function storeToken(token: AuthToken): Promise<void> {
  if (token) {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }
}

export function getToken(): AuthToken {
  try {
    return SecureStore.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getTokenAsync(): Promise<AuthToken> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

// -------------- user name management --------------

export async function saveUserName(name: string): Promise<void> {
  await SecureStore.setItemAsync(USER_NAME_KEY, name);
}

export async function getUserName(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(USER_NAME_KEY);
  } catch {
    return null;
  }
}

export async function removeUserName(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_NAME_KEY);
}

// -------------- API --------------

interface LoginResponse {
  token: string;
  user: {
    name: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiClient.post<LoginResponse>('/auth/login', payload);
  await storeToken(data.token);
  await saveUserName(data.user.name);
  return data;
}

export async function signUpUser(payload: SignUpPayload): Promise<LoginResponse> {
  const data = await apiClient.post<LoginResponse>('/auth/signup', payload);
  await storeToken(data.token);
  await saveUserName(data.user.name);
  return data;
}
