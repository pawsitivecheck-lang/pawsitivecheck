import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Shield, Loader2, Mail, Key } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface MobileAuthProps {
  onAuthSuccess?: () => void;
}

export default function MobileAuth({ onAuthSuccess }: MobileAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await apiRequest('POST', '/api/auth/login', { email, password });
    },
    onSuccess: () => {
      window.location.reload();
      onAuthSuccess?.();
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, firstName, lastName }: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
    }) => {
      return await apiRequest('POST', '/api/auth/register', { email, password, firstName, lastName });
    },
    onSuccess: () => {
      window.location.reload();
      onAuthSuccess?.();
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });

  const handleReplitLogin = async () => {
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

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Browser } = await import('@capacitor/browser');
        const { App } = await import('@capacitor/app');
        
        const serverUrl = window.location.origin;
        const googleUrl = `${serverUrl}/api/auth/google`;
        
        await Browser.open({
          url: googleUrl,
          windowName: '_self'
        });
        
        const urlListener = await App.addListener('appUrlOpen', async (event) => {
          if (event.url === serverUrl + '/') {
            await Browser.close();
            setTimeout(() => {
              window.location.reload();
              onAuthSuccess?.();
            }, 1000);
            urlListener.remove();
          }
        });
        
      } else {
        window.location.href = '/api/auth/google';
      }
      
    } catch (error) {
      console.error('Google authentication error:', error);
      window.location.href = '/api/auth/google';
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
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
      
      <CardContent>
        <Tabs defaultValue="replit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="replit" data-testid="tab-replit">Replit</TabsTrigger>
            <TabsTrigger value="google" data-testid="tab-google">Google</TabsTrigger>
            <TabsTrigger value="email" data-testid="tab-email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="replit" className="space-y-4">
            <Button
              onClick={handleReplitLogin}
              disabled={isAuthenticating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-replit-signin"
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
            <div className="text-center text-xs text-muted-foreground">
              You'll be redirected to Replit for secure authentication
            </div>
          </TabsContent>
          
          <TabsContent value="google" className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-google-signin"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign In with Google
                </>
              )}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Continue with your Google account
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      data-testid="input-login-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      data-testid="input-login-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold rounded-xl"
                    data-testid="button-email-signin"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        required
                        data-testid="input-register-firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        required
                        data-testid="input-register-lastname"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <Input
                      id="regEmail"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      data-testid="input-register-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <Input
                      id="regPassword"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                      minLength={6}
                      data-testid="input-register-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold rounded-xl"
                    data-testid="button-email-register"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}