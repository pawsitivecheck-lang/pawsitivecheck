import React, { useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, Ban, Shield, Users, Package, AlertTriangle, TrendingUp, Database, Loader2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import DatabaseSync from "@/components/database-sync";

// Reusable Components for Better Performance
const StatCard = React.memo(({ icon: Icon, title, value, color, isLoading }: {
  icon: React.ComponentType<any>;
  title: string;
  value: number | string;
  color: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-6 text-center">
          <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 mx-auto ${color} rounded-full flex items-center justify-center mb-4`}>
          <Icon className="text-current" />
        </div>
        <div className="text-3xl font-bold mb-2 text-current">
          {value}
        </div>
        <p className="text-gray-600 dark:text-gray-400">{title}</p>
      </CardContent>
    </Card>
  );
});

const LoadingSpinner = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 animate-pulse">
        <Crown className="text-2xl text-white" />
      </div>
      <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
    </div>
  </div>
));

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
        headers: {
          'Content-Type': 'application/json',
        },
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
      // Invalidate all product-related queries
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

  // Quick delete function for Internet Product 7888
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

  // Optimized data fetching with useQueries for better performance
  const queries = useQueries({
    queries: [
      {
        queryKey: ['/api/admin/analytics'],
        enabled: !!isAdmin,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ['/api/recalls'],
        enabled: !!isAdmin,
        staleTime: 2 * 60 * 1000, // 2 minutes
      },
      {
        queryKey: ['/api/blacklist'],
        enabled: !!isAdmin,
        staleTime: 10 * 60 * 1000, // 10 minutes
      },
      {
        queryKey: ['/api/products?limit=10'],
        enabled: !!isAdmin,
        staleTime: 1 * 60 * 1000, // 1 minute
      },
    ],
  });

  const [analyticsQuery, recallsQuery, blacklistQuery, productsQuery] = queries;
  const analytics = analyticsQuery.data || {};
  const recentRecalls = recallsQuery.data || [];
  const blacklistedIngredients = blacklistQuery.data || [];
  const recentProducts = productsQuery.data || [];

  const isLoadingData = queries.some(query => query.isLoading);
  const hasErrors = queries.some(query => query.isError);


  // Memoized helper functions for better performance
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="admin-header" />
        </div>
      </div>
      
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
                <div className="text-xl font-bold text-blue-600">{(analytics as any)?.totalProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{(analytics as any)?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{(analytics as any)?.cursedProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Unsafe</div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {hasErrors && (
            <Card className="border border-red-600/30 bg-red-900/20 mb-8">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-medium">Data Loading Issues</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">Some dashboard data couldn't be loaded. Please refresh the page.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Stats Cards - Only show on mobile */}
          <div className="grid grid-cols-2 gap-4 mb-8 md:hidden">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Package className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-blue-600">{(analytics as any)?.totalProducts || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Products</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-600">{(analytics as any)?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Active Recalls Management */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow" data-testid="card-recalls-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Active Recalls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recallsQuery.isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="p-3 bg-red-900/20 border-l-2 border-red-500 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                      </div>
                    ))
                  ) : (recentRecalls as any[]).slice(0, 3).map((recall: any) => (
                    <div key={recall.id} className="p-3 bg-red-900/20 border-l-2 border-red-500 rounded" data-testid={`recall-item-${recall.id}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{recall.reason}</p>
                        <Badge className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs" data-testid="badge-recall-severity">
                          {recall.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(recall.recallDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {!recallsQuery.isLoading && (recentRecalls as any[] || []).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-active-recalls">
                      No active recalls
                    </p>
                  )}
                </div>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-red-500 text-red-600 hover:bg-red-900/30"
                  data-testid="button-manage-recalls"
                >
                  <Link to="/recalls">Manage Recalls</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blacklist Management */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow" data-testid="card-blacklist-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Ban className="h-5 w-5" />
                  Ingredient Blacklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(blacklistedIngredients as any[] || []).slice(0, 4).map((ingredient: any) => (
                    <div key={ingredient.id} className="flex justify-between items-center" data-testid={`ingredient-item-${ingredient.id}`}>
                      <span className="text-gray-800 dark:text-gray-200 text-sm">{ingredient.ingredientName}</span>
                      <Badge 
                        className={
                          ingredient.severity === 'critical' 
                            ? 'bg-red-600 dark:bg-red-700 text-white font-bold border-2 border-red-800 shadow-lg' 
                            : ingredient.severity === 'high' 
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' 
                            : ingredient.severity === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }
                        data-testid="badge-ingredient-severity"
                      >
                        {ingredient.severity}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-blacklisted">
                      No blacklisted ingredients
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-900/30 text-xs"
                    data-testid="button-add-ingredient"
                  >
                    Add Ingredient
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs"
                    data-testid="button-manage-blacklist"
                  >
                    Manage List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(recentProducts as any[] || []).slice(0, 3).map((product: any) => (
                    <div key={product.id} className="p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded" data-testid={`activity-item-${product.id}`}>
                      <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{product.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600 dark:text-gray-400 text-xs">Added by {product.brand}</span>
                        {product.cosmicClarity && (
                          <Badge 
                            className={
                              product.cosmicClarity === 'blessed' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                                : product.cosmicClarity === 'cursed'
                                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                            }
                            data-testid="badge-product-clarity"
                          >
                            {product.cosmicClarity === 'blessed' ? 'Safe' : product.cosmicClarity === 'cursed' ? 'Unsafe' : 'Unknown'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-recent-activity">
                      No recent activity
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-blue-500 text-blue-600 hover:bg-blue-900/30"
                  data-testid="button-view-all-activity"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          
          {/* Database Synchronization Section */}
          <div className="space-y-6 mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mystical-purple via-starlight-500 to-cosmic-500 flex items-center justify-center gap-3">
                <Database className="h-8 w-8 text-mystical-purple dark:text-starlight-400" />
                🌟 COSMIC DATABASE COMMAND CENTER 🌟
              </h2>
              <p className="text-cosmic-400 dark:text-cosmic-300 mt-2">
                Control the cosmic forces that keep all platform data synchronized and up-to-date
              </p>
            </div>

            {/* Quick Product Management */}
            <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Quick Product Actions</h3>
              <Button
                onClick={handleQuickDelete}
                disabled={deleteProductMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-quick-delete-7888"
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Delete Internet Product 7888
                  </>
                )}
              </Button>
            </div>

            <DatabaseSync />
          </div>

          {/* Admin Guidelines */}
          <div className="mt-12">
            <Card className="border border-blue-600/30 bg-blue-900/20" data-testid="card-admin-guidelines">
              <CardContent className="p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6">
                    <Shield className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4" data-testid="text-admin-guidelines-title">Administrator Guidelines</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed" data-testid="text-admin-guidelines">
                    As a platform administrator, you have the responsibility to ensure pet product safety data is accurate and up-to-date. 
                    Use these tools to maintain data quality, manage recalls promptly, and keep pet owners informed about product safety.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
