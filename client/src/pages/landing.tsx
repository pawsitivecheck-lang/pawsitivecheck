import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import RecallAlert from "@/components/recall-alert";
import UserReview from "@/components/user-review";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, Users, ShoppingCart, Heart, Camera, BarChart3, AlertTriangle, Star, Menu, X, PawPrint, Crown, Eye, ChartLine, Ban, WandSparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  return (
    <div className="min-h-screen bg-white">
      {/* Safety Alert Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-medium">
        🚨 ALERT: New product recalls updated • Check your pet's products now →
      </div>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Product Safety Reports</span>
              <span className="text-gray-600">Recall Alerts</span>
              <span className="text-gray-600">Safety Database</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">🛡️ 11,401,185 pets protected through safety analysis.</span>
              <span className="text-gray-600">Free safety analysis for all pet parents</span>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">PawsitiveCheck</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Search PawsitiveCheck..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid="input-search"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded" data-testid="button-search">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Sign In</span>
              </div>
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </div>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Category Navigation Bar */}
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-3">
              <a href="#scanner" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-scan">Product Scanner</a>
              <a href="#database" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-database">Shop by Pet</a>
              <a href="#recalls" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-recalls">Safety Alerts</a>
              <a href="#vets" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-vets">Pet Services</a>
              <a href="#community" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-community">Learning</a>
              <a href="#deals" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-deals">Deals</a>
              <a href="#wellness" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-wellness">Health & Wellness</a>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#scanner" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-scan"
              >
                Product Scanner
              </a>
              <a 
                href="#database" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-database"
              >
                Shop by Pet
              </a>
              <a 
                href="#recalls" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-recalls"
              >
                Safety Alerts
              </a>
              <a 
                href="#vets" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-vets"
              >
                Pet Services
              </a>
              <a 
                href="#community" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-community"
              >
                Learning
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-16" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6" data-testid="text-welcome-title">
                Protect pets you love!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Comprehensive safety analysis for pet products. Scan, analyze, and make informed decisions for your pet's health.
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
                data-testid="button-start-analysis"
              >
                Start Safety Analysis
              </Button>
            </div>
            <div className="relative">
              <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-xs font-bold">SAFETY</div>
                  <div className="text-xs">FIRST</div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Product scanning technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 bg-white" id="scanner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-register">
              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Registration</h3>
              <p className="text-sm text-gray-600 mb-4">Access comprehensive safety reports and personalized alerts</p>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-analysis">
              <div className="w-12 h-12 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">Get detailed safety scores and ingredient breakdowns</p>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-scanner">
              <div className="w-12 h-12 mx-auto bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Camera className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Product Scanner</h3>
              <p className="text-sm text-gray-600 mb-4">Scan barcodes to check product safety instantly</p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                data-testid="button-scan-product"
              >
                Start Scanning
              </Button>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-safety">
              <div className="w-12 h-12 mx-auto bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Safety Alerts</h3>
              <p className="text-sm text-gray-600 mb-4">Stay informed about product recalls</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" id="database">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="text-featured-title">Recently Analyzed Products</h2>
            <p className="text-gray-600 text-lg" data-testid="text-featured-description">See safety scores and detailed analysis from our community</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts?.slice(0, 3).map((product: any) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => window.location.href = '/api/login'}
              />
            )) || (
              // Empty state
              [...Array(3)].map((_, i) => (
                <Card key={i} className="cosmic-card" data-testid={`card-product-placeholder-${i}`}>
                  <CardContent className="p-6">
                    <div className="h-48 bg-cosmic-700 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-cosmic-400" data-testid="text-no-products">Awaiting cosmic analysis...</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-cosmic-700 rounded"></div>
                      <div className="h-4 bg-cosmic-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recall Alerts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cosmic-900/30" id="recalls">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-mystical-red/20 via-cosmic-800/60 to-mystical-red/20 rounded-2xl border border-mystical-red/30 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-mystical-red rounded-full flex items-center justify-center mb-4 animate-pulse" data-testid="icon-recall-alert">
                <TriangleAlert className="text-2xl text-white" />
              </div>
              <h2 className="font-mystical text-3xl font-bold text-mystical-red mb-2" data-testid="text-recall-title">Cosmic Recall Alerts</h2>
              <p className="text-cosmic-300" data-testid="text-recall-description">The universe has spoken - these products must be avoided</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recalls?.slice(0, 2).map((recall: any) => (
                <RecallAlert key={recall.id} recall={recall} />
              )) || (
                <div className="col-span-2 text-center py-8">
                  <p className="text-cosmic-400" data-testid="text-no-recalls">No cosmic warnings at this time</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-mystical-red to-orange-600 text-white hover:from-mystical-red hover:to-orange-500"
                data-testid="button-view-warnings"
              >
                <Shield className="mr-2 h-4 w-4" />
                View All Cosmic Warnings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="community">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mystical text-4xl font-bold text-starlight-500 mb-4" data-testid="text-community-title">The Resistance Community</h2>
            <p className="text-cosmic-300 text-lg" data-testid="text-community-description">Fellow seekers sharing their mystical discoveries</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock community reviews for landing page */}
            <UserReview 
              username="MysticWhiskers92"
              userType="Resistance Member"
              content="Thanks to Aleister's divination, I discovered my cat's food contained cursed preservatives. Switched to a blessed alternative and saw immediate improvement! 🐾✨"
              rating={5}
              timeAgo="2 days ago"
              icon={<Search className="text-xs" />}
            />
            <UserReview 
              username="CosmicPawGuardian"
              userType="Elder Member"
              content="Severus revealed that my 'premium' treats were filled with cosmic deception. The ingredient scanner is revolutionary - every pet parent needs this tool!"
              rating={5}
              timeAgo="1 week ago"
              icon={<Crown className="text-xs" />}
            />
            <UserReview 
              username="EtherealFeline"
              userType="Truth Seeker"
              content="The recall alert system saved my pets from a cursed batch! The mystical analysis goes beyond surface marketing - pure cosmic wisdom."
              rating={5}
              timeAgo="3 days ago"
              icon={<Eye className="text-xs" />}
            />
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="mystical-button"
              data-testid="button-join-resistance"
            >
              <Users className="mr-2 h-4 w-4" />
              Join the Resistance
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cosmic-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow" data-testid="icon-admin">
              <Crown className="text-2xl text-cosmic-900" />
            </div>
            <h2 className="font-mystical text-4xl font-bold text-starlight-500 mb-4" data-testid="text-admin-title">Audit Syndicate Command</h2>
            <p className="text-cosmic-300 text-lg" data-testid="text-admin-description">Reserved for the cosmic guardians and their trusted lieutenants</p>
          </div>
          
          <div className="cosmic-card p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Mystical Analytics */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-mystical-green/20 rounded-full flex items-center justify-center mb-4" data-testid="icon-analytics">
                  <ChartLine className="text-2xl text-mystical-green" />
                </div>
                <h3 className="font-mystical text-xl text-starlight-400 mb-2" data-testid="text-analytics-title">Cosmic Analytics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">Products Analyzed:</span>
                    <span className="text-mystical-green font-bold" data-testid="text-products-analyzed">∞</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">Truth Seekers:</span>
                    <span className="text-starlight-500 font-bold" data-testid="text-truth-seekers">∞</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cosmic-400">Cursed Products:</span>
                    <span className="text-mystical-red font-bold" data-testid="text-cursed-products">∞</span>
                  </div>
                </div>
              </div>
              
              {/* Blacklist Management */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-mystical-red/20 rounded-full flex items-center justify-center mb-4" data-testid="icon-blacklist">
                  <Ban className="text-2xl text-mystical-red" />
                </div>
                <h3 className="font-mystical text-xl text-starlight-400 mb-2" data-testid="text-blacklist-title">Cosmic Blacklist</h3>
                <div className="space-y-2">
                  <div className="bg-cosmic-900/50 rounded-lg p-2">
                    <div className="text-xs text-cosmic-400 mb-1">Recently Banished:</div>
                    <div className="text-sm text-mystical-red" data-testid="text-recently-banished">Awaiting divine judgment</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-mystical-red/20 text-mystical-red border-mystical-red/40 hover:bg-mystical-red/30"
                    data-testid="button-manage-banishments"
                  >
                    Manage Banishments
                  </Button>
                </div>
              </div>
              
              {/* Divine Powers */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-mystical-purple/20 rounded-full flex items-center justify-center mb-4" data-testid="icon-divine-powers">
                  <WandSparkles className="text-2xl text-mystical-purple" />
                </div>
                <h3 className="font-mystical text-xl text-starlight-400 mb-2" data-testid="text-divine-title">Divine Powers</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-mystical-purple/20 text-mystical-purple border-mystical-purple/40 hover:bg-mystical-purple/30"
                    data-testid="button-enhance-oracle"
                  >
                    Enhance AI Oracle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-starlight-500/20 text-starlight-500 border-starlight-500/40 hover:bg-starlight-500/30"
                    data-testid="button-update-database"
                  >
                    Update Cosmic Database
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-cosmic-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6" data-testid="footer-logo">
              <div className="w-12 h-12 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center animate-glow">
                <svg className="w-7 h-7 text-cosmic-900" fill="currentColor" viewBox="0 0 24 24">
                  {/* Mystical Pawprint */}
                  <path d="M12 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  <path d="M6 14c-.8 0-1.5-.7-1.5-1.5S5.2 11 6 11s1.5.7 1.5 1.5S6.8 14 6 14z"/>
                  <path d="M18 14c-.8 0-1.5-.7-1.5-1.5S17.2 11 18 11s1.5.7 1.5 1.5S18.8 14 18 14z"/>
                  <path d="M8.5 11c-.8 0-1.5-.7-1.5-1.5S7.7 8 8.5 8 10 8.7 10 9.5 9.3 11 8.5 11z"/>
                  <path d="M15.5 11c-.8 0-1.5-.7-1.5-1.5S14.7 8 15.5 8 17 8.7 17 9.5 16.3 11 15.5 11z"/>
                  <path d="M12 15c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  {/* Checkmark inside main pad */}
                  <path d="M10.5 11.5l1 1 2.5-2.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-mystical text-3xl font-bold text-starlight-500">PawsitiveCheck</h3>
            </div>
            <p className="text-cosmic-300 text-lg max-w-2xl mx-auto" data-testid="text-footer-mission">
              Guided by cosmic wisdom, protected by mystical guardians, 
              united in the eternal quest for pet product truth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h4 className="font-mystical text-xl text-starlight-400 mb-4" data-testid="text-mission-title">The Mission</h4>
              <ul className="space-y-2 text-cosmic-300">
                <li data-testid="text-mission-analysis">Cosmic Product Analysis</li>
                <li data-testid="text-mission-transparency">Ingredient Transparency</li>
                <li data-testid="text-mission-truth">Corporate Truth Seeking</li>
                <li data-testid="text-mission-protection">Pet Protection Rituals</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="font-mystical text-xl text-starlight-400 mb-4" data-testid="text-guardians-title">The Guardians</h4>
              <ul className="space-y-2 text-cosmic-300">
                <li data-testid="text-guardian-aleister">Aleister - Mystical Analyst</li>
                <li data-testid="text-guardian-severus">Severus - Truth Guardian</li>
                <li data-testid="text-guardian-syndicate">The Audit Syndicate</li>
                <li data-testid="text-guardian-community">Resistance Community</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="font-mystical text-xl text-starlight-400 mb-4" data-testid="text-contact-title">Contact the Void</h4>
              <ul className="space-y-2 text-cosmic-300">
                <li data-testid="text-contact-email">mystical@pawsitivecheck.cosmic</li>
                <li data-testid="text-contact-support">Astral Plane Support</li>
                <li data-testid="text-contact-feedback">Cosmic Feedback Portal</li>
                <li data-testid="text-contact-hotline">Emergency Truth Hotline</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cosmic-700 pt-8">
            <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
              <a 
                href="/admin" 
                className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
                data-testid="link-admin"
              >
                Admin
              </a>
              <a 
                href="/privacy-policy" 
                className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service" 
                className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
                data-testid="link-terms-service"
              >
                Terms of Service
              </a>
              <button 
                onClick={() => {
                  // Re-show cookie consent by clearing stored consent
                  localStorage.removeItem('cookie-consent');
                  window.location.reload();
                }}
                className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
                data-testid="button-cookie-preferences"
              >
                Cookie Preferences
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-cosmic-400 text-sm" data-testid="text-copyright">
                © 2024 PawsitiveCheck - Protected by cosmic forces and mystical encryption
              </p>
              <p className="text-cosmic-500 text-xs mt-2" data-testid="text-motto">
                "In truth we trust, in transparency we thrive" - The Audit Syndicate
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
