// Simple fallback tooltip component without hooks
import React from 'react';

export const Tooltip = ({ children, content }: { children: React.ReactNode; content?: string }) => (
  <div title={content} style={{ display: 'inline-block' }}>
    {children}
  </div>
);

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Legacy simple tooltip for backwards compatibility
export interface TooltipProps {
  children: React.ReactNode;
  content?: string;
}

export const SimpleTooltip = ({ children, content, side }: { children: React.ReactNode; content: string; side?: string }) => (
  <div title={content} style={{ display: 'inline-block' }}>
    {children}
  </div>
);