import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, X, Search, AlertCircle, RefreshCw } from "lucide-react";
import Webcam from "react-webcam";
import { requestCameraPermission, getErrorGuidance, getDeviceInfo, checkScannerCapabilities } from "@/utils/camera-utils";

interface ImageScannerProps {
  onScan: (imageData: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export function ImageScanner({ onScan, onClose, isActive }: ImageScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [scannerCapabilities, setScannerCapabilities] = useState<any>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [deviceInfo] = useState(getDeviceInfo());

  // Check scanner capabilities on mount
  useEffect(() => {
    if (isActive) {
      checkScannerCapabilities().then(setScannerCapabilities);
    }
  }, [isActive]);

  const requestPermissionAndStartCamera = useCallback(async () => {
    setIsRequestingPermission(true);
    setCameraError("");
    setErrorType("");
    
    try {
      const result = await requestCameraPermission();
      
      if (result.granted) {
        setCameraPermissionGranted(true);
        setShowCamera(true);
      } else {
        setCameraError(result.message || "Camera permission denied");
        setErrorType(result.errorType || "PermissionError");
        setCameraPermissionGranted(false);
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setCameraError("Failed to request camera permission");
      setErrorType("InitializationError");
    } finally {
      setIsRequestingPermission(false);
    }
  }, []);

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowCamera(false); // Hide camera after successful capture
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setCameraError("Failed to capture image. Please try again or use file upload.");
      setErrorType("CaptureError");
    }
  }, []);

  const handleCameraError = useCallback((error: any) => {
    console.error('Camera error:', error);
    setCameraError("Camera failed to load. Please try file upload instead.");
    setErrorType("CameraLoadError");
    setShowCamera(false);
  }, []);

  const retryCamera = useCallback(() => {
    setCameraError("");
    setErrorType("");
    requestPermissionAndStartCamera();
  }, [requestPermissionAndStartCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCapturedImage(result);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeCapturedImage = () => {
    if (capturedImage) {
      onScan(capturedImage);
      onClose(); // Close modal after successful analysis
    }
  };

  const startOver = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="modal-image-scanner">
      <Card className="w-full max-w-2xl mx-4 bg-card border-border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Product Image Scanner
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className=""
            data-testid="button-close-image-scanner"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close scanner</span>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Error Display */}
          {cameraError && (
            <Alert className="mb-4" data-testid="alert-camera-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">{getErrorGuidance(errorType).title}</p>
                  <p className="text-sm">{cameraError}</p>
                  {errorType === 'NotReadableError' || errorType === 'NotAllowedError' ? (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={retryCamera}
                        data-testid="button-retry-camera"
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Try Again
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-fallback-upload"
                      >
                        <Upload className="mr-2 h-3 w-3" />
                        Upload Image
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-upload-fallback"
                    >
                      <Upload className="mr-2 h-3 w-3" />
                      Upload Image Instead
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!showCamera && !capturedImage && (
            <div className="text-center space-y-6">
              <p className="text-muted-foreground" data-testid="text-image-scanner-instructions">
                Capture or upload a photo of the product for safety analysis.
              </p>
              
              {/* Scanner Capabilities Info */}
              {scannerCapabilities && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <p>
                    📷 Camera: {scannerCapabilities.hasCamera ? 'Available' : 'Not detected'} |
                    📱 Device: {deviceInfo.isMobile ? 'Mobile' : 'Desktop'} |
                    🌐 Browser: {deviceInfo.isChrome ? 'Chrome' : deviceInfo.isSafari ? 'Safari' : deviceInfo.isFirefox ? 'Firefox' : 'Other'}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={requestPermissionAndStartCamera}
                  disabled={isRequestingPermission || (!scannerCapabilities?.hasCamera && scannerCapabilities !== null)}
                  className="h-24 flex-col"
                  data-testid="button-use-camera"
                >
                  {isRequestingPermission ? (
                    <RefreshCw className="h-8 w-8 mb-2 animate-spin" />
                  ) : (
                    <Camera className="h-8 w-8 mb-2" />
                  )}
                  {isRequestingPermission ? 'Requesting Access...' : 'Use Camera'}
                  {!scannerCapabilities?.hasCamera && scannerCapabilities !== null && (
                    <span className="text-xs opacity-70 mt-1">(Camera not available)</span>
                  )}
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-24 flex-col"
                  data-testid="button-upload-image"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  Upload Image
                  <span className="text-xs opacity-70 mt-1">Recommended fallback</span>
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-image-upload"
              />
            </div>
          )}

          {showCamera && !capturedImage && (
            <div className="text-center">
              <div className="mb-4 rounded-lg overflow-hidden relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  onUserMediaError={handleCameraError}
                  videoConstraints={(() => {
                    // Use enhanced device detection for better constraints
                    return deviceInfo.isMobile ? {
                      facingMode: { ideal: "environment" }, // More flexible constraint for mobile
                      width: { ideal: 640, max: 1280 },
                      height: { ideal: 480, max: 720 },
                      frameRate: { ideal: 15, max: 30 }
                    } : {
                      facingMode: { ideal: "environment" },
                      width: { ideal: 1280, max: 1920 },
                      height: { ideal: 720, max: 1080 },
                      frameRate: { ideal: 30 }
                    };
                  })()}
                  className="w-full h-64 object-cover"
                  data-testid="webcam-image-capture"
                />
                
                {/* Camera overlay guidance */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-white/70 rounded-lg w-48 h-32 flex items-center justify-center">
                    <span className="text-white/90 text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      Position product here
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={capture}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-capture-image"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Image
                </Button>
                
                <Button
                  onClick={() => {
                    setShowCamera(false);
                    setCameraError("");
                    setErrorType("");
                  }}
                  variant="outline"
                  data-testid="button-cancel-camera"
                >
                  Close Camera
                </Button>
              </div>
              
              {/* Camera tips */}
              <div className="mt-4 text-xs text-muted-foreground">
                <p>💡 Tips: Ensure good lighting, hold device steady, and position product clearly in frame</p>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={capturedImage} 
                  alt="Captured product" 
                  className="w-full max-h-80 object-contain rounded-lg"
                  data-testid="img-captured-product"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={analyzeCapturedImage}
                  className=""
                  data-testid="button-analyze-image"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Product Image
                </Button>
                
                <Button
                  onClick={startOver}
                  variant="outline"
                  data-testid="button-retake-image"
                >
                  Take Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}