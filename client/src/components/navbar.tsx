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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PawsitiveCheck</h1>
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
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  data-testid="nav-profile-dropdown"
                >
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-5 h-5 rounded-full mr-2"
                    />
                  ) : (
                    <Users className="mr-2 h-4 w-4" />
                  )}
                  {user?.firstName || 'Profile'}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center w-full">
                      <Crown className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
