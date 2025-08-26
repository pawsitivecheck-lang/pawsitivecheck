import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Menu, X, Shield, Users, Heart, PawPrint, LogOut, Tractor, Camera } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">PawsitiveCheck</h1>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <Link href="/product-scanner" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Camera className="h-4 w-4" />
                  <span>Product Scanner</span>
                </div>
              </Link>
              
              <Link href="/recalls" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Shield className="h-4 w-4" />
                  <span>Recall Alerts</span>
                </div>
              </Link>
              
              <Link href="/vet-finder" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Heart className="h-4 w-4" />
                  <span>Vet Locator</span>
                </div>
              </Link>
              
              <Link href="/community" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </div>
              </Link>
              
              <Link href="/pets" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <PawPrint className="h-4 w-4" />
                  <span>Pet Profiles</span>
                </div>
              </Link>
              
              <Link href="/livestock" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Tractor className="h-4 w-4" />
                  <span>Livestock Management</span>
                </div>
              </Link>
            </div>

            {user && (
              <div className="p-4 border-t space-y-2">
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
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
      )}
    </div>
  );
}