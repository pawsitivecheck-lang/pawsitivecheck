import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Force check if PWA is installable
    setTimeout(() => {
      console.log('PWA: Checking if app is installable...');
      if (!deferredPrompt) {
        // Trigger a custom event to force check installability
        try {
          const event = new Event('beforeinstallprompt');
          window.dispatchEvent(event);
        } catch (e) {
          console.log('PWA: Could not trigger install check');
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('PWA: Install button clicked');
    
    // Try native install first
    if (deferredPrompt) {
      console.log('PWA: Using native install prompt');
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA: Install accepted');
          alert('App installed successfully!');
        } else {
          console.log('PWA: Install dismissed');
        }
        setDeferredPrompt(null);
        return;
      } catch (error) {
        console.error('PWA: Install error:', error);
      }
    }

    // Try to force the browser's install interface
    console.log('PWA: Attempting to trigger browser install interface');
    
    // For Chrome/Edge - try to access the install interface
    if ('serviceWorker' in navigator && 'getInstalledRelatedApps' in navigator) {
      try {
        // @ts-ignore
        const relatedApps = await navigator.getInstalledRelatedApps();
        console.log('Related apps:', relatedApps);
        if (relatedApps.length === 0) {
          // App is not installed, try to show install UI
          console.log('App not installed, should show install option');
        }
      } catch (e) {
        console.log('Could not check installed apps');
      }
    }

    // Show install instructions as last resort
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod/.test(userAgent);

    let message = 'Install this app for a better experience!\n\n';
    
    if (isChrome || isEdge) {
      message += isMobile 
        ? '1. Tap the menu (⋮) button\n2. Select "Add to Home screen" or "Install app"'
        : '1. Look for the install icon (⊕) in the address bar\n2. Or go to Menu → "Install PawsitiveCheck"';
    } else if (isSafari) {
      message += isMobile
        ? '1. Tap the Share button (□↗)\n2. Select "Add to Home Screen"'
        : '1. Go to File menu → "Add to Dock"\n2. Or look for install icon in address bar';
    } else if (isFirefox) {
      message += '1. Look for install icon in address bar\n2. Or go to Menu → "Install"';
    } else {
      message += 'Look for an "Install" or "Add to Home Screen" option in your browser menu.';
    }

    alert(message);
  };

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20 transition-all cursor-pointer active:scale-95"
      data-testid="pwa-install-button"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}