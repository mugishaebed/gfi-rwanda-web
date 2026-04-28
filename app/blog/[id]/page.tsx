/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlog, getBlogs } from '@/lib/api/blogs';
import {
  formatAuthorName,
  formatBlogDate,
  formatBlogTime,
  resolveMediaUrl,
  sortBlogContents,
} from '@/lib/blog-utils';

async function loadBlog(id: string) {
  try {
    return await getBlog(id);
  } catch (error) {
    if (error instanceof Error && /404/.test(error.message)) {
      notFound();
    }
    throw error;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blog, relatedResponse] = await Promise.all([
    loadBlog(id),
    getBlogs(1, 4).catch(() => ({ data: [] })),
  ]);

  const orderedContents = sortBlogContents(blog.contents);
  const thumbnailUrl = resolveMediaUrl(blog.thumbnailUrl);
  const related = relatedResponse.data.filter((p) => p.id !== id).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">

      {/* Hero banner — thumbnail as background with breadcrumbs + title */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a3a2a]" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pb-10">
            <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
              <Link href="/" className="text-white/60 hover:text-[#00d63b] transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <Link href="/blog" className="text-white/60 hover:text-[#00d63b] transition-colors">
                Blog
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium line-clamp-1">{blog.title}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-4xl px-6 md:px-10 pt-8 pb-14">

        {/* Author row */}
        <div className="flex items-center gap-3 pb-7 border-b border-gray-100 mb-8">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{formatAuthorName(blog.author)}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {formatBlogDate(blog.createdAt)} · {formatBlogTime(blog.createdAt)}
            </p>
          </div>
        </div>

        {/* Thumbnail (small, left) + short description (right) */}
        {(thumbnailUrl || blog.shortDescription) && (
          <div className="flex flex-col gap-5 mb-10 md:flex-row md:items-start">
            {thumbnailUrl && (
              <div className="w-full flex-shrink-0 overflow-hidden rounded-lg md:w-64">
                <img
                  src={thumbnailUrl}
                  alt={blog.title}
                  className="h-48 w-full object-cover md:h-44"
                />
              </div>
            )}
            {blog.shortDescription && (
              <p className="flex-1 text-base leading-relaxed text-gray-700">
                {blog.shortDescription}
              </p>
            )}
          </div>
        )}

        {/* Article content */}
        <div className="space-y-10">
          {orderedContents.map((content) => (
            <section key={content.id} className="space-y-5">
              {content.header ? (
                <h2 className="text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
                  {content.header}
                </h2>
              ) : null}

              <div
                className="blog-html text-[17px] leading-[1.85] text-gray-700
                  [&_a]:text-[#15803d] [&_a]:underline [&_a]:underline-offset-2
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#36e17b] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-500
                  [&_figure]:my-8
                  [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900
                  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900
                  [&_li]:mb-2 [&_li]:leading-[1.75]
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
                  [&_p]:mb-5
                  [&_strong]:font-semibold [&_strong]:text-gray-800
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4"
                dangerouslySetInnerHTML={{ __html: content.body }}
              />

              {resolveMediaUrl(content.imageUrl) ? (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <img
                    src={resolveMediaUrl(content.imageUrl) ?? ''}
                    alt={content.header ?? blog.title}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-100 pt-8">
          <Link href="/blog" className="text-sm font-medium text-[#36e17b] hover:text-[#00d63b]">
            ← Back to all articles
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-[#f7fbf8]">
          <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-18">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Related articles</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <Link href={`/blog/${post.id}`} className="flex h-full flex-col">
                    <div className="overflow-hidden bg-gray-100">
                      {resolveMediaUrl(post.thumbnailUrl) ? (
                        <img
                          src={resolveMediaUrl(post.thumbnailUrl) ?? ''}
                          alt={post.title}
                          className="aspect-[16/9] w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex aspect-[16/9] items-center justify-center bg-[#edf8f0] text-sm font-medium text-[#1f8a44]">
                          GFI Rwanda
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                        <span>{formatBlogDate(post.createdAt)}</span>
                        <span className="text-gray-200">·</span>
                        <span>{formatAuthorName(post.author)}</span>
                      </div>
                      <h3 className="font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#1f8a44]">
                        {post.title}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                        {post.shortDescription}
                      </p>
                      <span className="text-sm font-medium text-[#36e17b]">Read article →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
