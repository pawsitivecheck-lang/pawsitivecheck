import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Camera, Scan, Image, Globe, Loader2, X } from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { ImageScanner } from "@/components/image-scanner";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";

interface HeaderSearchProps {
  isMobile?: boolean;
}

export default function HeaderSearch({ isMobile = false }: HeaderSearchProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showImageScanner, setShowImageScanner] = useState(false);
  const [showScannerMenu, setShowScannerMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!query.trim()) return [];
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    },
    onSuccess: (results: Product[]) => {
      setSearchResults(results);
      setShowResults(results.length > 0);
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Unable to search cosmic database",
        variant: "destructive",
      });
      setSearchResults([]);
      setShowResults(false);
    },
  });

  const scanProductMutation = useMutation({
    mutationFn: async (barcodeInput: string) => {
      try {
        // First try to find existing product by barcode
        const localRes = await fetch(`/api/products/barcode/${barcodeInput}`);
        if (localRes.ok) {
          const product = await localRes.json();
          return { source: 'local', product };
        }
        
        // If not found locally, search the internet
        const internetRes = await apiRequest('POST', '/api/products/internet-search', {
          type: 'barcode',
          query: barcodeInput
        });
        
        if (internetRes.ok) {
          const result = await internetRes.json();
          return result;
        }
        
        return null;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (result) => {
      if (result?.product) {
        // Navigate to scanner page with product
        setLocation('/scan');
        toast({
          title: `Product Found!`,
          description: result.source === 'local' 
            ? "Found in cosmic database" 
            : "Discovered through internet divination",
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "This product remains hidden from cosmic sight",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan the cosmic essence",
        variant: "destructive",
      });
    },
  });

  const imageSearchMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const res = await apiRequest('POST', '/api/products/internet-search', {
        type: 'image',
        query: imageData
      });
      
      if (res.ok) {
        const result = await res.json();
        return result;
      }
      
      return null;
    },
    onSuccess: (result) => {
      if (result?.product) {
        setLocation('/scan');
        toast({
          title: "Product Identified!",
          description: "Cosmic vision has revealed the product's identity",
        });
      } else {
        toast({
          title: "Product Not Recognized",
          description: "The cosmic vision cannot identify this product",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Image Analysis Failed",
        description: "Unable to analyze the mystical essence",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    searchMutation.mutate(searchQuery.trim());
  };

  const handleBarcodeScanned = (barcode: string) => {
    setShowBarcodeScanner(false);
    setShowScannerMenu(false);
    scanProductMutation.mutate(barcode);
  };

  const handleImageScanned = (imageData: string) => {
    setShowImageScanner(false);
    setShowScannerMenu(false);
    imageSearchMutation.mutate(imageData);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const selectProduct = (product: Product) => {
    setShowResults(false);
    clearSearch();
    // Navigate to scanner with selected product
    setLocation('/scan');
  };

  const isLoading = searchMutation.isPending || scanProductMutation.isPending || imageSearchMutation.isPending;

  return (
    <>
      <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md mx-4'}`}>
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products or scan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cosmic-900/50 border border-cosmic-600 rounded-full px-10 pr-16 text-cosmic-100 placeholder-cosmic-400 focus:border-starlight-500 h-10"
              data-testid="input-header-search"
            />
            {searchQuery && (
              <Button
                type="button"
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-cosmic-400 hover:text-cosmic-200"
                data-testid="button-clear-search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Scanner Menu Button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                onClick={() => setShowScannerMenu(!showScannerMenu)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-starlight-500 hover:text-starlight-400 hover:bg-starlight-500/10 rounded-full"
                disabled={isLoading}
                data-testid="button-scanner-menu"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Scanner Menu Dropdown */}
        {showScannerMenu && (
          <div className="absolute right-0 top-12 w-48 bg-cosmic-800/95 backdrop-blur-md border border-cosmic-600 rounded-lg p-2 z-50 shadow-lg">
            <div className="space-y-1">
              <Button
                onClick={() => {
                  setShowBarcodeScanner(true);
                  setShowScannerMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-700"
                data-testid="button-barcode-scanner"
              >
                <Scan className="mr-2 h-4 w-4" />
                Barcode Scanner
              </Button>
              <Button
                onClick={() => {
                  setShowImageScanner(true);
                  setShowScannerMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-700"
                data-testid="button-image-scanner"
              >
                <Image className="mr-2 h-4 w-4" />
                Image Scanner
              </Button>
              <Button
                onClick={() => {
                  setLocation('/scan');
                  setShowScannerMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-700"
                data-testid="button-advanced-scanner"
              >
                <Globe className="mr-2 h-4 w-4" />
                Advanced Scanner
              </Button>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-cosmic-800/95 backdrop-blur-md border border-cosmic-600 rounded-lg p-2 z-40 shadow-lg max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-cosmic-700 transition-colors"
                  data-testid={`search-result-${product.id}`}
                >
                  <div className="flex-1">
                    <p className="text-cosmic-100 text-sm font-medium">{product.name}</p>
                    <p className="text-cosmic-400 text-xs">{product.brand}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.cosmicScore && (
                      <Badge
                        variant={product.cosmicScore >= 70 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {product.cosmicScore}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scanner Modals */}
      <BarcodeScanner
        isActive={showBarcodeScanner}
        onScan={handleBarcodeScanned}
        onClose={() => setShowBarcodeScanner(false)}
      />
      
      <ImageScanner
        isActive={showImageScanner}
        onScan={handleImageScanned}
        onClose={() => setShowImageScanner(false)}
      />
    </>
  );
}