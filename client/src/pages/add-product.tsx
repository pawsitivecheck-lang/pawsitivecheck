import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, ArrowLeft, Sparkles } from "lucide-react";

export default function AddProduct() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    ingredients: "",
    barcode: "",
  });

  const categories = [
    { value: "pet-food", label: "Pet Food" },
    { value: "pet-treats", label: "Pet Treats" },
    { value: "pet-toys", label: "Pet Toys" },
    { value: "pet-accessories", label: "Pet Accessories" },
    { value: "pet-health", label: "Pet Health & Medicine" },
    { value: "pet-grooming", label: "Pet Grooming" },
    { value: "pet-supplies", label: "Pet Supplies" },
  ];

  const addProductMutation = useMutation({
    mutationFn: async (data: typeof productData) => {
      const response = await apiRequest('POST', '/api/products', {
        ...data,
        cosmicScore: 65, // Default score for new products
        cosmicClarity: 'unknown',
        transparencyLevel: 'pending',
        isBlacklisted: false,
        suspiciousIngredients: [],
        lastAnalyzed: new Date(),
      });
      return response.json();
    },
    onSuccess: (product) => {
      toast({
        title: "Product Added!",
        description: "Your product has been added to our database and will be analyzed soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setLocation(`/product/${product.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Product",
        description: error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add products to our database.",
        variant: "destructive",
      });
      return;
    }

    if (!productData.name || !productData.brand || !productData.category) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in product name, brand, and category.",
        variant: "destructive",
      });
      return;
    }

    addProductMutation.mutate(productData);
  };

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">Please log in to add products to our database.</p>
              <Button onClick={() => window.location.href = '/api/login'} className="w-full">
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-4"
              data-testid="button-back-home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <Sparkles className="inline mr-2 h-8 w-8 text-purple-600" />
                Add New Product
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Help expand our database by adding a new pet product
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Premium Dog Food"
                      required
                      data-testid="input-product-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={productData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="e.g., Blue Buffalo"
                      required
                      data-testid="input-product-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="barcode">Barcode (Optional)</Label>
                    <Input
                      id="barcode"
                      value={productData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="e.g., 123456789012"
                      data-testid="input-product-barcode"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the product..."
                    rows={3}
                    data-testid="textarea-product-description"
                  />
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    value={productData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    placeholder="List of ingredients separated by commas..."
                    rows={4}
                    data-testid="textarea-product-ingredients"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/')}
                    data-testid="button-cancel-add-product"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addProductMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    data-testid="button-submit-add-product"
                  >
                    {addProductMutation.isPending ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Add Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}