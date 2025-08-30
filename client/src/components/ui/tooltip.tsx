// Simple tooltip implementation without any external dependencies
import React from 'react';

// No-op components for compatibility
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Main tooltip component using native browser title attribute
export const Tooltip = ({ children, content }: { children: React.ReactNode; content?: string }) => (
  <div title={content} style={{ display: 'inline-block' }}>
    {children}
  </div>
);

// Backwards compatibility exports
export interface TooltipProps {
  children: React.ReactNode;
  content?: string;
}

export const SimpleTooltip = ({ children, content }: { children: React.ReactNode; content: string; side?: string }) => (
  <div title={content} style={{ display: 'inline-block' }}>
    {children}
  </div>
);