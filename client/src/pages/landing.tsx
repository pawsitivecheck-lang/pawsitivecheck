import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import RecallAlert from "@/components/recall-alert";
import UserReview from "@/components/user-review";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
// import CookieConsent from "@/components/cookie-consent";
import AdBanner from "@/components/ad-banner";
import HelpTooltip from "@/components/help-tooltip";
import DNTIndicator from "@/components/dnt-indicator";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Search, Shield, Users, Heart, Camera, BarChart3, AlertTriangle, Star, Menu, X, PawPrint, Crown, Eye, ChartLine, Ban, WandSparkles, TriangleAlert, UserCheck, Database } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

export default function Landing() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };
  
  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=3');
      return await res.json();
    },
  });

  const { data: recalls } = useQuery({
    queryKey: ['/api/recalls'],
    queryFn: async () => {
      const res = await fetch('/api/recalls');
      return await res.json();
    },
  });

  // Real data queries to replace mock data
  const { data: communityReviews, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const res = await fetch('/api/reviews?limit=3&featured=true');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    },
    retry: 1,
  });

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/dashboard');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    },
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Safety Alert Banner */}
      <div className="bg-red-600 text-white py-3 px-4 text-center text-sm md:text-base font-medium">
        <span className="block sm:inline">🚨 ALERT: New product recalls updated</span>
        <span className="hidden sm:inline"> • </span>
        <span className="block sm:inline">Check your pet's products now →</span>
      </div>

      {/* Top Leaderboard Ad */}
      <div className="bg-muted border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="header" />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 sm:space-x-3" data-testid="nav-logo">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="hidden md:block text-lg sm:text-xl lg:text-2xl font-bold text-primary">PawsitiveCheck</h1>
            </div>
            
            {/* Center Section - Search */}
            <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
              {/* Header Search - Now visible on all devices */}
              <div className="w-full max-w-md">
                <HeaderSearch />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* DNT Indicator */}
              <DNTIndicator />
              
              {/* Theme Toggle - Always visible */}
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Category Navigation Bar - Hidden on mobile */}
        <div className="hidden lg:block bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-3">
              <button onClick={() => scrollToSection('scanner')} className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-scan">Product Scanner</button>
              <button onClick={() => scrollToSection('database')} className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-database">Safety Database</button>
              <button onClick={() => scrollToSection('recalls')} className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-recalls">Recall Alerts</button>
              <Link to="/vet-finder" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-vets">Veterinary Network</Link>
              <button onClick={() => scrollToSection('community')} className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-community">Community Reviews</button>
              <button onClick={() => scrollToSection('resources')} className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-resources">Safety Resources</button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border shadow-lg">
            
            {/* Navigation Links */}
            <div className="px-4 py-4 space-y-2">
              
              
              <button 
                onClick={() => scrollToSection('recalls')}
                className="flex items-center py-3 px-3 text-foreground hover:text-primary hover:bg-muted transition-colors font-medium rounded-lg min-h-[44px] w-full text-left"
                data-testid="mobile-nav-recalls"
              >
                <AlertTriangle className="mr-3 h-5 w-5" />
                Recall Alerts
              </button>
              <Link 
                to="/vet-finder" 
                className="flex items-center py-3 px-3 text-foreground hover:text-primary hover:bg-muted transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-vets"
              >
                <Heart className="mr-3 h-5 w-5" />
                Veterinary Network
              </Link>
              <button 
                onClick={() => scrollToSection('community')}
                className="flex items-center py-3 px-3 text-foreground hover:text-primary hover:bg-muted transition-colors font-medium rounded-lg min-h-[44px] w-full text-left"
                data-testid="mobile-nav-community"
              >
                <Users className="mr-3 h-5 w-5" />
                Community Reviews
              </button>
              
              {/* Livestock Management Preview */}
              <Link 
                to="/livestock-preview"
                className="flex items-center py-3 px-3 text-foreground hover:text-primary hover:bg-muted transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-livestock-preview"
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Livestock Management Preview
              </Link>
              
              {/* Theme Toggle in Mobile */}
              <div className="flex items-center py-3 px-3">
                <span className="mr-3 text-foreground font-medium">Theme:</span>
                <ThemeToggle />
              </div>
              
              {/* Account Section in Mobile */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
                
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center py-3 px-3 mb-2">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <UserCheck className="mr-3 h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{user?.firstName || 'User'}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/pets"
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-pet-profiles"
                    >
                      <PawPrint className="mr-3 h-5 w-5" />
                      Pet Profiles
                    </Link>
                    
                    <Link 
                      to="/product-database"
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-database"
                    >
                      <Database className="mr-3 h-5 w-5" />
                      Safety Database
                    </Link>
                    
                    <a 
                      href="/api/logout"
                      className="flex items-center w-full py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-logout"
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </a>
                  </>
                ) : (
                  <>
                    <a 
                      href="/api/login"
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-sign-in"
                    >
                      <UserCheck className="mr-3 h-5 w-5" />
                      Sign In
                    </a>
                    <a 
                      href="/api/register"
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-nav-register"
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Create Account
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/20 py-12 sm:py-16 lg:py-20" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight" data-testid="text-welcome-title">
                Keep Your Pets Safe!
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Scan any pet product to get instant safety analysis, ingredient breakdown, and recall alerts. Make informed decisions for your pet's health.
              </p>
              {/* Comprehensive Search/Scan Bar */}
              <div className="w-full max-w-4xl mx-auto lg:mx-0">
                <div className="bg-card rounded-2xl shadow-xl border-2 border-primary/20 p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Check Any Pet Product for Safety</h3>
                    <p className="text-sm text-muted-foreground">Search our database, scan barcodes, or analyze ingredients instantly</p>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                    <Input 
                      type="text" 
                      placeholder="Search by product name, brand, ingredient, or barcode..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-xl focus:ring-3 focus:ring-primary/20 focus:border-primary text-lg placeholder:text-muted-foreground"
                      data-testid="input-comprehensive-search"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105 shadow-lg"
                      data-testid="button-search-database"
                    >
                      <Link to="/product-database">
                        <Search className="mr-2 h-5 w-5" />
                        Search Database
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105 shadow-lg"
                      data-testid="button-scan-barcode"
                    >
                      <Link to="/product-scanner">
                        <Camera className="mr-2 h-5 w-5" />
                        Scan Barcode
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild
                      variant="outline"
                      className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105"
                      data-testid="button-check-recalls"
                    >
                      <Link to="/recalls">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Check Recalls
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Quick Tips */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      💡 <span className="font-medium">Pro tip:</span> Take a photo of ingredients list for instant analysis, or search by product name
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-green-500 text-white rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mx-auto mb-1" />
                  <div className="text-xs sm:text-sm font-bold">SAFETY</div>
                  <div className="text-xs sm:text-sm">FIRST</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-muted to-muted/80 rounded-lg h-64 sm:h-80 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">Product scanning technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page Banner Ad */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="banner" position="mid-page" />
        </div>
      </div>

      {/* Service Cards */}
      <section className="py-12 sm:py-16 bg-card" id="scanner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 text-center border border-border hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-instant">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Instant Safety Check</h3>
                <HelpTooltip 
                  content="Our rapid analysis system scans product ingredients against our comprehensive safety database in real-time. Uses FDA recall data, veterinary toxicity research, allergen databases, and ingredient safety profiles to provide immediate risk assessment for your pet's specific needs."
                  side="top"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">Get immediate safety scores and ingredient analysis for any product</p>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border border-border hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-analysis">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Detailed Analysis</h3>
                <HelpTooltip 
                  content="Deep-dive into every ingredient with molecular-level analysis. Includes toxicity studies, dosage thresholds, species-specific reactions, interaction warnings, manufacturing source verification, and quality control assessments. Perfect for pets with allergies or health conditions."
                  side="top"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">Get comprehensive safety scores and ingredient breakdowns</p>
            </Card>
            
            
            
            <Card className="p-4 sm:p-6 text-center border border-border hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-alerts">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">🚨 Real-time Alerts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">Get instant notifications about product recalls and safety issues</p>
              <Button 
                asChild
                variant="outline"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 text-sm w-full min-h-[44px] transition-all transform hover:scale-105"
                data-testid="button-view-alerts"
              >
                <Link to="/recalls">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  View Alerts
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted" id="database">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-featured-title">Recently Analyzed Products</h2>
              <HelpTooltip 
                content="These are the latest products analyzed by our platform and community. Each product shows comprehensive safety analysis including paw ratings (1-5 paws), cosmic clarity assessment (blessed/questionable/cursed), ingredient concerns, UPC codes, transparency scores, and community reviews. Click any product for detailed analysis including molecular ingredient breakdown and veterinary safety research."
                side="right"
              />
            </div>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-featured-description">See safety scores and detailed analysis from our community</p>
          </div>
          
          {/* Square Ad - Featured Products Section */}
          <div className="flex justify-center mb-8">
            <AdBanner size="square" position="featured-products" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {(Array.isArray(featuredProducts) && featuredProducts.length > 0) ? (
              featuredProducts.slice(0, 3).map((product: any) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <ProductCard 
                    product={product}
                    onClick={() => {}}
                  />
                </Link>
              ))
            ) : (
              // Empty state
              [...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card border border-border hover:shadow-lg transition-shadow" data-testid={`card-product-placeholder-${i}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-40 sm:h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm" data-testid="text-no-products">No products analyzed yet...</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recall Alerts */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-red-50" id="recalls">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl border border-red-200 p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4" data-testid="icon-recall-alert">
                <TriangleAlert className="text-xl sm:text-2xl text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2" data-testid="text-recall-title">Safety Recall Alerts</h2>
              <p className="text-muted-foreground text-sm sm:text-base" data-testid="text-recall-description">Stay informed about important product safety alerts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {(Array.isArray(recalls) && recalls.length > 0) ? (
                recalls.slice(0, 2).map((recall: any) => (
                  <RecallAlert key={recall.id} recall={recall} />
                ))
              ) : (
                <div className="col-span-full text-center py-6 sm:py-8">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm sm:text-base" data-testid="text-no-recalls">No active safety alerts at this time</p>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">We'll notify you immediately if any issues arise</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <Button 
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 text-base min-h-[48px] transition-all transform hover:scale-105"
                data-testid="button-view-warnings"
              >
                <a href="/api/login">
                  <Shield className="mr-2 h-4 w-4" />
                  View All Safety Alerts
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card" id="community">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-community-title">Safety Community</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-community-description">Pet parents sharing their safety experiences and product reviews</p>
          </div>
          
          {/* Community Reviews - Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {reviewsLoading ? (
              // Loading state
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))
            ) : reviewsError ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                <p className="text-red-500 text-sm sm:text-base">Unable to load community reviews</p>
                <p className="text-red-400 text-xs sm:text-sm mt-1">Please try again later</p>
              </div>
            ) : (Array.isArray(communityReviews) && communityReviews.length > 0) ? (
              // Real reviews data
              communityReviews.map((review: any) => (
                <UserReview 
                  key={review.id}
                  username={review.username}
                  userType={review.userType}
                  content={review.content}
                  rating={review.rating}
                  timeAgo={review.timeAgo}
                  icon={<Star className="text-xs" />}
                />
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm sm:text-base">Community reviews will appear here</p>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">Join our community to share your safety experiences</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base min-h-[48px] transition-all transform hover:scale-105"
              data-testid="button-join-community"
            >
              <a href="/api/login">
                <Users className="mr-2 h-4 w-4" />
                Join Safety Community
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Safety Resources Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-blue-50" id="resources">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6" data-testid="icon-resources">
              <Shield className="text-xl sm:text-2xl text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-resources-title">Safety Resources</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-resources-description">Access comprehensive pet safety information and emergency contacts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
              <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Emergency Contacts</h3>
              <p className="text-muted-foreground text-sm mb-4">24/7 pet poison control and emergency veterinary services</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/vet-finder">Find Emergency Vets</Link>
              </Button>
            </Card>
            
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
              <Search className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Safety Guides</h3>
              <p className="text-muted-foreground text-sm mb-4">Learn about ingredient safety and product evaluation</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/ingredient-transparency">View Guides</Link>
              </Button>
            </Card>
            
            <Card className="p-6 text-center border border-border hover:shadow-lg transition-all duration-300">
              <AlertTriangle className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Recall Alerts</h3>
              <p className="text-muted-foreground text-sm mb-4">Stay updated on the latest product recalls and safety warnings</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/recalls">View Recalls</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted" id="admin">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6" data-testid="icon-admin">
              <Crown className="text-xl sm:text-2xl text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-admin-title">Admin Dashboard</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-admin-description">Comprehensive tools for managing safety data and community oversight</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 sm:p-6 lg:p-8 border border-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Safety Analytics */}
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4" data-testid="icon-analytics">
                  <ChartLine className="text-lg sm:text-2xl text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-analytics-title">Safety Analytics</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Products Analyzed:</span>
                    <span className="text-green-600 font-bold text-sm sm:text-base" data-testid="text-products-analyzed">
                      {analyticsLoading ? 'Loading...' : analyticsError ? 'N/A' : (analytics?.productsAnalyzed?.toLocaleString() || '0')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Active Users:</span>
                    <span className="text-blue-600 font-bold text-sm sm:text-base" data-testid="text-active-users">
                      {analyticsLoading ? 'Loading...' : analyticsError ? 'N/A' : (analytics?.activeUsers?.toLocaleString() || '0')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Safety Alerts:</span>
                    <span className="text-red-600 font-bold text-sm sm:text-base" data-testid="text-safety-alerts">
                      {analyticsLoading ? 'Loading...' : analyticsError ? 'N/A' : (analytics?.safetyAlerts?.toString() || '0')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Recall Management */}
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4" data-testid="icon-recalls">
                  <Ban className="text-lg sm:text-2xl text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-recalls-title">Recall Management</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-card rounded-lg p-2 sm:p-3 border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Latest Recall:</div>
                    <div className="text-sm text-red-600 font-medium" data-testid="text-latest-recall">
                      {(Array.isArray(recalls) && recalls.length > 0) ? recalls[0].productName : 'No active recalls'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100 min-h-[40px] text-sm"
                    data-testid="button-manage-recalls"
                  >
                    Manage Recalls
                  </Button>
                </div>
              </div>
              
              {/* System Management */}
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4" data-testid="icon-system">
                  <Database className="text-lg sm:text-2xl text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-system-title">System Management</h3>
                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 min-h-[40px] text-sm"
                    data-testid="button-update-ai"
                  >
                    Update AI Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 min-h-[40px] text-sm"
                    data-testid="button-update-database"
                  >
                    Update Safety Database
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer Ad */}
      <div className="bg-card py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="pre-footer" />
        </div>
      </div>

      <Footer />

      {/* Cookie Consent */}
      {/* <CookieConsent /> */}
    </div>
  );
}
