// Enhanced form error handling hooks
import { useState, useCallback } from "react";
import { getFieldError, hasFieldError, getErrorMessage } from "@/lib/error-utils";
import { toast } from "@/hooks/use-toast";

export interface UseFormErrorOptions {
  showToastOnError?: boolean;
  defaultErrorMessage?: string;
}

export interface FormErrorState {
  errors: Record<string, string>;
  hasErrors: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export function useFormError({
  showToastOnError = true,
  defaultErrorMessage = "Please fix the errors below"
}: UseFormErrorOptions = {}) {
  const [errorState, setErrorState] = useState<FormErrorState>({
    errors: {},
    hasErrors: false,
    isSubmitting: false,
    submitCount: 0
  });

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrorState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: error
      },
      hasErrors: true
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrorState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldName];
      
      return {
        ...prev,
        errors: newErrors,
        hasErrors: Object.keys(newErrors).length > 0
      };
    });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setErrorState(prev => ({
      ...prev,
      errors,
      hasErrors: Object.keys(errors).length > 0
    }));
    
    if (showToastOnError && Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: defaultErrorMessage,
        variant: "destructive",
      });
    }
  }, [showToastOnError, defaultErrorMessage]);

  const clearErrors = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      errors: {},
      hasErrors: false
    }));
  }, []);

  const handleSubmitStart = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1
    }));
  }, []);

  const handleSubmitEnd = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      isSubmitting: false
    }));
  }, []);

  const handleApiError = useCallback((error: any, fieldMappings?: Record<string, string>) => {
    const errorMessage = getErrorMessage(error);
    
    // Try to extract field-specific errors from API response
    if (error?.response?.data?.errors && fieldMappings) {
      const fieldErrors: Record<string, string> = {};
      
      Object.entries(error.response.data.errors).forEach(([apiField, message]) => {
        const formField = fieldMappings[apiField] || apiField;
        fieldErrors[formField] = message as string;
      });
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }
    }
    
    // Generic error handling
    if (showToastOnError) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    handleSubmitEnd();
  }, [setErrors, showToastOnError, handleSubmitEnd]);

  const getFieldProps = useCallback((fieldName: string) => ({
    error: errorState.errors[fieldName],
    hasError: hasFieldError(errorState.errors, fieldName),
    touched: errorState.submitCount > 0
  }), [errorState]);

  return {
    ...errorState,
    setFieldError,
    clearFieldError,
    setErrors,
    clearErrors,
    handleSubmitStart,
    handleSubmitEnd,
    handleApiError,
    getFieldProps
  };
}

// Hook for handling async operations with loading and error states
export interface UseAsyncOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
  successMessage?: string;
}

export function useAsyncOperation<T = any>({
  onSuccess,
  onError,
  showToastOnError = true,
  showToastOnSuccess = false,
  successMessage = "Operation completed successfully"
}: UseAsyncOperationOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      
      if (showToastOnSuccess) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (showToastOnError) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToastOnError, showToastOnSuccess, successMessage]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset
  };
}