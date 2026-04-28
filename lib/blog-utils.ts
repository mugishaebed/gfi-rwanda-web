import { getApiBaseUrl } from '@/lib/api/blogs';
import type { BlogContent } from '@/types/blog';

export function formatBlogDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBlogTime(value: string) {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function sortBlogContents(contents: BlogContent[]) {
  return [...contents].sort((left, right) => left.position - right.position);
}

export function getBlogExcerpt(contents: BlogContent[], maxLength = 180) {
  const firstBody = sortBlogContents(contents)
    .map((content) => stripHtml(content.body))
    .find(Boolean);

  if (!firstBody) {
    return '';
  }

  if (firstBody.length <= maxLength) {
    return firstBody;
  }

  return `${firstBody.slice(0, maxLength).trimEnd()}...`;
}

export function resolveMediaUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = value.startsWith('/') ? value : `/${value}`;

  return `${base}${path}`;
}

export function formatAuthorName(value: string) {
  if (!value.includes('@')) {
    return value;
  }

  const localPart = value.split('@')[0] ?? value;

  return localPart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function getReadTime(contents: BlogContent[]): string {
  const text = contents.map((c) => stripHtml(c.body)).join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '…')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}
