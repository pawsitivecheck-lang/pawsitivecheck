// Location permission utilities for cross-platform support
// This file handles web and Android location permissions

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

export interface LocationResult {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Request location permission and get current position
export const requestLocationPermission = async (): Promise<{
  granted: boolean;
  location?: LocationResult;
  message?: string;
}> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment - this will prompt for permissions
      try {
        const { Geolocation } = await import('@capacitor/geolocation');
        
        // Request permissions (this will show the permission prompt on Android)
        const permissions = await Geolocation.requestPermissions();
        
        if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
          // Permission granted, now get the location
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
          
          return {
            granted: true,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          };
        } else {
          return {
            granted: false,
            message: 'Location permission denied. Go to Settings > Apps > PawsitiveCheck > Permissions to enable location access.'
          };
        }
      } catch (capacitorError: any) {
        console.error('Capacitor Geolocation error:', capacitorError);
        
        // Check for specific error types
        if (capacitorError.message?.includes('Location services are not enabled')) {
          return {
            granted: false,
            message: 'Please enable location services on your device and try again.'
          };
        }
        
        // Fall through to web API for browser
        console.log('Falling back to web geolocation API');
      }
    }
    
    // Web browser environment
    if (!navigator.geolocation) {
      return {
        granted: false,
        message: 'Geolocation is not supported by this browser'
      };
    }
    
    // Check permission state if available
    let permissionState = 'prompt';
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      permissionState = permission.state;
      console.log('Current location permission state:', permissionState);
    } catch (e) {
      console.log('Permissions API not supported, proceeding with getCurrentPosition');
    }
    
    if (permissionState === 'denied') {
      return {
        granted: false,
        message: 'Location access blocked. Go to your browser settings and allow location access for this site.'
      };
    }
    
    // Request location (will prompt if needed)
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            granted: true,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
        },
        (error) => {
          let message = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please allow location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please try again.';
              break;
          }
          
          resolve({
            granted: false,
            message
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
    
  } catch (error) {
    console.error('Location permission error:', error);
    return {
      granted: false,
      message: 'An error occurred while requesting location permission'
    };
  }
};

// Watch position for continuous updates (useful for navigation)
export const watchPosition = async (
  callback: (location: LocationResult) => void,
  errorCallback?: (error: string) => void
): Promise<{ watchId?: string | number; stop: () => void }> => {
  if (isCapacitorApp()) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (position, err) => {
          if (err) {
            errorCallback?.(err.message || 'Location watch error');
            return;
          }
          
          if (position) {
            callback({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          }
        }
      );
      
      return {
        watchId,
        stop: () => Geolocation.clearWatch({ id: watchId })
      };
    } catch (error) {
      console.error('Capacitor watch position error:', error);
    }
  }
  
  // Web fallback
  if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        errorCallback?.(error.message || 'Location watch error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    return {
      watchId,
      stop: () => navigator.geolocation.clearWatch(watchId)
    };
  }
  
  return {
    stop: () => {}
  };
};