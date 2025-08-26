// Browser compatibility utilities for PawsitiveCheck
import "./polyfills"; // Load polyfills first

/**
 * Cross-browser localStorage with fallback
 */
export const storage = {
  get: (key: string): string | null => {
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        return localStorage.getItem(key);
      }
      // Fallback to cookies for very old browsers
      const name = key + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    } catch (e) {
      console.warn('Storage access failed:', e);
      return null;
    }
  },

  set: (key: string, value: string): boolean => {
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
      // Fallback to cookies
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/`;
      return true;
    } catch (e) {
      console.warn('Storage write failed:', e);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.removeItem(key);
        return true;
      }
      // Fallback: expire the cookie
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      return true;
    } catch (e) {
      console.warn('Storage removal failed:', e);
      return false;
    }
  }
};

/**
 * Cross-browser Do Not Track detection
 */
export const detectDNT = (): boolean => {
  try {
    // Check server-injected DNT status
    const serverDNT = (window as any).__DNT_ENABLED__;
    
    // Cross-browser DNT detection with fallbacks
    let navigatorDNT = false;
    
    // Modern browsers (Chrome, Firefox, Safari, Edge)
    if (typeof navigator !== 'undefined' && navigator.doNotTrack) {
      navigatorDNT = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
    }
    
    // Legacy IE/Edge support
    let msDNT = false;
    if (typeof navigator !== 'undefined' && (navigator as any).msDoNotTrack) {
      msDNT = (navigator as any).msDoNotTrack === '1';
    }
    
    // Safari-specific check
    let safariDNT = false;
    if (typeof window !== 'undefined' && (window as any).doNotTrack) {
      safariDNT = (window as any).doNotTrack === '1';
    }
    
    // Firefox legacy check
    let mozillaDNT = false;
    if (typeof navigator !== 'undefined' && (navigator as any).mozDoNotTrack) {
      mozillaDNT = (navigator as any).mozDoNotTrack === '1';
    }
    
    return serverDNT || navigatorDNT || msDNT || safariDNT || mozillaDNT;
  } catch (e) {
    console.warn('DNT detection failed:', e);
    return false;
  }
};

/**
 * Feature detection for modern APIs
 */
export const features = {
  // Check if CSS custom properties are supported
  cssCustomProperties: (() => {
    try {
      return window.CSS && CSS.supports && CSS.supports('color', 'var(--test)');
    } catch {
      return false;
    }
  })(),

  // Check if CSS Grid is supported
  cssGrid: (() => {
    try {
      return CSS.supports && CSS.supports('display', 'grid');
    } catch {
      return false;
    }
  })(),

  // Check if Flexbox is supported
  flexbox: (() => {
    try {
      return CSS.supports && (
        CSS.supports('display', 'flex') || 
        CSS.supports('display', '-webkit-flex') ||
        CSS.supports('display', '-ms-flexbox')
      );
    } catch {
      return false;
    }
  })(),

  // Check if localStorage is available
  localStorage: (() => {
    try {
      return typeof Storage !== 'undefined' && localStorage;
    } catch {
      return false;
    }
  })(),

  // Check if Service Worker is supported (for PWA)
  serviceWorker: (() => {
    try {
      return 'serviceWorker' in navigator;
    } catch {
      return false;
    }
  })(),

  // Check if WebRTC is supported (for camera scanning)
  webRTC: (() => {
    try {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    } catch {
      return false;
    }
  })(),

  // Check if IntersectionObserver is supported
  intersectionObserver: (() => {
    try {
      return 'IntersectionObserver' in window;
    } catch {
      return false;
    }
  })()
};

/**
 * Get browser information for compatibility handling
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  return {
    isIE: /MSIE|Trident/.test(userAgent),
    isEdge: /Edge/.test(userAgent),
    isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isOpera: /Opera|OPR/.test(userAgent),
    isMobile: /Mobi|Android/i.test(userAgent),
    isIOS: /iPad|iPhone|iPod/.test(userAgent)
  };
};

/**
 * Apply browser-specific fixes
 */
export const applyBrowserFixes = () => {
  const browser = getBrowserInfo();
  
  // IE-specific fixes
  if (browser.isIE) {
    // Add IE class to body for CSS targeting
    document.body.classList.add('ie-browser');
    
    // Polyfill for Array.includes if not available
    if (!Array.prototype.includes) {
      Array.prototype.includes = function(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) !== -1;
      };
    }
  }
  
  // Safari-specific fixes
  if (browser.isSafari) {
    document.body.classList.add('safari-browser');
  }
  
  // Mobile-specific fixes
  if (browser.isMobile) {
    document.body.classList.add('mobile-browser');
    // Prevent zoom on input focus in iOS
    if (browser.isIOS) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    }
  }
  
  // Add feature classes to body
  if (features.cssGrid) document.body.classList.add('css-grid');
  if (features.flexbox) document.body.classList.add('flexbox');
  if (features.cssCustomProperties) document.body.classList.add('css-custom-properties');
  if (features.serviceWorker) document.body.classList.add('service-worker');
  if (features.webRTC) document.body.classList.add('webrtc');
};

// Auto-run browser fixes when module loads
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBrowserFixes);
  } else {
    applyBrowserFixes();
  }
}