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
  permissionLevel?: 'always' | 'while-using' | 'once' | 'denied';
}> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment - this will prompt for permissions
      try {
        const { Geolocation } = await import('@capacitor/geolocation');
        
        // Request permissions - On Android 10+, this shows:
        // - "While using the app" (permission granted while app is in foreground)
        // - "Only this time" (one-time permission, Android 11+)
        // - "Deny" (no permission)
        // - "Allow all the time" (background location, requires additional request)
        const permissions = await Geolocation.requestPermissions();
        
        // Check permission status
        const locationStatus = permissions.location || permissions.coarseLocation;
        
        if (locationStatus === 'granted') {
          // Permission granted (could be "while using" or "always")
          try {
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
              },
              permissionLevel: 'while-using' // Android default for foreground location
            };
          } catch (positionError: any) {
            // Permission was granted but location retrieval failed
            console.error('Position error:', positionError);
            return {
              granted: true,
              message: 'Location permission granted but could not determine position. Please check if location services are enabled.',
              permissionLevel: 'while-using'
            };
          }
        } else if (locationStatus === 'prompt' || locationStatus === 'prompt-with-rationale') {
          // User hasn't decided yet or needs rationale
          return {
            granted: false,
            message: 'Please grant location permission to find veterinarians near you. You can choose "Only this time" for a single use.',
            permissionLevel: 'denied'
          };
        } else {
          // Permission denied
          return {
            granted: false,
            message: 'Location permission denied. You can change this in Settings > Apps > PawsitiveCheck > Permissions > Location.',
            permissionLevel: 'denied'
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