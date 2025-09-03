import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UnifiedScannerModal } from "@/components/unified-scanner-modal";
import { ImageScanner } from "@/components/image-scanner";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Camera, Scan, Image, Globe, Loader2, X, Clock, Sparkles, Brain } from "lucide-react";
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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiContext, setAiContext] = useState<any>(null);
  const [showAiContext, setShowAiContext] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const suggestionsDebounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!query.trim()) return { products: [], aiContext: null };
      
      // Enhanced search with AI capabilities
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`);
      if (!res.ok) throw new Error('Search failed');
      const searchResponse = await res.json();
      
      // Handle both legacy and AI-enhanced response formats
      if (Array.isArray(searchResponse)) {
        // Legacy format - just products array
        return { products: searchResponse, aiContext: null };
      } else if (searchResponse.products) {
        // AI-enhanced format - products and AI context
        return {
          products: searchResponse.products || [],
          aiContext: searchResponse.aiContext || null
        };
      }
      
      // If no local results found, automatically search internet
      if (!searchResponse.products || searchResponse.products.length === 0) {
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
              return { products: [internetResult.product], aiContext: null };
            }
          }
        } catch (error) {
          console.error('Internet search fallback failed:', error);
        }
      }
      
      return { products: searchResponse.products || [], aiContext: searchResponse.aiContext || null };
    },
    onSuccess: (result: { products: Product[], aiContext: any }, variables: string) => {
      const { products, aiContext } = result;
      
      // Store AI context for display
      setAiContext(aiContext);
      setShowAiContext(!!aiContext);
      
      // Sort results by relevance - if AI ranking was applied, trust it; otherwise use local scoring
      let sortedProducts = products || [];
      
      if (!aiContext || !aiContext.expandedQuery) {
        // No AI enhancement, use local advanced scoring
        const scoredResults = sortedProducts.map(product => ({
          product,
          score: calculateAdvancedScore(variables, product.name, product.brand)
        }));
        
        sortedProducts = scoredResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 8)
          .map(item => item.product);
      } else {
        // AI already ranked results, just limit to top 8
        sortedProducts = sortedProducts.slice(0, 8);
      }
      
      setSearchResults(sortedProducts);
      setShowResults(true);
      setSelectedIndex(-1);
      
      // Show success message if AI enhanced the search
      if (aiContext && aiContext.expandedQuery !== variables) {
        toast({
          title: "AI Enhanced Search",
          description: `Found results using: "${aiContext.expandedQuery}"`,
          duration: 3000,
        });
      }
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
        setLocation('/product-scanner');
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
        setLocation('/product-scanner');
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

  // AI-powered search suggestions query
  const fetchAiSuggestions = useCallback(
    async (query: string): Promise<string[]> => {
      if (!query.trim() || query.length < 2) return [];
      
      try {
        const res = await fetch(`/api/products/suggestions?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const suggestions = await res.json();
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
      } catch (error) {
        console.error('AI suggestions failed:', error);
        return [];
      }
    },
    []
  );

  // Debounced AI suggestions
  const debouncedFetchSuggestions = useCallback((query: string) => {
    if (suggestionsDebounceRef.current) {
      clearTimeout(suggestionsDebounceRef.current);
    }
    
    suggestionsDebounceRef.current = setTimeout(async () => {
      const suggestions = await fetchAiSuggestions(query);
      setAiSuggestions(suggestions);
    }, 200); // Slightly slower than search for better UX
  }, [fetchAiSuggestions]);

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

  // Advanced fuzzy matching utilities
  const calculateLevenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j += 1) matrix[j][0] = j;
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    return matrix[str2.length][str1.length];
  };

  const calculateJaroSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    const len1 = str1.length;
    const len2 = str2.length;
    if (len1 === 0 || len2 === 0) return 0;
    
    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    const str1Matches = new Array(len1).fill(false);
    const str2Matches = new Array(len2).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // Identify matches
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (str2Matches[j] || str1[i] !== str2[j]) continue;
        str1Matches[i] = str2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0;
    
    // Count transpositions
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    
    return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  };

  const calculateJaroWinklerSimilarity = (str1: string, str2: string): number => {
    const jaro = calculateJaroSimilarity(str1, str2);
    if (jaro < 0.7) return jaro;
    
    let prefix = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }
    
    return jaro + (0.1 * prefix * (1 - jaro));
  };

  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  };

  const generateNGrams = (str: string, n: number): string[] => {
    const normalized = normalizeString(str);
    const ngrams = [];
    for (let i = 0; i <= normalized.length - n; i++) {
      ngrams.push(normalized.slice(i, i + n));
    }
    return ngrams;
  };

  const calculateAdvancedScore = (query: string, candidate: string, candidateBrand?: string): number => {
    const normalizedQuery = normalizeString(query);
    const normalizedCandidate = normalizeString(candidate);
    const normalizedBrand = candidateBrand ? normalizeString(candidateBrand) : '';
    
    let score = 0;
    const weights = {
      exactStart: 120,
      jaroWinkler: 50,
      levenshtein: 35,
      ngram: 25,
      brandMatch: 20,
      contains: 15,
      length: 8
    };
    
    // Exact start match (highest priority)
    if (normalizedCandidate.startsWith(normalizedQuery)) {
      score += weights.exactStart;
      // Extra bonus for exact start matches
      if (normalizedQuery.length >= 3) {
        score += 20;
      }
    }
    
    // Jaro-Winkler similarity (handles transpositions well)
    const jaroWinkler = calculateJaroWinklerSimilarity(normalizedQuery, normalizedCandidate);
    score += jaroWinkler * weights.jaroWinkler;
    
    // Levenshtein distance (typo tolerance)
    const maxLen = Math.max(normalizedQuery.length, normalizedCandidate.length);
    const levenshtein = calculateLevenshteinDistance(normalizedQuery, normalizedCandidate);
    const levenshteinScore = maxLen > 0 ? (maxLen - levenshtein) / maxLen : 0;
    score += levenshteinScore * weights.levenshtein;
    
    // N-gram matching (partial word matching)
    const queryNgrams = generateNGrams(normalizedQuery, 2);
    const candidateNgrams = generateNGrams(normalizedCandidate, 2);
    const ngramMatches = queryNgrams.filter(gram => candidateNgrams.includes(gram)).length;
    const ngramScore = queryNgrams.length > 0 ? ngramMatches / queryNgrams.length : 0;
    score += ngramScore * weights.ngram;
    
    // Brand matching with improved logic
    if (normalizedBrand && normalizedQuery.length >= 2) {
      if (normalizedBrand.startsWith(normalizedQuery)) {
        score += weights.brandMatch + 10; // Extra bonus for brand start match
      } else if (normalizedBrand.includes(normalizedQuery) || normalizedQuery.includes(normalizedBrand)) {
        score += weights.brandMatch;
      }
    }
    
    // Contains match
    if (normalizedCandidate.includes(normalizedQuery)) {
      score += weights.contains;
    }
    
    // Length similarity bonus (prefer similar length matches)
    const lengthDiff = Math.abs(normalizedQuery.length - normalizedCandidate.length);
    const lengthScore = Math.max(0, 1 - lengthDiff / Math.max(normalizedQuery.length, normalizedCandidate.length));
    score += lengthScore * weights.length;
    
    return score;
  };

  // Ultra-fast debounced search with intelligent delay adjustment
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Dynamic delay based on query characteristics
    let delay = 80; // Base ultra-fast delay
    
    // Shorter delay for longer queries (user is more confident)
    if (query.length > 4) delay = 50;
    if (query.length > 8) delay = 30;
    
    // Optimized delays for better responsiveness
    if (query.length <= 1) delay = 300;
    if (query.length === 2) delay = 180;
    
    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 1) { // Start searching from 1 character
        searchMutation.mutate(query.trim());
      } else {
        setSearchResults([]);
        setShowResults(query.length > 0);
      }
    }, delay);
  }, [searchMutation]);

  // Handle input changes with ultra-responsive real-time search and AI suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);
    
    if (value.length === 0) {
      setSearchResults([]);
      setAiSuggestions([]);
      setAiContext(null);
      setShowAiContext(false);
      setShowResults(false);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (suggestionsDebounceRef.current) {
        clearTimeout(suggestionsDebounceRef.current);
      }
    } else {
      // Show dropdown immediately for better responsiveness
      setShowResults(true);
      
      // Trigger AI suggestions for queries 2+ characters
      if (value.length >= 2) {
        debouncedFetchSuggestions(value);
      } else {
        setAiSuggestions([]);
      }
      
      // For short queries, prioritize recent searches and faster feedback
      if (value.length <= 2 && recentSearches.length > 0) {
        const filteredRecent = recentSearches.filter(search => 
          normalizeString(search).startsWith(normalizeString(value))
        );
        if (filteredRecent.length > 0) {
          // Show recent matches immediately while triggering background search
          debouncedSearch(value);
          return;
        }
      }
      
      // Clear previous results and search
      setSearchResults([]);
      setAiContext(null);
      setShowAiContext(false);
      debouncedSearch(value);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    saveRecentSearch(searchQuery.trim());
    
    // Navigate to database with search
    setLocation(`/product-database?search=${encodeURIComponent(searchQuery.trim())}`);
    clearSearch();
  };

  const saveRecentSearch = (query: string) => {
    const recent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('pawsitivecheck-recent-searches', JSON.stringify(recent));
  };

  // Advanced autofill suggestion with fuzzy matching and error tolerance
  const getAutofillSuggestion = useCallback(() => {
    if (!searchQuery || searchQuery.length < 1) return '';
    
    const query = searchQuery.trim();
    const normalizedQuery = normalizeString(query);
    
    // Combine all possible suggestions with advanced scoring
    const candidates: Array<{text: string, score: number, source: 'product' | 'recent' | 'brand' | 'ai'}> = [];
    
    // Score product names
    searchResults.forEach(product => {
      if (product.name.toLowerCase() !== normalizedQuery) {
        const score = calculateAdvancedScore(query, product.name, product.brand);
        candidates.push({
          text: product.name,
          score: score,
          source: 'product'
        });
        
        // Also consider brand matches if they're good
        if (product.brand && product.brand.toLowerCase() !== normalizedQuery) {
          const brandScore = calculateAdvancedScore(query, product.brand) * 0.7; // Slightly lower weight
          if (brandScore > 50) { // Only if it's a good match
            candidates.push({
              text: product.brand,
              score: brandScore,
              source: 'brand'
            });
          }
        }
      }
    });
    
    // Score recent searches with recency boost
    recentSearches.forEach((search, index) => {
      if (search.toLowerCase() !== normalizedQuery) {
        const baseScore = calculateAdvancedScore(query, search);
        // Enhanced recency boost for better user experience
        const recencyBoost = (recentSearches.length - index) * 8;
        candidates.push({
          text: search,
          score: baseScore + recencyBoost,
          source: 'recent'
        });
      }
    });
    
    // Add AI suggestions with high priority scoring
    aiSuggestions.forEach((suggestion) => {
      if (suggestion.toLowerCase() !== normalizedQuery) {
        const baseScore = calculateAdvancedScore(query, suggestion);
        // AI suggestions get a significant boost since they're contextually relevant
        const aiBoost = 40;
        candidates.push({
          text: suggestion,
          score: baseScore + aiBoost,
          source: 'ai'
        });
      }
    });
    
    // Sort by score and return the best match
    candidates.sort((a, b) => b.score - a.score);
    
    // Only return suggestions that meet a minimum quality threshold
    const bestCandidate = candidates[0];
    const minThreshold = query.length <= 1 ? 100 : query.length <= 2 ? 70 : query.length <= 3 ? 50 : query.length <= 4 ? 40 : 30;
    
    if (bestCandidate && bestCandidate.score >= minThreshold) {
      // For very short queries, only suggest if it's an exact start match or very high score
      if (query.length <= 1 && bestCandidate.score < 120) {
        return '';
      }
      if (query.length <= 2 && !normalizeString(bestCandidate.text).startsWith(normalizedQuery) && bestCandidate.score < 90) {
        return '';
      }
      return bestCandidate.text;
    }
    
    return '';
  }, [searchQuery, searchResults, recentSearches]);

  // Handle keyboard navigation and autofill
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allOptions = [
      ...(searchQuery.length === 0 ? recentSearches : []),
      ...(searchQuery.length >= 2 ? aiSuggestions : []),
      ...searchResults.map(p => p.name)
    ];
    
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allOptions.length) {
          const selectedOption = allOptions[selectedIndex];
          const recentCount = searchQuery.length === 0 ? recentSearches.length : 0;
          const aiSuggestionsCount = searchQuery.length >= 2 ? aiSuggestions.length : 0;
          
          if (selectedIndex < recentCount) {
            // Recent search selected
            setSearchQuery(selectedOption);
            saveRecentSearch(selectedOption);
            setLocation(`/product-database?search=${encodeURIComponent(selectedOption)}`);
            clearSearch();
          } else if (selectedIndex < recentCount + aiSuggestionsCount) {
            // AI suggestion selected
            setSearchQuery(selectedOption);
            saveRecentSearch(selectedOption);
            setLocation(`/product-database?search=${encodeURIComponent(selectedOption)}`);
            clearSearch();
          } else {
            // Product selected
            const productIndex = selectedIndex - recentCount - aiSuggestionsCount;
            const product = searchResults[productIndex];
            if (product) {
              selectProduct(product);
            }
          }
        } else {
          // No option selected, search current query
          handleSearch(e);
        }
        break;
      case 'Tab':
        e.preventDefault();
        // Advanced tab completion with fuzzy matching
        const suggestion = getAutofillSuggestion();
        if (suggestion && suggestion !== searchQuery) {
          // Calculate how much of the suggestion to auto-complete
          const query = normalizeString(searchQuery);
          const normalizedSuggestion = normalizeString(suggestion);
          
          // If it's a fuzzy match, complete the whole thing
          // If it's a prefix match, just complete the common part
          if (normalizedSuggestion.startsWith(query)) {
            // Prefix match - complete with original casing
            setSearchQuery(suggestion);
          } else {
            // Fuzzy match - complete the whole suggestion
            setSearchQuery(suggestion);
          }
          
          debouncedSearch(suggestion);
          setShowResults(true);
          
          // Select the matching result
          const matchingIndex = searchResults.findIndex(p => 
            normalizeString(p.name) === normalizedSuggestion ||
            calculateAdvancedScore(suggestion, p.name, p.brand) > 80
          );
          if (matchingIndex >= 0) {
            setSelectedIndex(searchQuery.length === 0 ? matchingIndex + recentSearches.length : matchingIndex);
          }
        } else if (selectedIndex >= 0 && selectedIndex < allOptions.length) {
          // Fallback to selected item
          const selectedOption = allOptions[selectedIndex];
          setSearchQuery(selectedOption);
          debouncedSearch(selectedOption);
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
    setLocation(`/product-database?search=${encodeURIComponent(product.name)}`);
  };




  const handleBarcodeScanned = () => {
    setShowBarcodeScanner(false);
    setShowScannerMenu(false);
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="AI-powered search... (Tab to autofill, get smart suggestions)"
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
              className="w-full bg-background border border-border rounded-full px-10 pr-24 text-foreground placeholder-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-10"
              data-testid="input-header-search"
              autoComplete="off"
            />
            {searchQuery && (
              <Button
                type="button"
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-20 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
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
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-full"
              disabled={!searchQuery.trim() || isLoading}
              data-testid="button-header-search"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Scanner Menu Button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                onClick={() => {
                  setShowScannerMenu(!showScannerMenu);
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-full border border-blue-500/20"
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
          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-2 z-[60] shadow-xl">
            <div className="space-y-1">
              <Button
                onClick={() => {
                  setShowBarcodeScanner(true);
                  setShowScannerMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-popover-foreground hover:text-blue-400 hover:bg-accent"
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
                className="w-full justify-start text-popover-foreground hover:text-blue-400 hover:bg-accent"
                data-testid="button-image-scanner"
              >
                <Image className="mr-2 h-4 w-4" />
                Image Scanner
              </Button>
            </div>
          </div>
        )}


        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || (searchQuery.length === 0 && recentSearches.length > 0)) && (
          <div className="absolute top-12 left-0 right-0 bg-popover border border-border rounded-lg p-1 z-[60] shadow-lg max-h-80 overflow-y-auto">
            
            {/* Autofill Hint */}
            {searchQuery.length >= 1 && getAutofillSuggestion() && getAutofillSuggestion() !== searchQuery && (
              <div className="p-2 border-b border-border/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-accent/50 border border-border rounded text-accent-foreground">Tab</kbd>
                  <span>to autofill: </span>
                  <span 
                    className="text-blue-300 font-mono cursor-pointer hover:text-blue-200 underline"
                    onClick={() => {
                      const suggestion = getAutofillSuggestion();
                      if (suggestion) {
                        setSearchQuery(suggestion);
                        saveRecentSearch(suggestion);
                        setLocation(`/product-database?search=${encodeURIComponent(suggestion)}`);
                        clearSearch();
                      }
                    }}
                    data-testid="autofill-suggestion-click"
                  >
                    "{getAutofillSuggestion()}"
                  </span>
                </div>
              </div>
            )}

            {/* AI Context Information */}
            {showAiContext && aiContext && (
              <div className="p-2 border-b border-border/30">
                <div className="flex items-center gap-2 text-xs text-blue-300 mb-1">
                  <Brain className="h-3 w-3" />
                  <span>AI Enhanced Search</span>
                </div>
                {aiContext.expandedQuery && aiContext.expandedQuery !== searchQuery && (
                  <div className="text-xs text-muted-foreground">
                    <span>Enhanced to: </span>
                    <span className="text-blue-300 font-mono">"{aiContext.expandedQuery}"</span>
                  </div>
                )}
                {aiContext.context && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {aiContext.context}
                  </div>
                )}
              </div>
            )}

            {/* AI Smart Suggestions */}
            {aiSuggestions.length > 0 && searchQuery.length >= 2 && (
              <div className="p-2 border-b border-border/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                  <span>AI Suggestions</span>
                </div>
                <div className="space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        saveRecentSearch(suggestion);
                        setLocation(`/product-database?search=${encodeURIComponent(suggestion)}`);
                        clearSearch();
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 group"
                      data-testid={`ai-suggestion-${index}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:from-yellow-300 group-hover:to-orange-300" />
                      <span className="text-popover-foreground text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Searches (shown when query is short or empty) */}
            {searchQuery.length === 0 && recentSearches.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground mb-2 px-2">Recent Searches</p>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={search}
                      onClick={() => {
                        setSearchQuery(search);
                        saveRecentSearch(search);
                        setLocation(`/product-database?search=${encodeURIComponent(search)}`);
                        clearSearch();
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedIndex === index ? 'bg-accent' : 'hover:bg-accent/50'
                      }`}
                      data-testid={`recent-search-${index}`}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-popover-foreground text-sm">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                {recentSearches.length > 0 && searchQuery.length === 0 && (
                  <p className="text-xs text-muted-foreground mb-2 px-2 border-t border-border pt-2">Products</p>
                )}
                <div className="space-y-1">
                  {searchResults.map((product, index) => {
                    const adjustedIndex = searchQuery.length === 0 ? index + recentSearches.length : index;
                    return (
                      <div
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedIndex === adjustedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                        }`}
                        data-testid={`search-result-${product.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-popover-foreground text-sm font-medium truncate">{product.name}</p>
                          <p className="text-muted-foreground text-xs">{product.brand}</p>
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
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">
                  Searching database and internet...
                </p>
              </div>
            )}

            {/* No results state */}
            {!searchMutation.isPending && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="p-4 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No products found</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scanner Modals */}
      <UnifiedScannerModal
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        mode="full"
      />
      
      <ImageScanner
        isActive={showImageScanner}
        onScan={handleImageScanned}
        onClose={() => setShowImageScanner(false)}
      />


    </>
  );
}