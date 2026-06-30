'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitApplication } from '@/lib/api';
import { revalidateJobs } from '@/app/actions/revalidateJobs';
import { ApplicationRequest } from '@/types';
import { cn } from '@/lib/utils'; 
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const phoneRegex = /^\+?[\d\s\-()]{8,15}$/;

const linkedInUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .refine(
    (url) => url.includes('linkedin.com'),
    'Must be a LinkedIn URL (linkedin.com)'
  );

const applicationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters'),

    email: z.string().email('Please enter a valid email address'),

    phone: z
      .union([
        z.literal(''),
        z.string().regex(phoneRegex, 'Please enter a valid phone number'),
      ])
      .optional()
      .transform((val) => (val === '' ? undefined : val)),

    yearsOfExperience: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative')
      .max(50, 'Maximum 50 years'),

    coverLetter: z
      .string()
      .min(50, 'Cover letter must be at least 50 characters')
      .max(2000, 'Cover letter must not exceed 2000 characters'),

    linkedInUrl: z
      .union([
        z.literal(''),
        linkedInUrlSchema,
      ])
      .optional()
      .transform((val) => (val === '' ? undefined : val)),

    availableImmediately: z.boolean().default(true),

    noticePeriodWeeks: z
      .number()
      .int('Must be a whole number')
      .min(0, 'Cannot be negative'),
  })
  .refine(
    (data) => {
      if (!data.availableImmediately) {
        return data.noticePeriodWeeks > 0;
      }
      return true;
    },
    {
      message: 'Notice period must be at least 1 week when not immediately available',
      path: ['noticePeriodWeeks'],
    }
  );

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  applicantId: string;
}

export function ApplicationForm({ jobId, jobTitle, applicantId }: ApplicationFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      availableImmediately: true,
      noticePeriodWeeks: 0,
      yearsOfExperience: 0,
    },
  });

  const watchAvailableImmediately = watch("availableImmediately");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: submitApplication,

    onSuccess: async () => {
      reset();
      await revalidateJobs();
      router.refresh();
      toast.success("Application submitted! We'll be in touch soon."); // 👈 add
    },

    onError: (error) => {
      console.error("Application submission failed:", error);
      toast.error(error?.message ?? "Failed to submit application. Please try again."); // 👈 add
    },
  });
  const isBusy = isSubmitting || mutation.isPending;

  const onSubmit = async (data: ApplicationFormData) => {
    const applicationData: ApplicationRequest = {
      jobListingId: jobId,
      applicantId: applicantId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      yearsOfExperience: data.yearsOfExperience,
      coverLetter: data.coverLetter,
      linkedInUrl: data.linkedInUrl,
      availableImmediately: data.availableImmediately,
      noticePeriodWeeks: data.noticePeriodWeeks,
    };
    console.log("Sending application payload:", JSON.stringify(applicationData, null, 2));
    await mutation.mutateAsync(applicationData);
  };

  if (mutation.isSuccess) {
    return (
      <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
          Application Submitted!
        </h3>
        <p className="text-green-600 dark:text-green-300 mt-2">
          You have successfully applied for <strong>{jobTitle}</strong>
        </p>
        <p className="text-sm text-green-500 dark:text-green-400 mt-1">
          We'll be in touch soon!
        </p>
      </div>
    );
  }


  return (
    <div className="mt-4 border dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Apply for {jobTitle}</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
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
                errors.fullName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className={cn(
                'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              className={cn(
                'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium mb-1">
              Years of Experience *
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              min={0}
              max={50}
              className={cn(
                'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                errors.yearsOfExperience ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.yearsOfExperience}
              {...register('yearsOfExperience', { valueAsNumber: true })}
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-500">{errors.yearsOfExperience.message}</p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
              Cover Letter *
            </label>
            <textarea
              id="coverLetter"
              rows={4}
              className={cn(
                'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                errors.coverLetter ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.coverLetter}
              {...register('coverLetter')}
            />
            {errors.coverLetter && (
              <p className="mt-1 text-sm text-red-500">{errors.coverLetter.message}</p>
            )}
          </div>

          {/* LinkedIn URL */}
          <div>
            <label htmlFor="linkedInUrl" className="block text-sm font-medium mb-1">
              LinkedIn Profile (Optional)
            </label>
            <input
              id="linkedInUrl"
              type="url"
              className={cn(
                'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                errors.linkedInUrl ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              aria-invalid={!!errors.linkedInUrl}
              {...register('linkedInUrl')}
            />
            {errors.linkedInUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.linkedInUrl.message}</p>
            )}
          </div>

          {/* Available Immediately */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                {...register('availableImmediately')}
              />
              <span className="text-sm font-medium">Available Immediately</span>
            </label>
          </div>

          {/* Notice Period - only shown when not immediately available */}
          {!watchAvailableImmediately && (
            <div>
              <label htmlFor="noticePeriodWeeks" className="block text-sm font-medium mb-1">
                Notice Period (Weeks) *
              </label>
              <input
                id="noticePeriodWeeks"
                type="number"
                min={1}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800',
                  errors.noticePeriodWeeks ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.noticePeriodWeeks}
                {...register('noticePeriodWeeks', { valueAsNumber: true })}
              />
              {errors.noticePeriodWeeks && (
                <p className="mt-1 text-sm text-red-500">{errors.noticePeriodWeeks.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isBusy}
            className={cn(
              'w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md transition-colors',
              isBusy ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'hover:bg-blue-700'
            )}
          >
            {isBusy ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}