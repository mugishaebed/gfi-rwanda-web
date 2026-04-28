/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogs } from '@/lib/api/blogs';
import { formatAuthorName, formatBlogDate, resolveMediaUrl } from '@/lib/blog-utils';
import type { Blog } from '@/types/blog';

export default function BlogListPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getBlogs(1, 20)
      .then((response) => {
        if (!isMounted) return;
        setPosts(response.data);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        setError(reason instanceof Error ? reason.message : 'Failed to load blog posts.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
              Content
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          </div>
          <Link
            href="/dashboard/blog/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#36e17b] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#00d63b]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Post
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            <p className="mt-0.5 text-sm text-gray-400">Published posts</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-sm leading-6 text-gray-500">
              This dashboard reads from the live blog API. Editing and deletion are not wired yet
              because the backend endpoints provided for this task only include public reads and
              creation.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 rounded-full border-2 border-[#36e17b] border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
            <p className="mb-4 text-sm text-gray-400">No blog posts yet</p>
            <Link
              href="/dashboard/blog/new"
              className="inline-flex items-center gap-2 rounded-full border border-[#36e17b] px-5 py-2 text-sm font-medium text-[#36e17b] transition-colors hover:bg-[#36e17b] hover:text-white"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Post
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {resolveMediaUrl(post.thumbnailUrl) ? (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={resolveMediaUrl(post.thumbnailUrl) ?? ''}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8faf0] text-[#36e17b]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 9h18M9 21V9" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-medium text-gray-900">
                            {post.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">/blog/{post.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatAuthorName(post.author)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-400">
                      {formatBlogDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/blog/${post.id}`}
                        target="_blank"
                        className="rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        View ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
