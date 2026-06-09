import type { AuthTokens } from "@/app/types/user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = data?.detail || response.statusText;
    throw new Error(Array.isArray(detail) ? detail[0]?.msg || response.statusText : detail);
  }

  return data as T;
}

export async function authRequest(mode: "login" | "register", payload: AuthPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthTokens>(response);
}

export async function refreshRequest(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  return parseResponse<AuthTokens>(response);
}
