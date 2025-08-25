import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import RecallAlert from "@/components/recall-alert";
import UserReview from "@/components/user-review";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, Users, Heart, Camera, BarChart3, AlertTriangle, Star, Menu, X, PawPrint, Crown, Eye, ChartLine, Ban, WandSparkles, TriangleAlert, UserCheck, Database } from "lucide-react";
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
                  placeholder="Search products, ingredients, or brands for safety analysis..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid="input-search"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded" data-testid="button-search">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                data-testid="button-sign-in"
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Button>
              
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
              <a href="#database" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-database">Safety Database</a>
              <a href="#recalls" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-recalls">Recall Alerts</a>
              <a href="#vets" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-vets">Veterinary Network</a>
              <a href="#community" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-community">Community Reviews</a>
              <a href="#resources" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium" data-testid="nav-resources">Safety Resources</a>
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
                Safety Database
              </a>
              <a 
                href="#recalls" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-recalls"
              >
                Recall Alerts
              </a>
              <a 
                href="#vets" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-vets"
              >
                Veterinary Network
              </a>
              <a 
                href="#community" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-community"
              >
                Community Reviews
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
                Keep Your Pets Safe!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Scan any pet product to get instant safety analysis, ingredient breakdown, and recall alerts. Make informed decisions for your pet's health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.location.href = '/scan'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg flex items-center justify-center"
                  data-testid="button-scan-product"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Scan Product Now
                </Button>
                <Button 
                  onClick={() => window.location.href = '/database'}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg text-lg flex items-center justify-center"
                  data-testid="button-browse-database"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Safety Database
                </Button>
              </div>
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
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-instant">
              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Safety Check</h3>
              <p className="text-sm text-gray-600 mb-4">Get immediate safety scores and ingredient analysis for any product</p>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-analysis">
              <div className="w-12 h-12 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">Get detailed safety scores and ingredient breakdowns</p>
            </Card>
            
            <Card className="p-6 text-center border border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow" data-testid="card-scanner">
              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Camera className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">📱 Product Scanner</h3>
              <p className="text-sm text-gray-600 mb-4">Scan barcodes or take photos to check product safety instantly</p>
              <Button 
                onClick={() => window.location.href = '/scan'}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full"
                data-testid="button-scan-now"
              >
                <Camera className="mr-2 h-4 w-4" />
                Scan Now
              </Button>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow" data-testid="card-alerts">
              <div className="w-12 h-12 mx-auto bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">🚨 Real-time Alerts</h3>
              <p className="text-sm text-gray-600 mb-4">Get instant notifications about product recalls and safety issues</p>
              <Button 
                onClick={() => window.location.href = '/recalls'}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 text-sm w-full"
                data-testid="button-view-alerts"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Alerts
              </Button>
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
                <Card key={i} className="bg-white border border-gray-200" data-testid={`card-product-placeholder-${i}`}>
                  <CardContent className="p-6">
                    <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-gray-500" data-testid="text-no-products">No products analyzed yet...</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recall Alerts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50" id="recalls">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4" data-testid="icon-recall-alert">
                <TriangleAlert className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-2" data-testid="text-recall-title">Safety Recall Alerts</h2>
              <p className="text-gray-600" data-testid="text-recall-description">Stay informed about important product safety alerts</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recalls?.slice(0, 2).map((recall: any) => (
                <RecallAlert key={recall.id} recall={recall} />
              )) || (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500" data-testid="text-no-recalls">No active safety alerts at this time</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-view-warnings"
              >
                <Shield className="mr-2 h-4 w-4" />
                View All Safety Alerts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="community">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="text-community-title">Safety Community</h2>
            <p className="text-gray-600 text-lg" data-testid="text-community-description">Pet parents sharing their safety experiences and product reviews</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock community reviews for landing page */}
            <UserReview 
              username="Sarah_PetMom"
              userType="Verified Pet Parent"
              content="The ingredient scanner helped me identify artificial preservatives in my cat's food that were causing digestive issues. Switched to a cleaner formula and saw immediate improvement!"
              rating={5}
              timeAgo="2 days ago"
              icon={<Search className="text-xs" />}
            />
            <UserReview 
              username="VetTechMike"
              userType="Veterinary Professional"
              content="The detailed safety analysis is incredibly thorough. I recommend this tool to all my clients - it provides transparency that's often missing from product marketing."
              rating={5}
              timeAgo="1 week ago"
              icon={<Shield className="text-xs" />}
            />
            <UserReview 
              username="DogDad_Alex"
              userType="Safety Advocate"
              content="The recall alert system saved my dog from a contaminated batch of treats. The real-time notifications are a lifesaver for busy pet parents like me."
              rating={5}
              timeAgo="3 days ago"
              icon={<TriangleAlert className="text-xs" />}
            />
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-join-community"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Safety Community
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6" data-testid="icon-admin">
              <Crown className="text-2xl text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="text-admin-title">Admin Dashboard</h2>
            <p className="text-gray-600 text-lg" data-testid="text-admin-description">Comprehensive tools for managing safety data and community oversight</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Safety Analytics */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4" data-testid="icon-analytics">
                  <ChartLine className="text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" data-testid="text-analytics-title">Safety Analytics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products Analyzed:</span>
                    <span className="text-green-600 font-bold" data-testid="text-products-analyzed">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users:</span>
                    <span className="text-blue-600 font-bold" data-testid="text-active-users">8,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Safety Alerts:</span>
                    <span className="text-red-600 font-bold" data-testid="text-safety-alerts">23</span>
                  </div>
                </div>
              </div>
              
              {/* Recall Management */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4" data-testid="icon-recalls">
                  <Ban className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" data-testid="text-recalls-title">Recall Management</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">Latest Recall:</div>
                    <div className="text-sm text-red-600" data-testid="text-latest-recall">Pet Food Brand XYZ</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    data-testid="button-manage-recalls"
                  >
                    Manage Recalls
                  </Button>
                </div>
              </div>
              
              {/* System Management */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4" data-testid="icon-system">
                  <Database className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" data-testid="text-system-title">System Management</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                    data-testid="button-update-ai"
                  >
                    Update AI Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
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

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6" data-testid="footer-logo">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">PawsitiveCheck</h3>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto" data-testid="text-footer-mission">
              Empowering pet parents with transparent safety analysis and 
              comprehensive product information for healthier pets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-4" data-testid="text-mission-title">Our Mission</h4>
              <ul className="space-y-2 text-gray-300">
                <li data-testid="text-mission-analysis">Comprehensive Safety Analysis</li>
                <li data-testid="text-mission-transparency">Ingredient Transparency</li>
                <li data-testid="text-mission-truth">Corporate Accountability</li>
                <li data-testid="text-mission-protection">Pet Health Protection</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-4" data-testid="text-features-title">Key Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li data-testid="text-feature-scanner">Product Scanner</li>
                <li data-testid="text-feature-database">Safety Database</li>
                <li data-testid="text-feature-alerts">Recall Alerts</li>
                <li data-testid="text-feature-community">Community Reviews</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-4" data-testid="text-contact-title">Contact Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li data-testid="text-contact-email">support@pawsitivecheck.com</li>
                <li data-testid="text-contact-support">Customer Support</li>
                <li data-testid="text-contact-feedback">Feedback Portal</li>
                <li data-testid="text-contact-hotline">Safety Hotline</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-8">
            <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
              <a 
                href="/admin" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
                data-testid="link-admin"
              >
                Admin
              </a>
              <a 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
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
                className="text-gray-400 hover:text-white text-sm transition-colors"
                data-testid="button-cookie-preferences"
              >
                Cookie Preferences
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm" data-testid="text-copyright">
                © 2024 PawsitiveCheck - Professional pet product safety analysis platform
              </p>
              <p className="text-gray-500 text-xs mt-2" data-testid="text-motto">
                "Transparency for safer pets, accountability for better products"
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
