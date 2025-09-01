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
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
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
    }
  };

  const startOver = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" data-testid="modal-image-scanner">
      <Card className="cosmic-card w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-starlight-400">
            <Camera className="h-5 w-5" />
            Mystical Image Scanner
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-cosmic-600 text-cosmic-300"
            data-testid="button-close-image-scanner"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {!showCamera && !capturedImage && (
            <div className="text-center space-y-6">
              <p className="text-cosmic-300" data-testid="text-image-scanner-instructions">
                Capture or upload a photo of the product. The cosmic vision will analyze the mystical essence from the image.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowCamera(true)}
                  className="mystical-button h-24 flex-col"
                  data-testid="button-use-camera"
                >
                  <Camera className="h-8 w-8 mb-2" />
                  Use Camera
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-cosmic-600 text-cosmic-300 h-24 flex-col"
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
                  className="w-full h-64 object-cover"
                  data-testid="webcam-image-capture"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={capture}
                  className="mystical-button"
                  data-testid="button-capture-image"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Image
                </Button>
                
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="outline"
                  className="border-cosmic-600 text-cosmic-300"
                  data-testid="button-cancel-camera"
                >
                  Cancel
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
                  className="mystical-button"
                  data-testid="button-analyze-image"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Analyze with Cosmic Vision
                </Button>
                
                <Button
                  onClick={startOver}
                  variant="outline"
                  className="border-cosmic-600 text-cosmic-300"
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