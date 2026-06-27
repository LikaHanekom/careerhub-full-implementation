import Link from "next/link";
import { Suspense } from "react";
import ApplicationsSummary, { ApplicationsSummarySkeleton } from "@/components/ApplicationsSummary";
import { ListingsTableSkeleton } from "@/components/ListingsTable";
import ListingsTableWrapper from "@/components/ListingsTableWrapper";
import DashboardToolbar from "@/components/DashboardToolbar";
import { CreateJobLauncher } from "@/components/CreateJobLauncher";
import { fetchEmployerJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const jobs = await fetchEmployerJobs({ next: { tags: ["jobs"] } });

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employer Dashboard</h1>
        <Link
          href="/dashboard/listings?action=create"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Add New Job
        </Link>
      </div>

      <Suspense fallback={<ApplicationsSummarySkeleton />}>
        <ApplicationsSummary />
      </Suspense>

      <DashboardToolbar />

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <Suspense fallback={<ListingsTableSkeleton />}>
          <ListingsTableWrapper jobs={jobs} />
        </Suspense>
      </div>

      <CreateJobLauncher />
    </main>
  );
}