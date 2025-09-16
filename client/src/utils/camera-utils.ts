// Safe camera permission utilities for cross-platform support
// This file handles web and Android permissions without breaking React context
// Enhanced with robust error handling, retry mechanisms, and comprehensive fallbacks

export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

// Enhanced camera permission request with retry and better error handling
export const requestCameraPermission = async (retryCount: number = 0, maxRetries: number = 2): Promise<{ granted: boolean; permanent: boolean; message?: string; errorType?: string; retryable?: boolean }> => {
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
    
    // Request camera access with compatibility for various environments
    try {
      // Detect ChromeOS and Replit preview environment
      const isChromebook = /CrOS/.test(navigator.userAgent);
      const isReplitPreview = window.location.hostname.includes('replit.') || 
                             window.location.hostname.includes('repl.co') ||
                             navigator.userAgent.includes('Replit');
      console.log('ChromeOS detected:', isChromebook);
      console.log('Replit preview detected:', isReplitPreview);
      
      let stream;
      if (isChromebook || isReplitPreview) {
        // ChromeOS and Replit preview: Use simplest possible constraints
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } else {
        // Try with rear camera first, fallback to any available camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment', // Use rear camera without exact constraint
              frameRate: { ideal: 30 },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
        } catch (rearCameraError) {
          console.log('Rear camera not available, trying any camera:', rearCameraError);
          // Fallback to any available camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
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
          message: 'Camera access denied. Please click the camera icon in your browser\'s address bar and allow camera access, then try again.',
          errorType: 'NotAllowedError',
          retryable: true
        };
      }
      
      if (error.name === 'NotReadableError') {
        // Camera is busy or hardware issue
        if (retryCount < maxRetries) {
          console.log(`Camera busy, retrying in 2 seconds... (attempt ${retryCount + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return requestCameraPermission(retryCount + 1, maxRetries);
        }
        
        return {
          granted: false,
          permanent: false,
          message: 'Camera is currently busy. Please:\n• Close other camera apps (Zoom, Teams, etc.)\n• Refresh this page\n• Try the file upload option below',
          errorType: 'NotReadableError',
          retryable: true
        };
      }
      
      if (error.name === 'NotFoundError') {
        return {
          granted: false,
          permanent: true,
          message: 'No camera found on this device. Please use the file upload option to scan barcodes from photos.',
          errorType: 'NotFoundError',
          retryable: false
        };
      }
      
      if (error.name === 'AbortError') {
        return {
          granted: false,
          permanent: false,
          message: 'Camera access was interrupted. Please try again.',
          errorType: 'AbortError',
          retryable: true
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
            message: 'Camera constraints not supported. Try using the file upload option instead.',
            errorType: 'OverconstrainedError',
            retryable: false
          };
        }
      }
      
      // Generic camera error with retry option
      if (retryCount < maxRetries) {
        console.log(`Camera error, retrying in 1 second... (attempt ${retryCount + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return requestCameraPermission(retryCount + 1, maxRetries);
      }
      
      return { 
        granted: false, 
        permanent: false, 
        message: 'Camera access failed. Please try refreshing the page or use the file upload option.',
        errorType: error.name || 'UnknownError',
        retryable: true
      };
    }
    
  } catch (error: any) {
    console.error('Camera permission error:', error);
    return { 
      granted: false, 
      permanent: false, 
      message: 'Camera initialization failed. Please try refreshing the page or use the file upload option.',
      errorType: 'InitializationError',
      retryable: true
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

// Check if device supports camera scanning
export const checkScannerCapabilities = async (): Promise<{
  hasCamera: boolean;
  hasPermission: boolean;
  supportedFormats: string[];
  fallbackOptions: string[];
}> => {
  try {
    // Check if camera is available
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    
    // Check permission status
    let hasPermission = false;
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      hasPermission = permission.state === 'granted';
    } catch (e) {
      // Permissions API not supported, assume we need to request
      hasPermission = false;
    }
    
    // Supported barcode formats (comprehensive list)
    const supportedFormats = [
      'QR_CODE', 'UPC_A', 'UPC_E', 'EAN_13', 'EAN_8', 
      'CODE_128', 'CODE_39', 'CODE_93', 'CODABAR', 'ITF'
    ];
    
    // Available fallback options
    const fallbackOptions = ['file_upload', 'manual_entry'];
    
    // Add image analysis if available
    if (typeof FileReader !== 'undefined') {
      fallbackOptions.push('image_analysis');
    }
    
    return {
      hasCamera,
      hasPermission,
      supportedFormats,
      fallbackOptions
    };
  } catch (error) {
    console.error('Error checking scanner capabilities:', error);
    return {
      hasCamera: false,
      hasPermission: false,
      supportedFormats: [],
      fallbackOptions: ['manual_entry']
    };
  }
};

// Get user-friendly error guidance based on error type
export const getErrorGuidance = (errorType: string, deviceInfo?: any): {
  title: string;
  message: string;
  actions: { label: string; action: string; primary?: boolean }[];
} => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  switch (errorType) {
    case 'NotAllowedError':
      return {
        title: 'Camera Permission Needed',
        message: isMobile 
          ? 'Please allow camera access to scan barcodes. Check your browser settings and try again.'
          : 'Click the camera icon in your browser\'s address bar and select "Allow" to enable camera access.',
        actions: [
          { label: 'Try Again', action: 'retry', primary: true },
          { label: 'Upload Image', action: 'upload' },
          { label: 'Enter Manually', action: 'manual' }
        ]
      };
      
    case 'NotReadableError':
      return {
        title: 'Camera Busy',
        message: 'Your camera is currently being used by another application. Please close other camera apps and try again.',
        actions: [
          { label: 'Try Again', action: 'retry', primary: true },
          { label: 'Upload Image', action: 'upload' },
          { label: 'Enter Manually', action: 'manual' }
        ]
      };
      
    case 'NotFoundError':
      return {
        title: 'No Camera Found',
        message: 'No camera was detected on this device. You can still scan by uploading a photo or entering the barcode manually.',
        actions: [
          { label: 'Upload Image', action: 'upload', primary: true },
          { label: 'Enter Manually', action: 'manual' }
        ]
      };
      
    case 'OverconstrainedError':
      return {
        title: 'Camera Not Compatible',
        message: 'Your camera doesn\'t support the required settings for scanning. Try uploading a photo instead.',
        actions: [
          { label: 'Upload Image', action: 'upload', primary: true },
          { label: 'Enter Manually', action: 'manual' }
        ]
      };
      
    default:
      return {
        title: 'Camera Unavailable',
        message: 'Camera scanning is not available right now. You can upload a photo or enter the information manually.',
        actions: [
          { label: 'Try Again', action: 'retry' },
          { label: 'Upload Image', action: 'upload', primary: true },
          { label: 'Enter Manually', action: 'manual' }
        ]
      };
  }
};

// Enhanced device detection for better scanner optimization
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isChrome = /Chrome/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isEdge = /Edge/i.test(userAgent);
  const isReplitPreview = window.location.hostname.includes('replit.') || 
                         window.location.hostname.includes('repl.co');
  
  return {
    isMobile,
    isTablet,
    isAndroid,
    isIOS,
    isChrome,
    isSafari,
    isFirefox,
    isEdge,
    isReplitPreview,
    supportsFileAPI: typeof FileReader !== 'undefined',
    supportsGetUserMedia: typeof navigator.mediaDevices?.getUserMedia === 'function',
    supportsPermissionsAPI: typeof navigator.permissions?.query === 'function'
  };
};