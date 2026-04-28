'use client';

import { use } from 'react';
import Link from 'next/link';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#36e17b]">
          Not Wired Yet
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Editing is not available yet</h1>
        <p className="mt-4 text-sm leading-6 text-gray-500">
          This frontend is now connected to the live blogs API, but the backend endpoints provided
          for this task do not include blog updates. You can review the published article or create
          a new one instead.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={`/blog/${id}`}
            target="_blank"
            className="rounded-full bg-[#36e17b] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00d63b]"
          >
            View article
          </Link>
          <Link
            href="/dashboard/blog"
            className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to posts
          </Link>
        </div>
      </div>
    </div>
  );
}
