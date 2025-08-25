import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export default function HelpTooltip({ content, className = "", side = "top", align = "center" }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle 
            className={`h-4 w-4 text-cosmic-400 hover:text-cosmic-200 transition-colors cursor-help ${className}`}
            data-testid="help-tooltip-trigger"
          />
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-xs p-3 bg-cosmic-800 border-cosmic-600 text-cosmic-100">
          <p className="text-sm leading-relaxed" data-testid="help-tooltip-content">
            {content}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}