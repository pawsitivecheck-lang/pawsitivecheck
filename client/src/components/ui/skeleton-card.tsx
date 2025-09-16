import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  showHeader?: boolean
  showImage?: boolean
  linesCount?: number
  imageHeight?: string
  variant?: "product" | "list" | "feed" | "health" | "animal" | "default"
}

export function SkeletonCard({ 
  className, 
  showHeader = true, 
  showImage = false, 
  linesCount = 3,
  imageHeight = "h-32",
  variant = "default"
}: SkeletonCardProps) {
  // Variant-specific configurations
  const variants = {
    product: { showImage: true, imageHeight: "h-32", linesCount: 4, showHeader: true },
    list: { showImage: false, imageHeight: "h-24", linesCount: 2, showHeader: true },
    feed: { showImage: false, imageHeight: "h-20", linesCount: 3, showHeader: true },
    health: { showImage: false, imageHeight: "h-16", linesCount: 3, showHeader: true },
    animal: { showImage: true, imageHeight: "h-24", linesCount: 4, showHeader: true },
    default: { showImage, imageHeight, linesCount, showHeader }
  }

  const config = variants[variant]

  return (
    <Card className={cn("animate-pulse", className)}>
      {config.showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            {/* Avatar/Icon skeleton */}
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            {/* Action buttons skeleton */}
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {config.showImage && (
          <Skeleton className={cn("w-full rounded-md", config.imageHeight)} />
        )}
        {/* Content lines */}
        <div className="space-y-2">
          {Array.from({ length: config.linesCount }).map((_, index) => (
            <Skeleton 
              key={index} 
              className={cn(
                "h-3",
                index === config.linesCount - 1 ? "w-2/3" : "w-full"
              )} 
            />
          ))}
        </div>
        {/* Tags/badges skeleton */}
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// Specific skeleton variations for common use cases
export function ProductSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="product" className={className} />
}

export function AnimalSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="animal" className={className} />
}

export function HealthRecordSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="health" className={className} />
}

export function FeedRecordSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="feed" className={className} />
}

export function ListItemSkeleton({ className }: { className?: string }) {
  return <SkeletonCard variant="list" className={className} />
}