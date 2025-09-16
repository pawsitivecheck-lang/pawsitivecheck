import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Circle } from "lucide-react"

interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  current?: boolean
}

interface ProgressIndicatorProps {
  steps: Step[]
  className?: string
  orientation?: "horizontal" | "vertical"
  showLabels?: boolean
}

export function ProgressIndicator({
  steps,
  className,
  orientation = "horizontal",
  showLabels = true
}: ProgressIndicatorProps) {
  return (
    <div className={cn(
      "flex",
      orientation === "horizontal" ? "items-center justify-between" : "flex-col space-y-4",
      className
    )}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={cn(
            "flex items-center",
            orientation === "vertical" && "w-full"
          )}>
            <div className="relative flex items-center">
              {/* Step circle */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                  step.completed
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.current
                    ? "border-primary bg-background text-primary"
                    : "border-muted-foreground bg-muted text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Circle className="h-3 w-3 fill-current" />
                )}
              </div>
              
              {/* Step label */}
              {showLabels && (
                <div className={cn(
                  "ml-3 min-w-0 flex-1",
                  orientation === "vertical" && "flex flex-col"
                )}>
                  <div className={cn(
                    "text-sm font-medium transition-colors",
                    step.completed || step.current
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "transition-colors duration-200",
                orientation === "horizontal"
                  ? "h-0.5 flex-1 mx-4"
                  : "w-0.5 h-8 ml-5",
                step.completed
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}