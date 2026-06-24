interface ApplicationStat {
  jobId: string;
  applicationCount: number;
}

async function getApplicationStats(): Promise<ApplicationStat[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications/stats`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export function ApplicationsSummarySkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 p-6 w-56 h-24 bg-gray-100" />
  );
}

export default async function ApplicationsSummary() {
  const stats = await getApplicationStats();
  const total = stats.reduce((sum, s) => sum + s.applicationCount, 0);

  return (
    <div className="rounded-xl border border-gray-200 p-6 w-56 mb-6">
      <p className="text-sm text-gray-500">Total Applications</p>
      <p className="text-4xl font-semibold mt-1 text-gray-900">{total}</p>
    </div>
  );
}