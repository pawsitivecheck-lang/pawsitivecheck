import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  cosmicScore: number;
  description?: string;
}

export default function ProductList({ limit }: { limit?: number }) {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', limit],
    queryFn: async () => {
      const url = limit ? `/api/products?limit=${limit}` : '/api/products';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg p-4 border-red-200 bg-red-50">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">{product.brand}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">{product.cosmicScore}/100</div>
              <div className="text-xs text-gray-500">Safety Score</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {product.category}
            </span>
          </div>
          
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}