import AdSenseAd from "./adsense-ad";

export function SidebarAd() {
  return (
    <div className="mb-6 p-4 border border-cosmic-600 rounded-lg bg-cosmic-800/30" data-testid="sidebar-ad">
      <p className="text-xs text-cosmic-400 mb-2 text-center">Advertisement</p>
      <AdSenseAd
        adSlot="1234567890"
        style={{ display: "block", width: "300px", height: "250px" }}
        className="mx-auto"
        responsive={false}
      />
    </div>
  );
}

export function BannerAd() {
  return (
    <div className="my-6 p-4 border border-cosmic-600 rounded-lg bg-cosmic-800/30" data-testid="banner-ad">
      <p className="text-xs text-cosmic-400 mb-2 text-center">Advertisement</p>
      <AdSenseAd
        adSlot="0987654321"
        style={{ display: "block", width: "100%", height: "90px" }}
        responsive={true}
      />
    </div>
  );
}

export function SquareAd() {
  return (
    <div className="mb-6 p-4 border border-cosmic-600 rounded-lg bg-cosmic-800/30" data-testid="square-ad">
      <p className="text-xs text-cosmic-400 mb-2 text-center">Advertisement</p>
      <AdSenseAd
        adSlot="1122334455"
        style={{ display: "block", width: "300px", height: "300px" }}
        className="mx-auto"
        responsive={false}
      />
    </div>
  );
}

export function InArticleAd() {
  return (
    <div className="my-8 p-4 border border-cosmic-600 rounded-lg bg-cosmic-800/30" data-testid="in-article-ad">
      <p className="text-xs text-cosmic-400 mb-2 text-center">Advertisement</p>
      <AdSenseAd
        adSlot="6677889900"
        adFormat="fluid"
        adLayout="in-article"
        style={{ display: "block", textAlign: "center" }}
      />
    </div>
  );
}