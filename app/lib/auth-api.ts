const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000';

export type JwtPayload = {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

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
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  return res.json();
}

export async function apiLogout(userId: string): Promise<void> {
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

/** Browser navigates here — do NOT call with fetch. */
export const googleLoginUrl  = () => `${API}/auth/google/login`;
export const googleSignupUrl = () => `${API}/auth/google/signup?role=BLOG_EDITOR`;
