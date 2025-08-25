import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Crown, Search, Shield, Users, Camera, Heart, PawPrint } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Product Scanner', href: '/scan', icon: Camera },
    { name: 'Safety Database', href: '/database', icon: Search },
    { name: 'Recall Alerts', href: '/recalls', icon: Shield },
    { name: 'Vet Locator', href: '/vets', icon: Heart },
    { name: 'Pet Profiles', href: '/pets', icon: PawPrint },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isActivePage = (href: string) => location === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="nav-logo">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">PawsitiveCheck</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActivePage(item.href) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                  className={`border-blue-500 text-blue-600 hover:bg-blue-50 ${
                    isActivePage('/admin') ? 'bg-blue-50' : ''
                  }`}
                  data-testid="nav-admin"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Profile */}
            <Link href="/profile">
              <Button 
                variant="outline" 
                size="sm"
                className={`border-gray-300 text-gray-600 hover:bg-gray-50 ${
                  isActivePage('/profile') ? 'bg-gray-50' : ''
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
              className="border-red-500 text-red-600 hover:bg-red-50"
              data-testid="nav-logout"
            >
              Sign Out
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4" data-testid="nav-mobile-menu">
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
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="nav-mobile-admin"
                  >
                    <Crown className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </div>
                </Link>
              )}
              
              {/* Mobile Profile Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link href="/profile">
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActivePage('/profile') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/api/logout';
                  }}
                  data-testid="nav-mobile-logout"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
