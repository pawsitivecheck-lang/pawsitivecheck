import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile detection using user agent
    const checkMobile = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }
      
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
        navigator.userAgent
      );
    };
    
    setIsMobile(checkMobile());
  }, []);

  return { isMobile };
}