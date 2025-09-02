// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (isCapacitorApp()) {
      // Android/Capacitor environment
      try {
        // Safe dynamic import for Capacitor Camera
        const capacitorCamera = await import('@capacitor/camera');
        const permissions = await capacitorCamera.Camera.requestPermissions();
        return permissions.camera === 'granted';
      } catch (capacitorError) {
        console.log('Capacitor Camera not available, using web fallback');
        // Fall through to web API
      }
    }
    
    // Web browser environment (or fallback)
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