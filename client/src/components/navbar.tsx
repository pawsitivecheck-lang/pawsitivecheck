import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, Users, Heart, PawPrint, LogOut, Tractor, Camera } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import PWAInstallButton from "@/components/pwa-install-button";

// Force rebuild
export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/product-scanner', label: 'Product Scanner', icon: Camera },
    { href: '/recalls', label: 'Recall Alerts', icon: Shield },
    { href: '/vet-finder', label: 'Vet Locator', icon: Heart },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/pets', label: 'Pet Profiles', icon: PawPrint },
    { href: '/livestock', label: 'Livestock Management', icon: Tractor },
  ];

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3" data-testid="nav-logo">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">PawsitiveCheck</h1>
            </Link>

            {/* Center Search */}
            <div className="hidden md:block flex-1 mx-8">
              <HeaderSearch />
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              <ThemeToggle />
              
              {/* Hamburger Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuToggle}
                className="p-2"
                data-testid="hamburger-button"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b md:hidden">
              <HeaderSearch isMobile />
            </div>

            {/* Navigation */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                      <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}>
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Section */}
            {user && (
              <div className="p-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Account
                </h3>
                <div className="space-y-1">
                  <Link href="/profile" onClick={handleLinkClick}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Profile</span>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => window.location.href = '/api/logout'}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* User Info */}
            {user && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.firstName || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}