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
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
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

  const handleClick = async () => {
    if (installPrompt) {
      // Use native install prompt
      try {
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        if (result.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setInstallPrompt(null);
      } catch (error) {
        console.error('Install failed:', error);
      }
    } else {
      // Show manual instructions
      const userAgent = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod/.test(userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(userAgent);
      const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
      
      let message = 'To install this app:\n\n';
      
      if (isIOS) {
        message += '1. Tap the Share button (□↗)\n2. Select "Add to Home Screen"';
      } else if (isChrome && isMobile) {
        message += '1. Tap the menu (⋮)\n2. Select "Add to Home screen"';
      } else if (isChrome) {
        message += '1. Look for the install icon (⊕) in the address bar\n2. Or use Menu → "Install PawsitiveCheck"';
      } else {
        message += 'Look for "Install" or "Add to Home Screen" in your browser menu';
      }
      
      alert(message);
    }
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