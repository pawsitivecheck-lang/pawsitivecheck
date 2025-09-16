// Comprehensive error handling utilities for PawsitiveCheck
import { toast } from "@/hooks/use-toast";

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

// Error type classification
export const isUnauthorizedError = (error: any): boolean => {
  return (
    error?.message?.includes('401') || 
    error?.message?.includes('Unauthorized') ||
    error?.status === 401 ||
    error?.statusCode === 401
  );
};

export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('fetch') || 
    error?.message?.includes('Network') ||
    error?.message?.includes('Failed to fetch') ||
    !navigator.onLine
  );
};

export const isForbiddenError = (error: any): boolean => {
  return (
    error?.message?.includes('403') || 
    error?.message?.includes('Forbidden') ||
    error?.status === 403 ||
    error?.statusCode === 403
  );
};

export const isValidationError = (error: any): boolean => {
  return (
    error?.message?.includes('400') || 
    error?.message?.includes('Bad Request') ||
    error?.status === 400 ||
    error?.statusCode === 400 ||
    error?.message?.includes('validation')
  );
};

export const isServerError = (error: any): boolean => {
  return (
    error?.message?.includes('500') || 
    error?.message?.includes('Internal Server Error') ||
    error?.status === 500 ||
    error?.statusCode === 500 ||
    (error?.status >= 500 && error?.status < 600)
  );
};

// User-friendly error message generation
export const getErrorMessage = (error: any, defaultMessage: string = "An unexpected error occurred"): string => {
  if (isUnauthorizedError(error)) {
    return "Your session has expired. Please log in again.";
  }
  
  if (isForbiddenError(error)) {
    return "You don't have permission to perform this action.";
  }
  
  if (isValidationError(error)) {
    return "Please check your input and try again.";
  }
  
  if (isNetworkError(error)) {
    return "Network connection failed. Please check your internet connection and try again.";
  }
  
  if (isServerError(error)) {
    return "Our servers are experiencing issues. Please try again in a few moments.";
  }
  
  // Parse API error messages
  if (error?.message && typeof error.message === 'string') {
    // Remove technical prefixes like "400: " or "500: "
    const cleanMessage = error.message.replace(/^\d+:\s*/, '');
    
    // Return clean message if it looks user-friendly
    if (cleanMessage.length > 0 && !cleanMessage.includes('Error:') && !cleanMessage.includes('fetch')) {
      return cleanMessage;
    }
  }
  
  return defaultMessage;
};

// Enhanced error handling with automatic toast notifications
export const handleApiError = (
  error: any, 
  options: {
    title?: string;
    defaultMessage?: string;
    showToast?: boolean;
    onUnauthorized?: () => void;
  } = {}
) => {
  const {
    title = "Error",
    defaultMessage = "An unexpected error occurred",
    showToast = true,
    onUnauthorized
  } = options;

  console.error('API Error:', error);
  
  const message = getErrorMessage(error, defaultMessage);
  
  // Handle unauthorized errors
  if (isUnauthorizedError(error)) {
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      // Default unauthorized handling
      if (showToast) {
        toast({
          title: "Session Expired",
          description: message,
          variant: "destructive",
        });
      }
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }
  }
  
  if (showToast) {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  }
  
  return { message, error };
};

// Network connectivity utilities
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
      return;
    }
    
    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };
    
    window.addEventListener('online', handleOnline);
  });
};

// Retry with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if ((error as any)?.status >= 400 && (error as any)?.status < 500 && (error as any)?.status !== 408) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Wait for network if offline
      if (!navigator.onLine) {
        await waitForOnline();
      }
    }
  }
  
  throw lastError;
};

// Form validation error helpers
export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  const error = errors[fieldName];
  if (error?.message) {
    return error.message;
  }
  return undefined;
};

export const hasFieldError = (errors: any, fieldName: string): boolean => {
  return !!errors[fieldName];
};

// Loading state management helpers
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: any;
}

export const createLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
  data: undefined
});

export const setLoading = (state: LoadingState): LoadingState => ({
  ...state,
  isLoading: true,
  error: null
});

export const setSuccess = (state: LoadingState, data?: any): LoadingState => ({
  ...state,
  isLoading: false,
  error: null,
  data
});

export const setError = (state: LoadingState, error: any): LoadingState => ({
  ...state,
  isLoading: false,
  error: getErrorMessage(error),
  data: undefined
});