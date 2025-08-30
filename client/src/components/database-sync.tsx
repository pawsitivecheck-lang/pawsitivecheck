import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { RefreshCw, Database, CheckCircle, AlertTriangle, Clock, Zap, Crown, ChartLine, Ban, Shield, Users, Package, Eye, TrendingUp, FileText } from "lucide-react";

interface SyncStatus {
  database: {
    products: { count: number; lastSync: string | null };
    recalls: { count: number; lastSync: string | null };
    ingredients: { count: number; lastSync: string | null };
  };
  health: string;
  lastChecked: string;
}

interface SyncResult {
  message: string;
  syncedCount?: number;
  totalProcessed?: number;
  results?: {
    products: number;
    recalls: number;
    ingredients: number;
    errors: string[];
  };
  timestamp: string;
}

export default function DatabaseSync() {
  const { toast } = useToast();
  const [activeSync, setActiveSync] = useState<string | null>(null);
  const [isUpdatingLegal, setIsUpdatingLegal] = useState(false);

  const { data: syncStatus, refetch: refetchStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/admin/sync/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Admin data queries
  const { data: analytics = {} } = useQuery({
    queryKey: ['/api/admin/analytics'],
  });

  const { data: recentRecalls = [] } = useQuery({
    queryKey: ['/api/recalls'],
  });

  const { data: blacklistedIngredients = [] } = useQuery({
    queryKey: ['/api/blacklist'],
  });

  const { data: recentProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=10');
      return await res.json();
    },
  });

  const syncProductsMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('products');
      const response = await apiRequest('POST', '/api/admin/sync/products');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Products Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize product data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncRecallsMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('recalls');
      const response = await apiRequest('POST', '/api/admin/sync/recalls');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Recalls Synchronized", 
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize recall data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncIngredientsMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('ingredients');
      const response = await apiRequest('POST', '/api/admin/sync/ingredients');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Ingredients Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed", 
        description: "Unable to synchronize ingredient blacklist",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncLivestockMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('livestock');
      const response = await apiRequest('POST', '/api/admin/sync/livestock');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Livestock Data Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize livestock data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncFeedNutritionMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('feed-nutrition');
      const response = await apiRequest('POST', '/api/admin/sync/feed-nutrition');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Feed Nutrition Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize feed nutrition data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncFarmSafetyMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('farm-safety');
      const response = await apiRequest('POST', '/api/admin/sync/farm-safety');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Farm Safety Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize farm safety data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncExoticProductsMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('exotic-products');
      const response = await apiRequest('POST', '/api/admin/sync/exotic-products');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Exotic Products Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize exotic products",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncExoticNutritionMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('exotic-nutrition');
      const response = await apiRequest('POST', '/api/admin/sync/exotic-nutrition');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Exotic Nutrition Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize exotic nutrition data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncExoticSafetyMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('exotic-safety');
      const response = await apiRequest('POST', '/api/admin/sync/exotic-safety');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "Exotic Safety Synchronized",
        description: result.message,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to synchronize exotic safety data",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  const syncAllMutation = useMutation({
    mutationFn: async () => {
      setActiveSync('all');
      const response = await apiRequest('POST', '/api/admin/sync/all');
      return response.json() as Promise<SyncResult>;
    },
    onSuccess: (result) => {
      toast({
        title: "🌟 COSMIC SYNCHRONIZATION COMPLETE! 🌟",
        description: result.message,
        duration: 8000,
      });
      refetchStatus();
      setActiveSync(null);
    },
    onError: () => {
      toast({
        title: "💥 Cosmic Synchronization Failed",
        description: "The cosmic forces were disrupted during synchronization. Please try again.",
        variant: "destructive",
      });
      setActiveSync(null);
    },
  });

  // Admin mutations
  const updateLegalDocuments = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/update-legal');
    },
    onSuccess: () => {
      toast({
        title: "Legal Documents Updated",
        description: "Privacy Policy, Terms of Service, and Cookie Policy have been updated with current 2025 regulations.",
      });
      setIsUpdatingLegal(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update legal documents. Please try again.",
        variant: "destructive",
      });
      setIsUpdatingLegal(false);
    },
  });

  const handleUpdateLegal = () => {
    setIsUpdatingLegal(true);
    updateLegalDocuments.mutate();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8" data-testid="database-sync">
      {/* Admin Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Crown className="text-3xl text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4" data-testid="text-admin-title">
          Admin Control Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg" data-testid="text-admin-description">
          Manage platform content, users, safety data and cosmic synchronization
        </p>
      </div>

      {/* Admin Analytics Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-stat-products">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Package className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-total-products">
              {(analytics as any)?.totalProducts || 0}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Products</p>
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
            <p className="text-gray-600 dark:text-gray-400">Active Users</p>
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
            <p className="text-gray-600 dark:text-gray-400">Unsafe Products</p>
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
            <p className="text-gray-600 dark:text-gray-400">Safe Products</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Grid */}
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
                <div key={recall.id} className="p-3 bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500 rounded" data-testid={`recall-item-${recall.id}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{recall.reason}</p>
                    <Badge className="bg-red-100 text-red-600 text-xs" data-testid="badge-recall-severity">
                      {recall.severity}
                    </Badge>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(recall.recallDate).toLocaleDateString()}
                  </p>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-active-recalls">
                  No active recalls
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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
                  <span className="text-gray-800 dark:text-gray-200 text-sm">{ingredient.ingredientName}</span>
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
                    {ingredient.severity || 'low'}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-blacklisted-ingredients">
                  No blacklisted ingredients
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              data-testid="button-manage-blacklist"
            >
              Manage Blacklist
            </Button>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-recent-products">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentProducts as any[])?.slice(0, 4).map((product: any) => (
                <div key={product.id} className="flex justify-between items-center" data-testid={`product-item-${product.id}`}>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium truncate">{product.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{product.brand}</p>
                  </div>
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
                    {product.cosmicClarity || 'unknown'}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4" data-testid="text-no-products">
                  No products found
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => window.location.href = "/product-database"}
              data-testid="button-view-all-products"
            >
              View All Products
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="font-mystical flex items-center gap-2">
            <Database className="h-5 w-5 text-mystical-purple" />
            Cosmic Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cosmic-300">Products</span>
                <Badge variant="secondary">
                  {syncStatus?.database?.products?.count || 0}
                </Badge>
              </div>
              <p className="text-xs text-cosmic-400">
                Last sync: {formatDate(syncStatus?.database?.products?.lastSync || null)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cosmic-300">Recalls</span>
                <Badge variant="secondary">
                  {syncStatus?.database?.recalls?.count || 0}
                </Badge>
              </div>
              <p className="text-xs text-cosmic-400">
                Last sync: {formatDate(syncStatus?.database?.recalls?.lastSync || null)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cosmic-300">Ingredients</span>
                <Badge variant="secondary">
                  {syncStatus?.database?.ingredients?.count || 0}
                </Badge>
              </div>
              <p className="text-xs text-cosmic-400">
                Last sync: {formatDate(syncStatus?.database?.ingredients?.lastSync || null)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-cosmic-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cosmic-300">System Health</span>
              <Badge className={`${
                syncStatus?.health === 'operational' 
                  ? 'bg-mystical-green text-cosmic-900'
                  : 'bg-mystical-red text-white'
              }`}>
                {syncStatus?.health === 'operational' ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Operational</>
                ) : (
                  <><AlertTriangle className="h-3 w-3 mr-1" /> Issues</>
                )}
              </Badge>
            </div>
            <p className="text-xs text-cosmic-400 mt-1">
              Last checked: {formatDate(syncStatus?.lastChecked || null)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Actions & Data Synchronization */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="font-mystical flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            Administrative Actions & Data Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Administrative Actions Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-cosmic-200 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administrative Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                data-testid="button-enhance-analysis"
              >
                <ChartLine className="mr-2 h-4 w-4" />
                Enhance Analysis
              </Button>
              <Button 
                className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                data-testid="button-update-database"
              >
                <Package className="mr-2 h-4 w-4" />
                Update Database
              </Button>
              <Button 
                className="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
                onClick={() => window.location.href = "/admin/product-submissions"}
                data-testid="button-review-submissions"
              >
                <Eye className="mr-2 h-4 w-4" />
                Review Submissions
              </Button>
              <Button 
                className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                data-testid="button-issue-recall"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Issue Recall
              </Button>
              <Button 
                className="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900"
                data-testid="button-approve-product"
              >
                <Shield className="mr-2 h-4 w-4" />
                Approve Product
              </Button>
              <Button 
                className="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900"
                onClick={handleUpdateLegal}
                disabled={isUpdatingLegal}
                data-testid="button-update-legal"
              >
                {isUpdatingLegal ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {isUpdatingLegal ? "Updating..." : "Update Legal Docs"}
              </Button>
            </div>
          </div>

          {/* Data Synchronization Section */}
          <div>
            <h3 className="text-lg font-semibold text-cosmic-200 mb-4 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-starlight-500" />
              Data Synchronization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            <div className="space-y-3">
              <Button
                onClick={() => syncProductsMutation.mutate()}
                disabled={syncProductsMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-products"
              >
                {activeSync === 'products' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Products...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Sync Products
                  </>
                )}
              </Button>
              
              {activeSync === 'products' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating product database from external sources...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Product Sync:</strong> Updates pet product database with latest information from Open Pet Food Facts and external sources.
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => syncRecallsMutation.mutate()}
                disabled={syncRecallsMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-recalls"
              >
                {activeSync === 'recalls' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Recalls...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Sync Recalls
                  </>
                )}
              </Button>
              
              {activeSync === 'recalls' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Fetching latest recall alerts from regulatory sources...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Recall Sync:</strong> Pulls latest product recalls and safety alerts from FDA and regulatory databases.
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => syncIngredientsMutation.mutate()}
                disabled={syncIngredientsMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-ingredients"
              >
                {activeSync === 'ingredients' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Ingredients...
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Sync Ingredients
                  </>
                )}
              </Button>
              
              {activeSync === 'ingredients' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating dangerous ingredient blacklist...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Ingredient Sync:</strong> Updates dangerous ingredient blacklist from veterinary safety databases and research.
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => syncLivestockMutation.mutate()}
                disabled={syncLivestockMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-livestock"
              >
                {activeSync === 'livestock' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Livestock...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🐄</span>
                    Sync Livestock
                  </>
                )}
              </Button>
              
              {activeSync === 'livestock' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Fetching livestock feed products from USDA sources...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Livestock Sync:</strong> Updates livestock feed database with farm animal nutrition data from USDA NASS production sources.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncFeedNutritionMutation.mutate()}
                disabled={syncFeedNutritionMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-feed-nutrition"
              >
                {activeSync === 'feed-nutrition' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Nutrition...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🌾</span>
                    Sync Feed Nutrition
                  </>
                )}
              </Button>
              
              {activeSync === 'feed-nutrition' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating feed ingredient nutrition profiles...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Feed Nutrition:</strong> Synchronizes detailed nutrition profiles for livestock feed ingredients from USDA FoodData Central.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncFarmSafetyMutation.mutate()}
                disabled={syncFarmSafetyMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-farm-safety"
              >
                {activeSync === 'farm-safety' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Farm Safety...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚜</span>
                    Sync Farm Safety
                  </>
                )}
              </Button>
              
              {activeSync === 'farm-safety' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating farm animal safety alerts and guidelines...
                </div>
              )}
              
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Farm Safety:</strong> Updates dangerous ingredient alerts specific to farm animals from FDA Animal & Veterinary databases.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncExoticProductsMutation.mutate()}
                disabled={syncExoticProductsMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-exotic-products"
              >
                {activeSync === 'exotic-products' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Exotic Products...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🦎</span>
                    Sync Exotic Products
                  </>
                )}
              </Button>
              
              {activeSync === 'exotic-products' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Fetching exotic animal products from specialty databases...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Exotic Products:</strong> Updates database with specialty products for reptiles, birds, small mammals, and aquatic pets.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncExoticNutritionMutation.mutate()}
                disabled={syncExoticNutritionMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-exotic-nutrition"
              >
                {activeSync === 'exotic-nutrition' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Exotic Nutrition...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🍃</span>
                    Sync Exotic Nutrition
                  </>
                )}
              </Button>
              
              {activeSync === 'exotic-nutrition' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating specialized nutrition profiles for exotic species...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Exotic Nutrition:</strong> Synchronizes species-specific nutrition data from exotic animal veterinary research.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncExoticSafetyMutation.mutate()}
                disabled={syncExoticSafetyMutation.isPending || activeSync !== null}
                className="w-full mystical-button h-12"
                data-testid="button-sync-exotic-safety"
              >
                {activeSync === 'exotic-safety' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing Exotic Safety...
                  </>
                ) : (
                  <>
                    <span className="mr-2">⚠️</span>
                    Sync Exotic Safety
                  </>
                )}
              </Button>
              
              {activeSync === 'exotic-safety' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Updating toxic substance alerts for exotic animals...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Exotic Safety:</strong> Updates toxicology data and safety alerts specific to exotic pets from veterinary databases.
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => syncAllMutation.mutate()}
                disabled={syncAllMutation.isPending || activeSync !== null}
                className="w-full bg-gradient-to-r from-mystical-purple via-starlight-500 to-cosmic-500 text-white font-bold h-12 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                data-testid="button-sync-all"
              >
                {activeSync === 'all' ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Full Sync in Progress...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Sync Everything
                  </>
                )}
              </Button>
              
              {activeSync === 'all' && (
                <div className="text-center text-xs text-cosmic-400 animate-pulse">
                  Comprehensive database synchronization in progress...
                </div>
              )}
              
              <div className="text-center text-xs text-cosmic-500 bg-cosmic-800/30 p-2 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">Full Sync:</strong> Performs complete synchronization of all databases - products, recalls, ingredients, livestock, farm animals, exotic pets, and cosmic scoring.
              </div>
            </div>
            </div>
          </div>
          
          <p className="text-sm text-cosmic-400 mt-4">
            Synchronize with external databases to keep product information, recalls, 
            and ingredient safety data current. Full sync updates all data sources.
          </p>
        </CardContent>
      </Card>

      {/* Admin Guidelines */}
      <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950" data-testid="card-admin-guidelines">
        <CardContent className="p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6">
              <Shield className="text-2xl text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4" data-testid="text-admin-guidelines-title">Administrator Guidelines</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" data-testid="text-admin-guidelines">
              As a platform administrator, you have the responsibility to ensure pet product safety data is accurate and up-to-date. 
              Use these tools to maintain data quality, manage recalls promptly, and keep pet owners informed about product safety.
              The cosmic synchronization tools above help maintain real-time data integrity across all systems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}