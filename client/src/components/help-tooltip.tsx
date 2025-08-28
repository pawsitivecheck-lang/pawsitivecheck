import { HelpCircle } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface HelpTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export default function HelpTooltip({ content, className = "", side = "top" }: HelpTooltipProps) {
  return (
    <SimpleTooltip content={content} side={side}>
      <HelpCircle 
        className={`h-4 w-4 text-cosmic-400 hover:text-cosmic-200 transition-colors cursor-help ${className}`}
        data-testid="help-tooltip-trigger"
      />
    </SimpleTooltip>
  );
}