import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AnimalTag } from "@shared/schema";

interface AnimalTagsProps {
  tags: (AnimalTag & { relevanceScore?: number })[];
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  showScore?: boolean;
  className?: string;
  maxTags?: number;
}

const tagTypeColors = {
  species: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  breed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100", 
  subspecies: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  size: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  age_group: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
};

const tagTypeIcons = {
  species: "🐾",
  breed: "🏷️",
  subspecies: "🧬",
  size: "📏",
  age_group: "🎂",
};

export default function AnimalTags({ 
  tags, 
  variant = "default", 
  size = "default",
  showScore = false,
  className,
  maxTags
}: AnimalTagsProps) {
  if (!tags || tags.length === 0) return null;

  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const hasMoreTags = maxTags && tags.length > maxTags;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {displayTags.map((tag) => (
        <Badge
          key={tag.id}
          variant={variant}
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            tagTypeColors[tag.type as keyof typeof tagTypeColors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
            size === "sm" && "text-[10px] px-1.5 py-0.5",
            size === "lg" && "text-sm px-3 py-1"
          )}
          data-testid={`tag-${tag.type}-${tag.name}`}
        >
          <span className="shrink-0">
            {tagTypeIcons[tag.type as keyof typeof tagTypeIcons] || "🏷️"}
          </span>
          <span>{tag.name}</span>
          {showScore && tag.relevanceScore && (
            <span className="ml-1 opacity-75">
              ({tag.relevanceScore}%)
            </span>
          )}
        </Badge>
      ))}
      
      {hasMoreTags && (
        <Badge
          variant="outline"
          className={cn(
            "text-xs text-gray-600 dark:text-gray-400",
            size === "sm" && "text-[10px] px-1.5 py-0.5",
            size === "lg" && "text-sm px-3 py-1"
          )}
        >
          +{tags.length - maxTags!} more
        </Badge>
      )}
    </div>
  );
}

export function TagLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span className="flex items-center gap-1">
        <span>🐾</span> Species
      </span>
      <span className="flex items-center gap-1">
        <span>🏷️</span> Breed
      </span>
      <span className="flex items-center gap-1">
        <span>🧬</span> Subspecies
      </span>
      <span className="flex items-center gap-1">
        <span>📏</span> Size
      </span>
      <span className="flex items-center gap-1">
        <span>🎂</span> Age Group
      </span>
    </div>
  );
}