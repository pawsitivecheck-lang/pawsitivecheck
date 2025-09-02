import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile detection using user agent
    const checkMobile = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }
      
      const userAgent = navigator.userAgent;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
      
      // Debug logging
      console.log('Mobile Detection Debug:', {
        userAgent,
        isMobileUA,
        screenWidth: window.innerWidth,
        isTouchDevice: 'ontouchstart' in window
      });
      
      return isMobileUA;
    };
    
    setIsMobile(checkMobile());
  }, []);

  return { isMobile };
}