// Network status component for handling offline/online states
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface NetworkStatusProps {
  onRetry?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function NetworkStatus({ onRetry, className, showIcon = true }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast({
          title: "Back Online",
          description: "Your internet connection has been restored.",
        });
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast({
        title: "Connection Lost",
        description: "You're currently offline. Some features may not work.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (isOnline) {
    return null;
  }

  return (
    <Alert variant="destructive" className={cn("mb-4", className)} data-testid="network-offline">
      <div className="flex items-center space-x-2">
        {showIcon && <WifiOff className="h-4 w-4" />}
        <AlertDescription className="flex-1">
          You're currently offline. Check your internet connection and try again.
        </AlertDescription>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="ml-auto"
            data-testid="button-retry-connection"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </Alert>
  );
}

// Hook for network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'fast' | 'slow' | 'offline'>('fast');

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        setConnectionQuality('offline');
      } else {
        // Simple connection quality check
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setConnectionQuality('slow');
          } else {
            setConnectionQuality('fast');
          }
        }
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const checkConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    isOnline,
    connectionQuality,
    checkConnection
  };
}

// Wrapper component that handles network-dependent operations
export interface NetworkGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showStatus?: boolean;
  onRetry?: () => void;
}

export function NetworkGate({ children, fallback, showStatus = true, onRetry }: NetworkGateProps) {
  const { isOnline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <div>
        {showStatus && <NetworkStatus onRetry={onRetry} />}
        {fallback || (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400" data-testid="network-fallback">
            <WifiOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>This feature requires an internet connection.</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}