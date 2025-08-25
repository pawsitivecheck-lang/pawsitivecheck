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
  const [adContent, setAdContent] = useState<any>(null);

  useEffect(() => {
    // Always show demo ads for now
    loadAd();
  }, []);

  const loadAd = () => {
    // Placeholder for actual ad network integration (Google AdSense, etc.)
    // For now, showing demo ad content
    const demoAds = {
      banner: {
        width: "728px",
        height: "90px",
        content: "Pet Insurance - Protect Your Furry Friend"
      },
      leaderboard: {
        width: "728px", 
        height: "90px",
        content: "Premium Pet Food - 20% Off First Order"
      },
      square: {
        width: "300px",
        height: "250px", 
        content: "Veterinary Services Near You"
      },
      sidebar: {
        width: "160px",
        height: "600px",
        content: "Pet Safety Products"
      }
    };

    setAdContent(demoAds[size]);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !adContent) return null;

  const sizeClasses = {
    banner: "w-full max-w-[728px] h-[90px]",
    leaderboard: "w-full max-w-[728px] h-[90px]", 
    square: "w-[300px] h-[250px]",
    sidebar: "w-[160px] h-[600px]"
  };

  return (
    <div className={`relative ${className}`} data-testid={`ad-${size}-${position}`}>
      <Card className={`${sizeClasses[size]} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-border flex items-center justify-center relative overflow-hidden`}>
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-foreground bg-card/80 rounded-full z-10"
          data-testid="button-close-ad"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="text-center p-4">
          <div className="text-xs text-muted-foreground mb-1">Sponsored</div>
          <div className="text-sm font-medium text-foreground">{adContent.content}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 cursor-pointer hover:underline">
            Learn More →
          </div>
        </div>
      </Card>
    </div>
  );
}