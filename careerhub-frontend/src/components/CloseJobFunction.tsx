"use client";

import { useActionState } from "react";
import { closeJobListing } from "@/app/actions/closeJob";

interface CloseJobButtonProps {
  jobId: string;
  isActive: boolean; // matches JobListing.isActive, not a status string
}

export default function CloseJobButton({
  jobId,
  isActive,
}: CloseJobButtonProps) {
  const [state, formAction, isPending] = useActionState(closeJobListing, null);

  // Already closed — render nothing in the Action column
  if (!isActive) return null;

  // Success — swap button for confirmation
  if (state?.status === "success") {
    return (
      <span className="text-green-600 text-sm font-medium">
        ✓ Closed: {state.jobTitle}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <form action={formAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <button
          type="submit"
          disabled={isPending}
          className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Closing…" : "Close listing"}
        </button>
      </form>

      {state?.status === "error" && (
        <p className="text-red-500 text-xs">{state.message}</p>
      )}
    </div>
  );
}