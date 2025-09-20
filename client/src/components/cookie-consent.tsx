import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, Shield, Eye, BarChart, Sparkles, X, Calendar, Info } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieContextType {
  openPreferences: () => void;
  getPreferences: () => CookiePreferences | null;
}

const CookieContext = createContext<CookieContextType | null>(null);

export const useCookiePreferences = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookiePreferences must be used within a CookieProvider');
  }
  return context;
};

// Export utility for checking analytics consent
export const hasAnalyticsConsent = () => {
  try {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.analytics === true;
    }
  } catch (e) {
    console.warn('Failed to check analytics consent:', e);
  }
  return false;
};

export const CookieProvider = ({ children }: { children: React.ReactNode }) => {
  const [shouldShowCookieConsent, setShouldShowCookieConsent] = useState(false);
  
  const openPreferences = () => {
    setShouldShowCookieConsent(true);
  };
  
  const getPreferences = () => {
    try {
      const saved = localStorage.getItem('cookie-consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          essential: true,
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          functional: parsed.functional || false,
        };
      }
    } catch (e) {
      console.warn('Failed to get preferences:', e);
    }
    return null;
  };

  return (
    <CookieContext.Provider value={{ openPreferences, getPreferences }}>
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
  const [isExpired, setIsExpired] = useState(false);

  const isVisible = externalVisible !== undefined ? externalVisible : internalVisible;

  // Check if consent is expired (older than 365 days)
  const isConsentExpired = (timestamp: number) => {
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp > oneYearInMs;
  };

  // Server sync for logged-in users
  const { data: serverPreferences } = useQuery({
    queryKey: ["/api/cookie-preferences"],
    staleTime: Infinity,
    retry: false,
  });

  const syncPreferences = useMutation({
    mutationFn: async (prefs: CookiePreferences) => {
      return await apiRequest("/api/cookie-preferences", "POST", prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cookie-preferences"] });
    },
  });

  // Check if user has DNT enabled
  const isDNTEnabled = () => {
    return navigator.doNotTrack === '1' || 
           (window as any).doNotTrack === '1' || 
           (navigator as any).msDoNotTrack === '1';
  };

  // Load existing preferences
  const loadExistingPreferences = () => {
    // First check server preferences if available
    if (serverPreferences && serverPreferences !== null && serverPreferences.preferences) {
      const serverPrefs = serverPreferences.preferences;
      setPreferences({
        essential: true,
        analytics: serverPrefs.analytics || false,
        marketing: serverPrefs.marketing || false,
        functional: serverPrefs.functional || false,
      });
      
      // Sync to localStorage for consistency
      localStorage.setItem('cookie-consent', JSON.stringify({
        essential: true,
        analytics: serverPrefs.analytics,
        marketing: serverPrefs.marketing,
        functional: serverPrefs.functional,
        timestamp: new Date(serverPrefs.consentTimestamp).getTime(),
        synced: true,
      }));
      
      // Check if consent is expired
      if (isConsentExpired(new Date(serverPrefs.consentTimestamp).getTime())) {
        setIsExpired(true);
        return false; // Show consent popup again
      }
      return true;
    }
    
    // Fall back to localStorage
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Check if consent is expired
        if (parsed.timestamp && isConsentExpired(parsed.timestamp)) {
          setIsExpired(true);
          localStorage.removeItem('cookie-consent');
          return false; // Show consent popup again
        }
        
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

    const hasValidConsent = loadExistingPreferences();
    
    // Show consent banner if no previous consent or consent is expired
    if (!hasValidConsent) {
      setInternalVisible(true);
    }
  }, [serverPreferences]);

  // Load existing preferences when modal opens
  useEffect(() => {
    if (isVisible) {
      loadExistingPreferences();
    }
  }, [isVisible]);

  const savePreferences = async (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      essential: true, // Always required
      dnt: false,
      timestamp: Date.now()
    };
    
    // Save to localStorage first for immediate effect
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    
    // Sync to server if user is logged in
    try {
      await syncPreferences.mutateAsync(prefs);
    } catch (error) {
      // Silent failure - localStorage is the primary store
      console.warn('Failed to sync cookie preferences to server:', error);
    }
    
    const closeModal = () => {
      if (externalOnClose) {
        externalOnClose();
      } else {
        setInternalVisible(false);
      }
    };
    
    closeModal();
    
    // Fire custom event for analytics initialization
    if (prefs.analytics) {
      window.dispatchEvent(new CustomEvent('cookieConsent', { 
        detail: { analytics: true } 
      }));
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl mb-safe sm:mb-0 bg-gradient-to-b from-purple-50/95 to-blue-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border border-purple-200 dark:border-purple-700 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Cookie Preferences
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Managing your privacy preferences
                </p>
                {isExpired && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400">
                    <Calendar className="w-3 h-3" />
                    <span>Annual consent review required</span>
                  </div>
                )}
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
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 min-h-[44px] min-w-[44px]"
              data-testid="button-close-cookie-preferences"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showDetails ? (
            <>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  We respect your privacy and use minimal cookies to enhance your experience while protecting your digital sovereignty.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link to="/cookie-policy" className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Learn more in our Cookie Policy
                  </Link>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {isDNTEnabled() && (
                    <Badge variant="secondary" className="gap-1 bg-purple-100 dark:bg-purple-900/30">
                      <Shield className="w-3 h-3" />
                      DNT Enabled - Tracking Disabled
                    </Badge>
                  )}
                  {serverPreferences && (
                    <Badge variant="secondary" className="gap-1 bg-blue-100 dark:bg-blue-900/30">
                      <Shield className="w-3 h-3" />
                      Synced to Account
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge variant="secondary" className="gap-1 bg-amber-100 dark:bg-amber-900/30">
                      <Calendar className="w-3 h-3" />
                      Review Required
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={acceptAll} 
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  data-testid="button-accept-all-cookies"
                >
                  Accept All Cookies
                </Button>
                <Button 
                  variant="outline" 
                  onClick={acceptEssential} 
                  className="flex-1 min-h-[44px] border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  data-testid="button-accept-essential-cookies"
                >
                  Essential Only
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetails(true)}
                  className="flex items-center gap-2 min-h-[44px] border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  data-testid="button-customize-cookies"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-white/50 dark:bg-gray-800/50">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg opacity-75">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
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
                <div className="flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors min-h-[44px]">
                  <div className="flex items-start gap-3">
                    <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
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
                    className="touch-action-manipulation"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors min-h-[44px]">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
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
                    className="touch-action-manipulation"
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors min-h-[44px]">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1" />
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
                    className="touch-action-manipulation"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Save Preferences
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetails(false)}
                  className="flex-1 min-h-[44px] border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Back
                </Button>
              </div>
            </>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-purple-200 dark:border-purple-700 space-y-2">
            {isExpired && (
              <p className="text-amber-600 dark:text-amber-400">
                <strong>Note:</strong> Your consent has expired. We ask for your preferences annually to ensure transparency and compliance with privacy regulations.
              </p>
            )}
            <p>
              <strong>Do Not Track:</strong> We automatically respect "Do Not Track" browser settings and disable all non-essential cookies when detected.
            </p>
            <p>
              For more information, see our{" "}
              <Link to="/privacy-policy" className="text-purple-600 dark:text-purple-400 hover:underline">
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link to="/cookie-policy" className="text-purple-600 dark:text-purple-400 hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}