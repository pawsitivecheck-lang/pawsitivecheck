import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, Users, Heart, PawPrint, LogOut, Tractor } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import PWAInstallButton from "@/components/pwa-install-button";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">PawsitiveCheck</h1>
            </Link>
          </div>
          
          {/* Center Search */}
          <div className="flex-1 flex items-center justify-center">
            <div className="hidden md:block">
              <HeaderSearch />
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <PWAInstallButton />
            <ThemeToggle />
            
            {/* Hamburger Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 border"
              data-testid="nav-hamburger-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Simple Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-4 top-16 w-64 bg-white dark:bg-gray-900 border rounded-lg shadow-lg z-50">
            {/* Mobile Search */}
            <div className="p-4 border-b md:hidden">
              <HeaderSearch isMobile={true} />
            </div>
            
            {/* Navigation Links */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
                Navigation
              </div>
              
              <Link href="/recalls" onClick={closeMenu}>
                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Shield className="h-4 w-4" />
                  <span>Recall Alerts</span>
                </div>
              </Link>
              
              <Link href="/vet-finder" onClick={closeMenu}>
                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Heart className="h-4 w-4" />
                  <span>Vet Locator</span>
                </div>
              </Link>
              
              <Link href="/community" onClick={closeMenu}>
                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </div>
              </Link>
              
              <Link href="/pets" onClick={closeMenu}>
                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <PawPrint className="h-4 w-4" />
                  <span>Pet Profiles</span>
                </div>
              </Link>
              
              <Link href="/livestock" onClick={closeMenu}>
                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Tractor className="h-4 w-4" />
                  <span>Livestock Management</span>
                </div>
              </Link>
            </div>

            {/* Account Section */}
            {user && (
              <div className="border-t p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
                  Account
                </div>
                
                <Link href="/profile" onClick={closeMenu}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Users className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                
                <div 
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 cursor-pointer"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Backdrop */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-transparent z-40"
            onClick={closeMenu}
          />
        )}
      </div>
    </nav>
  );
}