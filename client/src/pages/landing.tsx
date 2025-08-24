import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MascotCard from "@/components/mascot-card";
import ProductCard from "@/components/product-card";
import RecallAlert from "@/components/recall-alert";
import UserReview from "@/components/user-review";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { Eye, Search, Shield, Users, Crown, Camera, WandSparkles, ShieldHalf, TriangleAlert, ChartLine, Ban, Menu, X } from "lucide-react";
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
    <div className="min-h-screen text-cosmic-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-cosmic-900/90 backdrop-blur-md border-b border-starlight-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center animate-glow">
                <svg className="w-6 h-6 text-cosmic-900" fill="currentColor" viewBox="0 0 24 24">
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
              <h1 className="font-mystical text-2xl font-semibold text-starlight-500">PawsitiveCheck</h1>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#scanner" className="hover:text-starlight-400 transition-colors text-sm font-medium" data-testid="nav-scan">Scanner</a>
              <a href="#database" className="hover:text-starlight-400 transition-colors text-sm font-medium" data-testid="nav-database">Products</a>
              <a href="#recalls" className="hover:text-starlight-400 transition-colors text-sm font-medium" data-testid="nav-recalls">Safety</a>
              <a href="#vets" className="hover:text-starlight-400 transition-colors text-sm font-medium" data-testid="nav-vets">Vets</a>
              <a href="#community" className="hover:text-starlight-400 transition-colors text-sm font-medium" data-testid="nav-community">Reviews</a>
            </div>
            
            {/* Header Search */}
            <HeaderSearch />
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-cosmic-800 transition-colors"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-starlight-500" />
                ) : (
                  <Menu className="h-5 w-5 text-starlight-500" />
                )}
              </button>
              
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="hidden sm:inline-flex bg-gradient-to-r from-starlight-500 to-mystical-purple text-cosmic-900 hover:from-starlight-400 hover:to-mystical-purple font-medium"
                data-testid="button-login"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-cosmic-900/95 backdrop-blur-md border-b border-starlight-500/20">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="pb-4 border-b border-cosmic-700">
                <HeaderSearch isMobile={true} />
              </div>
              <a 
                href="#scanner" 
                className="block py-2 text-cosmic-100 hover:text-starlight-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-scan"
              >
                📱 Product Scanner
              </a>
              <a 
                href="#database" 
                className="block py-2 text-cosmic-100 hover:text-starlight-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-database"
              >
                📚 Browse Products
              </a>
              <a 
                href="#recalls" 
                className="block py-2 text-cosmic-100 hover:text-starlight-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-recalls"
              >
                ⚠️ Safety Alerts
              </a>
              <a 
                href="#vets" 
                className="block py-2 text-cosmic-100 hover:text-starlight-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-vets"
              >
                💚 Find Vets
              </a>
              <a 
                href="#community" 
                className="block py-2 text-cosmic-100 hover:text-starlight-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-community"
              >
                💬 Reviews
              </a>
              <div className="pt-4 border-t border-cosmic-700">
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full bg-gradient-to-r from-starlight-500 to-mystical-purple text-cosmic-900 hover:from-starlight-400 hover:to-mystical-purple font-medium"
                  data-testid="mobile-button-login"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Welcome Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" id="hero">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-8">
              <h2 className="font-mystical text-6xl md:text-8xl font-bold text-starlight-500 mb-4 animate-float" data-testid="text-welcome-title">
                ✨ Welcome, Fellow Seeker! ✨
              </h2>
              <div className="text-xl md:text-2xl text-cosmic-200 mb-6 animate-bounce">
                <span className="inline-block">🐾</span> 
                <span className="text-mystical-purple font-mystical">The cosmic cats have been expecting you...</span>
                <span className="inline-block">🌟</span>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto cosmic-card p-8 border-2 border-starlight-500/30 shadow-2xl">
              <div className="mb-6">
                <h3 className="font-mystical text-2xl text-starlight-400 mb-4">🎭 Meet Your Mystical Guides 🎭</h3>
                <p className="text-cosmic-300 text-lg">These enchanted feline guardians will guide you through the magical realm of pet product safety!</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div className="group hover:scale-105 transition-transform duration-300">
                  <MascotCard 
                    name="🔮 Aleister 🔮"
                    role="✨ Master of Mystical Analysis ✨"
                    icon={<WandSparkles className="text-5xl text-starlight-500 animate-pulse" />}
                    bgGradient="from-mystical-purple to-cosmic-600"
                  />
                  <div className="mt-4 p-3 bg-mystical-purple/10 rounded-lg border border-mystical-purple/30">
                    <p className="text-sm text-mystical-purple italic">"Meow! I see through corporate lies with my cosmic third eye! 👁️✨"</p>
                  </div>
                </div>
                
                <div className="group hover:scale-105 transition-transform duration-300">
                  <MascotCard 
                    name="🛡️ Severus 🛡️"
                    role="⚔️ Protector of Truth & Justice ⚔️"
                    icon={<ShieldHalf className="text-5xl text-starlight-500 animate-pulse" />}
                    bgGradient="from-midnight-600 to-cosmic-700"
                  />
                  <div className="mt-4 p-3 bg-midnight-600/10 rounded-lg border border-midnight-600/30">
                    <p className="text-sm text-midnight-400 italic">"Purr-fection through vigilance! I guard against dangerous ingredients! 🐾⚔️"</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-cosmic-900/60 via-mystical-purple/10 to-cosmic-900/60 rounded-xl border-2 border-starlight-500/40 shadow-inner">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl animate-bounce mr-2">🌟</span>
                  <h4 className="font-mystical text-xl text-starlight-400">Their Mystical Message</h4>
                  <span className="text-2xl animate-bounce ml-2">🌟</span>
                </div>
                <p className="font-mystical text-lg leading-relaxed text-cosmic-100 text-center" data-testid="text-welcome-message">
                  "<span className="text-starlight-400 text-xl">Greetings, dear human!</span> 🙋‍♀️ We are <span className="text-mystical-purple font-bold">Aleister</span> 🔮 and <span className="text-midnight-400 font-bold">Severus</span> 🛡️, 
                  your mystical feline guardians from the legendary <span className="text-starlight-400 font-bold">Audit Syndicate</span>! ✨<br/><br/>
                  Through <span className="text-mystical-purple">cosmic divination</span> 🌙 and <span className="text-starlight-400">ancient wisdom</span> 📚, 
                  we'll help you pierce the veil of corporate deception and discover the <span className="text-mystical-green font-bold">TRUE ESSENCE</span> 💎 
                  of every pet product! Join our <span className="text-starlight-400">purr-fectly magical mission</span> of transparency and protection! 🐾💖"
                </p>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <div className="animate-bounce" style={{animationDelay: '0s'}}>🐱</div>
                <div className="animate-bounce" style={{animationDelay: '0.1s'}}>✨</div>
                <div className="animate-bounce" style={{animationDelay: '0.2s'}}>🔮</div>
                <div className="animate-bounce" style={{animationDelay: '0.3s'}}>🛡️</div>
                <div className="animate-bounce" style={{animationDelay: '0.4s'}}>🌟</div>
                <div className="animate-bounce" style={{animationDelay: '0.5s'}}>🐾</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Magical Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="scanner">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mystical text-4xl font-bold text-starlight-500 mb-4">🎪 Choose Your Magical Adventure! 🎪</h2>
            <p className="text-cosmic-300 text-lg">Pick your preferred method to unveil the cosmic truth! ✨</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mystical Scanner */}
            <Card className="cosmic-card group hover:shadow-2xl hover:shadow-mystical-green/20 border-2 border-mystical-green/30 transition-all duration-300" data-testid="card-scanner">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-mystical-green to-starlight-500 rounded-full flex items-center justify-center mb-6 animate-glow group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Eye className="text-3xl text-cosmic-900 animate-pulse" />
                </div>
                <h3 className="font-mystical text-2xl text-starlight-400 mb-4" data-testid="text-scanner-title">📱 Aleister's Mystical Scanner 🔮</h3>
                <div className="bg-mystical-green/10 rounded-lg p-4 mb-4 border border-mystical-green/30">
                  <p className="text-mystical-green italic text-sm mb-2">"Meow! Point your magic rectangle at any product!" - Aleister ✨</p>
                </div>
                <p className="text-cosmic-200 mb-6" data-testid="text-scanner-description">🌟 Unleash the power of cosmic divination to analyze any pet product's true essence through camera magic!</p>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="mystical-button group-hover:scale-105 transition-transform"
                  data-testid="button-scan-product"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  🎯 Start Scanning Magic!
                </Button>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="text-xs text-cosmic-400">📷 Camera • 📊 Barcode • 🖼️ Photo</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Advanced Search Portal */}
            <Card className="cosmic-card group hover:shadow-2xl hover:shadow-mystical-purple/20 border-2 border-mystical-purple/30 transition-all duration-300" data-testid="card-search">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-midnight-600 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                  <Search className="text-3xl text-starlight-500 animate-pulse" />
                </div>
                <h3 className="font-mystical text-2xl text-starlight-400 mb-4" data-testid="text-search-title">🔍 Severus's Ingredient Oracle 🛡️</h3>
                <div className="bg-midnight-600/10 rounded-lg p-4 mb-4 border border-midnight-600/30">
                  <p className="text-midnight-400 italic text-sm mb-2">"Purr! I'll sniff out suspicious ingredients!" - Severus ⚔️</p>
                </div>
                <p className="text-cosmic-200 mb-6" data-testid="text-search-description">🌙 Peer through the cosmic veil to uncover suspicious ingredients and hidden truths in our mystical database!</p>
                <div className="relative mb-4">
                  <Input 
                    type="text" 
                    placeholder="✨ Search the mystical database... 🔮" 
                    className="w-full bg-cosmic-900/50 border border-cosmic-600 rounded-full px-6 py-3 pl-12 text-cosmic-100 placeholder-cosmic-400 focus:border-starlight-500 group-hover:glow"
                    data-testid="input-search"
                  />
                  <WandSparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 text-starlight-500 h-4 w-4 animate-spin" />
                </div>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-gradient-to-r from-mystical-purple to-midnight-600 text-starlight-400 hover:from-mystical-purple hover:to-midnight-500 group-hover:scale-105 transition-transform"
                  data-testid="button-divine-truth"
                >
                  🌟 Reveal Divine Truth!
                </Button>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="text-xs text-cosmic-400">🏷️ Brand • 📋 Ingredients • ⚠️ Safety</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-starlight-500/10 rounded-full px-6 py-3 border border-starlight-500/30">
              <p className="text-starlight-400 font-mystical">💫 Both tools work together to give you the complete cosmic picture! 💫</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="database">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mystical text-4xl font-bold text-starlight-500 mb-4" data-testid="text-featured-title">Recently Divined Products</h2>
            <p className="text-cosmic-300 text-lg" data-testid="text-featured-description">Our mystical analysis reveals the cosmic truth behind these products</p>
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
