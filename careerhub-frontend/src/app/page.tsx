'use client';
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to CareerHub
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Find your dream job or manage your company's listings.
        </p>
        
        {/* Updated Button Group */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/jobs" className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto">
            Browse Jobs
          </Link>
          <Link href="/dashboard/listings" className="w-full rounded-lg border bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:w-auto">
            Dashboard
          </Link>
          {/* New Add Job Button */}
          <Link href="/dashboard/listings?action=create" className="w-full rounded-lg border border-green-600 bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700 sm:w-auto">
            Add New Job
          </Link>
        </div>
      </div>
    </main>
  );
}