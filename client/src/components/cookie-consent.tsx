import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { X, Cookie, Settings, Shield, BarChart3, Target } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isDNTEnabled, setIsDNTEnabled] = useState(false);

  useEffect(() => {
    // Check for DNT (Do Not Track) setting
    const checkDNT = () => {
      // Check server-injected DNT status
      const serverDNT = (window as any).__DNT_ENABLED__;
      // Check navigator DNT property
      const navigatorDNT = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
      // Check for other DNT indicators
      const msDNT = (navigator as any).msDoNotTrack === '1';
      
      return serverDNT || navigatorDNT || msDNT;
    };
    
    const isDNT = checkDNT();
    setIsDNTEnabled(isDNT);
    
    if (isDNT) {
      // For DNT users, automatically set minimal tracking preferences
      const dntPreferences: CookiePreferences = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      };
      
      // Save DNT preferences and don't show banner
      localStorage.setItem('cookie-consent', JSON.stringify(dntPreferences));
      localStorage.setItem('cookie-consent-dnt', 'true');
      localStorage.setItem('cookie-consent-timestamp', Date.now().toString());
      setPreferences(dntPreferences);
      applyCookiePreferences(dntPreferences);
      return;
    }
    
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consentGiven);
        setPreferences(savedPreferences);
      } catch {
        // If parsing fails, use defaults
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    savePreferences(defaultPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());
    
    // Mark if this was set due to DNT
    if (isDNTEnabled) {
      localStorage.setItem('cookie-consent-dnt', 'true');
    }
    
    setIsVisible(false);
    
    // Apply cookie preferences
    applyCookiePreferences(prefs);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Remove non-essential cookies if not consented
    if (!prefs.functional) {
      // Remove functional cookies
      const functionalCookies = ['user-preferences', 'ui-settings'];
      functionalCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
    
    if (!prefs.analytics) {
      // Remove analytics cookies
      const analyticsCookies = ['_ga', '_ga_*', '_gid', 'analytics-session'];
      analyticsCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
    
    if (!prefs.marketing) {
      // Remove marketing cookies
      const marketingCookies = ['marketing-id', 'ad-preferences', 'campaign-data'];
      marketingCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
  };

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'essential') return; // Can't disable essential cookies
    setPreferences(prev => ({ ...prev, [category]: value }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Simple Cookie Banner */}
      {!showDetails && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6" data-testid="cookie-banner">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">We value your privacy</h3>
                  <p className="text-sm text-gray-600">
                    We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
                    You can customize your preferences or accept all cookies.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="w-full sm:w-auto"
                  data-testid="button-cookie-preferences"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="w-full sm:w-auto"
                  data-testid="button-essential-only"
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  data-testid="button-accept-all"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Preferences Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-blue-600" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              <p className="mb-4">
                We use different types of cookies and similar technologies to provide you with the best experience on PawsitiveCheck. 
                You can choose which categories you'd like to allow. Essential cookies are required for the site to function properly and cannot be disabled. 
                Your choices are saved and can be updated anytime through your account settings or the privacy center.
              </p>
            </div>

            {/* Essential Cookies */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Essential Cookies</h4>
                  </div>
                  <Switch
                    checked={true}
                    disabled={true}
                    data-testid="switch-essential-cookies"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are necessary for the website to function and cannot be disabled. 
                  They enable core functionality like security, authentication, and basic site features.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Always active
                </div>
              </CardContent>
            </Card>

            {/* Functional Cookies */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-800">Functional Cookies</h4>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => updatePreference('functional', checked)}
                    data-testid="switch-functional-cookies"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  These cookies enable enhanced functionality like remembering your pet profiles across 38+ species, 
                  animal tag preferences, product filters, PWA settings for offline access, veterinary search preferences, and personalized dashboard layouts.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Used for: Pet profile preferences, animal tag settings, product filters, PWA functionality, vet finder preferences, dashboard customization
                </div>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Analytics Cookies</h4>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference('analytics', checked)}
                    data-testid="switch-analytics-cookies"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how users interact with barcode scanning, AI-powered product analysis, 
                  animal tagging features, veterinary finder services, and corporate accountability tracking by collecting anonymized usage data and performance metrics for algorithmic improvements.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Used for: Scan accuracy tracking, AI model performance, cosmic score analytics, animal tag usage, PWA performance, vet finder optimization, bias detection
                </div>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-800">Marketing Cookies</h4>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference('marketing', checked)}
                    data-testid="switch-marketing-cookies"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  These cookies enable personalized, ethical pet product advertisements based on your animal species, 
                  safety preferences, and browsing behavior. This helps support our free pet safety analysis platform while ensuring relevant, responsible advertising that prioritizes pet welfare.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Used for: Ethical pet-specific ad targeting, Google AdSense optimization, revenue to support free platform, responsible advertising standards
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy Link */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">
                For more information about how we handle your data, AI ethics, and your privacy rights under GDPR, CCPA, and other regulations, please read our{" "}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> and{" "}
                <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1"
                data-testid="button-accept-essential-detailed"
              >
                Accept Essential Only
              </Button>
              <Button
                variant="outline"
                onClick={handleSavePreferences}
                className="flex-1"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-accept-all-detailed"
              >
                Accept All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}