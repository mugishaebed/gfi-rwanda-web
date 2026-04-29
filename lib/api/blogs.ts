import type { Blog, BlogListResponse, CreateBlogPayload } from '@/types/blog';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000';

function buildUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Request failed with status ${response.status}${message ? `: ${message}` : ''}`,
    );
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function getBlogs(page = 1, limit = 10): Promise<BlogListResponse> {
  const response = await fetch(buildUrl(`/v1/blogs?page=${page}&limit=${limit}`), {
    cache: 'no-store',
  });

  return parseJson<BlogListResponse>(response);
}

export async function getBlog(id: string): Promise<Blog> {
  const response = await fetch(buildUrl(`/v1/blogs/${id}`), {
    cache: 'no-store',
  });

  return parseJson<Blog>(response);
}

export async function createBlog(token: string, payload: CreateBlogPayload): Promise<Blog> {
  const response = await fetch(buildUrl('/v1/blogs'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJson<Blog>(response);
}
