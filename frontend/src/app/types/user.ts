export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
};
