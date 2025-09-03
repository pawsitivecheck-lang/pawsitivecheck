import { QueryClient } from '@tanstack/react-query';

/**
 * Utility functions for comprehensive cache invalidation when products are updated
 */

export const invalidateProductCaches = (queryClient: QueryClient, productId?: string | number) => {
  // Core product caches
  queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard"] });
  
  // If specific product ID provided, invalidate its related caches
  if (productId) {
    const id = String(productId);
    queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
    queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
    queryClient.invalidateQueries({ queryKey: ["/api/products", id, "tags"] });
  }
  
  // Invalidate paginated and filtered product queries
  queryClient.invalidateQueries({ 
    predicate: (query) => {
      const key = query.queryKey as string[];
      return key.length > 0 && key[0] === "/api/products";
    }
  });
  
  // Invalidate related caches that depend on product data
  queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
  queryClient.invalidateQueries({ queryKey: ["/api/recalls"] });
  
  // Invalidate saved products (pets-related)
  queryClient.invalidateQueries({ 
    predicate: (query) => {
      const key = query.queryKey as string[];
      return key.some(k => typeof k === 'string' && k.includes('saved-products'));
    }
  });
};

export const invalidateAllProductData = (queryClient: QueryClient) => {
  // Nuclear option - invalidate everything product-related
  invalidateProductCaches(queryClient);
  
  // Also invalidate admin caches
  queryClient.invalidateQueries({ 
    predicate: (query) => {
      const key = query.queryKey as string[];
      return key.some(k => typeof k === 'string' && k.includes('/api/admin'));
    }
  });
  
  // Invalidate sync status
  queryClient.invalidateQueries({ queryKey: ["/api/admin/sync/status"] });
};