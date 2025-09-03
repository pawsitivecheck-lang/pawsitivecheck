import React, { useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, Ban, Shield, Users, Package, AlertTriangle, TrendingUp, Database, Loader2, X } from "lucide-react";
import { Link } from "wouter";
import DatabaseSync from "@/components/database-sync";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Quick product deletion mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Product Deleted",
        description: data.message || "Product has been permanently removed from the database.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleQuickDelete = () => {
    if (confirm("Are you sure you want to permanently delete 'Internet Product 7888' (ID: 215)?")) {
      deleteProductMutation.mutate(215);
    }
  };

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
    
    if (!isLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only Audit Syndicate members may enter the command center.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, isAdmin, toast]);

  // Optimized data fetching
  const queries = useQueries({
    queries: [
      {
        queryKey: ['/api/admin/analytics'],
        enabled: !!isAdmin,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['/api/recalls'],
        enabled: !!isAdmin,
        staleTime: 2 * 60 * 1000,
      },
      {
        queryKey: ['/api/blacklist'],
        enabled: !!isAdmin,
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: ['/api/products?limit=10'],
        enabled: !!isAdmin,
        staleTime: 1 * 60 * 1000,
      },
    ],
  });

  const [analyticsQuery, recallsQuery, blacklistQuery, productsQuery] = queries;
  const analytics = analyticsQuery.data || { totalProducts: 0, totalUsers: 0, cursedProducts: 0, blessedProducts: 0 };
  const recentRecalls = (recallsQuery.data as any[]) || [];
  const blacklistedIngredients = (blacklistQuery.data as any[]) || [];
  const recentProducts = (productsQuery.data as any[]) || [];

  const isLoadingData = queries.some(query => query.isLoading);
  const hasErrors = queries.some(query => query.isError);

  const getSeverityBadgeClass = useMemo(() => {
    return (severity: string) => {
      switch (severity) {
        case 'critical':
          return 'bg-red-600 dark:bg-red-700 text-white font-bold border-2 border-red-800 shadow-lg';
        case 'high':
          return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400';
        case 'medium':
          return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
        default:
          return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      }
    };
  }, []);

  const getClarityBadgeClass = useMemo(() => {
    return (clarity: string) => {
      switch (clarity) {
        case 'blessed':
          return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
        case 'cursed':
          return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400';
        default:
          return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
      }
    };
  }, []);

  const formatClarityText = useCallback((clarity: string) => {
    switch (clarity) {
      case 'blessed': return 'Safe';
      case 'cursed': return 'Unsafe';
      default: return 'Unknown';
    }
  }, []);

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Crown className="text-2xl text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <Crown className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200" data-testid="text-admin-title">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm" data-testid="text-admin-description">
                  Platform management & automation
                </p>
              </div>
            </div>
            
            {/* Inline Quick Stats */}
            <div className="hidden md:flex gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{analytics?.totalProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{analytics?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{analytics?.cursedProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Unsafe</div>
              </div>
            </div>
          </div>

          {/* Mobile Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 md:hidden">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Package className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-blue-600">{analytics?.totalProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Products</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-600">{analytics?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Management Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Content Overview */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Content Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recent Products */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    Recent Products
                  </h4>
                  <div className="space-y-2">
                    {recentProducts.slice(0, 3).map((product: any) => (
                      <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                        </div>
                        <Badge className={getClarityBadgeClass(product.cosmicClarity)}>
                          {formatClarityText(product.cosmicClarity)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Recalls */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Active Recalls ({recentRecalls.length})
                  </h4>
                  <div className="space-y-2">
                    {recentRecalls.slice(0, 2).map((recall: any) => (
                      <div key={recall.id} className="p-2 bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500 rounded">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium">{recall.reason}</p>
                          <Badge className={getSeverityBadgeClass(recall.severity)}>
                            {recall.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {recentRecalls.length === 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">No active recalls</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Control */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Status */}
                <div>
                  <h4 className="text-sm font-medium mb-2">System Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span className="text-xs">Database</span>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span className="text-xs">Scheduler</span>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs">Active</Badge>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleQuickDelete}
                      disabled={deleteProductMutation.isPending}
                    >
                      {deleteProductMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Quick Delete Problem Product
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/recalls">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Recalls
                        </Button>
                      </Link>
                      <Link href="/product-database">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Dangerous Ingredients Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Ban className="h-4 w-4 text-amber-600" />
                    Dangerous Ingredients ({blacklistedIngredients.length})
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {blacklistedIngredients.slice(0, 3).map((ingredient: any) => ingredient.ingredientName).join(', ') || 'None'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Sync Section */}
          <DatabaseSync />
        </div>
      </div>

      <Footer />
    </div>
  );
}