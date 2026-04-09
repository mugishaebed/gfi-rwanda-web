import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-6 max-w-md">

        {/* Large 404 */}
        <span className="text-[9rem] md:text-[12rem] font-bold leading-none text-gray-100 select-none">
          404
        </span>

        {/* Text stacked over the number */}
        <div className="-mt-16 md:-mt-24 flex flex-col items-center gap-4">
          <div className="w-8 h-0.5 bg-[#00d63b] rounded-full" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Page not found
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#00d63b] text-[#00d63b] font-medium text-sm hover:bg-[#00d63b] hover:text-white transition-all"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
