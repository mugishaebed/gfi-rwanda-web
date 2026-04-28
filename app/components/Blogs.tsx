/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import FadeIn from './FadeIn';
import { getBlogs } from '@/lib/api/blogs';
import { formatBlogDate, formatBlogTime, resolveMediaUrl } from '@/lib/blog-utils';
import type { Blog } from '@/types/blog';

export default async function Blogs() {
  let posts: Blog[] = [];

  try {
    const response = await getBlogs(1, 2);
    posts = response.data;
  } catch {
    posts = [];
  }

  return (
    <section id="blogs" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <FadeIn className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
            Latest News
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Insights & Updates
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-gray-500">
            Stay updated with the latest news, stories, and developments from GFI Rwanda.
          </p>
        </FadeIn>

        <div className="mb-8 flex justify-end">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Browse all articles
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-8 py-14 text-center">
            <p className="text-sm text-gray-500">
              Blog posts will appear here once the API is reachable and content is published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 120}>
                <Link
                  href={`/blog/${post.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="overflow-hidden bg-gray-100">
                    {resolveMediaUrl(post.thumbnailUrl) ? (
                      <img
                        src={resolveMediaUrl(post.thumbnailUrl) ?? ''}
                        alt={post.title}
                        className="h-60 w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-60 items-center justify-center bg-[#edf8f0] text-sm font-medium text-[#1f8a44]">
                        GFI Rwanda
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-7">
                    <h3 className="text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#36e17b]">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="rounded-full border border-gray-200 px-3 py-1">
                        {formatBlogDate(post.createdAt)}
                      </span>
                      <span className="rounded-full border border-gray-200 px-3 py-1">
                        {formatBlogTime(post.createdAt)}
                      </span>
                    </div>

                    <p className="flex-1 text-sm leading-relaxed text-gray-500">
                      {post.shortDescription}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#36e17b] transition-all group-hover:gap-3">
                      Read more →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
