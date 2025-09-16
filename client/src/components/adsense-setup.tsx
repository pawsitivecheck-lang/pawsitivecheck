// Google AdSense Integration Guide
// Replace the demo ads in ad-banner.tsx with actual AdSense code

import { useEffect, useRef, useState } from "react";

interface AdSenseAdProps {
  adClient: string; // Your AdSense client ID (e.g., "ca-pub-1234567890123456")
  adSlot: string;   // Your ad unit slot ID
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  fallbackContent?: React.ReactNode;
}

let scriptLoadingPromise: Promise<void> | null = null;
let scriptLoaded = false;

function loadAdSenseScript(): Promise<void> {
  if (scriptLoaded) {
    return Promise.resolve();
  }
  
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (existingScript) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      console.warn('AdSense script failed to load - ad blocker or CSP may be blocking it');
      scriptLoadingPromise = null;
      reject(new Error('AdSense script failed to load'));
    };
    
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export default function AdSenseAd({ 
  adClient, 
  adSlot, 
  adFormat = "auto", 
  fullWidthResponsive = true,
  className = "",
  fallbackContent
}: AdSenseAdProps) {
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAd = async () => {
      try {
        await loadAdSenseScript();
        
        if (!isMounted) return;

        // Initialize adsbygoogle array if not exists
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        
        // Push the ad
        ((window as any).adsbygoogle).push({});
        setAdLoaded(true);
      } catch (error) {
        console.warn('AdSense initialization failed:', error);
        if (isMounted) {
          setAdError(true);
        }
      }
    };

    initializeAd();

    return () => {
      isMounted = false;
    };
  }, [adClient, adSlot]);

  if (adError && fallbackContent) {
    return <div className={className}>{fallbackContent}</div>;
  }

  return (
    <div className={className} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
      {adError && !fallbackContent && (
        <div className="text-sm text-gray-500 text-center p-4">
          Advertisement space
        </div>
      )}
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