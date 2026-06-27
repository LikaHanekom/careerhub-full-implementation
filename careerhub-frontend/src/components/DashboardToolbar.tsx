"use client";

import { useDashboardStore } from "@/stores/dashboardStore";

export default function DashboardToolbar() {
  const view = useDashboardStore((s) => s.view);
  const setView = useDashboardStore((s) => s.setView);
  const showClosedJobs = useDashboardStore((s) => s.showClosedJobs);
  const toggleShowClosedJobs = useDashboardStore((s) => s.toggleShowClosedJobs);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("table")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition ${
            view === "table"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setView("grid")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition ${
            view === "grid"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Grid
        </button>
      </div>

      {/* Show closed toggle */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <input
          type="checkbox"
          checked={showClosedJobs}
          onChange={toggleShowClosedJobs}
          className="h-4 w-4 rounded border-gray-300"
        />
        Show closed jobs
      </label>
    </div>
  );
}