import { QueryClient } from '@tanstack/react-query';

// Create a client with default options for caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data exists
      retry: 1, // Retry failed requests once
    },
  },
});

