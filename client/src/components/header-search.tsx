import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  brand?: string;
}

interface HeaderSearchProps {
  isMobile?: boolean;
}

export default function HeaderSearch({ isMobile = false }: HeaderSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Fetch search results
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products', { search: debouncedQuery, limit: 8 }],
    enabled: debouncedQuery.length >= 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/product-database?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleProductClick = (product: Product) => {
    setLocation(`/product-database?search=${encodeURIComponent(product.name)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicks on dropdown items
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md mx-4'}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full bg-background border border-border rounded-full px-10 pr-20 text-foreground placeholder-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-10"
            data-testid="input-search"
            autoComplete="off"
          />
          
          {query && (
            <Button
              type="button"
              onClick={clearSearch}
              variant="ghost"
              size="sm"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              data-testid="button-clear-search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-500 hover:text-blue-600"
            disabled={!query.trim()}
            data-testid="button-search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto" data-testid="dropdown-results">
          {products.length > 0 ? (
            <div className="py-2">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  onMouseDown={() => handleProductClick(product)}
                  className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-3"
                  data-testid={`item-result-${index}`}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{product.name}</div>
                    {product.brand && (
                      <div className="text-xs text-muted-foreground">{product.brand}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-muted-foreground text-sm">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}