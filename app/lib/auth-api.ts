const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000';

function buildUrl(path: string) {
  return `${API.replace(/\/$/, '')}${path}`;
}

export type JwtPayload = {
  sub: string;
  email: string;
  name?: string;
  roles: string[];
  exp: number;
  iat: number;
};

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  provider?: string;
};

type RefreshResponse = {
  appAccessToken?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  email?: string;
  name?: string;
  roles?: unknown;
  user?: {
    id?: string;
    userId?: string;
    email?: string;
    name?: string;
    roles?: unknown;
  };
};

export type RefreshResult = {
  appAccessToken: string;
  refreshToken: string;
  user?: Partial<AuthUser>;
};

export function parseRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => parseRoles(item));
  }

  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      return parseRoles(JSON.parse(trimmed));
    } catch {
      // Fall back to delimiter parsing below.
    }
  }

  return trimmed
    .split(/[,\s]+/)
    .map((role) => role.trim())
    .filter(Boolean);
}

/** Decode JWT without verification (signature check is server-side). */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1];
    // Handle URL-safe base64
    const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** True when the token expires within the next 60 seconds. */
export function isExpiringSoon(token: string): boolean {
  const p = parseJwt(token);
  return !p || p.exp * 1000 < Date.now() + 60_000;
}

export async function apiRefresh(
  refreshToken: string,
): Promise<RefreshResult> {
  const res = await fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

  const data = (await res.json()) as RefreshResponse;
  const appAccessToken = data.appAccessToken ?? data.accessToken;

  if (!appAccessToken) {
    throw new Error('Refresh response did not include an access token.');
  }

  const user = data.user;

  return {
    appAccessToken,
    refreshToken: data.refreshToken ?? refreshToken,
    user: {
      userId: data.userId ?? user?.userId ?? user?.id,
      email: data.email ?? user?.email,
      name: data.name ?? user?.name,
      roles: parseRoles(data.roles ?? user?.roles),
    },
  };
}

export async function apiLogout(userId: string): Promise<void> {
  await fetch(buildUrl('/auth/logout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

/** Browser navigates here — do NOT call with fetch. */
export const microsoftLoginUrl = (origin: string) =>
  buildUrl(
    `/auth/microsoft/login?redirectTo=${encodeURIComponent(`${origin}/auth/callback`)}`,
  );

export const microsoftSignupUrl = (origin: string) =>
  buildUrl(
    `/auth/microsoft/signup?role=BLOG_EDITOR&redirectTo=${encodeURIComponent(
      `${origin}/auth/callback`,
    )}`,
  );

export const microsoftLogoutUrl = (origin: string) =>
  buildUrl(
    `/auth/microsoft/logout?postLogoutRedirectUri=${encodeURIComponent(origin)}`,
  );
