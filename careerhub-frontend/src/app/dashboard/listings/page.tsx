import { Suspense } from "react";
import ApplicationsSummary, {
  ApplicationsSummarySkeleton,
} from "@/components/ApplicationsSummary";
import ListingsTable, {
  ListingsTableSkeleton,
} from "@/components/ListingsTable";

export default function ListingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Employer Dashboard</h1>

      <Suspense fallback={<ApplicationsSummarySkeleton />}>
        <ApplicationsSummary />
      </Suspense>

      <Suspense fallback={<ListingsTableSkeleton />}>
        <ListingsTable />
      </Suspense>
    </main>
  );
}