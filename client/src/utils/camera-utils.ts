// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

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
    
    // Web browser environment
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
    
    // Request camera access with ChromeOS compatibility
    try {
      // Detect ChromeOS
      const isChromebook = /CrOS/.test(navigator.userAgent);
      console.log('ChromeOS detected:', isChromebook);
      
      let stream;
      if (isChromebook) {
        // ChromeOS: Use simplest possible constraints
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } else {
        // Force rear camera on mobile devices without fallback
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { exact: 'environment' }, // Force rear camera
            frameRate: { ideal: 30 },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      }
      
      // Close test stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      // Determine if permission is likely permanent based on permission state
      const isPermanent = permissionState === 'granted';
      
      return { 
        granted: true, 
        permanent: isPermanent 
      };
      
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        return { 
          granted: false, 
          permanent: false, 
          message: 'Camera access denied. Try again for a fresh permission prompt.' 
        };
      }
      
      if (error.name === 'OverconstrainedError') {
        // Try again with basic rear camera constraint
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          basicStream.getTracks().forEach(track => track.stop());
          return { granted: true, permanent: permissionState === 'granted' };
        } catch (basicError) {
          return { 
            granted: false, 
            permanent: false, 
            message: 'Rear camera not available. Please ensure your device has a rear camera.' 
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
      facingMode: 'environment', // Use rear camera without exact constraint
      width: isMobile ? { ideal: 1280 } : { ideal: 1920 },
      height: isMobile ? { ideal: 720 } : { ideal: 1080 }
    }
  };
};