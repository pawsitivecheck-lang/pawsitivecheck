import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { handleApiError, retryWithBackoff, isUnauthorizedError, isNetworkError } from "@/lib/error-utils";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`) as any;
    error.status = res.status;
    error.statusText = res.statusText;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await retryWithBackoff(async () => {
      const response = await fetch(url, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });
      
      await throwIfResNotOk(response);
      return response;
    }, 2, 1000, 5000); // Max 2 retries, 1s base delay, 5s max delay
    
    return res;
  } catch (error: any) {
    // Enhanced error with additional context
    const enhancedError = new Error(error.message) as any;
    enhancedError.status = error.status;
    enhancedError.statusText = error.statusText;
    enhancedError.method = method;
    enhancedError.url = url;
    throw enhancedError;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // Increased to 10 minutes for better caching
      gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx) except timeouts
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 408) {
          return false;
        }
        // Don't retry unauthorized errors
        if (isUnauthorizedError(error)) {
          return false;
        }
        // Retry network errors and server errors up to 3 times
        if (isNetworkError(error) || error?.status >= 500) {
          return failureCount < 3;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Only retry mutations on network errors, not client/server errors
        if (isNetworkError(error) && failureCount < 2) {
          return true;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      gcTime: 5 * 60 * 1000, // 5 minutes for mutations
    },
  },
});

// Export commonly used error utilities for convenience
export { handleApiError, getErrorMessage, isUnauthorizedError } from "@/lib/error-utils";
