import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="live-badge mb-4">404</span>
      <h1 className="text-3xl font-bold md:text-4xl">This stream went offline</h1>
      <p className="mt-3 max-w-md text-text-secondary">
        The page you&rsquo;re looking for isn&rsquo;t here. It may have ended, been clipped, or never
        existed in this demo.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary px-5 py-2.5 text-sm">
          Back to home
        </Link>
        <Link href="/discover" className="btn-secondary px-5 py-2.5 text-sm">
          Browse live streams
        </Link>
        <Link href="/clips" className="btn-secondary px-5 py-2.5 text-sm">
          Watch clips
        </Link>
      </div>
    </div>
  );
}
