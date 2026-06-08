'use client';

import { useCallback } from 'react';
import { buildApiUrl } from './auth-api';
import { useAuth } from './auth-context';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function shouldSetJsonContentType(body: BodyInit | null | undefined) {
  return Boolean(body) && !(body instanceof FormData);
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === 'string') return body || fallback;

  if (body && typeof body === 'object') {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message)) return message.join(' ');
    if (typeof message === 'string') return message;
  }

  return fallback;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(body, `Request failed with status ${response.status}`),
      body,
    );
  }

  return body as T;
}

export function useApiClient() {
  const { getValidToken, refreshSession } = useAuth();

  return useCallback(
    async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
      const makeRequest = async (token: string) => {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${token}`);

        if (!headers.has('Content-Type') && shouldSetJsonContentType(options.body)) {
          headers.set('Content-Type', 'application/json');
        }

        return fetch(buildApiUrl(path), {
          ...options,
          headers,
        });
      };

      const token = await getValidToken();
      if (!token) throw new ApiError(401, 'Please sign in to continue.');

      let response = await makeRequest(token);

      if (response.status === 401) {
        const refreshedToken = await refreshSession();
        if (!refreshedToken) {
          throw new ApiError(401, 'Your session expired. Please sign in again.');
        }

        response = await makeRequest(refreshedToken);
      }

      return parseApiResponse<T>(response);
    },
    [getValidToken, refreshSession],
  );
}
