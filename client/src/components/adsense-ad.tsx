import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function AdSenseAd({
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
  responsive = true
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // Push the ad to Google AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} data-testid="adsense-ad">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
}