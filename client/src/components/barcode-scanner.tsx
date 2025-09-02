import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, RotateCcw } from "lucide-react";
import Webcam from "react-webcam";
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export function BarcodeScanner({ onScan, onClose, isActive }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isScannerReady, setIsScannerReady] = useState(false);

  const onScanSuccess = useCallback((decodedText: string) => {
    onScan(decodedText);
    onClose();
  }, [onScan, onClose]);

  const onScanFailure = useCallback((error: string) => {
    // Ignore scan failures - they happen constantly during scanning
    console.debug('Scan attempt failed:', error);
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        onClose();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isActive, onClose]);

  useEffect(() => {
    if (isActive && !scannerRef.current) {
      // Add delay to ensure DOM is ready and prevent race conditions
      const initScanner = async () => {
        try {
          // Clear any existing scanner first
          const existingScanner = document.getElementById("barcode-scanner-container");
          if (existingScanner) {
            existingScanner.innerHTML = '';
          }

          // First explicitly request camera permission
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment' // Prefer rear camera on mobile
              } 
            });
            // Permission granted - close the test stream
            stream.getTracks().forEach(track => track.stop());
          } catch (permissionError) {
            throw new Error('Camera permission denied. Please allow camera access and try again.');
          }

          // Check if camera is available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          
          if (!hasCamera) {
            throw new Error('No camera device found. Please ensure your device has a camera and try again.');
          }

          // Better configuration for mobile devices
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          const scanner = new Html5QrcodeScanner(
            "barcode-scanner-container",
            {
              fps: isMobile ? 5 : 10, // Lower FPS on mobile for better performance
              qrbox: function(viewfinderWidth, viewfinderHeight) {
                // Square scanning box, responsive to container size
                const minEdgePercentage = 0.7;
                const qrboxSize = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * minEdgePercentage);
                return {
                  width: qrboxSize,
                  height: Math.floor(qrboxSize * 0.6) // Rectangle for barcodes
                };
              },
              supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
              formatsToSupport: [
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.QR_CODE
              ],
              aspectRatio: isMobile ? 1.0 : 1.777778, // 16:9 for desktop, square for mobile
              disableFlip: false,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
              showZoomSliderIfSupported: true,
              defaultZoomValueIfSupported: 1,
            },
            false // verbose
          );

          await scanner.render(onScanSuccess, onScanFailure);
          scannerRef.current = scanner;
          setIsScannerReady(true);
          setCameraError(""); // Clear any previous errors
        } catch (error) {
          console.error('Error initializing scanner:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Provide more specific error messages
          let friendlyMessage = errorMessage;
          if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied') || errorMessage.includes('Camera permission denied')) {
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
      };

      // Longer delay for better mobile support
      setTimeout(initScanner, 200);
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.debug('Scanner cleanup error (normal):', error);
        }
        scannerRef.current = null;
        setIsScannerReady(false);
      }
    };
  }, [isActive, onScanSuccess, onScanFailure]);

  const handleReset = async () => {
    // Clear existing scanner
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.debug('Scanner clear error (normal):', error);
      }
      scannerRef.current = null;
    }
    
    setIsScannerReady(false);
    setCameraError("");
    
    // Clear the container
    const container = document.getElementById("barcode-scanner-container");
    if (container) {
      container.innerHTML = '';
    }
    
    // Re-initialize with improved logic
    setTimeout(async () => {
      if (isActive) {
        try {
          // Check if camera is available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          
          if (!hasCamera) {
            throw new Error('No camera device found. Please ensure your device has a camera and try again.');
          }

          // Better configuration for mobile devices
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          const scanner = new Html5QrcodeScanner(
            "barcode-scanner-container",
            {
              fps: isMobile ? 5 : 10,
              qrbox: function(viewfinderWidth, viewfinderHeight) {
                const minEdgePercentage = 0.7;
                const qrboxSize = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * minEdgePercentage);
                return {
                  width: qrboxSize,
                  height: Math.floor(qrboxSize * 0.6)
                };
              },
              supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
              formatsToSupport: [
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.QR_CODE
              ],
              aspectRatio: isMobile ? 1.0 : 1.777778,
              disableFlip: false,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
              showZoomSliderIfSupported: true,
              defaultZoomValueIfSupported: 1,
            },
            false
          );
          
          await scanner.render(onScanSuccess, onScanFailure);
          scannerRef.current = scanner;
          setIsScannerReady(true);
        } catch (error) {
          console.error('Error resetting scanner:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Provide more specific error messages
          let friendlyMessage = errorMessage;
          if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
            friendlyMessage = 'Camera permission denied. Please allow camera access and refresh the page.';
          } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera')) {
            friendlyMessage = 'No camera found. Please connect a camera or try a different device.';
          } else if (errorMessage.includes('NotReadableError')) {
            friendlyMessage = 'Camera is already in use by another application. Please close other apps and try again.';
          } else if (errorMessage.includes('OverconstrainedError')) {
            friendlyMessage = 'Camera configuration not supported. Please try a different device or browser.';
          }
          
          setCameraError(friendlyMessage);
        }
      }
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-[9999] cursor-pointer p-4 overflow-y-auto pt-8 pb-8" 
      data-testid="modal-barcode-scanner"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-lg cursor-default bg-card border-border shadow-xl my-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            🔮 Mystical Barcode Scanner
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-white/30 text-white hover:bg-white/20"
              data-testid="button-reset-scanner"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-white/30 text-white hover:bg-white/20"
              data-testid="button-close-scanner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {cameraError ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4 font-medium" data-testid="text-camera-error">
                ⚠️ {cameraError}
              </div>
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                data-testid="button-retry-camera"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="text-center mb-4">
                <p className="text-foreground text-sm mb-2" data-testid="text-scanner-instructions">
                  🔮 Point your camera at a barcode. The cosmic scanner will automatically detect and analyze the mystical signature.
                </p>
              </div>
              
              <div 
                id="barcode-scanner-container" 
                className="w-full min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                data-testid="container-barcode-scanner"
              />

              {!isScannerReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-foreground font-medium" data-testid="text-scanner-loading">
                      🔮 Initializing cosmic scanner...
                    </p>
                    <p className="text-muted-foreground text-xs mt-2" data-testid="text-permission-hint">
                      Your browser may ask for camera permissions
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}