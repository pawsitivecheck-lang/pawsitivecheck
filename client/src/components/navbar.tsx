import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Crown, Search, Shield, Users, Camera, Heart, PawPrint, ChevronDown, LogOut } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const navigation = [
    { name: 'Recall Alerts', href: '/recalls', icon: Shield },
    { name: 'Vet Locator', href: '/vets', icon: Heart },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isActivePage = (href: string) => location === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PawsitiveCheck</h1>
            </Link>
          </div>
          
          {/* Center Section - Search */}
          <div className="flex-1 flex items-center justify-center">
            {/* Header Search - Center on desktop */}
            <div className="hidden md:block">
              <HeaderSearch />
            </div>
          </div>
          
          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Hamburger Menu Button - Desktop */}
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 p-2 border border-gray-200 dark:border-gray-600"
                onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
                data-testid="nav-hamburger-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 dark:text-gray-300 p-2 border border-gray-200 dark:border-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Desktop Hamburger Sidebar */}
        {isHamburgerMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsHamburgerMenuOpen(false)}
              data-testid="hamburger-backdrop"
            />
            
            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl z-50 transform translate-x-0 transition-transform duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gray-900">
                <div className="flex items-center space-x-3">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-white">
                      {user?.firstName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHamburgerMenuOpen(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-2 bg-gray-900">
                <div className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
                  Navigation
                </div>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div 
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActivePage(item.href) 
                            ? 'text-blue-400 bg-blue-900/30' 
                            : 'text-gray-200 hover:text-blue-400 hover:bg-gray-700'
                        }`}
                        onClick={() => setIsHamburgerMenuOpen(false)}
                        data-testid={`hamburger-${item.href.slice(1)}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Profile Items */}
              <div className="p-4 border-t border-gray-600 bg-gray-900">
                <div className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
                  Account
                </div>
                <div className="space-y-2">
                  <Link href="/profile">
                    <div 
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:text-blue-400 hover:bg-gray-700 transition-colors"
                      onClick={() => setIsHamburgerMenuOpen(false)}
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </div>
                  </Link>
                  
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <div 
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:text-blue-400 hover:bg-gray-700 transition-colors"
                        onClick={() => setIsHamburgerMenuOpen(false)}
                      >
                        <Crown className="h-5 w-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </div>
                    </Link>
                  )}
                  
                  <div 
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors cursor-pointer"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4" data-testid="nav-mobile-menu">
            {/* Mobile Search */}
            <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Search Products</div>
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
              
              
              {/* Mobile Profile Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <span>{user?.firstName || 'Profile'}</span>
                  </div>
                </div>
                
                <Link href="/profile">
                  <div 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mx-0 ${
                      isActivePage('/profile') 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="nav-mobile-profile"
                  >
                    <Users className="h-5 w-5" />
                    <span>Profile</span>
                  </div>
                </Link>

                {user?.isAdmin && (
                  <Link href="/admin">
                    <div 
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mx-0 ${
                        isActivePage('/admin') 
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="nav-mobile-admin"
                    >
                      <Crown className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </div>
                  </Link>
                )}
                
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer mx-0"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/api/logout';
                  }}
                  data-testid="nav-mobile-logout"
                >
                  <LogOut className="h-5 w-5" />
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
