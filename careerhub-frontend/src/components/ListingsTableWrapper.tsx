"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import ListingsTable from "./ListingsTable";
import { JobListing } from "@/types";

export default function ListingsTableWrapper({ jobs }: { jobs: JobListing[] }) {
  const view = useDashboardStore((s) => s.view);
  const showClosedJobs = useDashboardStore((s) => s.showClosedJobs);

  return <ListingsTable jobs={jobs} view={view} showClosedJobs={showClosedJobs} />;
}