// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

// Track scan attempts to force fresh prompts
let scanAttemptCounter = 0;

export const requestCameraPermission = async (): Promise<{ granted: boolean; permanent: boolean; message?: string }> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment
      try {
        // Safe dynamic import for Capacitor Camera (only in Android)
        const capacitorModule = await import('@capacitor/camera');
        const permissions = await capacitorModule.Camera.requestPermissions({
          permissions: ['camera']
        });
        
        if (permissions.camera === 'granted') {
          return { granted: true, permanent: true }; // Android typically grants permanently
        } else {
          return { granted: false, permanent: true, message: 'Camera permission denied. Go to Settings > Apps > PawsitiveCheck > Permissions to enable camera access.' };
        }
      } catch (capacitorError) {
        console.log('Capacitor Camera import failed, using web fallback:', capacitorError);
        // Fall through to web API
      }
    }
    
    // Web browser environment - force fresh permission prompt each time
    scanAttemptCounter++;
    console.log('Scan attempt #', scanAttemptCounter);
    
    // Check permission state
    let permissionState = 'prompt';
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      permissionState = permission.state;
      console.log('Current camera permission state:', permissionState);
    } catch (e) {
      console.log('Permissions API not supported, proceeding with getUserMedia');
    }
    
    // Handle denied state
    if (permissionState === 'denied') {
      return { 
        granted: false, 
        permanent: true, 
        message: 'Camera access blocked. Go to your browser settings and allow camera access for this site.' 
      };
    }
    
    // Force fresh permission request by using varied constraints each time
    // This tricks browsers into showing permission prompt again
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: 'environment' }, // Force rear camera explicitly
          frameRate: { ideal: 30 + (scanAttemptCounter % 5) }, // Vary frame rate
          width: { ideal: 1280 + (scanAttemptCounter % 10) }, // Vary width slightly
          height: { ideal: 720 + (scanAttemptCounter % 8) }, // Vary height slightly
          // Add random deviceId constraint to force fresh prompt
          deviceId: { ideal: 'rear-camera-' + scanAttemptCounter }
        } 
      });
      
      // Close test stream immediately to clean up
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      
      // Clear any lingering media streams
      if (stream.active) {
        console.log('Force stopping active stream');
      }
      
      return { granted: true, permanent: false }; // Always temporary for web
      
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        return { 
          granted: false, 
          permanent: false, 
          message: 'Camera access denied. Try again to get a fresh permission prompt.' 
        };
      }
      
      if (error.name === 'OverconstrainedError') {
        // Try again with basic constraints if our varied ones failed
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { exact: 'environment' } }
          });
          basicStream.getTracks().forEach(track => track.stop());
          return { granted: true, permanent: false };
        } catch (basicError) {
          return { 
            granted: false, 
            permanent: false, 
            message: 'Camera not available. Please check your device has a camera.' 
          };
        }
      }
      
      return { 
        granted: false, 
        permanent: false, 
        message: 'Camera not available. Please check your device has a camera.' 
      };
    }
    
  } catch (error: any) {
    console.error('Camera permission error:', error);
    return { 
      granted: false, 
      permanent: false, 
      message: 'Camera not available. Please check your device has a camera.' 
    };
  }
};

// Safe haptic feedback for both platforms
export const triggerHapticFeedback = async (): Promise<void> => {
  try {
    if (isCapacitorApp()) {
      // Android haptic feedback
      try {
        const haptics = await import('@capacitor/haptics');
        await haptics.Haptics.vibrate({ duration: 100 });
        return;
      } catch (error) {
        console.log('Capacitor Haptics not available');
      }
    }
    
    // Web vibration API fallback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  } catch (error) {
    console.log('Haptic feedback not available on this platform');
  }
};

export const getCameraConstraints = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return {
    video: {
      facingMode: { exact: 'environment' }, // Force rear camera explicitly
      width: isMobile ? { ideal: 1280 } : { ideal: 1920 },
      height: isMobile ? { ideal: 720 } : { ideal: 1080 }
    }
  };
};