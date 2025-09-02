import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Shield, Loader2 } from 'lucide-react';

interface MobileAuthProps {
  onAuthSuccess?: () => void;
}

export default function MobileAuth({ onAuthSuccess }: MobileAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMobileLogin = async () => {
    setIsAuthenticating(true);
    
    try {
      // Check if we're in a Capacitor environment first
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // Use Capacitor Browser for in-app authentication
        const { Browser } = await import('@capacitor/browser');
        const { App } = await import('@capacitor/app');
        
        const serverUrl = window.location.origin;
        const loginUrl = `${serverUrl}/api/login`;
        
        // Open authentication in in-app browser
        await Browser.open({
          url: loginUrl,
          windowName: '_self'
        });
        
        // Listen for successful authentication
        const urlListener = await App.addListener('appUrlOpen', async (event) => {
          if (event.url.includes('/api/callback') || event.url === serverUrl + '/') {
            await Browser.close();
            setTimeout(() => {
              window.location.reload();
              onAuthSuccess?.();
            }, 1000);
            urlListener.remove();
          }
        });
        
      } else {
        // Fallback: direct redirect (no new window for better mobile experience)
        window.location.href = '/api/login';
      }
      
    } catch (error) {
      console.error('Mobile authentication error:', error);
      // Fallback to direct redirect
      window.location.href = '/api/login';
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">Sign In to PawsitiveCheck</CardTitle>
        <p className="text-muted-foreground text-sm">
          Access your pet safety dashboard and personalized recommendations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={handleMobileLogin}
          disabled={isAuthenticating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-testid="button-mobile-signin"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Sign In with Replit
            </>
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}