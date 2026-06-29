"use client";

import { useActionState, useEffect } from "react";
import { closeJobListing } from "@/app/actions/closeJob";
import { toast } from "sonner";

interface CloseJobButtonProps {
  jobId: string;
  isActive: boolean;
}

export default function CloseJobButton({ jobId, isActive }: CloseJobButtonProps) {
  const [state, formAction, isPending] = useActionState(closeJobListing, null);

  useEffect(() => {
    if (!state) return;

    if (state.status === "success") {
      toast.success(`Listing closed: ${state.jobTitle}`);
    } else if (state.status === "error") {
      toast.error(state.message ?? "Failed to close listing. Please try again.");
    }
  }, [state]);

  if (!isActive) return null;

  // After success, the listing will update via revalidation — no inline span needed
  return (
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
  );
}