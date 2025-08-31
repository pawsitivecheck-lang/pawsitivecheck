import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Plus, Share, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(true); // Always show button initially
  const [isInstalled, setIsInstalled] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({ 
    isChrome: false, 
    isSafari: false, 
    isFirefox: false, 
    isEdge: false,
    isMobile: false
  });

  useEffect(() => {
    // Detect browser and platform
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/i.test(userAgent) && !/Edg/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isEdge = /Edg/i.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    setBrowserInfo({ isChrome, isSafari, isFirefox, isEdge, isMobile });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window as any).navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const getInstallInstructions = () => {
    const currentUrl = window.location.href;
    
    if (browserInfo.isSafari) {
      if (browserInfo.isMobile) {
        return `To install PawsitiveCheck:
        
1. Tap the Share button (${String.fromCharCode(8593)}) at the bottom of your screen
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm
        
The app will appear on your home screen!`;
      } else {
        return `To install PawsitiveCheck on Safari:
        
1. Look for the app install icon in the address bar
2. Or go to the Safari menu and select "Add to Dock"
3. The app will be available in your dock and applications
        
Note: PWA support varies in Safari desktop.`;
      }
    } else if (browserInfo.isChrome || browserInfo.isEdge) {
      return `To install PawsitiveCheck:
      
1. Look for the install icon (+) in the address bar
2. Click it and select "Install"
3. Or click the three dots menu and select "Install PawsitiveCheck"
        
The app will open in its own window and appear in your applications!`;
    } else if (browserInfo.isFirefox) {
      return `To install PawsitiveCheck on Firefox:
      
1. Look for the install icon in the address bar
2. Or open the Firefox menu and look for "Install"
3. Follow the prompts to add to applications
        
Note: PWA support may vary in Firefox.`;
    } else {
      return `To install PawsitiveCheck:
      
• Chrome/Edge: Look for the + icon in address bar
• Safari Mobile: Share menu → "Add to Home Screen"  
• Firefox: Look for install option in menu
        
Having trouble? Try refreshing the page or using Chrome/Edge for best PWA support.`;
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        console.log('PWA: Triggering install prompt');
        // Show the install prompt
        await deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA: User accepted the install prompt');
        } else {
          console.log('PWA: User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
        return;
      } catch (error) {
        console.error('PWA: Error during installation:', error);
      }
    }

    // Fallback: Show detailed instructions based on browser
    const instructions = getInstallInstructions();
    alert(instructions);
  };

  // Don't show button if already installed
  if (isInstalled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-2 text-green-600 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-900/20"
        data-testid="pwa-installed"
      >
        <Smartphone className="h-4 w-4" />
        App Installed ✓
      </Button>
    );
  }

  // Choose appropriate icon based on browser and prompt availability
  const getIcon = () => {
    if (deferredPrompt) return Download;
    if (browserInfo.isSafari) return Share;
    if (browserInfo.isChrome || browserInfo.isEdge) return Plus;
    return Smartphone;
  };

  const Icon = getIcon();
  const buttonText = deferredPrompt ? 'Install App' : 'Install App';

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20 transition-all cursor-pointer active:scale-95"
      data-testid="pwa-install-button"
    >
      <Icon className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}