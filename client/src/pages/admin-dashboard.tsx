import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Crown, ChartLine, Ban, Shield, Users, Package, AlertTriangle, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
    
    if (!isLoading && isAuthenticated && !user?.isAdmin) {
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
  }, [isAuthenticated, isLoading, user?.isAdmin, toast]);

  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: !!user?.isAdmin,
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
    },
  });

  const { data: recentRecalls } = useQuery({
    queryKey: ['/api/recalls'],
    enabled: !!user?.isAdmin,
  });

  const { data: blacklistedIngredients } = useQuery({
    queryKey: ['/api/blacklist'],
    enabled: !!user?.isAdmin,
  });

  const { data: recentProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=10');
      return await res.json();
    },
    enabled: !!user?.isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-4 animate-glow">
            <Crown className="text-2xl text-cosmic-900" />
          </div>
          <p className="text-cosmic-300">Accessing the cosmic command center...</p>
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
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow">
              <Crown className="text-3xl text-cosmic-900" />
            </div>
            <h1 className="font-mystical text-4xl md:text-6xl font-bold text-starlight-500 mb-4" data-testid="text-admin-title">
              Audit Syndicate Command
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-admin-description">
              Divine oversight of the cosmic truth-seeking mission
            </p>
          </div>

          {/* Welcome Message */}
          <Card className="cosmic-card border-starlight-500/50 mb-8" data-testid="card-admin-welcome">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center">
                  <Crown className="text-cosmic-900" />
                </div>
                <div>
                  <h2 className="font-mystical text-xl text-starlight-500 mb-1" data-testid="text-welcome-admin">
                    Welcome, Cosmic Guardian {user.firstName}
                  </h2>
                  <p className="text-cosmic-300" data-testid="text-admin-status">
                    The mystical realm awaits your divine command
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="cosmic-card" data-testid="card-stat-products">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-mystical-green/20 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-mystical-green" />
                </div>
                <div className="text-3xl font-bold text-mystical-green mb-2" data-testid="text-total-products">
                  {analytics?.totalProducts || 0}
                </div>
                <p className="text-cosmic-300">Products Analyzed</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-users">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-starlight-500/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-starlight-500" />
                </div>
                <div className="text-3xl font-bold text-starlight-500 mb-2" data-testid="text-total-users">
                  {analytics?.totalUsers || 0}
                </div>
                <p className="text-cosmic-300">Truth Seekers</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-cursed">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-mystical-red/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="text-mystical-red" />
                </div>
                <div className="text-3xl font-bold text-mystical-red mb-2" data-testid="text-cursed-products">
                  {analytics?.cursedProducts || 0}
                </div>
                <p className="text-cosmic-300">Cursed Products</p>
              </CardContent>
            </Card>

            <Card className="cosmic-card" data-testid="card-stat-blessed">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-mystical-purple/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-mystical-purple" />
                </div>
                <div className="text-3xl font-bold text-mystical-purple mb-2" data-testid="text-blessed-products">
                  {analytics?.blessedProducts || 0}
                </div>
                <p className="text-cosmic-300">Blessed Products</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Active Recalls Management */}
            <Card className="cosmic-card" data-testid="card-recalls-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-red">
                  <AlertTriangle className="h-5 w-5" />
                  Active Cosmic Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRecalls?.slice(0, 3).map((recall: any) => (
                    <div key={recall.id} className="p-3 bg-mystical-red/10 border-l-2 border-mystical-red rounded" data-testid={`recall-item-${recall.id}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-cosmic-200 text-sm font-medium">{recall.reason}</p>
                        <Badge className="bg-mystical-red/20 text-mystical-red text-xs" data-testid="badge-recall-severity">
                          {recall.severity}
                        </Badge>
                      </div>
                      <p className="text-cosmic-400 text-xs">
                        {new Date(recall.recallDate).toLocaleDateString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-cosmic-400 text-center py-4" data-testid="text-no-active-recalls">
                      No active warnings
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-mystical-red text-mystical-red hover:bg-mystical-red/10"
                  data-testid="button-manage-recalls"
                >
                  Manage Warnings
                </Button>
              </CardContent>
            </Card>

            {/* Blacklist Management */}
            <Card className="cosmic-card" data-testid="card-blacklist-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-red">
                  <Ban className="h-5 w-5" />
                  Cosmic Blacklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blacklistedIngredients?.slice(0, 4).map((ingredient: any) => (
                    <div key={ingredient.id} className="flex justify-between items-center" data-testid={`ingredient-item-${ingredient.id}`}>
                      <span className="text-cosmic-200 text-sm">{ingredient.ingredientName}</span>
                      <Badge 
                        className={
                          ingredient.severity === 'high' 
                            ? 'bg-mystical-red/20 text-mystical-red' 
                            : ingredient.severity === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-cosmic-600/20 text-cosmic-400'
                        }
                        data-testid="badge-ingredient-severity"
                      >
                        {ingredient.severity}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-cosmic-400 text-center py-4" data-testid="text-no-blacklisted">
                      No blacklisted ingredients
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-mystical-red text-mystical-red hover:bg-mystical-red/10 text-xs"
                    data-testid="button-add-ingredient"
                  >
                    Add Ingredient
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-cosmic-600 text-cosmic-300 hover:bg-cosmic-600/10 text-xs"
                    data-testid="button-manage-blacklist"
                  >
                    Manage List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="cosmic-card" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <TrendingUp className="h-5 w-5" />
                  Recent Divine Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentProducts?.slice(0, 3).map((product: any) => (
                    <div key={product.id} className="p-3 bg-cosmic-800/30 rounded" data-testid={`activity-item-${product.id}`}>
                      <p className="text-cosmic-200 text-sm font-medium">{product.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-cosmic-400 text-xs">Added by {product.brand}</span>
                        {product.cosmicClarity && (
                          <Badge 
                            className={
                              product.cosmicClarity === 'blessed' 
                                ? 'bg-mystical-green/20 text-mystical-green' 
                                : product.cosmicClarity === 'cursed'
                                ? 'bg-mystical-red/20 text-mystical-red'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }
                            data-testid="badge-product-clarity"
                          >
                            {product.cosmicClarity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-cosmic-400 text-center py-4" data-testid="text-no-recent-activity">
                      No recent activity
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                  data-testid="button-view-all-activity"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Divine Powers */}
          <Card className="cosmic-card border-mystical-purple/50" data-testid="card-divine-powers">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mystical-purple">
                <Eye className="h-5 w-5" />
                Divine Command Powers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  className="bg-mystical-purple/20 text-mystical-purple border border-mystical-purple/40 hover:bg-mystical-purple/30"
                  data-testid="button-enhance-oracle"
                >
                  <ChartLine className="mr-2 h-4 w-4" />
                  Enhance AI Oracle
                </Button>
                <Button 
                  className="bg-starlight-500/20 text-starlight-500 border border-starlight-500/40 hover:bg-starlight-500/30"
                  data-testid="button-update-database"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Update Database
                </Button>
                <Button 
                  className="bg-mystical-red/20 text-mystical-red border border-mystical-red/40 hover:bg-mystical-red/30"
                  data-testid="button-issue-recall"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Issue Recall
                </Button>
                <Button 
                  className="bg-mystical-green/20 text-mystical-green border border-mystical-green/40 hover:bg-mystical-green/30"
                  data-testid="button-bless-product"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Bless Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mascot Wisdom */}
          <div className="mt-12">
            <Card className="cosmic-card border-mystical-purple/30" data-testid="card-mascot-wisdom">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mystical-purple to-cosmic-600 rounded-full flex items-center justify-center mb-4 animate-glow">
                      <Eye className="text-2xl text-starlight-500" />
                    </div>
                    <h3 className="font-mystical text-xl text-mystical-purple mb-2" data-testid="text-aleister-wisdom-title">Aleister's Wisdom</h3>
                    <p className="text-cosmic-200 italic" data-testid="text-aleister-wisdom">
                      "With great cosmic power comes the responsibility to protect all creatures. Use these divine tools wisely, Guardian."
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-midnight-600 to-cosmic-700 rounded-full flex items-center justify-center mb-4 animate-glow">
                      <Shield className="text-2xl text-starlight-500" />
                    </div>
                    <h3 className="font-mystical text-xl text-midnight-400 mb-2" data-testid="text-severus-wisdom-title">Severus's Counsel</h3>
                    <p className="text-cosmic-200 italic" data-testid="text-severus-wisdom">
                      "The truth you guard today protects countless innocent souls tomorrow. Your vigilance shapes the cosmic order."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
