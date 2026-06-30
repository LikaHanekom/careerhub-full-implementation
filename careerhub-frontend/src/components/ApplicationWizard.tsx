'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { submitApplication } from '@/lib/api';
import { revalidateJobs } from '@/app/actions/revalidateJobs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

// ─── Schema ────────────────────────────────────────────────────────────────────

const wizardSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[\d\s\-()]{8,15}$/.test(val),
        'Please enter a valid phone number'
      ),
    coverLetter: z
      .string()
      .max(2000, 'Cover letter must not exceed 2000 characters')
      .optional(),
    linkedInUrl: z.string().optional(),
    howDidYouHear: z.string().min(1, 'Please select an option'),
  })
  .refine(
    (data) => {
      if (data.linkedInUrl && data.linkedInUrl.trim() !== '') {
        return (
          data.linkedInUrl.startsWith('https://linkedin.com/') ||
          data.linkedInUrl.startsWith('https://www.linkedin.com/')
        );
      }
      return true;
    },
    {
      message: 'LinkedIn URL must start with https://linkedin.com/ or https://www.linkedin.com/',
      path: ['linkedInUrl'],
    }
  );

// Use z.input so the form type matches what the fields produce (strings, not transformed values)
type WizardFormData = z.input<typeof wizardSchema>;

// Fields validated per step
const STEP_FIELDS: Record<number, (keyof WizardFormData)[]> = {
  1: ['fullName', 'email', 'phone'],
  2: ['coverLetter', 'linkedInUrl', 'howDidYouHear'],
};

const HOW_DID_YOU_HEAR_OPTIONS = [
  { value: '', label: 'Select an option...' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'referral', label: 'Referral from a friend' },
  { value: 'company-website', label: 'Company website' },
  { value: 'google', label: 'Google search' },
  { value: 'other', label: 'Other' },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ApplicationWizardProps {
  jobId: string;
  jobTitle: string;
  applicantId: string | null; // null = not signed in
  isEmployer: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ApplicationWizard({
  jobId,
  jobTitle,
  applicantId,
  isEmployer,
}: ApplicationWizardProps) {
  const [step, setStep] = useState(1);
  const [hasDraft, setHasDraft] = useState(false);
  const router = useRouter();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const storageKey = `careerhub-application-${jobId}`;

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      linkedInUrl: '',
      howDidYouHear: '',
    },
  });

  // ── Draft restore on mount ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        reset(parsed);
        setHasDraft(true);
      }
    } catch {
      // Corrupt draft — ignore
    }
  }, [storageKey, reset]);

  // ── Draft auto-save on every field change ───────────────────────────────────
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
        setHasDraft(true);
      } catch {
        // localStorage unavailable — fail silently
      }
    });
    return () => subscription.unsubscribe(); // cleanup
  }, [watch, storageKey]);

  // ── Mutation ────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: async () => {
      localStorage.removeItem(storageKey);
      setHasDraft(false);
      reset();
      setStep(1);
      toast.success('Application submitted! We\'ll be in touch soon.');
      await revalidateJobs();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message ?? 'Failed to submit application. Please try again.');
    },
  });

  // ── Discard draft ───────────────────────────────────────────────────────────
    const discardDraft = () => {
    localStorage.removeItem(storageKey);
    reset({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        linkedInUrl: '',
        howDidYouHear: '',
    });
    setHasDraft(false);
    setStep(1);
    setDiscardDialogOpen(false);
    };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleNext = async () => {
    // Gate: must be signed in as candidate to pass step 1
    //to trigger test5 to not pass-comment out the line below
    if (step === 1 && !applicantId) return; // inline message handles this

    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
    //setStep((s) => s + 1);
  };

  const handleBack = () => {
    // Back never re-validates — user should be able to go back freely
    setStep((s) => s - 1);
  };

  // ── Submit 
    const onSubmit = async (data: WizardFormData) => {
    if (!applicantId) return;
    try {
      await mutation.mutateAsync({
          jobListingId: jobId,
          applicantId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone?.trim() || undefined,
          coverLetter: data.coverLetter?.trim() || '',
          linkedInUrl: data.linkedInUrl?.trim() || undefined,
          yearsOfExperience: 0,
          availableImmediately: true,
          noticePeriodWeeks: 0,
      });
      } catch {
        
      }
    };

  // ─── Employer guard 
  if (isEmployer) {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Employers cannot apply for jobs.
        </p>
      </div>
    );
  }

  const values = getValues();

  return (
    <div className="mt-4 border dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">Apply for {jobTitle}</h3>

      {/* ── Progress indicator ── */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step === n
                  ? 'bg-blue-600 text-white'
                  : step > n
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              {step > n ? '✓' : n}
            </div>
            <span className={cn(
              'text-sm hidden sm:block',
              step === n ? 'text-blue-600 font-medium' : 'text-gray-400'
            )}>
              {n === 1 ? 'Your Details' : n === 2 ? 'Your Application' : 'Review & Submit'}
            </span>
            {n < 3 && <div className="w-8 h-px bg-gray-300 dark:bg-gray-600" />}
          </div>
        ))}
      </div>

      {/* ── Draft restored banner ── */}
      {hasDraft && (
        <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You have a saved draft for this application. Restored automatically.
          </p>
          <button
            type="button"
            onClick={() => setHasDraft(false)}
            className="ml-3 text-blue-500 hover:text-blue-700 text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/*STEP 1 — Your Details*/}
        {step === 1 && (
          <div className="space-y-4">
             <h4 className="text-lg font-semibold">Your Details</h4>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Sign-in gate — shown when Next would be clicked without a session */}
            {!applicantId && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You need to be signed in as a candidate to apply.{' '}
                  <Link href="/login" className="font-medium underline hover:no-underline">
                    Sign in here.
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/*STEP 2 — Your Application*/}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Your Application</h4>
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                rows={5}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('coverLetter')}
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-500">{errors.coverLetter.message}</p>
              )}
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedInUrl" className="block text-sm font-medium mb-1">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                id="linkedInUrl"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.linkedInUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('linkedInUrl')}
              />
              {errors.linkedInUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.linkedInUrl.message}</p>
              )}
            </div>

            {/* How did you hear */}
            <div>
              <label htmlFor="howDidYouHear" className="block text-sm font-medium mb-1">
                How did you hear about this role? *
              </label>
              <select
                id="howDidYouHear"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.howDidYouHear ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                {...register('howDidYouHear')}
              >
                {HOW_DID_YOU_HEAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.howDidYouHear && (
                <p className="mt-1 text-sm text-red-500">{errors.howDidYouHear.message}</p>
              )}
            </div>
          </div>
        )}

        {/*STEP 3 — Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Review & Submit</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please review your application before submitting.
            </p>

            <div className="rounded-md border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Step 1 fields */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Your Details
                </h4>
                <ReviewRow label="Full Name" value={values.fullName} />
                <ReviewRow label="Email" value={values.email} />
                <ReviewRow label="Phone" value={values.phone} />
              </div>

              {/* Step 2 fields */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Your Application
                </h4>
                <ReviewRow label="Cover Letter" value={values.coverLetter} multiline />
                <ReviewRow label="LinkedIn URL" value={values.linkedInUrl} />
                <ReviewRow
                  label="How did you hear?"
                  value={
                    HOW_DID_YOU_HEAR_OPTIONS.find((o) => o.value === values.howDidYouHear)?.label
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {/* Discard draft — only when draft exists */}
          {hasDraft && step === 1 && (
            <AlertDialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
                <button
                type="button"
                onClick={() => setDiscardDialogOpen(true)}
                className="text-sm text-red-500 hover:text-red-700 underline"
                >
                Discard draft
                </button>

                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Discard your draft?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Your saved application progress will be permanently deleted. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep draft</AlertDialogCancel>
                    <AlertDialogAction onClick={discardDraft}>Discard draft</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}

          <div className="flex gap-3 ml-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!applicantId && step === 1}
                className={cn(
                  'px-4 py-2 bg-blue-600 text-white font-medium rounded-md text-sm transition-colors',
                  !applicantId && step === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                )}
              >
                Next
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                disabled={mutation.isPending}
                className={cn(
                  'px-4 py-2 bg-blue-600 text-white font-medium rounded-md text-sm transition-colors',
                  mutation.isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                )}
              >
                {mutation.isPending ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Helper: review row 
function ReviewRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | undefined;
  multiline?: boolean;
}) {
  const display = value && value.trim() !== '' ? value : 'Not provided';
  //const display = value; //test
  const isEmpty = display === 'Not provided';

  return (
    <div className="flex gap-4 py-2">
      <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{label}</span>
      <span
        className={cn(
          'text-sm flex-1',
          isEmpty ? 'text-gray-400 italic' : 'text-gray-900 dark:text-gray-100',
          multiline && 'whitespace-pre-wrap'
        )}
      >
        {display}
      </span>
    </div>
  );
}