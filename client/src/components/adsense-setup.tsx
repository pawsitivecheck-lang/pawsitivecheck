// Google AdSense Integration Guide
// Replace the demo ads in ad-banner.tsx with actual AdSense code

import { useEffect } from "react";

interface AdSenseAdProps {
  adClient: string; // Your AdSense client ID (e.g., "ca-pub-1234567890123456")
  adSlot: string;   // Your ad unit slot ID
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdSenseAd({ 
  adClient, 
  adSlot, 
  adFormat = "auto", 
  fullWidthResponsive = true,
  className = ""
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!(window as any).adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      // Push the ad
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Instructions for implementing real AdSense:
// 1. Sign up for Google AdSense at https://www.google.com/adsense/
// 2. Get approved for your website
// 3. Create ad units in your AdSense dashboard
// 4. Replace the demo AdBanner components with AdSenseAd components
// 5. Use your actual client ID and ad slot IDs

// Example usage:
// <AdSenseAd 
//   adClient="ca-pub-YOUR-CLIENT-ID"
//   adSlot="YOUR-AD-SLOT-ID" 
//   className="my-4"
// />

// For other ad networks (alternatives to AdSense):
// - Media.net
// - PropellerAds  
// - Ezoic
// - AdThrive
// - Mediavine