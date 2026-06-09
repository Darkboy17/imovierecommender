"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { API_BASE_URL, authRequest, refreshRequest } from "@/app/lib/api";
import { clearStoredSession, getStoredSession, storeSession } from "@/app/lib/token-storage";
import type { AuthTokens, Session, User } from "@/app/types/user";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshPromiseRef = useRef<Promise<Session> | null>(null);

  const saveTokens = useCallback((tokens: AuthTokens) => {
    const nextSession = storeSession(tokens);
    setSession(nextSession);
    return nextSession;
  }, []);

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const current = getStoredSession();
    if (!current?.refreshToken) {
      throw new Error("Missing refresh token");
    }

    refreshPromiseRef.current = refreshRequest(current.refreshToken)
      .then(saveTokens)
      .finally(() => {
        refreshPromiseRef.current = null;
      });

    return refreshPromiseRef.current;
  }, [saveTokens]);

  useEffect(() => {
    const stored = getStoredSession();
    setSession(stored);
    setLoading(false);

    if (stored && stored.expiresAt - Date.now() < 60_000) {
      refreshSession().catch(() => {
        clearStoredSession();
        setSession(null);
      });
    }
  }, [refreshSession]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const refreshIn = Math.max(session.expiresAt - Date.now() - 60_000, 5_000);
    const timer = window.setTimeout(() => {
      refreshSession().catch(() => {
        clearStoredSession();
        setSession(null);
      });
    }, refreshIn);

    return () => window.clearTimeout(timer);
  }, [refreshSession, session]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await authRequest("login", { email, password });
      saveTokens(tokens);
    },
    [saveTokens],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const tokens = await authRequest("register", { name, email, password });
      saveTokens(tokens);
    },
    [saveTokens],
  );

  const logout = useCallback(async () => {
    const current = getStoredSession();
    if (current?.accessToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(current.accessToken),
        },
        body: JSON.stringify({ refresh_token: current.refreshToken }),
      }).catch(() => undefined);
    }

    clearStoredSession();
    setSession(null);
  }, []);

  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      let current = getStoredSession();

      if (!current) {
        throw new Error("You need to sign in first.");
      }

      if (current.expiresAt - Date.now() < 30_000) {
        const refreshed = await refreshSession();
        current = refreshed;
      }

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${current.accessToken}`);

      let response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

      if (response.status === 401) {
        const refreshed = await refreshSession();
        current = refreshed;
        headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
        response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
      }

      return response;
    },
    [refreshSession],
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      loading,
      login,
      register,
      logout,
      apiFetch,
    }),
    [apiFetch, loading, login, logout, register, session?.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
