"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { closeJobListing } from "@/app/actions/closeJob";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CloseJobButtonProps {
  jobId: string;
  isActive: boolean;
}

export default function CloseJobButton({ jobId, isActive }: CloseJobButtonProps) {
  const [state, formAction] = useActionState(closeJobListing, null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!state) return;

    if (state.status === "success") {
      toast.success(`Listing closed: ${state.jobTitle}`);
      setOpen(false);
    } else if (state.status === "error") {
      toast.error(state.message ?? "Failed to close listing. Please try again.");
      setOpen(false);
    }
  }, [state]);

  if (!isActive) return null;

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("jobId", jobId);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Close listing
      </button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This listing will be marked as closed and removed from the public jobs board. This
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep listing</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Closing…" : "Close listing"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}