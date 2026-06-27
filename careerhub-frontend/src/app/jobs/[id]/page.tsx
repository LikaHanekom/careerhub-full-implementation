import { notFound } from "next/navigation";
import Link from "next/link";
import { ApplicationForm } from "@/components/ApplicationForm";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { fetchJobById } from '@/lib/api';
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch job and session in parallel
  const [job, session] = await Promise.all([
    fetchJobById(id, { next: { tags: ["jobs"] } }),
    auth(),
  ]);

  if (!job) notFound();

  const role = session?.user?.role;

  // Determine what to render in the application section
  const renderApplicationSection = () => {
    if (!job.isActive) {
      return (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            This position is no longer accepting applications.
          </p>
        </div>
      );
    }

    if (role === "employer") {
      return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Employers cannot apply for jobs.
          </p>
        </div>
      );
    }

    if (!session) {
      return (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            You must be signed in to apply.{" "}
            <Link href="/login" className="font-medium underline hover:no-underline">
              Sign in here.
            </Link>
          </p>
        </div>
      );
    }

    // role - "candidate"
    return (
      <ApplicationForm
        jobId={job.id}
        jobTitle={job.title}
        applicantId={session.user.id}
      />
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to jobs
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {job.title}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {job.company} • {job.location}
              </p>
            </div>
            <JobStatusBadge
              employmentType={job.employmentType}
              isActive={job.isActive}
            />
          </div>
        </div>

        {renderApplicationSection()}
      </div>
    </main>
  );
}