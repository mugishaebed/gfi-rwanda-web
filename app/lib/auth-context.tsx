'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiLogout, apiRefresh, isExpiringSoon, parseJwt, type AuthUser } from './auth-api';

const ACCESS_KEY = 'gfi_app_access_token';
const REFRESH_KEY = 'gfi_refresh_token';
const USER_KEY = 'gfi_auth_user';

type AuthSession = {
  appAccessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type AuthCtx = {
  appAccessToken: string | null;
  refreshToken: string | null;
  token: string | null;
  user: AuthUser | null;
  roles: string[];
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  setTokens: (appAccessToken: string, refreshToken: string, user?: Partial<AuthUser>) => void;
  getValidToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored) as Partial<AuthUser>;
    if (!user.userId || !user.email) return null;

    return {
      userId: user.userId,
      email: user.email,
      name: user.name ?? user.email,
      roles: Array.isArray(user.roles) ? user.roles : [],
      provider: user.provider,
    };
  } catch {
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function mergeProfile(
  base: AuthUser | null,
  update?: Partial<AuthUser>,
): Partial<AuthUser> | undefined {
  if (!base && !update) return undefined;

  return {
    userId: update?.userId ?? base?.userId,
    email: update?.email ?? base?.email,
    name: update?.name ?? base?.name,
    roles: update?.roles?.length ? update.roles : base?.roles,
    provider: update?.provider ?? base?.provider,
  };
}

function userFromToken(
  appAccessToken: string,
  profile?: Partial<AuthUser>,
): AuthUser | null {
  const payload = parseJwt(appAccessToken);
  const userId = profile?.userId ?? payload?.sub;
  const email = profile?.email ?? payload?.email;

  if (!userId || !email) return null;

  return {
    userId,
    email,
    name: profile?.name ?? payload?.name ?? email,
    roles: profile?.roles?.length ? profile.roles : payload?.roles ?? [],
    provider: profile?.provider,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [appAccessToken, setAppAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Deduplicate concurrent refresh calls
  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  const applySession = useCallback((session: AuthSession) => {
    setAppAccessToken(session.appAccessToken);
    setRefreshToken(session.refreshToken);
    setUser(session.user);
    localStorage.setItem(ACCESS_KEY, session.appAccessToken);
    localStorage.setItem(REFRESH_KEY, session.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }, []);

  const clearSession = useCallback(() => {
    setAppAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    clearStoredSession();
  }, []);

  // On mount: restore session from the persisted refresh token
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const storedAccessToken = localStorage.getItem(ACCESS_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_KEY);
      const storedUser = readStoredUser();

      try {
        if (
          storedAccessToken &&
          storedRefreshToken &&
          storedUser &&
          !isExpiringSoon(storedAccessToken)
        ) {
          if (isMounted) {
            applySession({
              appAccessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
              user: storedUser,
            });
          }
          return;
        }

        if (!storedRefreshToken) {
          clearStoredSession();
          return;
        }

        const {
          appAccessToken: nextAccessToken,
          refreshToken: nextRefreshToken,
          user: nextProfile,
        } = await apiRefresh(storedRefreshToken);
        const nextUser = userFromToken(
          nextAccessToken,
          mergeProfile(storedUser, nextProfile),
        );

        if (!isMounted) return;

        if (nextUser) {
          applySession({
            appAccessToken: nextAccessToken,
            refreshToken: nextRefreshToken,
            user: nextUser,
          });
        } else {
          clearSession();
        }
      } catch {
        if (isMounted) clearSession();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [applySession, clearSession]);

  const setSession = useCallback((session: AuthSession) => {
    applySession(session);
  }, [applySession]);

  const setTokens = useCallback(
    (newAccessToken: string, newRefreshToken: string, profile?: Partial<AuthUser>) => {
      const nextUser = userFromToken(newAccessToken, profile);

      if (!nextUser) {
        clearSession();
        return;
      }

      applySession({
        appAccessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: nextUser,
      });
    },
    [applySession, clearSession],
  );

  const doRefresh = useCallback(async (): Promise<string | null> => {
    const stored = refreshToken ?? localStorage.getItem(REFRESH_KEY);
    if (!stored) return null;
    try {
      const {
        appAccessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: nextProfile,
      } = await apiRefresh(stored);
      const nextUser = userFromToken(nextAccessToken, mergeProfile(user, nextProfile));

      if (!nextUser) {
        clearSession();
        return null;
      }

      applySession({
        appAccessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: nextUser,
      });
      return nextAccessToken;
    } catch {
      clearSession();
      return null;
    }
  }, [applySession, clearSession, refreshToken, user]);

  /**
   * Returns a guaranteed-fresh app access token for API calls.
   * Refreshes automatically if the token is expiring soon.
   * Deduplicates concurrent refresh attempts.
   */
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!appAccessToken) return null;
    if (!isExpiringSoon(appAccessToken)) return appAccessToken;

    if (!refreshInFlight.current) {
      refreshInFlight.current = doRefresh().finally(() => {
        refreshInFlight.current = null;
      });
    }
    return refreshInFlight.current;
  }, [appAccessToken, doRefresh]);

  const userId = user?.userId;

  const logout = useCallback(async () => {
    if (userId) {
      try { await apiLogout(userId); } catch { /* best effort */ }
    }
    clearSession();
  }, [clearSession, userId]);

  const roles = user?.roles ?? [];
  const token = appAccessToken;

  return (
    <Ctx.Provider value={{
      appAccessToken,
      refreshToken,
      token,
      user,
      roles,
      isLoading,
      setSession,
      setTokens,
      getValidToken,
      logout,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
