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
    console.log('PWA: Install button initializing...');
    
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInAppBrowser = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInAppBrowser) {
      console.log('PWA: App already installed');
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt event received');
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully');
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Force trigger a check
    setTimeout(() => {
      console.log('PWA: Current state - installPrompt:', !!installPrompt, 'isInstalled:', isInstalled);
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('PWA: Install button clicked');
    
    if (installPrompt) {
      console.log('PWA: Using native install prompt');
      try {
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        
        console.log('PWA: Install result:', result.outcome);
        
        if (result.outcome === 'accepted') {
          setIsInstalled(true);
        }
        
        setInstallPrompt(null);
      } catch (error) {
        console.error('PWA: Install failed:', error);
        alert('Install failed. Try using your browser menu instead.');
      }
    } else {
      console.log('PWA: No install prompt available, showing instructions');
      const userAgent = navigator.userAgent;
      const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isMobile = /Android|iPhone|iPad|iPod/.test(userAgent);
      
      let instructions = 'To install this app:\n\n';
      
      if (isSafari && /iPhone|iPad|iPod/.test(userAgent)) {
        instructions += '1. Tap the Share button (□↗)\n2. Select "Add to Home Screen"';
      } else if (isChrome && isMobile) {
        instructions += '1. Tap the menu (⋮)\n2. Select "Add to Home screen"';
      } else if (isChrome) {
        instructions += '1. Look for the install icon (⊕) in the address bar\n2. Or Menu → "Install PawsitiveCheck"';
      } else if (isFirefox) {
        instructions += '1. Menu → "Install"\n2. Or look for install icon in address bar';
      } else {
        instructions += 'Look for "Install" or "Add to Home Screen" in your browser menu';
      }
      
      alert(instructions);
    }
  };

  // Hide button if app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
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