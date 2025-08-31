import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt (Chrome, Edge, Samsung, Opera)
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful install
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    return {
      isChrome: /Chrome/.test(userAgent) && !/Edg|OPR|SamsungBrowser/.test(userAgent),
      isEdge: /Edg/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isOpera: /OPR|Opera/.test(userAgent),
      isSamsung: /SamsungBrowser/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isIOS: /iPhone|iPad|iPod/.test(userAgent),
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(userAgent)
    };
  };

  const handleClick = async () => {
    const browser = getBrowserInfo();

    // Try native install prompt first (Chrome, Edge, Samsung, Opera)
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        if (result.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setInstallPrompt(null);
        return;
      } catch (error) {
        console.error('Native install failed:', error);
        // Fall through to manual instructions
      }
    }

    // Browser-specific manual instructions
    let title = 'Install PawsitiveCheck';
    let instructions = '';

    if (browser.isIOS) {
      if (browser.isSafari) {
        instructions = 'Safari:\n1. Tap the Share button (□↗) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install';
      } else {
        instructions = 'To install in Safari:\n1. Open this page in Safari\n2. Tap Share → "Add to Home Screen"';
      }
    } else if (browser.isAndroid) {
      if (browser.isChrome) {
        instructions = 'Chrome:\n1. Tap the menu (⋮) in the top-right\n2. Select "Add to Home screen"\n3. Tap "Add" to install';
      } else if (browser.isSamsung) {
        instructions = 'Samsung Internet:\n1. Tap the menu (≡) button\n2. Select "Add page to"\n3. Choose "Home screen"';
      } else if (browser.isFirefox) {
        instructions = 'Firefox:\n1. Tap the menu (⋮)\n2. Select "Install"\n3. Tap "Add to Home screen"';
      } else {
        instructions = 'Android:\n1. Look for "Add to Home screen" in your browser menu\n2. Or try opening in Chrome for better support';
      }
    } else {
      // Desktop browsers
      if (browser.isChrome) {
        instructions = 'Chrome:\n1. Look for the install icon (⊕) in the address bar\n2. Or go to Menu → "Install PawsitiveCheck"\n3. Click "Install"';
      } else if (browser.isEdge) {
        instructions = 'Edge:\n1. Look for the install icon (⊕) in the address bar\n2. Or go to Menu (⋯) → "Apps" → "Install this site as an app"\n3. Click "Install"';
      } else if (browser.isFirefox) {
        instructions = 'Firefox:\n1. Look for the install icon in the address bar\n2. Or go to Menu → "Install this site as an app"\n3. Click "Install"';
      } else if (browser.isSafari) {
        instructions = 'Safari:\n1. Go to File menu → "Add to Dock"\n2. Or look for install option in address bar';
      } else if (browser.isOpera) {
        instructions = 'Opera:\n1. Look for the install icon in the address bar\n2. Or go to Menu → "Install PawsitiveCheck"\n3. Click "Install"';
      } else {
        instructions = 'Desktop:\n1. Look for an install icon (⊕) in your browser address bar\n2. Or check your browser menu for "Install" or "Add to Apps"\n3. This works best in Chrome, Edge, or Firefox';
      }
    }

    alert(`${title}\n\n${instructions}`);
  };

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20"
      data-testid="pwa-install-button"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}