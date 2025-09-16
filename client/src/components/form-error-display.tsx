// Enhanced form error display component for consistent error handling
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export interface FormErrorDisplayProps {
  error?: string | null;
  success?: string | null;
  info?: string | null;
  className?: string;
  variant?: "default" | "destructive";
  showIcon?: boolean;
}

export function FormErrorDisplay({
  error,
  success,
  info,
  className,
  variant,
  showIcon = true,
}: FormErrorDisplayProps) {
  const message = error || success || info;
  if (!message) return null;

  const alertVariant = variant || (error ? "destructive" : "default");
  
  const getIcon = () => {
    if (!showIcon) return null;
    
    if (error) return <AlertCircle className="h-4 w-4" />;
    if (success) return <CheckCircle className="h-4 w-4" />;
    if (info) return <Info className="h-4 w-4" />;
    return null;
  };

  const getStyles = () => {
    if (error) return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300";
    if (success) return "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300";
    if (info) return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300";
    return "";
  };

  return (
    <Alert 
      variant={alertVariant} 
      className={cn("flex items-start space-x-2", getStyles(), className)}
      data-testid={`alert-${error ? 'error' : success ? 'success' : 'info'}`}
    >
      {getIcon()}
      <AlertDescription className="text-sm font-medium flex-1">
        {message}
      </AlertDescription>
    </Alert>
  );
}

// Field-level error display for form inputs
export interface FieldErrorProps {
  error?: string;
  touched?: boolean;
  className?: string;
}

export function FieldError({ error, touched, className }: FieldErrorProps) {
  if (!error || !touched) return null;

  return (
    <p 
      className={cn("text-sm text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1", className)}
      data-testid="field-error"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </p>
  );
}

// Loading state with error fallback
export interface LoadingStateDisplayProps {
  isLoading: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingStateDisplay({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data available",
  children,
  className
}: LoadingStateDisplayProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} data-testid="loading-state">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <FormErrorDisplay 
        error={error} 
        className={cn("m-4", className)}
      />
    );
  }

  if (isEmpty) {
    return (
      <div className={cn("flex items-center justify-center p-8 text-gray-500 dark:text-gray-400", className)} data-testid="empty-state">
        <div className="text-center">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}