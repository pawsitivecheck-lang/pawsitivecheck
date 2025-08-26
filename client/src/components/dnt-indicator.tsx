import { useState, useEffect } from "react";
import { Shield, Info } from "lucide-react";
import { detectDNT } from "@/utils/browser-compat";

export default function DNTIndicator() {
  const [isDNTEnabled, setIsDNTEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Use cross-browser DNT detection utility
    setIsDNTEnabled(detectDNT());
  }, []);

  if (!isDNTEnabled) return null;

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-sm cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        data-testid="dnt-indicator"
      >
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-green-700 dark:text-green-300 font-medium">
          Do Not Track Enabled
        </span>
        <Info className="h-3 w-3 text-green-600 dark:text-green-400" />
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 p-3">
          <div className="text-center">
            <p className="font-medium mb-1">Privacy Protected</p>
            <p>We've detected your "Do Not Track" setting and automatically disabled all non-essential tracking and analytics.</p>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}