import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { RefreshCw, Database, CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react";

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

  const { data: syncStatus, refetch: refetchStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/admin/sync/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
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
    <div className="space-y-6" data-testid="database-sync">
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

      {/* Sync Controls */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="font-mystical flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-starlight-500" />
            Data Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <strong className="text-mystical-purple">Full Sync:</strong> Performs complete synchronization of all databases - products, recalls, ingredients, livestock, feed nutrition, farm safety, and cosmic scoring.
              </div>
            </div>
          </div>
          
          <p className="text-sm text-cosmic-400 mt-4">
            Synchronize with external databases to keep product information, recalls, 
            and ingredient safety data current. Full sync updates all data sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}