import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Camera, X, AlertCircle, CheckCircle, RotateCcw, Loader2 } from "lucide-react";
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { requestCameraPermission as utilsRequestCameraPermission, isCapacitorApp, triggerHapticFeedback } from "@/utils/camera-utils";
import type { Product } from "@shared/schema";

type ScannerMode = "quick" | "full" | "search";

interface UnifiedScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: ScannerMode;
  onProductFound?: (product: Product) => void;
  onSearchResult?: (query: string, product: Product) => void;
}

export function UnifiedScannerModal({ 
  isOpen, 
  onClose, 
  mode = "quick",
  onProductFound,
  onSearchResult 
}: UnifiedScannerModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const scanProductMutation = useMutation({
    mutationFn: async (barcode: string) => {
      // First try to find existing product by barcode (works for everyone)
      const localRes = await fetch(`/api/products/barcode/${barcode}`);
      if (localRes.ok) {
        const product = await localRes.json();
        return { source: 'local', product };
      }
      
      // If not found locally, try internet search (for logged-in users)
      try {
        const internetRes = await apiRequest('POST', '/api/products/internet-search', {
          type: 'barcode',
          query: barcode
        });
        
        if (internetRes.ok) {
          const result = await internetRes.json();
          return result;
        }
      } catch (error) {
        // Internet search failed (likely auth issue), but that's okay
        console.debug('Internet search unavailable:', error);
      }
      
      // Product not found anywhere - still allow "Add Product" flow
      return { source: 'none', product: null, barcode };
    },
    onSuccess: (result) => {
      setIsProcessing(false);
      
      if (result?.product) {
        const successMessage = result.source === 'local' 
          ? "Found in safety database" 
          : "Discovered through product search";

        toast({
          title: "Product Found!",
          description: successMessage,
        });

        // Close modal first, then navigate to prevent navigation issues
        onClose();
        
        // Small delay to ensure modal closes before navigation  
        setTimeout(() => {
          console.log('Navigating to product:', result.product.id);
          setLocation(`/product/${result.product.id}`);
        }, 200);
      } else {
        // Product not found - different message based on auth status
        if (user) {
          // Logged-in users get the "Add Product" option
          toast({
            title: "Product Not Found",
            description: "Would you like to add this product to our database?",
            variant: "destructive",
            action: (
              <div className="space-x-2">
                <Button size="sm" onClick={() => {
                  onClose();
                  setLocation('/add-product');
                }}>
                  Add Product
                </Button>
              </div>
            ),
          });
        } else {
          // Guest users get a message with login link
          setScanResult("This product is not in our database yet. Log in to add new products.");
          toast({
            title: "Product Not Found",
            description: "This product is not in our database yet. Log in to add new products.",
            variant: "destructive",
          });
        }
        // Don't auto-close - let user manually close or take action
      }
    },
    onError: (error: any) => {
      setIsProcessing(false);
      
      // Check if it's an authentication error
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        toast({
          title: "Login Required",
          description: "Please log in to scan and analyze products",
          variant: "destructive",
        });
        // Close scanner and redirect to login
        onClose();
        return;
      }
      
      toast({
        title: "Scan Failed", 
        description: "Unable to scan this product barcode",
        variant: "destructive",
      });
      
      // Reset state and restart scanner after error
      setLastScannedCode("");
      setShowScanner(true);
    },
  });

  const onScanSuccess = useCallback((decodedText: string) => {
    // Prevent duplicate scans of the same code - check this FIRST
    if (isProcessing || lastScannedCode === decodedText) {
      console.debug('Ignoring duplicate scan:', decodedText);
      return;
    }

    console.log('Processing new barcode scan:', decodedText);
    setIsProcessing(true);
    setLastScannedCode(decodedText);
    
    // Stop scanner immediately to prevent more scans
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.clear(); // More aggressive cleanup
      } catch (e) {
        console.debug('Scanner stop error:', e);
      }
    }
    
    // Immediate feedback for successful scan
    playSuccessSound();
    showScanSuccess();
    
    // Brief delay to show success feedback before processing
    setTimeout(() => {
      setShowScanner(false);
      scanProductMutation.mutate(decodedText);
    }, 500);
  }, [scanProductMutation, isProcessing, lastScannedCode]);

  const playSuccessSound = () => {
    // Create a brief success beep
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.debug('Audio feedback not available:', error);
    }
  };

  const showScanSuccess = () => {
    // Show success overlay
    const successOverlay = document.getElementById("scan-success-overlay");
    if (successOverlay) {
      successOverlay.style.opacity = "1";
      
      setTimeout(() => {
        successOverlay.style.opacity = "0";
      }, 400);
    }

    // Add visual flash effect to container
    const scannerContainer = document.getElementById("unified-barcode-scanner-container");
    if (scannerContainer) {
      scannerContainer.style.transition = "all 0.2s ease";
      scannerContainer.style.boxShadow = "0 0 20px #10b981";
      scannerContainer.style.borderColor = "#10b981";
      
      setTimeout(() => {
        scannerContainer.style.boxShadow = "";
        scannerContainer.style.borderColor = "";
      }, 400);
    }

    // Trigger haptic feedback
    triggerHapticFeedback();
  };

  const onScanFailure = useCallback((error: string) => {
    // Ignore scan failures - they happen constantly during scanning
    console.debug('Scan attempt failed:', error);
  }, []);

  const requestCameraPermission = async () => {
    setCameraError("");
    
    try {
      const result = await utilsRequestCameraPermission();
      
      if (result.granted) {
        // Immediately show scanner without permission screen
        setPermissionRequested(false);
        setShowScanner(true);
        
        // Different message based on permission type
        const message = result.permanent 
          ? `Camera access granted${isCapacitorApp() ? ' (Android)' : ' (Always allowed)'}`
          : `Camera access granted${isCapacitorApp() ? ' (Android)' : ' (Until browser closes)'}`;
          
        toast({
          title: "Camera Access Granted",
          description: `${message}. Point your camera at a product barcode to scan.`,
        });
      } else {
        // Handle different denial scenarios
        const errorMessage = result.message || 'Camera permission denied by user';
        setCameraError(errorMessage);
        setPermissionRequested(false);
        
        toast({
          title: "Camera Permission Denied", 
          description: result.message || "Please allow camera access to scan barcodes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setCameraError("Camera permission denied. Please allow camera access and try again.");
      setPermissionRequested(false);
      toast({
        title: "Camera Permission Error", 
        description: "Unable to access camera. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initializeScanner = useCallback(async () => {
    if (!showScanner || scannerRef.current) return;
    
    try {
      // First, release any existing camera streams to prevent conflicts
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (e) {
        // Ignore errors - no existing stream
      }

      // Clear any existing scanner first
      const existingScanner = document.getElementById("unified-barcode-scanner-container");
      if (existingScanner) {
        existingScanner.innerHTML = '';
      }

      // Immediately clear permission state to show camera
      setPermissionRequested(false);
      setCameraError("");
      
      // Small delay to ensure camera is released and DOM is ready
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!hasCamera) {
        throw new Error('No camera device found. Please ensure your device has a camera and try again.');
      }

      // Better configuration for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Configure scanner with comprehensive barcode format support
      const scanner = new Html5Qrcode("unified-barcode-scanner-container", {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.RSS_14,
          Html5QrcodeSupportedFormats.RSS_EXPANDED,
        ],
        useBarCodeDetectorIfSupported: true,
        verbose: false, // Required property for configuration
      });

      // Get camera constraints based on device
      const cameraConstraints = { facingMode: "environment" }; // Use rear camera without constraints

      await scanner.start(
        cameraConstraints,
        {
          fps: isMobile ? 8 : 10, // Slightly higher fps for better detection
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            const minEdgePercentage = 0.8; // Larger scan area
            const qrboxSize = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * minEdgePercentage);
            return {
              width: qrboxSize,
              height: Math.floor(qrboxSize * 0.5) // Optimized for barcodes
            };
          },
          aspectRatio: isMobile ? 1.0 : 1.777778,
          disableFlip: false, // Allow image flipping for better detection
        },
        onScanSuccess,
        onScanFailure
      );
      scannerRef.current = scanner;
      setIsScannerReady(true);
      setPermissionRequested(false); // Clear permission state
      setCameraError("");
    } catch (error) {
      console.error('Error initializing scanner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      let friendlyMessage = errorMessage;
      if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
        friendlyMessage = 'Camera permission denied. Please allow camera access in your browser settings and refresh the page.';
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera')) {
        friendlyMessage = 'No camera found. Please connect a camera or try a different device.';
      } else if (errorMessage.includes('NotReadableError') || errorMessage.includes('Could not start video source')) {
        friendlyMessage = 'Camera is busy or unavailable. Please:\n• Close other camera apps (Zoom, Teams, etc.)\n• Refresh this page\n• Try a different browser\n• Check if camera works in other apps';
      } else if (errorMessage.includes('OverconstrainedError')) {
        friendlyMessage = 'Camera configuration not supported. Please try a different device or browser.';
      }
      
      setCameraError(friendlyMessage);
      setIsScannerReady(false);
    }
  }, [showScanner, onScanSuccess, onScanFailure]);

  const handleClose = () => {
    // Clean up scanner and camera streams
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {
        console.log('Scanner cleanup error:', e);
      }
      scannerRef.current = null;
    }
    
    // Stop any active camera streams
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => stream.getTracks().forEach(track => track.stop()))
      .catch(() => {}); // Ignore errors
    
    // Reset all states
    setShowScanner(false);
    setPermissionRequested(false);
    setCameraError("");
    setIsScannerReady(false);
    setIsProcessing(false);
    setLastScannedCode("");
    onClose();
  };

  const handleRetry = () => {
    setCameraError("");
    setPermissionRequested(false);
    setShowScanner(false);
    setIsScannerReady(false);
    setIsProcessing(false);
    setLastScannedCode("");
  };

  // Initialize scanner when showScanner becomes true
  useEffect(() => {
    if (showScanner) {
      const timer = setTimeout(initializeScanner, 200);
      return () => clearTimeout(timer);
    }
  }, [showScanner, initializeScanner]);

  // Cleanup scanner when modal closes
  useEffect(() => {
    if (!isOpen && scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.debug('Scanner cleanup error (normal):', error);
      }
      scannerRef.current = null;
      setIsScannerReady(false);
    }
  }, [isOpen]);

  // Reset state when modal opens and show permission request screen
  useEffect(() => {
    if (isOpen) {
      setShowScanner(false);
      setPermissionRequested(false);
      setCameraError("");
      setIsScannerReady(false);
      setScanResult(null);
      
      // On mobile, automatically request camera permission
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        // Small delay for modal to fully open, then auto-request permission
        const timer = setTimeout(async () => {
          await requestCameraPermission();
        }, 300);
        
        return () => clearTimeout(timer);
      }
      // On desktop, show the permission request button
    }
  }, [isOpen]);

  const getModeTitle = () => {
    switch (mode) {
      case "quick": return "Quick Scan Product";
      case "full": return "Scan for Analysis";
      case "search": return "Scan to Search";
      default: return "Scan Product Barcode";
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case "quick": return "Quickly find and view product details";
      case "full": return "Scan for comprehensive safety analysis";
      case "search": return "Scan to add to search results";
      default: return "Scan product barcode for information";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="scanner-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            {getModeTitle()}
          </DialogTitle>
          <p id="scanner-dialog-description" className="sr-only">
            {getModeDescription()}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {cameraError ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">Camera Access Needed</p>
                <p className="text-sm text-gray-600" data-testid="text-camera-error">
                  {cameraError}
                </p>
                <p className="text-xs text-gray-500">
                  Please allow camera access to scan product barcodes
                </p>
              </div>
              <Button 
                onClick={requestCameraPermission}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-retry-scanner"
              >
                <Camera className="w-4 h-4 mr-2" />
                Allow Camera Access
              </Button>
            </div>
          ) : !permissionRequested && !showScanner ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">Ready to Scan</p>
                <p className="text-sm text-gray-600">
                  Click below to start scanning product barcodes
                </p>
              </div>
              <Button 
                onClick={requestCameraPermission}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-start-scanner"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Scanner
              </Button>
            </div>
          ) : showScanner ? (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  🔮 Point your camera at a product barcode
                </p>
              </div>
              
              <div className="relative">
                <div 
                  id="unified-barcode-scanner-container" 
                  className="w-full min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-transparent"
                  data-testid="container-unified-barcode-scanner"
                />

                
                {/* Scan success overlay */}
                <div 
                  id="scan-success-overlay"
                  className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200"
                  data-testid="overlay-scan-success"
                >
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-semibold text-lg">
                      ✅ Barcode Scanned!
                    </p>
                    <p className="text-green-600 text-sm">
                      Analyzing product...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Scan Result Display */}
          {scanResult && (
            <div className="text-center space-y-4 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-3">
                <p className="text-red-700 font-semibold text-lg">Product Not Found</p>
                <p className="text-sm text-red-600" data-testid="text-scan-result">
                  {scanResult}
                </p>
                <Button 
                  onClick={() => {
                    window.location.href = '/api/login?redirect=/add-product';
                  }}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-login-to-add"
                >
                  Log In to Add Products
                </Button>
              </div>
            </div>
          )}

          {scanProductMutation.isPending && (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Analyzing barcode...</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} data-testid="button-close-scanner">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}