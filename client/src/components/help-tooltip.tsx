import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export default function HelpTooltip({ content, className = "" }: HelpTooltipProps) {
  return (
    <HelpCircle 
      className={`h-4 w-4 text-cosmic-400 hover:text-cosmic-200 transition-colors cursor-help ${className}`}
      data-testid="help-tooltip-trigger"
      title={content}
    />
  );
}