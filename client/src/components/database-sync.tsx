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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => syncProductsMutation.mutate()}
              disabled={syncProductsMutation.isPending || activeSync !== null}
              className="mystical-button"
              data-testid="button-sync-products"
            >
              {activeSync === 'products' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Sync Products
            </Button>
            
            <Button
              onClick={() => syncRecallsMutation.mutate()}
              disabled={syncRecallsMutation.isPending || activeSync !== null}
              className="mystical-button"
              data-testid="button-sync-recalls"
            >
              {activeSync === 'recalls' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Sync Recalls
            </Button>
            
            <Button
              onClick={() => syncIngredientsMutation.mutate()}
              disabled={syncIngredientsMutation.isPending || activeSync !== null}
              className="mystical-button"
              data-testid="button-sync-ingredients"
            >
              {activeSync === 'ingredients' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
              Sync Ingredients
            </Button>
            
            <div className="space-y-4">
              <Button
                onClick={() => syncAllMutation.mutate()}
                disabled={syncAllMutation.isPending || activeSync !== null}
                className="w-full bg-gradient-to-r from-mystical-purple via-starlight-500 to-cosmic-500 text-white font-bold py-4 px-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                data-testid="button-sync-all"
              >
                {activeSync === 'all' ? (
                  <>
                    <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                    🌟 COSMIC SYNCHRONIZATION IN PROGRESS... 🌟
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 mr-3" />
                    🚀 SYNC EVERYTHING - FULL COSMIC REFRESH 🚀
                  </>
                )}
              </Button>
              
              {activeSync === 'all' && (
                <div className="text-center space-y-2">
                  <div className="text-cosmic-300 font-medium animate-pulse">
                    ✨ Channeling cosmic energies across all databases... ✨
                  </div>
                  <div className="text-sm text-cosmic-400">
                    This comprehensive sync updates products, recalls, ingredients, safety scores, cosmic clarity, and transparency levels
                  </div>
                </div>
              )}
              
              <div className="text-center text-sm text-cosmic-500 bg-cosmic-800/30 p-3 rounded border border-cosmic-700">
                <strong className="text-mystical-purple">⚡ ULTIMATE SYNC POWER:</strong> This cosmic operation will refresh ALL platform data including external product sources, regulatory recalls, veterinary ingredient databases, recalculated safety scores, updated cosmic clarity assessments, and comprehensive transparency evaluations.
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