import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { TRANSITION_CLASSES } from "@/utils/transitions"
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnhancedInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  success?: boolean
  showPasswordToggle?: boolean
  description?: string
  required?: boolean
  loading?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    label,
    error,
    success = false,
    showPasswordToggle = false,
    description,
    required = false,
    loading = false,
    type,
    id,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()

    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password") 
      : type

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={inputId} 
            className={cn(
              "text-sm font-medium",
              TRANSITION_CLASSES.colorChange,
              error && "text-destructive",
              success && "text-green-600"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              TRANSITION_CLASSES.focus,
              "pr-10", // Space for icons
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              success && "border-green-500 focus:border-green-500 focus:ring-green-500",
              loading && "animate-pulse",
              isFocused && "shadow-md",
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {/* Status icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground" />
            )}
            
            {!loading && error && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            
            {!loading && !error && success && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            
            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {error && (
          <p 
            className={cn(
              "text-xs text-destructive",
              TRANSITION_CLASSES.fadeIn
            )} 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }