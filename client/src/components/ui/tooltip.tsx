// Simple fallback tooltip component without hooks
import React from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content?: string;
}

export const Tooltip = ({ children, content }: TooltipProps) => (
  <div title={content} style={{ display: 'inline-block' }}>
    {children}
  </div>
);

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SimpleTooltip = Tooltip;