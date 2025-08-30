import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, Edit3, Trash2, Calendar, Star, AlertCircle, CheckCircle, XCircle, Package } from "lucide-react";
import type { SavedProduct, Product } from "@shared/schema";

interface SavedProductsListProps {
  petId: number;
}

interface SavedProductWithProduct extends SavedProduct {
  product?: Product;
}

export function SavedProductsList({ petId }: SavedProductsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<SavedProduct | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"saved" | "favorite" | "avoid" | "tried">("saved");

  const { data: savedProducts = [] as SavedProduct[], isLoading } = useQuery({
    queryKey: [`/api/pets/${petId}/saved-products`],
    enabled: !!petId,
  });

  // Fetch product details for each saved product
  const { data: productsData = [] } = useQuery({
    queryKey: [`/api/products/batch`, (savedProducts as SavedProduct[]).map((sp: SavedProduct) => sp.productId)],
    enabled: (savedProducts as SavedProduct[]).length > 0,
    queryFn: async () => {
      const productIds = (savedProducts as SavedProduct[]).map((sp: SavedProduct) => sp.productId);
      const products = await Promise.all(
        productIds.map(async (id: number) => {
          try {
            return await apiRequest(`/api/products/${id}`, "GET");
          } catch {
            return null;
          }
        })
      );
      return products.filter(Boolean);
    },
  });

  const updateSavedProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return await apiRequest(`/api/saved-products/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${petId}/saved-products`] });
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeSavedProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/saved-products/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${petId}/saved-products`] });
      toast({
        title: "Success",
        description: "Product removed successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startEditing = (savedProduct: SavedProduct) => {
    setEditingProduct(savedProduct);
    setNotes(savedProduct.notes || "");
    setStatus(savedProduct.status as "saved" | "favorite" | "avoid" | "tried");
  };

  const saveChanges = () => {
    if (!editingProduct) return;
    
    updateSavedProductMutation.mutate({
      id: editingProduct.id,
      notes: notes.trim() || null,
      status,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'avoid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'tried':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'favorite':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'avoid':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'tried':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getCosmicClarityColor = (clarity: string) => {
    switch (clarity) {
      case 'blessed':
        return 'text-green-600 dark:text-green-400';
      case 'questionable':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'cursed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Merge saved products with product details
  const savedProductsWithDetails: SavedProductWithProduct[] = (savedProducts as SavedProduct[]).map((savedProduct: SavedProduct) => {
    const product = productsData.find((p: Product) => p.id === savedProduct.productId);
    return { ...savedProduct, product };
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if ((savedProducts as SavedProduct[]).length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No saved products yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Products saved for this pet will appear here. Visit the product database to start saving products!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {savedProductsWithDetails.map((savedProduct) => (
          <Card key={savedProduct.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">
                      {savedProduct.product?.name || "Unknown Product"}
                    </CardTitle>
                    <Badge className={getStatusBadgeColor(savedProduct.status || 'saved')}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(savedProduct.status || 'saved')}
                        {savedProduct.status}
                      </div>
                    </Badge>
                  </div>
                  
                  {savedProduct.product && (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Brand:</span>
                        <span>{savedProduct.product.brand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="capitalize">{savedProduct.product.category.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Safety Score:</span>
                        <span className="font-bold">{savedProduct.product.cosmicScore}/100</span>
                        <span className={`capitalize ${getCosmicClarityColor(savedProduct.product.cosmicClarity)}`}>
                          ({savedProduct.product.cosmicClarity})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(savedProduct)}
                    data-testid={`button-edit-saved-product-${savedProduct.id}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Remove this product from your pet's saved list?")) {
                        removeSavedProductMutation.mutate(savedProduct.id);
                      }
                    }}
                    data-testid={`button-remove-saved-product-${savedProduct.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {savedProduct.notes && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Notes: </span>
                    {savedProduct.notes}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Saved {new Date(savedProduct.createdAt).toLocaleDateString()}
                </div>
                {savedProduct.lastUsed && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Last used {new Date(savedProduct.lastUsed).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Card className="fixed inset-0 z-50 bg-white dark:bg-gray-900 m-4 overflow-auto">
          <CardHeader>
            <CardTitle>Edit Saved Product</CardTitle>
            <CardDescription>
              Update notes and status for this product
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger data-testid="select-product-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="favorite">Favorite</SelectItem>
                  <SelectItem value="tried">Tried</SelectItem>
                  <SelectItem value="avoid">Avoid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this product for your pet..."
                className="mt-1"
                data-testid="textarea-product-notes"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingProduct(null)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                onClick={saveChanges}
                disabled={updateSavedProductMutation.isPending}
                data-testid="button-save-changes"
              >
                {updateSavedProductMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </ScrollArea>
  );
}