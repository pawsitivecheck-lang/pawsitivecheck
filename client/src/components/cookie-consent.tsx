import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, Shield, Eye, BarChart, Sparkles, X } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieContextType {
  openPreferences: () => void;
}

const CookieContext = createContext<CookieContextType | null>(null);

export const useCookiePreferences = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookiePreferences must be used within a CookieProvider');
  }
  return context;
};

export const CookieProvider = ({ children }: { children: React.ReactNode }) => {
  const [shouldShowCookieConsent, setShouldShowCookieConsent] = useState(false);

  const openPreferences = () => {
    setShouldShowCookieConsent(true);
  };

  return (
    <CookieContext.Provider value={{ openPreferences }}>
      {children}
      <CookieConsent isVisible={shouldShowCookieConsent} onClose={() => setShouldShowCookieConsent(false)} />
    </CookieContext.Provider>
  );
};

interface CookieConsentProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export default function CookieConsent({ isVisible: externalVisible, onClose: externalOnClose }: CookieConsentProps = {}) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
  });

  const isVisible = externalVisible !== undefined ? externalVisible : internalVisible;

  // Check if user has DNT enabled
  const isDNTEnabled = () => {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' || 
           (navigator as any).msDoNotTrack === '1';
  };

  // Load existing preferences
  const loadExistingPreferences = () => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({
          essential: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          functional: parsed.functional || false,
        });
        return true;
      } catch (e) {
        console.warn('Failed to parse cookie preferences:', e);
      }
    }
    return false;
  };

  // Check if consent has been given or if DNT is enabled
  useEffect(() => {
    if (externalVisible !== undefined) return; // Externally controlled

    const hasConsent = localStorage.getItem('cookie-consent');
    const hasDNT = isDNTEnabled();
    
    // If DNT is enabled, automatically disable all non-essential tracking and don't show banner
    if (hasDNT) {
      localStorage.setItem('cookie-consent', JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        functional: false,
        dnt: true,
        timestamp: Date.now()
      }));
      setInternalVisible(false);
      return;
    }

    // Show consent banner if no previous consent
    if (!hasConsent) {
      setInternalVisible(true);
    }
  }, [externalVisible]);

  // Load existing preferences when modal opens
  useEffect(() => {
    if (isVisible) {
      loadExistingPreferences();
    }
  }, [isVisible]);

  const savePreferences = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      essential: true, // Always required
      dnt: false,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    
    const closeModal = () => {
      if (externalOnClose) {
        externalOnClose();
      } else {
        setInternalVisible(false);
      }
    };
    
    closeModal();
    
    // Only reload if this is the first time consent (no existing preferences)
    if (!loadExistingPreferences()) {
      window.location.reload();
    }
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const acceptEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  };

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: category === 'essential' ? true : value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom-4">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Cookie Preferences
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  We use cookies to enhance your experience and analyze usage
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (externalOnClose) {
                  externalOnClose();
                } else {
                  setInternalVisible(false);
                }
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              data-testid="button-close-cookie-preferences"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showDetails ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                We respect your privacy. Choose which cookies you'd like to accept. Essential cookies are required for the platform to function properly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={acceptAll} 
                  className="flex-1"
                  data-testid="button-accept-all-cookies"
                >
                  Accept All Cookies
                </Button>
                <Button 
                  variant="outline" 
                  onClick={acceptEssential} 
                  className="flex-1"
                  data-testid="button-accept-essential-cookies"
                >
                  Essential Only
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetails(true)}
                  className="flex items-center gap-2"
                  data-testid="button-customize-cookies"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Essential Cookies</h3>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Required
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Authentication, security, and core functionality. Cannot be disabled.
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={true} 
                    disabled={true}
                    className="opacity-50"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <BarChart className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us understand how you use our platform to improve functionality.
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.analytics} 
                    onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Marketing Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Personalized content and relevant advertisements.
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.marketing} 
                    onCheckedChange={(checked) => updatePreference('marketing', checked)}
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Functional Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enhanced features like preferences, settings, and PWA functionality.
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.functional} 
                    onCheckedChange={(checked) => updatePreference('functional', checked)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={() => savePreferences(preferences)}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetails(false)}
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            </>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="mb-2">
              <strong>Do Not Track:</strong> We automatically respect "Do Not Track" browser settings and disable all non-essential cookies when detected.
            </p>
            <p>
              For more information, see our{" "}
              <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}