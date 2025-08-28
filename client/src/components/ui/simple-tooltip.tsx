"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleTooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function SimpleTooltip({ 
  children, 
  content, 
  side = "top",
  className 
}: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-sm text-white bg-black rounded-md shadow-lg whitespace-nowrap",
            side === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            side === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-2",
            side === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-2",
            side === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-2",
            className
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-black rotate-45",
              side === "top" && "top-full left-1/2 transform -translate-x-1/2 -mt-1",
              side === "bottom" && "bottom-full left-1/2 transform -translate-x-1/2 -mb-1",
              side === "left" && "left-full top-1/2 transform -translate-y-1/2 -ml-1",
              side === "right" && "right-full top-1/2 transform -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  )
}

// Export compatible names for existing components
export const Tooltip = ({ children }: { children: React.ReactNode }) => children
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => children
export const TooltipContent = ({ children }: { children: React.ReactNode }) => children
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => children