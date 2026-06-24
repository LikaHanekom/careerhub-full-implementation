"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreateJobForm } from "@/components/CreateJobForm";

function CreateJobModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showCreate = searchParams.get("action") === "create";

  if (!showCreate) return null;

  return (
    <CreateJobForm
      onClose={() => router.replace("/dashboard/listings")}
    />
  );
}

export function CreateJobLauncher() {
  return (
    <Suspense fallback={null}>
      <CreateJobModal />
    </Suspense>
  );
}
