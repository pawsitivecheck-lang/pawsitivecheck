import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Safely check if running in Capacitor (mobile app)
    let capacitorPlatform = false;
    try {
      // Dynamic import to avoid loading Capacitor in web environment
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const Capacitor = (window as any).Capacitor;
        capacitorPlatform = Capacitor.isNativePlatform();
      }
    } catch (error) {
      // Capacitor not available, continue with web detection
      capacitorPlatform = false;
    }
    
    // Also check for mobile user agents as fallback
    const isMobileDevice = typeof navigator !== 'undefined' && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    
    setIsCapacitor(capacitorPlatform);
    setIsMobile(capacitorPlatform || isMobileDevice);
  }, []);

  return { isMobile, isCapacitor };
}