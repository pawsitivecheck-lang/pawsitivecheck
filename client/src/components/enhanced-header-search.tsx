import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UnifiedScannerModal } from "@/components/unified-scanner-modal";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Camera, Scan, Globe, X, Clock } from "lucide-react";
import { TRANSITION_CLASSES, staggerDelay } from "@/utils/transitions";
import { cn } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface EnhancedHeaderSearchProps {
  isMobile?: boolean;
}

export default function EnhancedHeaderSearch({ isMobile = false }: EnhancedHeaderSearchProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showScannerMenu, setShowScannerMenu] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!query.trim()) return [];
      
      // First search local database
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`);
      if (!res.ok) throw new Error('Search failed');
      const localResults = await res.json();
      
      // If no local results found, automatically search internet
      if (!localResults || localResults.length === 0) {
        try {
          const internetRes = await fetch('/api/products/internet-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'text', 
              query: query.trim()
            }),
          });
          
          if (internetRes.ok) {
            const internetResult = await internetRes.json();
            if (internetResult.product) {
              return [internetResult.product];
            }
          }
        } catch (error) {
          console.error('Internet search fallback failed:', error);
        }
      }
      
      return localResults || [];
    },
    onSuccess: (results: Product[], variables: string) => {
      const sortedProducts = (results || []).slice(0, 8);
      setSearchResults(sortedProducts);
      setShowResults(true);
      setSelectedIndex(-1);
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Unable to search products",
        variant: "destructive",
      });
      setSearchResults([]);
      setShowResults(false);
    },
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchMutation.mutate(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchMutation]);

  const handleProductSelect = useCallback((product: Product) => {
    setShowResults(false);
    setSearchQuery("");
    
    // Add to recent searches
    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    setLocation(`/product/${product.id}`);
  }, [searchQuery, recentSearches, setLocation]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Enhanced search input with smooth transitions */}
      <div className={cn(
        "relative flex items-center",
        TRANSITION_CLASSES.stateChange,
        showResults && "shadow-lg"
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            className={cn(
              "pl-10 pr-12 h-10",
              TRANSITION_CLASSES.focus,
              TRANSITION_CLASSES.colorChange,
              "focus:shadow-md"
            )}
            data-testid="input-search"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-2 top-1/2 h-6 w-6 p-0 -translate-y-1/2",
                TRANSITION_CLASSES.buttonSoft,
                TRANSITION_CLASSES.fadeIn
              )}
              onClick={clearSearch}
              data-testid="button-clear-search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Enhanced scanner button with loading state */}
        <div className="ml-2">
          <LoadingButton
            variant="outline"
            size="sm"
            className={cn(
              "h-10 px-3",
              TRANSITION_CLASSES.button
            )}
            onClick={() => setShowBarcodeScanner(true)}
            loading={showBarcodeScanner}
            data-testid="button-scanner"
          >
            <Camera className="h-4 w-4" />
          </LoadingButton>
        </div>
      </div>

      {/* Enhanced search results with staggered animations */}
      {showResults && (
        <div className={cn(
          "absolute top-full mt-1 w-full bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto",
          TRANSITION_CLASSES.slideUp
        )}>
          {searchMutation.isPending ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center p-3 rounded-md cursor-pointer",
                    TRANSITION_CLASSES.cardSoft,
                    "hover:bg-muted",
                    selectedIndex === index && "bg-muted"
                  )}
                  style={staggerDelay(index, 50)}
                  onClick={() => handleProductSelect(product)}
                  data-testid={`result-product-${product.id}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.brand}</div>
                  </div>
                  {product.cosmicScore && (
                    <Badge variant="secondary" className="ml-2">
                      {Math.round(product.cosmicScore)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-2">No products found</div>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", TRANSITION_CLASSES.buttonSoft)}
                onClick={() => {
                  // Trigger internet search
                  if (searchQuery.trim()) {
                    searchMutation.mutate(searchQuery);
                  }
                }}
                data-testid="button-search-internet"
              >
                <Globe className="h-3 w-3" />
                Search Internet
              </Button>
            </div>
          )}

          {/* Recent searches section with enhanced styling */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="border-t border-border p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">Recent Searches</div>
              {recentSearches.slice(0, 3).map((search, index) => (
                <div
                  key={search}
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer",
                    TRANSITION_CLASSES.cardSoft,
                    "hover:bg-muted"
                  )}
                  style={staggerDelay(index, 30)}
                  onClick={() => {
                    setSearchQuery(search);
                    searchMutation.mutate(search);
                  }}
                  data-testid={`recent-search-${index}`}
                >
                  <Clock className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-sm">{search}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced scanner modal */}
      <UnifiedScannerModal
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        mode="search"
        onProductFound={handleProductSelect}
      />
    </div>
  );
}