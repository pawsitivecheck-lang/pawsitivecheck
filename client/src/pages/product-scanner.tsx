import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Scan, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function ProductScanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [barcode, setBarcode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const scanProductMutation = useMutation({
    mutationFn: async (barcodeInput: string) => {
      // First try to find existing product by barcode
      try {
        const res = await fetch(`/api/products/barcode/${barcodeInput}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (error) {
        // Product not found, continue to manual entry
      }
      return null;
    },
    onSuccess: (product) => {
      if (product) {
        setScannedProduct(product);
        toast({
          title: "Product Found!",
          description: "Existing product found in cosmic database",
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "This product hasn't been analyzed yet. You can add it to our cosmic database.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan the cosmic essence of this product",
        variant: "destructive",
      });
    },
  });

  const analyzeProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest('POST', `/api/products/${productId}/analyze`);
      return await res.json();
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      toast({
        title: "Mystical Analysis Complete!",
        description: "The cosmic guardians have revealed the truth",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "The mystical forces are disrupted. Please try again.",
        variant: "destructive",
      });
    },
  });

  const recordScanMutation = useMutation({
    mutationFn: async (scanData: any) => {
      const res = await apiRequest('POST', '/api/scans', scanData);
      return await res.json();
    },
  });

  const handleScan = () => {
    if (!barcode.trim()) {
      toast({
        title: "Invalid Scan",
        description: "Please enter a valid barcode",
        variant: "destructive",
      });
      return;
    }

    scanProductMutation.mutate(barcode);
    
    // Record scan history
    recordScanMutation.mutate({
      scannedData: barcode,
      analysisResult: null,
    });
  };

  const handleAnalyze = () => {
    if (scannedProduct) {
      analyzeProductMutation.mutate(scannedProduct.id);
    }
  };

  const getCosmicClarityIcon = (clarity: string) => {
    switch (clarity) {
      case 'blessed':
        return <CheckCircle className="text-mystical-green" />;
      case 'questionable':
        return <AlertTriangle className="text-yellow-500" />;
      case 'cursed':
        return <XCircle className="text-mystical-red" />;
      default:
        return <Eye className="text-cosmic-400" />;
    }
  };

  const getCosmicClarityColor = (clarity: string) => {
    switch (clarity) {
      case 'blessed':
        return 'text-mystical-green border-mystical-green bg-mystical-green/20';
      case 'questionable':
        return 'text-yellow-500 border-yellow-500 bg-yellow-500/20';
      case 'cursed':
        return 'text-mystical-red border-mystical-red bg-mystical-red/20';
      default:
        return 'text-cosmic-400 border-cosmic-400 bg-cosmic-400/20';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-mystical-green to-starlight-500 rounded-full flex items-center justify-center mb-6 animate-glow">
              <Camera className="text-3xl text-cosmic-900" />
            </div>
            <h1 className="font-mystical text-4xl md:text-6xl font-bold text-starlight-500 mb-4" data-testid="text-scanner-title">
              Mystical Product Scanner
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-scanner-description">
              Channel the cosmic guardians to reveal the true essence of any pet product
            </p>
          </div>

          {/* Scanner Interface */}
          <Card className="cosmic-card mb-8" data-testid="card-scanner-interface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Scan className="h-5 w-5" />
                Cosmic Divination Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter product barcode or scan cosmic signature..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 bg-cosmic-900/50 border border-cosmic-600 text-cosmic-100 placeholder-cosmic-400"
                  data-testid="input-barcode"
                />
                <Button 
                  onClick={handleScan}
                  disabled={scanProductMutation.isPending}
                  className="mystical-button"
                  data-testid="button-scan"
                >
                  {scanProductMutation.isPending ? 'Scanning...' : 'Scan'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-cosmic-400 text-sm">
                  Or use your device's camera to scan a barcode directly
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-cosmic-600 text-cosmic-300"
                  data-testid="button-camera-scan"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scanned Product */}
          {scannedProduct && (
            <Card className="cosmic-card mb-8" data-testid="card-scanned-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <Eye className="h-5 w-5" />
                  Product Discovered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-cosmic-100 mb-2" data-testid="text-product-name">
                      {scannedProduct.name}
                    </h3>
                    <p className="text-cosmic-300 mb-4" data-testid="text-product-brand">
                      by {scannedProduct.brand}
                    </p>
                    
                    {scannedProduct.description && (
                      <div className="mb-4">
                        <h4 className="text-cosmic-200 font-medium mb-2">Description:</h4>
                        <p className="text-cosmic-400 text-sm" data-testid="text-product-description">
                          {scannedProduct.description}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-cosmic-200 font-medium mb-2">Ingredients:</h4>
                      <p className="text-cosmic-400 text-sm" data-testid="text-product-ingredients">
                        {scannedProduct.ingredients}
                      </p>
                    </div>

                    {scannedProduct.cosmicClarity && scannedProduct.cosmicClarity !== 'unknown' && (
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {getCosmicClarityIcon(scannedProduct.cosmicClarity)}
                          <span className="text-cosmic-200">Cosmic Clarity:</span>
                        </div>
                        <Badge className={getCosmicClarityColor(scannedProduct.cosmicClarity)} data-testid="badge-cosmic-clarity">
                          {scannedProduct.cosmicClarity.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    {scannedProduct.imageUrl ? (
                      <img 
                        src={scannedProduct.imageUrl} 
                        alt={scannedProduct.name}
                        className="w-32 h-32 object-cover rounded-lg mb-4"
                        data-testid="img-product"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-cosmic-700 rounded-lg mb-4 flex items-center justify-center" data-testid="placeholder-product-image">
                        <Camera className="text-cosmic-500" />
                      </div>
                    )}

                    <Button 
                      onClick={handleAnalyze}
                      disabled={analyzeProductMutation.isPending}
                      className="w-full mystical-button"
                      data-testid="button-analyze"
                    >
                      {analyzeProductMutation.isPending ? 'Analyzing...' : 'Perform Mystical Analysis'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="cosmic-card" data-testid="card-analysis-results">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <Eye className="h-5 w-5" />
                  Cosmic Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cosmic Score */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-cosmic-800 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="text-2xl font-bold text-starlight-500" data-testid="text-cosmic-score">
                      {analysisResult.analysis.cosmicScore}
                    </div>
                    <div className="absolute -bottom-2 text-xs text-cosmic-400">/ 100</div>
                  </div>
                  <h3 className="font-mystical text-xl text-starlight-400 mb-2">Cosmic Purity Score</h3>
                </div>

                {/* Verdicts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cosmic-800/30 rounded-xl p-6">
                    <h4 className="font-mystical text-lg text-mystical-purple mb-3" data-testid="text-aleister-verdict-title">
                      Aleister's Verdict:
                    </h4>
                    <p className="text-cosmic-200 italic" data-testid="text-aleister-verdict">
                      "{analysisResult.analysis.aleisterVerdict}"
                    </p>
                  </div>

                  <div className="bg-cosmic-800/30 rounded-xl p-6">
                    <h4 className="font-mystical text-lg text-midnight-400 mb-3" data-testid="text-severus-verdict-title">
                      Severus's Verdict:
                    </h4>
                    <p className="text-cosmic-200 italic" data-testid="text-severus-verdict">
                      "{analysisResult.analysis.severusVerdict}"
                    </p>
                  </div>
                </div>

                {/* Cosmic Clarity */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getCosmicClarityColor(analysisResult.analysis.cosmicClarity)}`}>
                    {getCosmicClarityIcon(analysisResult.analysis.cosmicClarity)}
                    <span className="font-mystical text-lg" data-testid="text-final-clarity">
                      {analysisResult.analysis.cosmicClarity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Suspicious Ingredients */}
                {analysisResult.analysis.suspiciousIngredients?.length > 0 && (
                  <div className="bg-mystical-red/10 border border-mystical-red/30 rounded-xl p-6">
                    <h4 className="font-mystical text-lg text-mystical-red mb-3" data-testid="text-suspicious-title">
                      Cursed Ingredients Detected:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.analysis.suspiciousIngredients.map((ingredient: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="destructive"
                          className="bg-mystical-red/20 text-mystical-red border-mystical-red"
                          data-testid={`badge-suspicious-${index}`}
                        >
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transparency Level */}
                <div className="flex items-center justify-between p-4 bg-cosmic-800/30 rounded-xl">
                  <span className="text-cosmic-300">Transparency Level:</span>
                  <Badge 
                    className={
                      analysisResult.analysis.transparencyLevel === 'excellent' 
                        ? 'bg-mystical-green/20 text-mystical-green border-mystical-green'
                        : analysisResult.analysis.transparencyLevel === 'good'
                        ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                        : 'bg-mystical-red/20 text-mystical-red border-mystical-red'
                    }
                    data-testid="badge-transparency"
                  >
                    {analysisResult.analysis.transparencyLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
