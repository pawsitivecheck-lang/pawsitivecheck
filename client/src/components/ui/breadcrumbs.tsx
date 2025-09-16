import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { TRANSITION_CLASSES } from "@/utils/transitions"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const allItems = showHome 
    ? [{ label: "Home", href: "/" }, ...items]
    : items

  return (
    <nav 
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              {item.href && !item.current ? (
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-muted-foreground hover:text-foreground",
                    TRANSITION_CLASSES.colorChange,
                    index === 0 && showHome && "hover:text-primary"
                  )}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className={cn(
                    "flex items-center space-x-1",
                    item.current 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
            
            {index < allItems.length - 1 && (
              <li>
                <ChevronRight 
                  className="h-4 w-4 text-muted-foreground" 
                  aria-hidden="true"
                />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Common breadcrumb patterns
export const breadcrumbPatterns = {
  product: (productName: string) => [
    { label: "Products", href: "/product-database" },
    { label: productName, current: true }
  ],

  userProfile: () => [
    { label: "Profile", current: true }
  ],

  adminDashboard: (section?: string) => [
    { label: "Admin", href: "/admin" },
    ...(section ? [{ label: section, current: true }] : [])
  ],

  livestock: (herdName?: string) => [
    { label: "Livestock", href: "/livestock" },
    ...(herdName ? [{ label: herdName, current: true }] : [])
  ]
}