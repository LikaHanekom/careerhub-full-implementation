import { fetchEmployerJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export function ApplicationsSummarySkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 p-6 w-56 h-24 bg-gray-100" />
  );
}

export default async function ApplicationsSummary() {
  const jobs = await fetchEmployerJobs({ next: { tags: ["jobs"] } });
  const total = jobs.reduce((sum, job) => sum + job.applicantCount, 0);

  return (
    <div className="rounded-xl border border-gray-200 p-6 w-56 mb-6">
      <p className="text-sm text-gray-500">Total Applications</p>
      <p className="text-4xl font-semibold mt-1 text-gray-900">{total}</p>
    </div>
  );
}
