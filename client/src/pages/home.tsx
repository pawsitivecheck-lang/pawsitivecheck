import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Camera, Search, Shield, BarChart3, History, Crown, WandSparkles, PawPrint } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Top Banner Ad */}
      <div className="bg-card dark:bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="home-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="bg-card dark:bg-card rounded-lg p-12 text-center border border-border shadow-sm">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-center tracking-tight" 
                    data-testid="text-welcome-user">
                  Welcome back, {user?.firstName || 'Pet Parent'}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                  Your personalized pet product safety dashboard
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="w-12 h-12 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <WandSparkles className="text-lg text-white" />
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Advanced AI analysis ready for your products</p>
                  <p className="text-muted-foreground text-xs mt-1">Safety Analysis Engine</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="w-12 h-12 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="text-lg text-white" />
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">Real-time safety monitoring active</p>
                  <p className="text-gray-500 text-xs mt-1">Protection System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-8">Quick Actions</h2>
            
            {/* Mid-page Square Ad */}
            <div className="flex justify-center mb-8">
              <AdBanner size="square" position="home-mid" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/product-scanner">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-blue-300 dark:hover:border-blue-600" data-testid="card-quick-scan">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="text-blue-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Product Scanner</h3>
                    <p className="text-muted-foreground text-sm">Analyze products with barcode or image scanning</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/product-database">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-purple-300 dark:hover:border-purple-600" data-testid="card-database">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                      <Search className="text-purple-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Product Database</h3>
                    <p className="text-muted-foreground text-sm">Search and explore comprehensive product information</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/recalls">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-red-300 dark:hover:border-red-600" data-testid="card-recalls">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="text-red-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Safety Recalls</h3>
                    <p className="text-muted-foreground text-sm">View active product recalls and safety alerts</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/community">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-green-300 dark:hover:border-green-600" data-testid="card-community">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-green-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
                    <p className="text-muted-foreground text-sm">Connect with other pet owners and share reviews</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Link href="/submit-product-update">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-amber-300 dark:hover:border-amber-600" data-testid="card-submit-update">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                      <WandSparkles className="text-amber-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Submit Product Update</h3>
                    <p className="text-muted-foreground text-sm">Help improve our database with corrections and new info</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/pets">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-pink-300 dark:hover:border-pink-600" data-testid="card-pet-profiles">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                      <PawPrint className="text-pink-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Pet Profiles</h3>
                    <p className="text-muted-foreground text-sm">Manage your pet's health information and preferences</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin">
                <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-indigo-300 dark:hover:border-indigo-600" data-testid="card-admin">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                      <Crown className="text-indigo-600 h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Admin Dashboard</h3>
                    <p className="text-muted-foreground text-sm">Manage platform settings and moderate content</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Scans */}
            <Card className="bg-card border border-border" data-testid="card-recent-scans">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <History className="h-5 w-5" />
                  Recent Safety Analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(recentScans?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {recentScans?.slice(0, 3).map((scan: any) => (
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
                    <Link href="/product-scanner">
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
                {(recentRecalls?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {recentRecalls?.slice(0, 2).map((recall: any) => (
                      <div key={recall.id} className="p-3 bg-mystical-red/10 border-l-2 border-mystical-red rounded-lg" data-testid={`recall-item-${recall.id}`}>
                        <p className="text-cosmic-200 text-sm font-medium mb-2">{recall.reason}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-mystical-red text-xs font-semibold uppercase">{recall.severity}</p>
                          <a 
                            href={recall.sourceUrl || (recall.source === 'CPSC' ? 'https://www.cpsc.gov/Recalls' : 'https://www.fda.gov/animal-veterinary/recalls-withdrawals')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-starlight-400 hover:text-starlight-300 text-xs underline"
                            data-testid={`recall-source-link-${recall.id}`}
                          >
                            View {recall.source || 'Official'} Report →
                          </a>
                        </div>
                        <div className="mt-2 text-xs text-cosmic-400">
                          <strong>What to do:</strong> {recall.severity === 'urgent' 
                            ? 'Stop using immediately and contact your veterinarian if your pet has consumed this product.' 
                            : recall.severity === 'moderate' 
                              ? 'Discontinue use and monitor your pet for any adverse effects.'
                              : 'Consider switching to an alternative product when current supply is finished.'}
                        </div>
                        {recall.affectedBatches?.length > 0 && (
                          <div className="mt-2 text-xs text-cosmic-400">
                            <strong>Check batches:</strong> {recall.affectedBatches.slice(0, 2).join(', ')}
                            {recall.affectedBatches.length > 2 && ` + ${recall.affectedBatches.length - 2} more`}
                          </div>
                        )}
                        {recall.disposalInstructions && (
                          <div className="mt-2 p-2 bg-mystical-red/5 rounded border border-mystical-red/20">
                            <p className="text-xs font-semibold text-mystical-red mb-1">⚠️ Safe Disposal:</p>
                            <p className="text-xs text-cosmic-400" data-testid={`disposal-instructions-${recall.id}`}>
                              {recall.disposalInstructions}
                            </p>
                          </div>
                        )}
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
                {(userReviews?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {userReviews?.slice(0, 3).map((review: any) => (
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
                    <Link href="/product-database">
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
      
      {/* Bottom Banner Ad */}
      <div className="bg-card border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="banner" position="home-footer" />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
