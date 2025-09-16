import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { cn } from "@/lib/utils"
import { TRANSITION_CLASSES } from "@/utils/transitions"
import { LucideIcon } from "lucide-react"

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  success?: boolean
  successText?: string
  successIcon?: LucideIcon
  showRipple?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    loading = false, 
    loadingText,
    icon: Icon,
    iconPosition = "left",
    success = false,
    successText = "Success!",
    successIcon: SuccessIcon,
    showRipple = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    React.useEffect(() => {
      if (success) {
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 2000)
        return () => clearTimeout(timer)
      }
    }, [success])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (showRipple && !loading) {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 200)
      }
      onClick?.(e)
    }

    if (loading) {
      return (
        <LoadingButton
          className={cn(className)}
          loading={loading}
          loadingText={loadingText}
          ref={ref}
          {...props}
        >
          {children}
        </LoadingButton>
      )
    }

    return (
      <Button
        className={cn(
          TRANSITION_CLASSES.button,
          showRipple && "relative overflow-hidden",
          isClicked && "animate-pulse",
          showSuccess && "bg-green-600 hover:bg-green-700",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {showRipple && isClicked && (
          <div className="absolute inset-0 bg-white/20 animate-ping rounded-md" />
        )}
        
        {showSuccess ? (
          <>
            {SuccessIcon && iconPosition === "left" && (
              <SuccessIcon className="mr-2 h-4 w-4" />
            )}
            {successText}
            {SuccessIcon && iconPosition === "right" && (
              <SuccessIcon className="ml-2 h-4 w-4" />
            )}
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon className="mr-2 h-4 w-4" />
            )}
            {children}
            {Icon && iconPosition === "right" && (
              <Icon className="ml-2 h-4 w-4" />
            )}
          </>
        )}
      </Button>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }