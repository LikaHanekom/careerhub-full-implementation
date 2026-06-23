import Link from "next/link";

// No "use client" - Server Component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl gap-8 p-8">
        {/* Sidebar - persists across dashboard navigation */}
        <aside className="w-48 shrink-0">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Employer Dashboard
          </h2>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard/listings"
              className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              All Listings
            </Link>
            <Link
              href="/jobs"
              className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              View as Candidate
            </Link>
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}