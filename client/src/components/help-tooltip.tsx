import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export default function HelpTooltip({ content, className = "", side = "top" }: HelpTooltipProps) {
  return (
    <div title={content} className="inline-block cursor-help">
      <HelpCircle 
        className={`h-4 w-4 text-cosmic-400 hover:text-cosmic-200 transition-colors ${className}`}
        data-testid="help-tooltip-trigger"
      />
    </div>
  );
}