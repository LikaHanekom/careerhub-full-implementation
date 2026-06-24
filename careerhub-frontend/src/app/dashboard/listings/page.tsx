import Link from "next/link";
import { Suspense } from "react";
import ApplicationsSummary, {
  ApplicationsSummarySkeleton,
} from "@/components/ApplicationsSummary";
import ListingsTable, {
  ListingsTableSkeleton,
} from "@/components/ListingsTable";
import { CreateJobLauncher } from "@/components/CreateJobLauncher";

export const dynamic = "force-dynamic";

export default function ListingsPage() {
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

      <Suspense fallback={<ListingsTableSkeleton />}>
        <ListingsTable />
      </Suspense>

      <CreateJobLauncher />
    </main>
  );
}
