// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment - request native permissions
      try {
        // Safe dynamic import for Capacitor Camera (only in Android)
        const capacitorModule = await import('@capacitor/camera');
        const permissions = await capacitorModule.Camera.requestPermissions();
        
        if (permissions.camera === 'granted') {
          return true;
        } else {
          console.error('Camera permission denied by Android system');
          return false;
        }
      } catch (capacitorError) {
        console.log('Capacitor Camera import failed, using web fallback:', capacitorError);
        // Fall through to web API
      }
    }
    
    // Web browser environment (or Android fallback)
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment'
      } 
    });
    
    // Close test stream immediately
    stream.getTracks().forEach(track => track.stop());
    return true;
    
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
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
      facingMode: 'environment',
      width: isMobile ? { ideal: 1280 } : { ideal: 1920 },
      height: isMobile ? { ideal: 720 } : { ideal: 1080 }
    }
  };
};