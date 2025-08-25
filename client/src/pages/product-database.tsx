import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Plus, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ProductDatabase() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize search term from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);
  const [filterClarity, setFilterClarity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [minCosmicScore, setMinCosmicScore] = useState(0);
  const [maxCosmicScore, setMaxCosmicScore] = useState(100);
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', { search: searchTerm, limit, offset: page * limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
      });
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await fetch(`/api/products?${params}`);
      return await res.json();
    },
  });

  // Get unique brands and categories for filter options
  const uniqueBrands: string[] = Array.from(new Set(products?.map((p: any) => p.brand).filter(Boolean) || []));
  const uniqueCategories: string[] = Array.from(new Set(products?.map((p: any) => p.category).filter(Boolean) || []));
  
  const filteredProducts = products?.filter((product: any) => {
    // Clarity filter
    if (filterClarity !== 'all' && product.cosmicClarity !== filterClarity) return false;
    
    // Category filter
    if (filterCategory !== 'all' && product.category !== filterCategory) return false;
    
    // Brand filter
    if (filterBrand !== 'all' && product.brand !== filterBrand) return false;
    
    // Cosmic score range filter
    const score = product.cosmicScore || 0;
    if (score < minCosmicScore || score > maxCosmicScore) return false;
    
    return true;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'score-high':
        return (b.cosmicScore || 0) - (a.cosmicScore || 0);
      case 'score-low':
        return (a.cosmicScore || 0) - (b.cosmicScore || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
    // Update URL to reflect search
    if (searchTerm.trim()) {
      setLocation(`/database?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      setLocation('/database');
    }
  };

  const clearAllFilters = () => {
    setFilterClarity('all');
    setFilterCategory('all');
    setFilterBrand('all');
    setMinCosmicScore(0);
    setMaxCosmicScore(100);
  };

  const hasActiveFilters = filterClarity !== 'all' || filterCategory !== 'all' || filterBrand !== 'all' || minCosmicScore > 0 || maxCosmicScore < 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="database-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-mystical-purple to-midnight-600 rounded-full flex items-center justify-center mb-6 animate-glow">
              <Search className="text-3xl text-starlight-500" />
            </div>
            <h1 className="font-mystical text-4xl md:text-6xl font-bold text-starlight-500 mb-4" data-testid="text-database-title">
              Cosmic Product Database
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-database-description">
              Search the mystical archives of pet product knowledge
            </p>
          </div>

          {/* Current Search Display */}
          {searchTerm && (
            <div className="mb-8">
              <Card className="cosmic-card" data-testid="card-search-results">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-starlight-400" />
                      <div>
                        <p className="text-cosmic-200 text-sm">Search Results for:</p>
                        <p className="text-starlight-400 font-medium text-lg" data-testid="text-search-term">
                          "{searchTerm}"
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-starlight-500/20 text-starlight-300 border-starlight-500/30"
                        data-testid="badge-results-count"
                      >
                        {filteredProducts?.length || 0} results
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setLocation('/database');
                      }}
                      className="text-cosmic-400 hover:text-cosmic-200"
                      data-testid="button-clear-search"
                    >
                      <X className="h-4 w-4" />
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <Card className="cosmic-card mb-8" data-testid="card-search-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Search className="h-5 w-5" />
                Mystical Search Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Search by product name, brand, or ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-cosmic-900/50 border border-cosmic-600 text-cosmic-100 placeholder-cosmic-400"
                    data-testid="input-search"
                  />
                  <Button 
                    type="submit"
                    className="mystical-button"
                    data-testid="button-search"
                  >
                    Divine Search
                  </Button>
                </div>

                {/* Basic Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-cosmic-300 text-sm mb-2 block">Cosmic Clarity</label>
                    <Select value={filterClarity} onValueChange={setFilterClarity} data-testid="select-clarity-filter">
                      <SelectTrigger className="bg-cosmic-900/50 border-cosmic-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-800 border-cosmic-600">
                        <SelectItem value="all">All Clarity Levels</SelectItem>
                        <SelectItem value="blessed">✨ Blessed</SelectItem>
                        <SelectItem value="questionable">⚠️ Questionable</SelectItem>
                        <SelectItem value="cursed">💀 Cursed</SelectItem>
                        <SelectItem value="unknown">❓ Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-cosmic-300 text-sm mb-2 block">Category</label>
                    <Select value={filterCategory} onValueChange={setFilterCategory} data-testid="select-category-filter">
                      <SelectTrigger className="bg-cosmic-900/50 border-cosmic-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-800 border-cosmic-600">
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((category: string) => (
                          <SelectItem key={category} value={category}>
                            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-cosmic-300 text-sm mb-2 block">Brand</label>
                    <Select value={filterBrand} onValueChange={setFilterBrand} data-testid="select-brand-filter">
                      <SelectTrigger className="bg-cosmic-900/50 border-cosmic-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-800 border-cosmic-600">
                        <SelectItem value="all">All Brands</SelectItem>
                        {uniqueBrands.map((brand: string) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-cosmic-300 text-sm mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy} data-testid="select-sort">
                      <SelectTrigger className="bg-cosmic-900/50 border-cosmic-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-800 border-cosmic-600">
                        <SelectItem value="newest">🕒 Newest First</SelectItem>
                        <SelectItem value="oldest">⏰ Oldest First</SelectItem>
                        <SelectItem value="name-asc">🔤 Name A-Z</SelectItem>
                        <SelectItem value="name-desc">🔠 Name Z-A</SelectItem>
                        <SelectItem value="score-high">⭐ Highest Score</SelectItem>
                        <SelectItem value="score-low">📉 Lowest Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Advanced Filters Toggle */}
                <div className="flex justify-between items-center pt-4 border-t border-cosmic-600">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="text-cosmic-300 hover:text-starlight-400"
                    data-testid="button-toggle-advanced"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </Button>
                  
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearAllFilters}
                      className="border-mystical-red text-mystical-red hover:bg-mystical-red/10"
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                {/* Advanced Filters Section */}
                {showAdvancedFilters && (
                  <div className="space-y-4 pt-4 border-t border-cosmic-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-cosmic-300 text-sm mb-3 block">Cosmic Score Range</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-cosmic-400 text-sm w-8">Min:</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={minCosmicScore}
                              onChange={(e) => setMinCosmicScore(parseInt(e.target.value))}
                              className="flex-1 accent-mystical-purple"
                              data-testid="slider-min-score"
                            />
                            <span className="text-starlight-400 text-sm w-8 font-medium">{minCosmicScore}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-cosmic-400 text-sm w-8">Max:</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={maxCosmicScore}
                              onChange={(e) => setMaxCosmicScore(parseInt(e.target.value))}
                              className="flex-1 accent-mystical-purple"
                              data-testid="slider-max-score"
                            />
                            <span className="text-starlight-400 text-sm w-8 font-medium">{maxCosmicScore}</span>
                          </div>
                          <div className="text-xs text-cosmic-400 text-center">
                            Showing products with scores between {minCosmicScore} and {maxCosmicScore}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-cosmic-300 text-sm mb-3 block">Quick Safety Filters</label>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFilterClarity('blessed');
                              setMinCosmicScore(80);
                              setMaxCosmicScore(100);
                            }}
                            className="border-mystical-green text-mystical-green hover:bg-mystical-green/10 justify-start"
                            data-testid="button-filter-safe"
                          >
                            ✨ Show Only Safe Products (Score 80+)
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFilterClarity('cursed');
                              setMinCosmicScore(0);
                              setMaxCosmicScore(50);
                            }}
                            className="border-mystical-red text-mystical-red hover:bg-mystical-red/10 justify-start"
                            data-testid="button-filter-unsafe"
                          >
                            💀 Show Potentially Unsafe (Score &lt;50)
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFilterClarity('questionable');
                              setMinCosmicScore(40);
                              setMaxCosmicScore(75);
                            }}
                            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 justify-start"
                            data-testid="button-filter-moderate"
                          >
                            ⚠️ Show Moderate Risk (Score 40-75)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-cosmic-600">
                    <span className="text-cosmic-400 text-sm">Active filters:</span>
                    {filterClarity !== 'all' && (
                      <Badge className="bg-cosmic-700 text-cosmic-200" data-testid="badge-active-clarity">
                        Clarity: {filterClarity}
                      </Badge>
                    )}
                    {filterCategory !== 'all' && (
                      <Badge className="bg-cosmic-700 text-cosmic-200" data-testid="badge-active-category">
                        Category: {filterCategory}
                      </Badge>
                    )}
                    {filterBrand !== 'all' && (
                      <Badge className="bg-cosmic-700 text-cosmic-200" data-testid="badge-active-brand">
                        Brand: {filterBrand}
                      </Badge>
                    )}
                    {(minCosmicScore > 0 || maxCosmicScore < 100) && (
                      <Badge className="bg-cosmic-700 text-cosmic-200" data-testid="badge-active-score">
                        Score: {minCosmicScore}-{maxCosmicScore}
                      </Badge>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Add Product Button (for authenticated users) */}
          {user && (
            <div className="mb-8 text-center">
              <Button 
                variant="outline"
                className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                data-testid="button-add-product"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product to Cosmic Archive
              </Button>
            </div>
          )}

          {/* Results Count and Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-cosmic-300 text-lg font-medium" data-testid="text-results-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
              {searchTerm && (
                <p className="text-cosmic-400 text-sm" data-testid="text-search-term">
                  Results for: "{searchTerm}"
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-cosmic-400 text-sm">
                {filteredProducts.length > 0 && (
                  <>
                    Showing {Math.min((page * limit) + 1, filteredProducts.length)}-{Math.min((page + 1) * limit, filteredProducts.length)} of {filteredProducts.length}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="cosmic-card animate-pulse" data-testid={`skeleton-product-${i}`}>
                  <CardContent className="p-6">
                    <div className="h-48 bg-cosmic-700 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-cosmic-700 rounded"></div>
                      <div className="h-4 bg-cosmic-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.slice(page * limit, (page + 1) * limit).map((product: any, index: number) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onClick={() => {}} // Handle product detail view
                    />
                  ))}
                </div>
                
                {/* In-content Ad */}
                {filteredProducts.slice(page * limit, (page + 1) * limit).length >= 4 && (
                  <div className="my-8">
                    <AdBanner size="leaderboard" position="product-list" />
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="border-cosmic-600 text-cosmic-300"
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="flex items-center text-cosmic-300" data-testid="text-page-info">
                  Page {page + 1} of {Math.ceil(filteredProducts.length / limit)}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * limit >= filteredProducts.length}
                  className="border-cosmic-600 text-cosmic-300"
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Card className="cosmic-card" data-testid="card-no-products">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-cosmic-700 rounded-full flex items-center justify-center mb-6">
                  <Search className="text-cosmic-500 text-2xl" />
                </div>
                <h3 className="font-mystical text-xl text-cosmic-300 mb-4" data-testid="text-no-products-title">
                  No Products Found
                </h3>
                <p className="text-cosmic-400 mb-6" data-testid="text-no-products-description">
                  {searchTerm 
                    ? "The cosmic archive contains no products matching your search."
                    : "The mystical database appears empty. Begin your journey by scanning a product."}
                </p>
                <div className="flex gap-4 justify-center">
                  {(searchTerm || hasActiveFilters) && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        clearAllFilters();
                        setPage(0);
                      }}
                      className="border-cosmic-600 text-cosmic-300"
                      data-testid="button-clear-search"
                    >
                      Clear All Filters
                    </Button>
                  )}
                  <Link href="/scan">
                    <Button className="mystical-button" data-testid="button-scan-first-product">
                      Scan Your First Product
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}