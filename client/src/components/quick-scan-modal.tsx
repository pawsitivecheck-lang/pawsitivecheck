import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Camera, X, AlertCircle, CheckCircle } from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";
import type { Product } from "@shared/schema";

interface QuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound?: (product: Product) => void;
}

export function QuickScanModal({ isOpen, onClose, onProductFound }: QuickScanModalProps) {
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

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
        onProductFound?.(result.product);
        toast({
          title: "Product Found!",
          description: result.source === 'local' 
            ? "Found in safety database" 
            : "Discovered through product search",
        });
        onClose();
      } else {
        toast({
          title: "Product Not Found",
          description: "This product is not in our database yet.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan this product barcode",
        variant: "destructive",
      });
    },
  });

  const requestCameraPermission = async () => {
    setPermissionRequested(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Permission granted - close stream and show scanner
      stream.getTracks().forEach(track => track.stop());
      setShowScanner(true);
      toast({
        title: "Camera Access Granted",
        description: "Point your camera at a product barcode to scan",
      });
    } catch (error) {
      toast({
        title: "Camera Permission Denied",
        description: "Please allow camera access to scan barcodes",
        variant: "destructive",
      });
      setPermissionRequested(false);
    }
  };

  const handleScanResult = (barcode: string) => {
    setShowScanner(false);
    scanProductMutation.mutate(barcode);
  };

  const handleClose = () => {
    setShowScanner(false);
    setPermissionRequested(false);
    onClose();
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowScanner(false);
      setPermissionRequested(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Scan Product Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!permissionRequested && !showScanner && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  We need access to your camera to scan product barcodes
                </p>
                <p className="text-sm text-gray-500">
                  Your camera data stays on your device and is never stored
                </p>
              </div>
              <Button 
                onClick={requestCameraPermission}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-allow-camera"
              >
                <Camera className="mr-2 h-4 w-4" />
                Allow Camera Access
              </Button>
            </div>
          )}

          {permissionRequested && !showScanner && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">Requesting camera permission...</p>
                <p className="text-sm text-gray-500">
                  Please allow camera access in your browser
                </p>
              </div>
            </div>
          )}

          {showScanner && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Point your camera at a product barcode
                </p>
              </div>
              <BarcodeScanner
                onScan={handleScanResult}
                onClose={() => setShowScanner(false)}
                isActive={true}
              />
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