// Complete override to prevent any Radix UI tooltip imports
import React from "react";

// Simple tooltip implementation that completely replaces Radix UI
export function SimpleTooltip({ 
  children, 
  content, 
  side = "top"
}: { 
  children: React.ReactNode, 
  content: string, 
  side?: string 
}) {
  const [show, setShow] = React.useState(false);
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '5px',
          padding: '5px 8px',
          backgroundColor: '#333',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000
        }}>
          {content}
        </div>
      )}
    </div>
  );
}

// Override all possible Radix UI tooltip exports to prevent loading
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;  
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Make sure this is the default export too
export default SimpleTooltip;