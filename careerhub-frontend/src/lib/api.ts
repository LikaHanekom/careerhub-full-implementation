//bridge between application and backend API
import { JobListing } from '@/types'; 

//if this succeeds TanStack then caches the result
//if this fails TanStack throws error
export async function fetchJobs(): Promise<JobListing[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; //environment configuration
  
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
  }

  const url = `${baseUrl}/api/jobs`;
  
  try {
    const response = await fetch(url);
    
    // Check response.ok - checks Errors and thow statements
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data as JobListing[];
  } catch (error) {
    // If fetch itself fails  rethrow with friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
    throw error;
  }
}