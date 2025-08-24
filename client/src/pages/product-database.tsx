import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Plus } from "lucide-react";
import { Link } from "wouter";

export default function ProductDatabase() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClarity, setFilterClarity] = useState("all");
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

  const filteredProducts = products?.filter((product: any) => {
    if (filterClarity === 'all') return true;
    return product.cosmicClarity === filterClarity;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
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

          {/* Search and Filters */}
          <Card className="cosmic-card mb-8" data-testid="card-search-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Search className="h-5 w-5" />
                Mystical Search Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
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

                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-cosmic-400" />
                    <span className="text-cosmic-300 text-sm">Filter by Cosmic Clarity:</span>
                  </div>
                  <Select value={filterClarity} onValueChange={setFilterClarity} data-testid="select-clarity-filter">
                    <SelectTrigger className="w-48 bg-cosmic-900/50 border-cosmic-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-cosmic-800 border-cosmic-600">
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="blessed">Blessed</SelectItem>
                      <SelectItem value="questionable">Questionable</SelectItem>
                      <SelectItem value="cursed">Cursed</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product: any) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onClick={() => {}} // Handle product detail view
                  />
                ))}
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
                  Page {page + 1}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={filteredProducts.length < limit}
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
                  {searchTerm && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterClarity("all");
                        setPage(0);
                      }}
                      className="border-cosmic-600 text-cosmic-300"
                      data-testid="button-clear-search"
                    >
                      Clear Search
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
    </div>
  );
}
