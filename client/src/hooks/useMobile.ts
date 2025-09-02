import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor (mobile app)
    const isCapacitor = Capacitor.isNativePlatform();
    
    // Also check for mobile user agents as fallback
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    setIsMobile(isCapacitor || isMobileDevice);
  }, []);

  return { isMobile, isCapacitor: Capacitor.isNativePlatform() };
}