"use server";

import { revalidateTag } from "next/cache";
import { JobListing } from "@/types";

type CloseJobState =
  | { status: "success"; jobTitle: string }
  | { status: "error"; message: string }
  | null;

export async function closeJobListing(
  _prevState: CloseJobState,
  formData: FormData
): Promise<CloseJobState> {
  const jobId = formData.get("jobId");

  if (!jobId || typeof jobId !== "string" || jobId.trim() === "") {
    return { status: "error", message: "Job ID is missing." };
  }

  let res: Response;
  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Your type uses isActive: boolean, not a status string
        body: JSON.stringify({ isActive: false }),
      }
    );
  } catch {
    return {
      status: "error",
      message: "Network error — could not reach the server.",
    };
  }

  if (!res.ok) {
    let detail = "Failed to close listing.";
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
    }
    return { status: "error", message: detail };
  }

  const job: JobListing = await res.json();

  // Clears ALL cached responses tagged "jobs" — /jobs, /jobs/[id], /dashboard/listings
  revalidateTag("jobs", "max");

  return { status: "success", jobTitle: job.title };
}