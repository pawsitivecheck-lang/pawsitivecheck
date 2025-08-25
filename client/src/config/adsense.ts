// Google AdSense Configuration
// Replace with your actual AdSense publisher ID and ad slot IDs

export const ADSENSE_CONFIG = {
  // Your actual AdSense publisher ID  
  publisherId: "ca-pub-2513342355355066",
  
  // Replace these with your actual ad slot IDs from AdSense dashboard
  adSlots: {
    // Header/leaderboard ads (728x90)
    homeHeader: "1234567890",
    databaseHeader: "0987654321",
    recallsHeader: "1122334455",
    
    // Sidebar ads (300x250 or 160x600)
    homeSidebar: "6677889900",
    databaseSidebar: "5544332211",
    
    // In-content ads (responsive)
    productList: "9988776655",
    recallList: "4433221100",
    
    // Banner ads (728x90)
    footer: "7766554433"
  },
  
  // Ad settings
  settings: {
    enableAutoAds: true,
    enableResponsive: true,
    enableLazyLoading: true
  }
};

// Helper function to get ad slot by position
export function getAdSlot(position: string): string {
  return ADSENSE_CONFIG.adSlots[position as keyof typeof ADSENSE_CONFIG.adSlots] || "1234567890";
}