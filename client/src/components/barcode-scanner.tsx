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

  useEffect(() => {
    if (isActive && !scannerRef.current) {
      try {
        const scanner = new Html5QrcodeScanner(
          "barcode-scanner-container",
          {
            fps: 10,
            qrbox: { width: 300, height: 200 },
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
            aspectRatio: 1.777778, // 16:9
            disableFlip: false,
          },
          false // verbose
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
        setIsScannerReady(true);
      } catch (error) {
        console.error('Error initializing scanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setCameraError(`Failed to initialize camera scanner: ${errorMessage}. Please ensure camera permissions are granted and try refreshing the page.`);
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error('Error clearing scanner:', error instanceof Error ? error.message : error);
        }
        scannerRef.current = null;
        setIsScannerReady(false);
      }
    };
  }, [isActive, onScanSuccess, onScanFailure]);

  const handleReset = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScannerReady(false);
        setCameraError("");
        
        // Re-initialize after a short delay
        setTimeout(() => {
          if (isActive) {
            const scanner = new Html5QrcodeScanner(
              "barcode-scanner-container",
              {
                fps: 10,
                qrbox: { width: 300, height: 200 },
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
              },
              false
            );
            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
            setIsScannerReady(true);
          }
        }, 500);
      } catch (error) {
        console.error('Error resetting scanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setCameraError(`Failed to reset scanner: ${errorMessage}. Please try closing and reopening the scanner.`);
      }
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="modal-barcode-scanner">
      <Card className="cosmic-card w-full max-w-lg mx-4">
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
                <p className="text-cosmic-300 text-sm" data-testid="text-scanner-instructions">
                  Point your camera at a barcode. The cosmic scanner will automatically detect and analyze the mystical signature.
                </p>
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