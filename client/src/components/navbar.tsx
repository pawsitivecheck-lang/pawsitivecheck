import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, X, Shield, Users, Heart, PawPrint, LogOut, Tractor, Camera } from "lucide-react";
import HeaderSearch from "@/components/header-search";
import ThemeToggle from "@/components/theme-toggle";
import PWAInstallButton from "@/components/pwa-install-button";

export default function Navbar() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const closeMenu = () => setShowMenu(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div>
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">PawsitiveCheck</h1>
            </Link>

            <div className="hidden md:block flex-1 mx-8">
              <HeaderSearch />
            </div>

            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              <ThemeToggle />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {showMenu ? (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu}></div>
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={closeMenu}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-2">
              <Link href="/product-scanner">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <Camera className="h-4 w-4" />
                  <span>Product Scanner</span>
                </div>
              </Link>
              
              <Link href="/recalls">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <Shield className="h-4 w-4" />
                  <span>Recall Alerts</span>
                </div>
              </Link>
              
              <Link href="/vet-finder">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <Heart className="h-4 w-4" />
                  <span>Vet Locator</span>
                </div>
              </Link>
              
              <Link href="/community">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </div>
              </Link>
              
              <Link href="/pets">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <PawPrint className="h-4 w-4" />
                  <span>Pet Profiles</span>
                </div>
              </Link>
              
              <Link href="/livestock">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                  <Tractor className="h-4 w-4" />
                  <span>Livestock Management</span>
                </div>
              </Link>
            </div>

            {user && (
              <div className="p-4 border-t space-y-2">
                <Link href="/profile">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMenu}>
                    <Users className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                
                <button
                  onClick={() => window.location.href = '/api/logout'}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}