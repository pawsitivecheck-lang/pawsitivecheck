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
    // Check if user has consented to marketing cookies
    const consent = localStorage.getItem('cookie-consent');
    let canShowAds = false;
    
    if (consent) {
      try {
        const preferences = JSON.parse(consent);
        canShowAds = preferences.marketing || preferences.accepted;
      } catch {
        canShowAds = false;
      }
    } else {
      // Show placeholder ads for demo purposes when no consent decision made yet
      canShowAds = true;
    }

    if (canShowAds) {
      // Simulate ad loading (replace with actual ad network integration)
      loadAd();
    }
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
      <Card className={`${sizeClasses[size]} bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 flex items-center justify-center relative overflow-hidden`}>
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full z-10"
          data-testid="button-close-ad"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="text-center p-4">
          <div className="text-xs text-gray-500 mb-1">Sponsored</div>
          <div className="text-sm font-medium text-gray-800">{adContent.content}</div>
          <div className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">
            Learn More →
          </div>
        </div>
      </Card>
    </div>
  );
}