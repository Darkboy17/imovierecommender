import type { AuthTokens, User } from "@/app/types/user";

const ACCESS_TOKEN_KEY = "imovie.accessToken";
const REFRESH_TOKEN_KEY = "imovie.refreshToken";
const EXPIRES_AT_KEY = "imovie.accessExpiresAt";
const USER_KEY = "imovie.user";

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));
  const user = localStorage.getItem(USER_KEY);

  if (!accessToken || !refreshToken || !expiresAt || !user) {
    return null;
  }

  try {
    return {
      accessToken,
      refreshToken,
      expiresAt,
      user: JSON.parse(user) as User,
    };
  } catch {
    clearStoredSession();
    return null;
  }
}

export function storeSession(tokens: AuthTokens) {
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
    user: tokens.user,
  };
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(USER_KEY);
}
