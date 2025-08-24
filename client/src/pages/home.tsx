import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Camera, Search, Shield, BarChart3, History, Crown, WandSparkles } from "lucide-react";
import type { ScanHistory, ProductRecall, ProductReview } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: recentScans } = useQuery<ScanHistory[]>({
    queryKey: ['/api/scans'],
  });

  const { data: recentRecalls } = useQuery<ProductRecall[]>({
    queryKey: ['/api/recalls'],
  });

  const { data: userReviews } = useQuery<ProductReview[]>({
    queryKey: ['/api/user/reviews'],
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Welcome Section */}
          <div className="mb-12">
            <div className="cosmic-card p-12 text-center border border-starlight-500/30">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-mystical-purple via-starlight-500 to-mystical-green bg-clip-text text-transparent mb-6 text-center tracking-tight" 
                    data-testid="text-welcome-user">
                  Welcome back, {user?.firstName || 'Truth Seeker'}
                </h1>
                <p className="text-xl text-cosmic-300 max-w-2xl mx-auto mb-6">
                  Your personalized pet product safety dashboard
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-mystical-purple/5 rounded-xl p-6 border border-mystical-purple/20">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-mystical-purple to-cosmic-600 rounded-lg flex items-center justify-center mb-4">
                    <WandSparkles className="text-lg text-starlight-500" />
                  </div>
                  <p className="text-mystical-purple text-sm">Advanced AI analysis ready for your products</p>
                  <p className="text-cosmic-400 text-xs mt-1">Aleister Analytics</p>
                </div>
                <div className="bg-midnight-600/5 rounded-xl p-6 border border-midnight-600/20">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-midnight-600 to-cosmic-700 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="text-lg text-starlight-500" />
                  </div>
                  <p className="text-midnight-400 text-sm">Real-time safety monitoring active</p>
                  <p className="text-cosmic-400 text-xs mt-1">Severus Protection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-starlight-400 mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/scan">
                <Card className="cosmic-card hover:scale-105 transition-all duration-200 cursor-pointer border border-mystical-green/30 hover:border-mystical-green/50 hover:shadow-lg" data-testid="card-quick-scan">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-mystical-green/20 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="text-mystical-green h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-starlight-400 mb-2">Product Scanner</h3>
                    <p className="text-cosmic-300 text-sm">Analyze products with barcode or image scanning</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/database">
                <Card className="cosmic-card hover:scale-105 transition-all duration-200 cursor-pointer border border-mystical-purple/30 hover:border-mystical-purple/50 hover:shadow-lg" data-testid="card-database">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-mystical-purple/20 rounded-lg flex items-center justify-center mb-4">
                      <Search className="text-mystical-purple h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-starlight-400 mb-2">Product Database</h3>
                    <p className="text-cosmic-300 text-sm">Search and explore comprehensive product information</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/recalls">
                <Card className="cosmic-card hover:scale-105 transition-all duration-200 cursor-pointer border border-mystical-red/30 hover:border-mystical-red/50 hover:shadow-lg" data-testid="card-recalls">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-mystical-red/20 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="text-mystical-red h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-starlight-400 mb-2">Safety Recalls</h3>
                    <p className="text-cosmic-300 text-sm">View active product recalls and safety alerts</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/community">
                <Card className="cosmic-card hover:scale-105 transition-all duration-200 cursor-pointer border border-starlight-500/30 hover:border-starlight-500/50 hover:shadow-lg" data-testid="card-community">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-starlight-500/20 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-starlight-500 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-starlight-400 mb-2">Community</h3>
                    <p className="text-cosmic-300 text-sm">Connect with other pet owners and share reviews</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Scans */}
            <Card className="cosmic-card" data-testid="card-recent-scans">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <History className="h-5 w-5" />
                  Recent Mystical Analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentScans?.length > 0 ? (
                  <div className="space-y-3">
                    {recentScans.slice(0, 3).map((scan: any) => (
                      <div key={scan.id} className="p-3 bg-cosmic-800/30 rounded-lg" data-testid={`scan-item-${scan.id}`}>
                        <p className="text-cosmic-200 text-sm">{scan.scannedData || 'Unknown Product'}</p>
                        <p className="text-cosmic-400 text-xs">
                          {new Date(scan.scannedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cosmic-400" data-testid="text-no-scans">No mystical analyses yet</p>
                    <Link href="/scan">
                      <Button className="mt-4 mystical-button" size="sm" data-testid="button-start-scanning">
                        Begin Your Journey
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Recalls */}
            <Card className="cosmic-card" data-testid="card-active-recalls">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-red">
                  <Shield className="h-5 w-5" />
                  Active Cosmic Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentRecalls?.length > 0 ? (
                  <div className="space-y-3">
                    {recentRecalls.slice(0, 2).map((recall: any) => (
                      <div key={recall.id} className="p-3 bg-mystical-red/10 border-l-2 border-mystical-red rounded-lg" data-testid={`recall-item-${recall.id}`}>
                        <p className="text-cosmic-200 text-sm font-medium">{recall.reason}</p>
                        <p className="text-mystical-red text-xs font-semibold uppercase">{recall.severity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cosmic-400" data-testid="text-no-recalls">No cosmic warnings active</p>
                    <p className="text-mystical-green text-xs mt-2">The realm is peaceful</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Reviews */}
            <Card className="cosmic-card" data-testid="card-user-reviews">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <BarChart3 className="h-5 w-5" />
                  Your Mystical Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userReviews?.length > 0 ? (
                  <div className="space-y-3">
                    {userReviews.slice(0, 3).map((review: any) => (
                      <div key={review.id} className="p-3 bg-cosmic-800/30 rounded-lg" data-testid={`review-item-${review.id}`}>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={i < review.rating ? 'text-mystical-green' : 'text-cosmic-600'}
                            >
                              🐾
                            </span>
                          ))}
                        </div>
                        <p className="text-cosmic-200 text-sm">{review.title}</p>
                        <p className="text-cosmic-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cosmic-400" data-testid="text-no-reviews">No mystical insights shared yet</p>
                    <Link href="/database">
                      <Button className="mt-4 mystical-button" size="sm" data-testid="button-share-insights">
                        Share Your Wisdom
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Access */}
          {user?.isAdmin && (
            <div className="mt-12">
              <Card className="cosmic-card border-starlight-500/50" data-testid="card-admin-access">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow">
                    <Crown className="text-2xl text-cosmic-900" />
                  </div>
                  <h3 className="font-mystical text-2xl text-starlight-500 mb-4" data-testid="text-syndicate-access">Audit Syndicate Access</h3>
                  <p className="text-cosmic-300 mb-6">Welcome, cosmic guardian. The divine command center awaits.</p>
                  <Link href="/admin">
                    <Button className="mystical-button" data-testid="button-enter-command">
                      Enter Command Center
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
