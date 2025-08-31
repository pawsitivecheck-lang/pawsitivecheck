import { useRef, useEffect, useState, useCallback } from "react";
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
      // Add a small delay to ensure DOM is ready
      const initScanner = async () => {
        try {
          // Clear any existing scanner first
          const existingScanner = document.getElementById("barcode-scanner-container");
          if (existingScanner) {
            existingScanner.innerHTML = '';
          }

          const scanner = new Html5QrcodeScanner(
            "barcode-scanner-container",
            {
              fps: 10,
              qrbox: { width: 250, height: 150 },
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
              aspectRatio: 1.0,
              disableFlip: false,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
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
          setCameraError(`Camera access failed: ${errorMessage}. Please allow camera permissions and try again.`);
          setIsScannerReady(false);
        }
      };

      // Small delay to ensure the container is mounted
      setTimeout(initScanner, 100);
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
    
    // Re-initialize after a delay
    setTimeout(async () => {
      if (isActive) {
        try {
          const scanner = new Html5QrcodeScanner(
            "barcode-scanner-container",
            {
              fps: 10,
              qrbox: { width: 250, height: 150 },
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
              aspectRatio: 1.0,
              disableFlip: false,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
            },
            false
          );
          
          await scanner.render(onScanSuccess, onScanFailure);
          scannerRef.current = scanner;
          setIsScannerReady(true);
        } catch (error) {
          console.error('Error resetting scanner:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setCameraError(`Failed to reset scanner: ${errorMessage}. Please check camera permissions.`);
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer p-4 overflow-y-auto" 
      data-testid="modal-barcode-scanner"
      onClick={handleBackdropClick}
    >
      <Card className="cosmic-card w-full max-w-lg cursor-default m-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-starlight-400">
            <Camera className="h-5 w-5" />
            Mystical Barcode Scanner
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-cosmic-600 text-cosmic-300"
              data-testid="button-reset-scanner"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-cosmic-600 text-cosmic-300"
              data-testid="button-close-scanner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cameraError ? (
            <div className="text-center py-8">
              <div className="text-mystical-red mb-4" data-testid="text-camera-error">
                {cameraError}
              </div>
              <Button
                onClick={handleReset}
                className="mystical-button"
                data-testid="button-retry-camera"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                <p className="text-cosmic-300 text-sm mb-2" data-testid="text-scanner-instructions">
                  Point your camera at a barcode. The cosmic scanner will automatically detect and analyze the mystical signature.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
                  <p className="text-blue-700 dark:text-blue-300 text-xs font-medium" data-testid="text-permission-reminder">
                    📱 <strong>Important:</strong> When your browser asks for camera permission, please tap/click <strong>"Allow"</strong> or <strong>"Request Camera Permissions"</strong> to start scanning.
                  </p>
                </div>
              </div>
              
              <div 
                id="barcode-scanner-container" 
                className="w-full"
                data-testid="container-barcode-scanner"
              />

              {!isScannerReady && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-starlight-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-cosmic-400" data-testid="text-scanner-loading">
                    Initializing cosmic scanner...
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}