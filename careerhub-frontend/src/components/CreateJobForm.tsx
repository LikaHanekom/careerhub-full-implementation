'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CreateJobFormData } from '@/types';

// ============================================
// ZOD SCHEMA
// ============================================

const createJobSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must not exceed 120 characters'),
  
  companyId: z.string()
    .uuid('Please enter a valid company ID (GUID format)')
    .min(1, 'Company ID is required'),
  
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters'),
  
  employmentType: z.enum(['FullTime', 'PartTime', 'Contract', 'Casual']),
  
  salaryMin: z.number()
    .min(0.01, 'Minimum salary must be greater than 0'),
  
  salaryMax: z.number()
    .min(0.01, 'Maximum salary must be greater than 0'),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  
  expiresAt: z.string()
    .min(1, 'Expiration date is required')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Expiration date must be in the future',
    }),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salaryMax'],
});

type CreateJobFormSchema = z.infer<typeof createJobSchema>;

// ============================================
// COMPONENT
// ============================================

interface CreateJobFormProps {
  onClose: () => void;
}

export function CreateJobForm({ onClose }: CreateJobFormProps) {
  const queryClient = useQueryClient();

  // Get tomorrow's date in UTC for default value
  const getDefaultExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormSchema>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      employmentType: 'FullTime',
      salaryMin: 0.01,
      salaryMax: 0.01,
      expiresAt: getDefaultExpiryDate(),
    },
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
    },
  });

  const isBusy = isSubmitting || mutation.isPending;

  const onSubmit = async (data: CreateJobFormSchema) => {
    // Convert the date to UTC ISO string format
    const utcDate = new Date(data.expiresAt).toISOString();
    
    const formData: CreateJobFormData = {
      title: data.title,
      companyId: data.companyId,
      location: data.location,
      employmentType: data.employmentType,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      description: data.description,
      expiresAt: utcDate, // Send UTC date
    };
    
    await mutation.mutateAsync(formData);
  };

  const formError = mutation.isError ? mutation.error?.message : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">Create New Job Listing</h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Job Title *
              </label>
              <input
                id="title"
                type="text"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                  errors.title
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Company ID */}
            <div>
              <label htmlFor="companyId" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Company ID *
              </label>
              <input
                id="companyId"
                type="text"
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                  errors.companyId
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.companyId}
                {...register('companyId')}
              />
              {errors.companyId && (
                <p className="mt-1 text-sm text-red-500">{errors.companyId.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a valid company ID from your database
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Location *
              </label>
              <input
                id="location"
                type="text"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                  errors.location
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.location}
                {...register('location')}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Employment Type *
              </label>
              <select
                id="employmentType"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-white"
                {...register('employmentType')}
              >
                <option value="FullTime">Full-time</option>
                <option value="PartTime">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Casual">Casual</option>
              </select>
              {errors.employmentType && (
                <p className="mt-1 text-sm text-red-500">{errors.employmentType.message}</p>
              )}
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Min Salary ($) *
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={cn(
                    'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                    errors.salaryMin
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  aria-invalid={!!errors.salaryMin}
                  {...register('salaryMin', { valueAsNumber: true })}
                />
                {errors.salaryMin && (
                  <p className="mt-1 text-sm text-red-500">{errors.salaryMin.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Max Salary ($) *
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={cn(
                    'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                    errors.salaryMax
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  aria-invalid={!!errors.salaryMax}
                  {...register('salaryMax', { valueAsNumber: true })}
                />
                {errors.salaryMax && (
                  <p className="mt-1 text-sm text-red-500">{errors.salaryMax.message}</p>
                )}
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Expiration Date *
              </label>
              <input
                id="expiresAt"
                type="date"
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                  errors.expiresAt
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.expiresAt}
                {...register('expiresAt')}
              />
              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-500">{errors.expiresAt.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select a future date (will be sent as UTC)
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Job Description *
              </label>
              <textarea
                id="description"
                rows={6}
                className={cn(
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white',
                  errors.description
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
                aria-invalid={!!errors.description}
                placeholder="Describe the role, responsibilities, and requirements..."
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isBusy}
                className={cn(
                  'flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md transition-colors',
                  isBusy
                    ? 'bg-blue-400 cursor-not-allowed opacity-70'
                    : 'hover:bg-blue-700'
                )}
              >
                {isBusy ? 'Creating...' : 'Create Job'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}