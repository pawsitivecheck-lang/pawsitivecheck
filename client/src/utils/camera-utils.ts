// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

export const requestCameraPermission = async (forcePrompt: boolean = true): Promise<boolean> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment - always request fresh permissions
      try {
        // Safe dynamic import for Capacitor Camera (only in Android)
        const capacitorModule = await import('@capacitor/camera');
        
        // Force fresh permission request every time
        const permissions = await capacitorModule.Camera.requestPermissions({
          permissions: ['camera']
        });
        
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
    // Force fresh permission by trying to revoke existing permissions first
    try {
      // Try to get current permissions and revoke them
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'granted') {
        console.log('Attempting to force fresh permission prompt...');
      }
    } catch (e) {
      // Permissions API not supported, continue
    }
    
    // Use unique constraints to try to force fresh prompt
    const uniqueConstraints = { 
      video: { 
        facingMode: 'environment',
        // Vary constraints to potentially trigger fresh prompts
        frameRate: { ideal: 30 },
        width: { ideal: 1280 + Math.floor(Math.random() * 10) },
        height: { ideal: 720 + Math.floor(Math.random() * 10) }
      } 
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(uniqueConstraints);
    
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