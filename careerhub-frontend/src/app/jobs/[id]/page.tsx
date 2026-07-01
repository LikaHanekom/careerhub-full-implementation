import { notFound } from "next/navigation";
import Link from "next/link";
import ApplicationWizardLoader from "@/components/ApplicationWizardLoader";
import { ApplicationWizard } from "@/components/ApplicationWizard";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { fetchJobById } from '@/lib/api';
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import type { Metadata } from "next";


export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const job = await fetchJobById(id, { next: { tags: ["jobs"] } });
    const description = `Apply for ${job.title} at ${job.company} in ${job.location}.`;

    return {
      title: job.title,
      description,
      openGraph: {
        title: job.title,
        description,
        type: "website",
      },
    };
  } catch {
    return { title: "Job Not Found" };
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let job;
  try {
    job = await fetchJobById(id, { next: { tags: ["jobs"] } });
  } catch {
    notFound();
  }

  const session = await getServerSession(authConfig);
  const role = session?.user?.role;

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
    return (
      <ApplicationWizardLoader
        jobId={job.id}
        jobTitle={job.title}
        applicantId={session?.user?.id ?? null}
        isEmployer={role === 'employer'}
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