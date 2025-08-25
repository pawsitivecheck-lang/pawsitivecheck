import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import RecallAlert from "@/components/recall-alert";
import UserReview from "@/components/user-review";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import SimpleCookieConsent from "@/components/simple-cookie-consent";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Search, Shield, Users, Heart, Camera, BarChart3, AlertTriangle, Star, Menu, X, PawPrint, Crown, Eye, ChartLine, Ban, WandSparkles, TriangleAlert, UserCheck, Database } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Landing() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
      <div className="bg-red-600 text-white py-3 px-4 text-center text-sm md:text-base font-medium">
        <span className="block sm:inline">🚨 ALERT: New product recalls updated</span>
        <span className="hidden sm:inline"> • </span>
        <span className="block sm:inline">Check your pet's products now →</span>
      </div>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 sm:space-x-3" data-testid="nav-logo">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">PawsitiveCheck</h1>
            </div>
            
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] border border-gray-200"
                  data-testid="button-user-menu"
                >
                  {isAuthenticated ? (
                    <>
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="hidden sm:inline font-medium text-gray-700">{user?.firstName || 'Account'}</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-5 w-5 text-gray-600" />
                      <span className="hidden sm:inline font-medium text-gray-700">Account</span>
                    </>
                  )}
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <button 
                          onClick={() => {
                            window.location.href = '/pets';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-pet-profiles-dropdown"
                        >
                          <PawPrint className="mr-3 h-4 w-4" />
                          Pet Profiles
                        </button>
                        <button 
                          onClick={() => {
                            window.location.href = '/database';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-database-dropdown"
                        >
                          <Database className="mr-3 h-4 w-4" />
                          Safety Database
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={() => {
                            window.location.href = '/api/logout';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-logout-dropdown"
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            window.location.href = '/api/login';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-sign-in-dropdown"
                        >
                          <UserCheck className="mr-3 h-4 w-4" />
                          Sign In
                        </button>
                        <button 
                          onClick={() => {
                            window.location.href = '/api/register';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-register-dropdown"
                        >
                          <Users className="mr-3 h-4 w-4" />
                          Create Account
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={() => {
                            window.location.href = '/help';
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center min-h-[44px]"
                          data-testid="button-help-dropdown"
                        >
                          <Heart className="mr-3 h-4 w-4" />
                          Help & Support
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Category Navigation Bar - Hidden on mobile */}
        <div className="hidden lg:block bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-3">
              <a href="#scanner" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-scan">Product Scanner</a>
              <a href="#database" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-database">Safety Database</a>
              <a href="#recalls" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-recalls">Recall Alerts</a>
              <a href="#vets" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-vets">Veterinary Network</a>
              <a href="#community" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-community">Community Reviews</a>
              <a href="#resources" className="hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors min-h-[44px] flex items-center" data-testid="nav-resources">Safety Resources</a>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
            
            {/* Navigation Links */}
            <div className="px-4 py-4 space-y-2">
              <a 
                href="#scanner" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-scan"
              >
                <Camera className="mr-3 h-5 w-5" />
                Product Scanner
              </a>
              <a 
                href="#database" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-database"
              >
                <Database className="mr-3 h-5 w-5" />
                Safety Database
              </a>
              <a 
                href="#recalls" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-recalls"
              >
                <AlertTriangle className="mr-3 h-5 w-5" />
                Recall Alerts
              </a>
              <a 
                href="#vets" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-vets"
              >
                <Heart className="mr-3 h-5 w-5" />
                Veterinary Network
              </a>
              <a 
                href="#community" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-community"
              >
                <Users className="mr-3 h-5 w-5" />
                Community Reviews
              </a>
              
              {/* Account Section in Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
                
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
                    
                    <button 
                      onClick={() => {
                        window.location.href = '/pets';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      data-testid="mobile-nav-pet-profiles"
                    >
                      <PawPrint className="mr-3 h-5 w-5" />
                      Pet Profiles
                    </button>
                    
                    <button 
                      onClick={() => {
                        window.location.href = '/database';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      data-testid="mobile-nav-database"
                    >
                      <Database className="mr-3 h-5 w-5" />
                      Safety Database
                    </button>
                    
                    <button 
                      onClick={() => {
                        window.location.href = '/api/logout';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      data-testid="mobile-nav-logout"
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        window.location.href = '/api/login';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      data-testid="mobile-nav-sign-in"
                    >
                      <UserCheck className="mr-3 h-5 w-5" />
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        window.location.href = '/api/register';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-lg min-h-[44px]"
                      data-testid="mobile-nav-register"
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-12 sm:py-16 lg:py-20" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight" data-testid="text-welcome-title">
                Keep Your Pets Safe!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Scan any pet product to get instant safety analysis, ingredient breakdown, and recall alerts. Make informed decisions for your pet's health.
              </p>
              {/* Comprehensive Search/Scan Bar */}
              <div className="w-full max-w-4xl mx-auto lg:mx-0">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Any Pet Product for Safety</h3>
                    <p className="text-sm text-gray-600">Search our database, scan barcodes, or analyze ingredients instantly</p>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <Input 
                      type="text" 
                      placeholder="Search by product name, brand, ingredient, or barcode..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 text-lg placeholder:text-gray-400"
                      data-testid="input-comprehensive-search"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      onClick={() => window.location.href = '/database'}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105 shadow-lg"
                      data-testid="button-search-database"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search Database
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/scan'}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105 shadow-lg"
                      data-testid="button-scan-barcode"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Scan Barcode
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/recalls'}
                      variant="outline"
                      className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-4 rounded-xl text-base flex items-center justify-center min-h-[52px] transition-all transform hover:scale-105"
                      data-testid="button-check-recalls"
                    >
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Check Recalls
                    </Button>
                  </div>
                  
                  {/* Quick Tips */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
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
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 sm:h-80 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">Product scanning technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-12 sm:py-16 bg-white" id="scanner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-instant">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Instant Safety Check</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Get immediate safety scores and ingredient analysis for any product</p>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-analysis">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Detailed Analysis</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Get comprehensive safety scores and ingredient breakdowns</p>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-scanner">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Camera className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📱 Product Scanner</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Scan barcodes or take photos to check product safety instantly</p>
              <Button 
                onClick={() => window.location.href = '/scan'}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full min-h-[44px] transition-all transform hover:scale-105"
                data-testid="button-scan-now"
              >
                <Camera className="mr-2 h-4 w-4" />
                Scan Now
              </Button>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="card-alerts">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="text-white h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">🚨 Real-time Alerts</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Get instant notifications about product recalls and safety issues</p>
              <Button 
                onClick={() => window.location.href = '/recalls'}
                variant="outline"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 text-sm w-full min-h-[44px] transition-all transform hover:scale-105"
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
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" id="database">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-featured-title">Recently Analyzed Products</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-featured-description">See safety scores and detailed analysis from our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts?.slice(0, 3).map((product: any) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => window.location.href = '/api/login'}
              />
            )) || (
              // Empty state
              [...Array(3)].map((_, i) => (
                <Card key={i} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow" data-testid={`card-product-placeholder-${i}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-40 sm:h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm" data-testid="text-no-products">No products analyzed yet...</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
          <div className="bg-white rounded-2xl border border-red-200 p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4" data-testid="icon-recall-alert">
                <TriangleAlert className="text-xl sm:text-2xl text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2" data-testid="text-recall-title">Safety Recall Alerts</h2>
              <p className="text-gray-600 text-sm sm:text-base" data-testid="text-recall-description">Stay informed about important product safety alerts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {recalls?.slice(0, 2).map((recall: any) => (
                <RecallAlert key={recall.id} recall={recall} />
              )) || (
                <div className="col-span-full text-center py-6 sm:py-8">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base" data-testid="text-no-recalls">No active safety alerts at this time</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">We'll notify you immediately if any issues arise</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 text-base min-h-[48px] transition-all transform hover:scale-105"
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
          {/* Mystical Message */}
          <div className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center border border-purple-500 shadow-2xl">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center justify-center gap-2">
                <span>🌟</span> Their Mystical Message <span>🌟</span>
              </h3>
              <div className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 space-y-3 sm:space-y-4">
                <p>
                  "Greetings, dear human! 🐱 We are <span className="text-purple-400 font-bold">Aleister</span> 🧙‍♂️ and <span className="text-white font-bold">Severus</span> 🛡️, your mystical 
                  feline guardians from the legendary <span className="text-yellow-400 font-bold">Audit Syndicate!</span> ✨
                </p>
                <p>
                  Through <span className="text-purple-400">cosmic divination</span> 🌙 and <span className="text-yellow-400">ancient wisdom</span> 📚, we'll help you pierce the veil 
                  of corporate deception and discover the <span className="text-green-400 font-bold">TRUE ESSENCE</span> 💎 of every pet product!
                </p>
                <p>
                  Join our purr-fectly magical mission of transparency and protection! 🐾❤️"
                </p>
              </div>
              <div className="flex justify-center space-x-3 sm:space-x-4 text-xl sm:text-2xl">
                <span>🐱</span><span>✨</span><span>🧙‍♂️</span><span>🛡️</span><span>🌟</span><span>🐾</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-community-title">Safety Community</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-community-description">Pet parents sharing their safety experiences and product reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
          
          <div className="text-center mt-8 sm:mt-12">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base min-h-[48px] transition-all transform hover:scale-105"
              data-testid="button-join-community"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Safety Community
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6" data-testid="icon-admin">
              <Crown className="text-xl sm:text-2xl text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-admin-title">Admin Dashboard</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto" data-testid="text-admin-description">Comprehensive tools for managing safety data and community oversight</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Safety Analytics */}
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4" data-testid="icon-analytics">
                  <ChartLine className="text-lg sm:text-2xl text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-analytics-title">Safety Analytics</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Products Analyzed:</span>
                    <span className="text-green-600 font-bold text-sm sm:text-base" data-testid="text-products-analyzed">12,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Active Users:</span>
                    <span className="text-blue-600 font-bold text-sm sm:text-base" data-testid="text-active-users">8,432</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Safety Alerts:</span>
                    <span className="text-red-600 font-bold text-sm sm:text-base" data-testid="text-safety-alerts">23</span>
                  </div>
                </div>
              </div>
              
              {/* Recall Management */}
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4" data-testid="icon-recalls">
                  <Ban className="text-lg sm:text-2xl text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-recalls-title">Recall Management</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-white rounded-lg p-2 sm:p-3 border">
                    <div className="text-xs text-gray-500 mb-1">Latest Recall:</div>
                    <div className="text-sm text-red-600 font-medium" data-testid="text-latest-recall">Pet Food Brand XYZ</div>
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
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4" data-testid="text-system-title">System Management</h3>
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

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6" data-testid="footer-logo">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">PawsitiveCheck</h3>
            </div>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" data-testid="text-footer-mission">
              Empowering pet parents with transparent safety analysis and 
              comprehensive product information for healthier pets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4" data-testid="text-mission-title">Our Mission</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li data-testid="text-mission-analysis">Comprehensive Safety Analysis</li>
                <li data-testid="text-mission-transparency">Ingredient Transparency</li>
                <li data-testid="text-mission-truth">Corporate Accountability</li>
                <li data-testid="text-mission-protection">Pet Health Protection</li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4" data-testid="text-features-title">Key Features</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li data-testid="text-feature-scanner">Product Scanner</li>
                <li data-testid="text-feature-database">Safety Database</li>
                <li data-testid="text-feature-alerts">Recall Alerts</li>
                <li data-testid="text-feature-community">Community Reviews</li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4" data-testid="text-contact-title">Contact Us</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li data-testid="text-contact-email">pawsitivecheck@gmail.com</li>
                <li data-testid="text-contact-support">Customer Support</li>
                <li data-testid="text-contact-feedback">Feedback Portal</li>
                <li data-testid="text-contact-hotline">Safety Hotline</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-6 sm:pt-8">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <a 
                href="/admin" 
                className="text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center px-2 py-2"
                data-testid="link-admin"
              >
                Admin
              </a>
              <a 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center px-2 py-2"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service" 
                className="text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center px-2 py-2"
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
                className="text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center px-2 py-2"
                data-testid="button-cookie-preferences"
              >
                Cookie Preferences
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm leading-relaxed" data-testid="text-copyright">
                © 2025 PawsitiveCheck - Professional pet product safety analysis platform
              </p>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed" data-testid="text-motto">
                "Transparency for safer pets, accountability for better products"
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <SimpleCookieConsent />
    </div>
  );
}
