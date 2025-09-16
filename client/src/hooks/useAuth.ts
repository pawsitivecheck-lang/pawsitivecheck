import { useQuery } from "@tanstack/react-query";
import { handleApiError, getErrorMessage } from "@/lib/error-utils";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });
        
        // Silently return null for unauthorized access - this is expected
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          const error = new Error(`${res.status}: ${res.statusText}`) as any;
          error.status = res.status;
          error.statusText = res.statusText;
          
          // Log authentication errors for debugging but don't show to user
          console.warn("Auth check failed:", getErrorMessage(error));
          return null;
        }
        
        return await res.json();
      } catch (error: any) {
        // Network errors or other issues - log but don't show to user
        console.warn("Auth check failed:", getErrorMessage(error));
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't show loading spinner for auth checks - should be silent
    refetchOnWindowFocus: true, // Recheck auth when user returns to tab
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
  };
}
