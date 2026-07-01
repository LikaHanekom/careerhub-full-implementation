'use client';

import dynamic from "next/dynamic";

const ApplicationWizard = dynamic(
  () => import("@/components/ApplicationWizard").then((mod) => ({ default: mod.ApplicationWizard })),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    ),
  }
);

interface ApplicationWizardLoaderProps {
  jobId: string;
  jobTitle: string;
  applicantId: string | null;
  isEmployer: boolean;
}

export default function ApplicationWizardLoader(props: ApplicationWizardLoaderProps) {
  return <ApplicationWizard {...props} />;
}