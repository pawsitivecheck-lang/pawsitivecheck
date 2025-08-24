import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { X, Cookie, Settings, Shield, ChartBar, Target } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
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
      necessary: true,
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
    if (category === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [category]: value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card className="cosmic-card w-full max-w-lg pointer-events-auto border-starlight-500/30" data-testid="card-cookie-consent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-starlight-400">
              <Cookie className="mr-2 h-5 w-5" />
              Cookie Preferences
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-cosmic-400 hover:text-cosmic-200"
              data-testid="button-close-cookie"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showDetails ? (
            // Simple consent view
            <div className="space-y-4">
              <p className="text-cosmic-200 text-sm">
                We use cookies to enhance your mystical experience, analyze cosmic patterns, and provide personalized content. Choose your preference below.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-starlight-500 to-mystical-purple text-cosmic-900 hover:from-starlight-400 hover:to-mystical-purple"
                  data-testid="button-accept-all"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 border-cosmic-600 text-cosmic-200 hover:bg-cosmic-800"
                  data-testid="button-reject-all"
                >
                  Reject All
                </Button>
              </div>
              
              <Button
                onClick={() => setShowDetails(true)}
                variant="ghost"
                className="w-full text-starlight-400 hover:text-starlight-300"
                data-testid="button-customize"
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize Preferences
              </Button>
            </div>
          ) : (
            // Detailed preferences view
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="sm"
                className="text-starlight-400"
                data-testid="button-back-simple"
              >
                ← Back to Simple View
              </Button>
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-mystical-green" />
                      <span className="font-medium text-cosmic-100">Necessary</span>
                    </div>
                    <Switch
                      checked={preferences.necessary}
                      disabled={true}
                      data-testid="switch-necessary"
                    />
                  </div>
                  <p className="text-xs text-cosmic-400 ml-6">
                    Essential for basic site functionality, security, and user authentication. Always active.
                  </p>
                </div>

                <Separator className="bg-cosmic-600" />

                {/* Functional Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-starlight-500" />
                      <span className="font-medium text-cosmic-100">Functional</span>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={(checked) => updatePreference('functional', checked)}
                      data-testid="switch-functional"
                    />
                  </div>
                  <p className="text-xs text-cosmic-400 ml-6">
                    Remember your preferences, settings, and personalized experience features.
                  </p>
                </div>

                <Separator className="bg-cosmic-600" />

                {/* Analytics Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChartBar className="mr-2 h-4 w-4 text-mystical-purple" />
                      <span className="font-medium text-cosmic-100">Analytics</span>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => updatePreference('analytics', checked)}
                      data-testid="switch-analytics"
                    />
                  </div>
                  <p className="text-xs text-cosmic-400 ml-6">
                    Help us understand how users interact with our platform to improve the cosmic experience.
                  </p>
                </div>

                <Separator className="bg-cosmic-600" />

                {/* Marketing Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="mr-2 h-4 w-4 text-mystical-red" />
                      <span className="font-medium text-cosmic-100">Marketing</span>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => updatePreference('marketing', checked)}
                      data-testid="switch-marketing"
                    />
                  </div>
                  <p className="text-xs text-cosmic-400 ml-6">
                    Personalized content, recommendations, and relevant mystical insights based on your usage.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-starlight-500 to-mystical-purple text-cosmic-900"
                  data-testid="button-save-preferences"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1 border-cosmic-600 text-cosmic-200"
                  data-testid="button-accept-all-detailed"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-cosmic-500 text-center">
            You can change these preferences anytime in your account settings or by clicking "Cookie Preferences" in our footer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}