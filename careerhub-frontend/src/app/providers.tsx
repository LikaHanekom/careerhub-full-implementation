'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
/*Connects to layout.tsx:  wraps entire application with this <Providers> 
component in root layout. This establishes the "Client Boundary,"
 meaning every page or component nested inside the children prop can 
 now use the useQuery hook to fetch the job data. */
export default function Providers({ children }: { children: React.ReactNode }) {
  // This ensures each request gets its own client 
  const [queryClient] = useState( //new instance of queryClient, ensures no data leakage
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Forces app to verify data against API every time user navigates back to the page
            refetchOnWindowFocus: true, // if user leaves and returns it still ensures data is current
          },
        },
      })
  );

  return (
    <SessionProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NuqsAdapter>
    </SessionProvider>
  );
}