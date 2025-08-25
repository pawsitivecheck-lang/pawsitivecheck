import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { ImageScanner } from "@/components/image-scanner";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Camera, Scan, Image, Globe, Loader2, X, Clock } from "lucide-react";
import type { Product } from "@shared/schema";

interface HeaderSearchProps {
  isMobile?: boolean;
}

export default function HeaderSearch({ isMobile = false }: HeaderSearchProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showImageScanner, setShowImageScanner] = useState(false);
  const [showScannerMenu, setShowScannerMenu] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!query.trim()) return [];
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    },
    onSuccess: (results: Product[]) => {
      setSearchResults(results);
      setShowResults(true);
      setSelectedIndex(-1);
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Unable to search product database",
        variant: "destructive",
      });
      setSearchResults([]);
      setShowResults(false);
    },
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pawsitivecheck-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Debounced search as user types - faster for autofill
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchMutation.mutate(query.trim());
      } else {
        setSearchResults([]);
        setShowResults(query.length > 0); // Show recent searches for short queries
      }
    }, 150); // Faster response for better autofill UX
  }, [searchMutation]);

  // Handle input changes with real-time search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);
    
    if (value.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    } else {
      debouncedSearch(value);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    saveRecentSearch(searchQuery.trim());
    
    // Navigate to database with search
    setLocation(`/database?search=${encodeURIComponent(searchQuery.trim())}`);
    clearSearch();
  };

  const saveRecentSearch = (query: string) => {
    const recent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('pawsitivecheck-recent-searches', JSON.stringify(recent));
  };

  // Get the best autofill suggestion
  const getAutofillSuggestion = useCallback(() => {
    if (!searchQuery || searchQuery.length < 2) return '';
    
    // Try to find a product name that starts with the search query
    const suggestion = searchResults.find(product => 
      product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    
    if (suggestion) {
      return suggestion.name;
    }
    
    // Try to find a recent search that starts with the query
    const recentSuggestion = recentSearches.find(search => 
      search.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    
    return recentSuggestion || '';
  }, [searchQuery, searchResults, recentSearches]);

  // Handle keyboard navigation and autofill
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allOptions = [...(searchQuery.length < 2 ? recentSearches : []), ...searchResults.map(p => p.name)];
    
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (showResults) {
          // Tab completion - autofill with the best suggestion
          const suggestion = getAutofillSuggestion();
          if (suggestion && suggestion !== searchQuery) {
            setSearchQuery(suggestion);
            debouncedSearch(suggestion);
            setSelectedIndex(0); // Select first result after autofill
          } else if (selectedIndex >= 0 && selectedIndex < allOptions.length) {
            // If no suggestion, use selected item
            const selectedOption = allOptions[selectedIndex];
            setSearchQuery(selectedOption);
            debouncedSearch(selectedOption);
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!showResults && searchQuery.length > 0) {
          setShowResults(true);
        }
        setSelectedIndex(prev => (prev + 1) % Math.max(allOptions.length, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!showResults && searchQuery.length > 0) {
          setShowResults(true);
        }
        setSelectedIndex(prev => prev <= 0 ? Math.max(allOptions.length - 1, 0) : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (showResults && selectedIndex >= 0 && selectedIndex < allOptions.length) {
          if (selectedIndex < recentSearches.length && searchQuery.length < 2) {
            // Recent search selected
            const selectedSearch = recentSearches[selectedIndex];
            setSearchQuery(selectedSearch);
            saveRecentSearch(selectedSearch);
            setLocation(`/database?search=${encodeURIComponent(selectedSearch)}`);
            clearSearch();
          } else {
            // Product selected
            const productIndex = searchQuery.length < 2 ? selectedIndex : selectedIndex - (searchQuery.length < 2 ? recentSearches.length : 0);
            if (searchResults[productIndex]) {
              selectProduct(searchResults[productIndex]);
            }
          }
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        if (showResults) {
          setShowResults(false);
          setSelectedIndex(-1);
        } else {
          inputRef.current?.blur();
        }
        break;
    }
  };


  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const selectProduct = (product: Product) => {
    saveRecentSearch(product.name);
    setShowResults(false);
    clearSearch();
    // Navigate to database with product search
    setLocation(`/database?search=${encodeURIComponent(product.name)}`);
  };

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
            ? "Found in product database" 
            : "Discovered through internet search",
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "Product not found in our database",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan product barcode",
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
          description: "Product successfully identified from image",
        });
      } else {
        toast({
          title: "Product Not Recognized",
          description: "Unable to identify product from image",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Image Analysis Failed",
        description: "Unable to analyze product image",
        variant: "destructive",
      });
    },
  });

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

  const isLoading = searchMutation.isPending || scanProductMutation.isPending || imageSearchMutation.isPending;

  return (
    <>
      <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md mx-4'}`}>
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products or scan... (Press Tab to autofill)"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length > 0 && setShowResults(true)}
              onBlur={(e) => {
                // Delay hiding results to allow clicks
                setTimeout(() => {
                  const activeElement = document.activeElement;
                  const currentTarget = e.currentTarget;
                  if (!activeElement || !currentTarget || !currentTarget.contains(activeElement)) {
                    setShowResults(false);
                  }
                }, 200);
              }}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-10 pr-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-10"
              data-testid="input-header-search"
              autoComplete="off"
            />
            {searchQuery && (
              <Button
                type="button"
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-16 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                data-testid="button-clear-search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Search Button */}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-full"
              disabled={!searchQuery.trim() || isLoading}
              data-testid="button-header-search"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Scanner Menu Button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                onClick={() => setShowScannerMenu(!showScannerMenu)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-full"
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
          <div className="absolute right-0 top-12 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-2 z-50 shadow-lg">
            <div className="space-y-1">
              <Button
                onClick={() => {
                  setShowBarcodeScanner(true);
                  setShowScannerMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                data-testid="button-advanced-scanner"
              >
                <Globe className="mr-2 h-4 w-4" />
                Advanced Scanner
              </Button>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || (searchQuery.length < 2 && recentSearches.length > 0)) && (
          <div className="absolute top-12 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-1 z-40 shadow-lg max-h-80 overflow-y-auto">
            
            {/* Autofill Hint */}
            {searchQuery.length >= 2 && getAutofillSuggestion() && getAutofillSuggestion() !== searchQuery && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600/30">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded">Tab</kbd>
                  <span>to autofill: "{getAutofillSuggestion()}"</span>
                </div>
              </div>
            )}
            
            {/* Recent Searches (shown when query is short) */}
            {searchQuery.length < 2 && recentSearches.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Recent Searches</p>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={search}
                      onClick={() => {
                        setSearchQuery(search);
                        debouncedSearch(search);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      data-testid={`recent-search-${index}`}
                    >
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                {recentSearches.length > 0 && searchQuery.length < 2 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2 border-t border-gray-200 dark:border-gray-600 pt-2">Products</p>
                )}
                <div className="space-y-1">
                  {searchResults.map((product, index) => {
                    const adjustedIndex = searchQuery.length < 2 ? index + recentSearches.length : index;
                    return (
                      <div
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedIndex === adjustedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid={`search-result-${product.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate">{product.name}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{product.brand}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
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
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loading state */}
            {searchMutation.isPending && (
              <div className="p-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Searching database...</p>
              </div>
            )}

            {/* No results state */}
            {!searchMutation.isPending && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="p-4 text-center">
                <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">No products found</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Try a different search term</p>
              </div>
            )}
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