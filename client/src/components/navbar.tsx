import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Crown, Search, Shield, Users, Camera, Heart } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Mystical Scanner', href: '/scan', icon: Camera },
    { name: 'Cosmic Database', href: '/database', icon: Search },
    { name: 'Cosmic Warnings', href: '/recalls', icon: Shield },
    { name: 'Vet Locator', href: '/vets', icon: Heart },
    { name: 'Resistance Hub', href: '/community', icon: Users },
  ];

  const isActivePage = (href: string) => location === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-cosmic-900/90 backdrop-blur-md border-b border-starlight-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="nav-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center animate-glow">
              <svg className="w-6 h-6 text-cosmic-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h1 className="font-mystical text-2xl font-semibold text-starlight-500">PawsitiveCheck</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActivePage(item.href) 
                      ? 'text-starlight-400 bg-starlight-500/10' 
                      : 'text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-800/50'
                  }`} data-testid={`nav-${item.href.slice(1)}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Header Search */}
          <HeaderSearch />
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Admin Badge */}
            {user?.isAdmin && (
              <Link href="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`border-starlight-500 text-starlight-500 hover:bg-starlight-500/10 ${
                    isActivePage('/admin') ? 'bg-starlight-500/10' : ''
                  }`}
                  data-testid="nav-admin"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Syndicate
                </Button>
              </Link>
            )}

            {/* Profile */}
            <Link href="/profile">
              <Button 
                variant="outline" 
                size="sm"
                className={`border-cosmic-600 text-cosmic-300 hover:bg-cosmic-600/10 ${
                  isActivePage('/profile') ? 'bg-cosmic-600/10' : ''
                }`}
                data-testid="nav-profile"
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-5 h-5 rounded-full mr-1"
                  />
                ) : (
                  <Users className="mr-1 h-3 w-3" />
                )}
                {user?.firstName || 'Profile'}
              </Button>
            </Link>

            {/* Logout */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="border-mystical-red text-mystical-red hover:bg-mystical-red/10"
              data-testid="nav-logout"
            >
              Leave Realm
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-cosmic-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-cosmic-700 py-4" data-testid="nav-mobile-menu">
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <HeaderSearch isMobile={true} />
            </div>
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div 
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActivePage(item.href) 
                          ? 'text-starlight-400 bg-starlight-500/10' 
                          : 'text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-800/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-mobile-${item.href.slice(1)}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
              
              {user?.isAdmin && (
                <Link href="/admin">
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActivePage('/admin') 
                        ? 'text-starlight-400 bg-starlight-500/10' 
                        : 'text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-800/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="nav-mobile-admin"
                  >
                    <Crown className="h-5 w-5" />
                    <span>Syndicate Command</span>
                  </div>
                </Link>
              )}
              
              {/* Mobile Profile Section */}
              <div className="border-t border-cosmic-700 pt-4 mt-4">
                <Link href="/profile">
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActivePage('/profile') 
                        ? 'text-starlight-400 bg-starlight-500/10' 
                        : 'text-cosmic-200 hover:text-starlight-400 hover:bg-cosmic-800/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="nav-mobile-profile"
                  >
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                    <span>{user?.firstName || 'Profile'}</span>
                  </div>
                </Link>
                
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-mystical-red hover:text-mystical-red hover:bg-mystical-red/10 cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/api/logout';
                  }}
                  data-testid="nav-mobile-logout"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Leave Realm</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
