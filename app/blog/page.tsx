/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import Link from 'next/link';
import { getBlogs } from '@/lib/api/blogs';
import { formatAuthorName, formatBlogDate, resolveMediaUrl } from '@/lib/blog-utils';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getPageNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = getPageNumber((await searchParams).page);
  const response = await getBlogs(page, 10);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src="/hero.png"
          alt="GFI Rwanda Blog"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pb-10">
            <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 hover:text-[#00d63b] transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Blog</span>
            </nav>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
              GFI Journal
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
              Insights, updates, and field stories from Green Financing Incorporate.
            </h1>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-18">
        {/* Intro */}
        <div className="mb-12 max-w-2xl">
          <p className="text-base leading-relaxed text-gray-500">
            Explore perspectives on green finance, sustainable development, and economic growth
            from the GFI Rwanda team — stories from the field, industry updates, and practical
            insights for businesses across Rwanda and the region.
          </p>
        </div>

        {response.data.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
            <p className="text-base text-gray-500">No blog posts have been published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {response.data.map((blog) => (
              <article key={blog.id}>
                <Link
                  href={`/blog/${blog.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="overflow-hidden bg-gray-100">
                    {resolveMediaUrl(blog.thumbnailUrl) ? (
                      <img
                        src={resolveMediaUrl(blog.thumbnailUrl) ?? ''}
                        alt={blog.title}
                        className="h-60 w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-60 items-center justify-center bg-[#edf8f0] text-sm font-medium text-[#1f8a44]">
                        GFI Rwanda
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-7">
                    <h2 className="text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#36e17b]">
                      {blog.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="rounded-full border border-gray-200 px-3 py-1">
                        {formatBlogDate(blog.createdAt)}
                      </span>
                      <span className="rounded-full border border-gray-200 px-3 py-1">
                        Author: {formatAuthorName(blog.author)}
                      </span>
                    </div>

                    <p className="flex-1 text-sm leading-relaxed text-gray-500">
                      {blog.shortDescription}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#36e17b] transition-all group-hover:gap-3">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-400">
            Page {response.meta.page} of {response.meta.totalPages}
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={response.meta.page > 1 ? `/blog?page=${response.meta.page - 1}` : '/blog'}
              aria-disabled={response.meta.page <= 1}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                response.meta.page <= 1
                  ? 'pointer-events-none border-gray-100 text-gray-300'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Previous
            </Link>
            <Link
              href={`/blog?page=${response.meta.page + 1}`}
              aria-disabled={response.meta.page >= response.meta.totalPages}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                response.meta.page >= response.meta.totalPages
                  ? 'pointer-events-none bg-gray-100 text-gray-300'
                  : 'bg-[#36e17b] text-white hover:bg-[#00d63b]'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
