import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, RefreshCw, Circle } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "accent" | "muted"
}

export function LoadingSpinner({ 
  className, 
  size = "default", 
  variant = "default" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  }

  const variantClasses = {
    default: "text-primary",
    accent: "text-accent-foreground",
    muted: "text-muted-foreground"
  }

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
    />
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  loadingText?: string
  blur?: boolean
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  className,
  loadingText = "Loading...",
  blur = true
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
          !blur && "backdrop-blur-none"
        )}>
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface PulseLoaderProps {
  className?: string
  count?: number
  size?: "sm" | "default" | "lg"
}

export function PulseLoader({ className, count = 3, size = "default" }: PulseLoaderProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    default: "h-3 w-3",
    lg: "h-4 w-4"
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Circle
          key={index}
          className={cn(
            "fill-current text-primary animate-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false,
  animated = true 
}: ProgressBarProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-foreground">
            {normalizedProgress}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "bg-primary h-2 rounded-full transition-all duration-300 ease-out",
            animated && "animate-pulse"
          )}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  )
}