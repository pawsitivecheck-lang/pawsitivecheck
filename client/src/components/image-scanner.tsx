import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, Search } from "lucide-react";
import Webcam from "react-webcam";

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

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowCamera(false); // Hide camera after successful capture
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }, []);

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
          {!showCamera && !capturedImage && (
            <div className="text-center space-y-6">
              <p className="text-muted-foreground" data-testid="text-image-scanner-instructions">
                Capture or upload a photo of the product for safety analysis.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowCamera(true)}
                  className="h-24 flex-col"
                  data-testid="button-use-camera"
                >
                  <Camera className="h-8 w-8 mb-2" />
                  Use Camera
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-24 flex-col"
                  data-testid="button-upload-image"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  Upload Image
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
              <div className="mb-4 rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: { ideal: "environment" }, // Prefer rear camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  }}
                  className="w-full h-64 object-cover"
                  data-testid="webcam-image-capture"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={capture}
                  className=""
                  data-testid="button-capture-image"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Image
                </Button>
                
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="outline"
                  data-testid="button-cancel-camera"
                >
                  Close Camera
                </Button>
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