import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const [, setLocation] = useLocation();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [isScannerReady, setIsScannerReady] = useState(false);

  const scanProductMutation = useMutation({
    mutationFn: async (barcode: string) => {
      // First try to find existing product by barcode
      const localRes = await fetch(`/api/products/barcode/${barcode}`);
      if (localRes.ok) {
        const product = await localRes.json();
        return { source: 'local', product };
      }
      
      // If not found locally, search the internet
      const internetRes = await apiRequest('POST', '/api/products/internet-search', {
        type: 'barcode',
        query: barcode
      });
      
      if (internetRes.ok) {
        const result = await internetRes.json();
        return result;
      }
      
      return null;
    },
    onSuccess: (result) => {
      if (result?.product) {
        const successMessage = result.source === 'local' 
          ? "Found in safety database" 
          : "Discovered through product search";

        toast({
          title: "Product Found!",
          description: successMessage,
        });

        // Navigate to product detail page
        setLocation(`/product/${result.product.id}`);
        onClose();
      } else {
        // Product not found - offer to add it
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
      }
    },
    onError: (error: any) => {
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
      
      // Restart scanner after error
      setShowScanner(true);
    },
  });

  const onScanSuccess = useCallback((decodedText: string) => {
    // Immediate feedback for successful scan
    playSuccessSound();
    showScanSuccess();
    
    // Brief delay to show success feedback before processing
    setTimeout(() => {
      setShowScanner(false);
      scanProductMutation.mutate(decodedText);
    }, 500);
  }, [scanProductMutation]);

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
      
      const scanner = new Html5Qrcode("unified-barcode-scanner-container");

      // Get camera constraints based on device
      const cameraConstraints = /CrOS/.test(navigator.userAgent) 
        ? { facingMode: "environment" } // ChromeOS - flexible
        : { facingMode: { ideal: "environment" } }; // Mobile - prefer rear

      await scanner.start(
        cameraConstraints,
        {
          fps: isMobile ? 5 : 10,
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            const minEdgePercentage = 0.7;
            const qrboxSize = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * minEdgePercentage);
            return {
              width: qrboxSize,
              height: Math.floor(qrboxSize * 0.6) // Rectangle for barcodes
            };
          },
          aspectRatio: isMobile ? 1.0 : 1.777778,
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
      } else if (errorMessage.includes('NotReadableError')) {
        friendlyMessage = 'Camera is already in use by another application. Please close other apps and try again.';
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
    
    setShowScanner(false);
    setPermissionRequested(false);
    setCameraError("");
    setIsScannerReady(false);
    onClose();
  };

  const handleRetry = () => {
    setCameraError("");
    setPermissionRequested(false);
    setShowScanner(false);
    setIsScannerReady(false);
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

  // Reset state when modal opens and auto-request camera permission
  useEffect(() => {
    if (isOpen) {
      setShowScanner(false);
      setPermissionRequested(false);
      setCameraError("");
      setIsScannerReady(false);
      
      // Automatically start scanner without permission screen delay
      const timer = setTimeout(async () => {
        const result = await utilsRequestCameraPermission();
        if (result.granted) {
          setShowScanner(true);
          toast({
            title: "Camera Access Granted",
            description: "Point your camera at a product barcode to scan.",
          });
        } else {
          setCameraError(result.message || 'Camera permission denied');
        }
      }, 100);
      
      return () => clearTimeout(timer);
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
                <p className="text-gray-700 font-medium">Scanner Error</p>
                <p className="text-sm text-red-600" data-testid="text-camera-error">
                  {cameraError}
                </p>
              </div>
              <Button 
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-retry-scanner"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
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