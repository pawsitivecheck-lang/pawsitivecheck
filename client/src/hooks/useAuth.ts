import type { User } from "@shared/schema";

export function useAuth() {
  // Temporarily return mock data to fix React hook error
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    isAdmin: false,
  };
}
