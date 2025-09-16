import { useToast as useOriginalToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from "lucide-react"

// Enhanced toast hook with better UX patterns
export function useEnhancedToast() {
  const { toast, ...rest } = useOriginalToast()

  const enhancedToast = {
    success: (message: string, options?: { 
      title?: string 
      description?: string
      duration?: number
    }) => {
      return toast({
        title: options?.title || "Success",
        description: options?.description || message,
        duration: options?.duration || 3000,
        className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
      })
    },

    error: (message: string, options?: { 
      title?: string
      description?: string
      duration?: number
    }) => {
      return toast({
        title: options?.title || "Error",
        description: options?.description || message,
        variant: "destructive",
        duration: options?.duration || 5000,
      })
    },

    warning: (message: string, options?: { 
      title?: string
      description?: string
      duration?: number
    }) => {
      return toast({
        title: options?.title || "Warning",
        description: options?.description || message,
        duration: options?.duration || 4000,
        className: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
      })
    },

    info: (message: string, options?: { 
      title?: string
      description?: string
      duration?: number
    }) => {
      return toast({
        title: options?.title || "Information",
        description: options?.description || message,
        duration: options?.duration || 3000,
        className: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
      })
    },

    loading: (message: string, options?: { 
      title?: string
      duration?: number
    }) => {
      return toast({
        title: options?.title || "Loading",
        description: message,
        duration: options?.duration || 0, // Persistent until dismissed
        className: "border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100",
      })
    },

    promise: async <T,>(
      promise: Promise<T>,
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      }: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      }
    ) => {
      const loadingToast = enhancedToast.loading(loadingMessage)

      try {
        const data = await promise
        loadingToast.dismiss()
        
        const message = typeof successMessage === 'function' 
          ? successMessage(data) 
          : successMessage
        
        enhancedToast.success(message)
        return data
      } catch (error) {
        loadingToast.dismiss()
        
        const message = typeof errorMessage === 'function' 
          ? errorMessage(error) 
          : errorMessage
        
        enhancedToast.error(message)
        throw error
      }
    },

    // Original toast function for backward compatibility
    toast
  }

  return {
    ...enhancedToast,
    ...rest
  }
}

// Specific toast helpers for common use cases
export const toastHelpers = {
  saveSuccess: (itemName = "item") => ({
    title: "Saved Successfully",
    description: `Your ${itemName} has been saved.`,
  }),

  deleteSuccess: (itemName = "item") => ({
    title: "Deleted Successfully", 
    description: `The ${itemName} has been removed.`,
  }),

  updateSuccess: (itemName = "item") => ({
    title: "Updated Successfully",
    description: `Your ${itemName} has been updated.`,
  }),

  networkError: () => ({
    title: "Connection Error",
    description: "Please check your internet connection and try again.",
  }),

  unauthorized: () => ({
    title: "Session Expired",
    description: "Please log in again to continue.",
  }),

  validationError: (field?: string) => ({
    title: "Validation Error",
    description: field 
      ? `Please check the ${field} field and try again.`
      : "Please check your input and try again.",
  }),
}