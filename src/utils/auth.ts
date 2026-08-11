export type AuthToken = string | null;

export async function storeToken(token: AuthToken): Promise<void> {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

export function getToken(): AuthToken {
  return localStorage.getItem('authToken');
}

export async function simulateLogin(username: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.length > 0 && password.length > 0) {
        const token = `token_${username}_${Date.now()}`;
        resolve(token);
      } else {
        reject(new Error('ユーザー名またはパスワードが空です'));
      }
    }, 800);
  });
}

export async function removeToken(): Promise<void> {
  localStorage.removeItem('authToken');
}
