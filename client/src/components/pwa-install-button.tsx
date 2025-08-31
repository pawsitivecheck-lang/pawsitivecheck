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
    isSamsung: false,
    isOpera: false,
    isMobile: false,
    isAndroid: false,
    isIOS: false
  });

  useEffect(() => {
    // Detect browser and platform
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/SamsungBrowser/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent) && !/SamsungBrowser/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isEdge = /Edg/i.test(userAgent);
    const isSamsung = /SamsungBrowser/i.test(userAgent);
    const isOpera = /OPR|Opera/i.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    
    setBrowserInfo({ isChrome, isSafari, isFirefox, isEdge, isSamsung, isOpera, isMobile, isAndroid, isIOS });

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

    // Additional event listener for Samsung Internet and other browsers
    const handleAppBannerPrompt = (e: Event) => {
      console.log('PWA: app banner prompt detected');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Standard PWA install events
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Additional events for broader browser support
    window.addEventListener('beforeinstallprompt', handleAppBannerPrompt);
    
    // Force check for install capability after a delay
    setTimeout(() => {
      if (!deferredPrompt && (browserInfo.isChrome || browserInfo.isEdge || browserInfo.isSamsung)) {
        console.log('PWA: Manual check for install capability');
        // Some browsers don't fire the event immediately
        setShowInstallButton(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleAppBannerPrompt);
    };
  }, []);

  const getInstallInstructions = () => {
    if (browserInfo.isSafari) {
      if (browserInfo.isMobile) {
        return `To install PawsitiveCheck on Safari:
        
1. Tap the Share button (${String.fromCharCode(8593)}) at the bottom of your screen
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm
        
The app will appear on your home screen with a custom icon!`;
      } else {
        return `To install PawsitiveCheck on Safari:
        
1. Look for the app install icon in the address bar
2. Or go to the Safari menu and select "Add to Dock"
3. The app will be available in your dock and applications
        
Note: PWA support varies in Safari desktop.`;
      }
    } else if (browserInfo.isSamsung) {
      return `To install PawsitiveCheck on Samsung Internet:
      
1. Tap the menu button (three lines) at the bottom
2. Select "Add page to" → "Home screen"
3. Customize the name and tap "Add"
      
Or:
1. Look for the install icon in the address bar
2. Tap it and follow the prompts
        
The app will appear on your home screen!`;
    } else if (browserInfo.isChrome || browserInfo.isEdge) {
      if (browserInfo.isMobile) {
        return `To install PawsitiveCheck:
        
1. Tap the menu button (three dots) in the browser
2. Select "Add to Home screen" or "Install app"
3. Confirm the installation
        
Or look for the install icon (+) in the address bar and tap it.
        
The app will appear on your home screen!`;
      } else {
        return `To install PawsitiveCheck:
        
1. Look for the install icon (+) in the address bar
2. Click it and select "Install"
3. Or click the three dots menu and select "Install PawsitiveCheck"
        
The app will open in its own window and appear in your applications!`;
      }
    } else if (browserInfo.isOpera) {
      return `To install PawsitiveCheck on Opera:
      
1. Look for the install icon in the address bar
2. Or open the Opera menu and look for "Install"
3. Follow the prompts to add to applications
        
Opera has good PWA support for most features.`;
    } else if (browserInfo.isFirefox) {
      if (browserInfo.isMobile) {
        return `To install PawsitiveCheck on Firefox Mobile:
        
1. Tap the menu button (three dots)
2. Select "Add to Home screen"
3. Confirm the installation
        
Note: PWA features may be limited in Firefox.`;
      } else {
        return `To install PawsitiveCheck on Firefox:
        
1. Look for the install icon in the address bar
2. Or open the Firefox menu and look for "Install"
3. Follow the prompts to add to applications
        
Note: PWA support may vary in Firefox desktop.`;
      }
    } else {
      return `To install PawsitiveCheck:
      
• Chrome/Edge: Look for + icon in address bar or menu → "Install"
• Samsung Internet: Menu → "Add page to" → "Home screen"
• Safari Mobile: Share menu → "Add to Home Screen"
• Opera: Install icon in address bar
• Firefox: Menu → "Add to Home screen" (mobile)
        
For best PWA experience, we recommend Chrome, Edge, or Samsung Internet.`;
    }
  };

  const handleInstallClick = async () => {
    // Try native install first
    if (deferredPrompt) {
      try {
        console.log('PWA: Triggering native install prompt');
        // Show the install prompt
        await deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA: User accepted the install prompt');
          setIsInstalled(true);
        } else {
          console.log('PWA: User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        setDeferredPrompt(null);
        return;
      } catch (error) {
        console.error('PWA: Error during installation:', error);
        // Continue to fallback instructions
      }
    }

    // Check if we can trigger install through other methods
    if (browserInfo.isSamsung || browserInfo.isChrome || browserInfo.isEdge) {
      // Try to trigger browser-specific install
      try {
        // For browsers that support it, we can try to programmatically trigger install
        const event = new Event('beforeinstallprompt');
        if (window.dispatchEvent && window.dispatchEvent(event)) {
          console.log('PWA: Attempted to trigger install event');
          return;
        }
      } catch (error) {
        console.log('PWA: Could not trigger programmatic install');
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
    if (browserInfo.isSafari && browserInfo.isMobile) return Share;
    if (browserInfo.isSamsung) return Download;
    if (browserInfo.isChrome || browserInfo.isEdge || browserInfo.isOpera) return Plus;
    return Smartphone;
  };

  const Icon = getIcon();
  const getButtonText = () => {
    if (deferredPrompt) return 'Install App';
    if (browserInfo.isSamsung) return 'Add to Home';
    if (browserInfo.isSafari && browserInfo.isMobile) return 'Add to Home';
    return 'Install App';
  };
  
  const buttonText = getButtonText();

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