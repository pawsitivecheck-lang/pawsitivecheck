import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Crown, ChartLine, Ban, Shield, Users, Package, AlertTriangle, Eye, TrendingUp, Database } from "lucide-react";
import DatabaseSync from "@/components/database-sync";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: analytics = {} } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: !!isAdmin,
  });

  const { data: recentRecalls = [] } = useQuery({
    queryKey: ['/api/recalls'],
    enabled: !!isAdmin,
  });

  const { data: blacklistedIngredients = [] } = useQuery({
    queryKey: ['/api/blacklist'],
    enabled: !!isAdmin,
  });

  const { data: recentProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=10');
      return await res.json();
    },
    enabled: !!isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Crown className="text-2xl text-white" />
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Crown className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg" data-testid="text-admin-description">
              Manage platform content, users, and safety data
            </p>
          </div>

          {/* Welcome Message */}
          <Card className="border border-blue-200 bg-blue-50 mb-8" data-testid="card-admin-welcome">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <Crown className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1" data-testid="text-welcome-admin">
                    Welcome, Administrator {user.firstName}
                  </h2>
                  <p className="text-gray-600" data-testid="text-admin-status">
                    Manage your pet safety platform from here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-stat-products">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-total-products">
                  {(analytics as any)?.totalProducts || 0}
                </div>
                <p className="text-gray-600">Products Analyzed</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-stat-users">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-total-users">
                  {(analytics as any)?.totalUsers || 0}
                </div>
                <p className="text-gray-600">Active Users</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-stat-unsafe">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2" data-testid="text-unsafe-products">
                  {(analytics as any)?.cursedProducts || 0}
                </div>
                <p className="text-gray-600">Unsafe Products</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-stat-safe">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-safe-products">
                  {(analytics as any)?.blessedProducts || 0}
                </div>
                <p className="text-gray-600">Safe Products</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Active Recalls Management */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-recalls-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Active Recalls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(recentRecalls as any[]).slice(0, 3).map((recall: any) => (
                    <div key={recall.id} className="p-3 bg-red-50 border-l-2 border-red-500 rounded" data-testid={`recall-item-${recall.id}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-gray-800 text-sm font-medium">{recall.reason}</p>
                        <Badge className="bg-red-100 text-red-600 text-xs" data-testid="badge-recall-severity">
                          {recall.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {new Date(recall.recallDate).toLocaleDateString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4" data-testid="text-no-active-recalls">
                      No active recalls
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-red-500 text-red-600 hover:bg-red-50"
                  data-testid="button-manage-recalls"
                >
                  Manage Recalls
                </Button>
              </CardContent>
            </Card>

            {/* Blacklist Management */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-blacklist-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Ban className="h-5 w-5" />
                  Ingredient Blacklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(blacklistedIngredients as any[]).slice(0, 4).map((ingredient: any) => (
                    <div key={ingredient.id} className="flex justify-between items-center" data-testid={`ingredient-item-${ingredient.id}`}>
                      <span className="text-gray-800 text-sm">{ingredient.ingredientName}</span>
                      <Badge 
                        className={
                          ingredient.severity === 'high' 
                            ? 'bg-red-100 text-red-600' 
                            : ingredient.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                        data-testid="badge-ingredient-severity"
                      >
                        {ingredient.severity}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4" data-testid="text-no-blacklisted">
                      No blacklisted ingredients
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50 text-xs"
                    data-testid="button-add-ingredient"
                  >
                    Add Ingredient
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-400 text-gray-600 hover:bg-gray-50 text-xs"
                    data-testid="button-manage-blacklist"
                  >
                    Manage List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentProducts && recentProducts.slice(0, 3).map((product: any) => (
                    <div key={product.id} className="p-3 bg-gray-50 border rounded" data-testid={`activity-item-${product.id}`}>
                      <p className="text-gray-800 text-sm font-medium">{product.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600 text-xs">Added by {product.brand}</span>
                        {product.cosmicClarity && (
                          <Badge 
                            className={
                              product.cosmicClarity === 'blessed' 
                                ? 'bg-green-100 text-green-600' 
                                : product.cosmicClarity === 'cursed'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }
                            data-testid="badge-product-clarity"
                          >
                            {product.cosmicClarity === 'blessed' ? 'Safe' : product.cosmicClarity === 'cursed' ? 'Unsafe' : 'Unknown'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4" data-testid="text-no-recent-activity">
                      No recent activity
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                  data-testid="button-view-all-activity"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Admin Powers */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-admin-powers">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Eye className="h-5 w-5" />
                Admin Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                  data-testid="button-enhance-analysis"
                >
                  <ChartLine className="mr-2 h-4 w-4" />
                  Enhance Analysis
                </Button>
                <Button 
                  className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                  data-testid="button-update-database"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Update Database
                </Button>
                <Button 
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  data-testid="button-issue-recall"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Issue Recall
                </Button>
                <Button 
                  className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                  data-testid="button-approve-product"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Approve Product
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Database Synchronization Section */}
          <div className="space-y-6 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Database className="h-6 w-6" />
              Database Management
            </h2>
            <DatabaseSync />
          </div>

          {/* Admin Guidelines */}
          <div className="mt-12">
            <Card className="border border-blue-200 bg-blue-50" data-testid="card-admin-guidelines">
              <CardContent className="p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6">
                    <Shield className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4" data-testid="text-admin-guidelines-title">Administrator Guidelines</h3>
                  <p className="text-gray-600 leading-relaxed" data-testid="text-admin-guidelines">
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
