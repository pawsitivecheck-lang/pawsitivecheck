import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface AdBannerProps {
  size: "banner" | "square" | "leaderboard" | "sidebar";
  position?: string;
  className?: string;
}

export default function AdBanner({ size, position = "", className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      // Initialize AdSense ads
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const adSlots = {
    banner: "1234567890",
    leaderboard: "0987654321", 
    square: "1122334455",
    sidebar: "6677889900"
  };

  const sizeClasses = {
    banner: "w-full max-w-[728px] h-[90px]",
    leaderboard: "w-full max-w-[728px] h-[90px]", 
    square: "w-[300px] h-[250px]",
    sidebar: "w-[160px] h-[600px]"
  };

  const adStyles = {
    banner: { display: "block", width: "728px", height: "90px" },
    leaderboard: { display: "block", width: "728px", height: "90px" },
    square: { display: "block", width: "300px", height: "250px" },
    sidebar: { display: "block", width: "160px", height: "600px" }
  };

  return (
    <div className={`relative ${className}`} data-testid={`ad-${size}-${position}`}>
      <Card className={`${sizeClasses[size]} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-border flex items-center justify-center relative overflow-hidden p-2`}>
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-foreground bg-card/80 rounded-full z-10"
          data-testid="button-close-ad"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="text-center w-full">
          <div className="text-xs text-muted-foreground mb-1">Advertisement</div>
          
          {/* Google AdSense Ad */}
          <ins
            className="adsbygoogle"
            style={adStyles[size]}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
            data-ad-slot={adSlots[size]}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </Card>
    </div>
  );
}