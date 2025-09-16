import { useEffect, useRef, useState } from "react";
import { ADSENSE_CONFIG } from "@/config/adsense";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  fallbackContent?: React.ReactNode;
}

export default function AdSenseAd({
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
  responsive = true,
  fallbackContent
}: AdSenseAdProps) {
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAd = () => {
      try {
        // Prevent double initialization
        if (hasInitialized.current) return;
        
        // Check if AdSense is available
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          hasInitialized.current = true;
          ((window as any).adsbygoogle).push({});
          if (isMounted) {
            setAdLoaded(true);
          }
        } else {
          // AdSense script not loaded - wait a bit and retry
          setTimeout(() => {
            if (isMounted && !hasInitialized.current) {
              if ((window as any).adsbygoogle) {
                hasInitialized.current = true;
                ((window as any).adsbygoogle).push({});
                setAdLoaded(true);
              } else {
                console.warn('AdSense script not loaded - ad may not display');
                setAdError(true);
              }
            }
          }, 1000);
        }
      } catch (err) {
        console.warn("AdSense initialization error:", err);
        if (isMounted) {
          setAdError(true);
        }
      }
    };

    initializeAd();

    return () => {
      isMounted = false;
    };
  }, [adSlot]);

  if (adError && fallbackContent) {
    return <div className={`adsense-container ${className}`}>{fallbackContent}</div>;
  }

  return (
    <div className={`adsense-container ${className}`} data-testid="adsense-ad" ref={adRef}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
      {adError && !fallbackContent && (
        <div className="text-sm text-gray-500 text-center p-4 border border-gray-200 rounded">
          <div className="text-gray-400">Advertisement</div>
          <div className="text-xs mt-1">Content unavailable</div>
        </div>
      )}
    </div>
  );
}