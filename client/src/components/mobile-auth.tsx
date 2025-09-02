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
    try {
      setIsAuthenticating(true);
      
      // Check if we're in a Capacitor environment
      const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor;
      
      if (isCapacitor) {
        // Mobile app authentication with Capacitor
        const { Browser } = await import('@capacitor/browser');
        const { App } = await import('@capacitor/app');
        
        const serverUrl = window.location.origin;
        const loginUrl = `${serverUrl}/api/login`;
        
        // Open authentication in in-app browser
        await Browser.open({
          url: loginUrl,
          windowName: '_self',
          presentationStyle: 'popover'
        });
        
        // Listen for app URL changes to detect successful authentication
        const urlListener = await App.addListener('appUrlOpen', async (event) => {
          console.log('App URL opened:', event.url);
          
          // Check if we received a successful callback
          if (event.url.includes('/api/callback') || event.url === serverUrl + '/') {
            // Close the browser and refresh the app
            await Browser.close();
            
            // Wait a moment then check authentication status
            setTimeout(() => {
              window.location.reload();
              onAuthSuccess?.();
            }, 1000);
            
            // Remove the listener
            urlListener.remove();
          }
        });
        
        // Also listen for successful authentication by polling
        const pollAuth = setInterval(async () => {
          try {
            const response = await fetch('/api/auth/user', {
              credentials: 'include'
            });
            
            if (response.ok) {
              // Authentication successful
              clearInterval(pollAuth);
              await Browser.close();
              setIsAuthenticating(false);
              
              // Refresh the page to update authentication state
              window.location.reload();
              onAuthSuccess?.();
            }
          } catch (error) {
            // Still not authenticated, continue polling
          }
        }, 2000);
        
        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollAuth);
          setIsAuthenticating(false);
        }, 5 * 60 * 1000);
        
      } else {
        // Web environment - just redirect to login
        window.location.href = '/api/login';
      }
      
    } catch (error) {
      console.error('Mobile authentication error:', error);
      setIsAuthenticating(false);
      
      // Fallback to external browser
      window.open('/api/login', '_blank');
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