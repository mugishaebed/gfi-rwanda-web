'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiLogout, apiRefresh, isExpiringSoon, parseJwt, type JwtPayload } from './auth-api';

const REFRESH_KEY = 'gfi_refresh_token';

type AuthCtx = {
  token: string | null;
  user: JwtPayload | null;
  isLoading: boolean;
  setTokens: (token: string, refresh: string) => void;
  getValidToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken]     = useState<string | null>(null);
  const [user, setUser]       = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Deduplicate concurrent refresh calls
  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  // On mount: restore session from the persisted refresh token
  useEffect(() => {
    const stored = localStorage.getItem(REFRESH_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    apiRefresh(stored)
      .then(({ accessToken, refreshToken }) => {
        const payload = parseJwt(accessToken);
        if (payload) {
          setToken(accessToken);
          setUser(payload);
          localStorage.setItem(REFRESH_KEY, refreshToken);
        } else {
          localStorage.removeItem(REFRESH_KEY);
        }
      })
      .catch(() => localStorage.removeItem(REFRESH_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const setTokens = useCallback((newToken: string, newRefresh: string) => {
    setToken(newToken);
    setUser(parseJwt(newToken));
    localStorage.setItem(REFRESH_KEY, newRefresh);
  }, []);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    const stored = localStorage.getItem(REFRESH_KEY);
    if (!stored) return null;
    try {
      const { accessToken, refreshToken } = await apiRefresh(stored);
      setToken(accessToken);
      setUser(parseJwt(accessToken));
      localStorage.setItem(REFRESH_KEY, refreshToken);
      return accessToken;
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem(REFRESH_KEY);
      return null;
    }
  }, []);

  /**
   * Returns a guaranteed-fresh JWT for API calls.
   * Refreshes automatically if the token is expiring soon.
   * Deduplicates concurrent refresh attempts.
   */
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!token) return null;
    if (!isExpiringSoon(token)) return token;

    if (!refreshInFlight.current) {
      refreshInFlight.current = doRefresh().finally(() => {
        refreshInFlight.current = null;
      });
    }
    return refreshInFlight.current;
  }, [token, doRefresh]);

  const logout = useCallback(async () => {
    if (user?.sub) {
      try { await apiLogout(user.sub); } catch { /* best effort */ }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(REFRESH_KEY);
  }, [user]);

  return (
    <Ctx.Provider value={{ token, user, isLoading, setTokens, getValidToken, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
