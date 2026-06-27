import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Session } from "next-auth";
import SignOutButton from "@/components/SignOutButton";

export default function NavBar({ session }: { session: Session | null }) {
  const isSignedIn = !!session;
  const role = session?.user?.role;

  return (
    <header className="border-b border-gray-200 bg-white px-8 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          CareerHub
        </Link>

        <nav className="flex items-center gap-6">
          {!isSignedIn ? (
            <>
              <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Jobs
              </Link>
              <Link
                href="/login"
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              {role === "candidate" && (
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Jobs
                </Link>
              )}
              {role === "employer" && (
                <Link href="/dashboard/listings" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {session.user.name}
                </span>
                <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                  {role}
                </span>
              </div>

              {/* v4: signOut is client-side only — delegate to Client Component */}
              <SignOutButton />
            </>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}