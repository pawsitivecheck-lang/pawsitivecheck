import * as React from "react"
import { cn } from "@/lib/utils"
import { TRANSITION_CLASSES, staggerDelay } from "@/utils/transitions"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "none" | "sm" | "md" | "lg" | "xl"
  responsive?: boolean
  staggered?: boolean
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4", 
  lg: "gap-6",
  xl: "gap-8"
}

const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6"
}

const responsiveColClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
}

export function LayoutGrid({ 
  className, 
  cols = 3, 
  gap = "md", 
  responsive = true,
  staggered = false,
  children, 
  ...props 
}: GridProps) {
  const gridCols = responsive ? responsiveColClasses[cols] : colClasses[cols]

  return (
    <div
      className={cn(
        "grid",
        gridCols,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {staggered 
        ? React.Children.map(children, (child, index) => (
            <div 
              key={index}
              style={staggerDelay(index, 100)}
              className={TRANSITION_CLASSES.fadeIn}
            >
              {child}
            </div>
          ))
        : children
      }
    </div>
  )
}

interface ContentSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  headerActions?: React.ReactNode
  spacing?: "tight" | "normal" | "loose"
  variant?: "default" | "card" | "bordered"
}

const spacingClasses = {
  tight: "space-y-4",
  normal: "space-y-6",
  loose: "space-y-8"
}

export function ContentSection({ 
  className,
  title,
  description,
  headerActions,
  spacing = "normal",
  variant = "default",
  children,
  ...props 
}: ContentSectionProps) {
  const sectionClasses = {
    default: "",
    card: "bg-card border border-border rounded-lg p-6",
    bordered: "border-b border-border pb-6 last:border-b-0 last:pb-0"
  }

  return (
    <section 
      className={cn(
        spacingClasses[spacing],
        sectionClasses[variant],
        className
      )}
      {...props}
    >
      {(title || description || headerActions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "tight" | "normal" | "loose"
  align?: "start" | "center" | "end"
  direction?: "vertical" | "horizontal"
}

const stackSpacingClasses = {
  vertical: {
    tight: "space-y-2",
    normal: "space-y-4", 
    loose: "space-y-6"
  },
  horizontal: {
    tight: "space-x-2",
    normal: "space-x-4",
    loose: "space-x-6"
  }
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end"
}

export function Stack({ 
  className,
  spacing = "normal",
  align = "start",
  direction = "vertical",
  children,
  ...props 
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        stackSpacingClasses[direction][spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}