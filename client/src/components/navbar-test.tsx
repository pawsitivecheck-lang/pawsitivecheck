import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Shield, Heart, Users, Wheat } from "lucide-react";

export default function NavbarTest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Recall Alerts', href: '/recalls', icon: Shield },
    { name: 'Vet Locator', href: '/vet-finder', icon: Heart },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Pet Profiles', href: '/pets', icon: Users },
    { name: 'Livestock Management', href: '/livestock', icon: Wheat },
  ];

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Test Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
        TEST MENU
      </button>

      {/* Test Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4">
          <div className="text-sm font-bold mb-3">
            Navigation Test ({menuItems.length} items)
          </div>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Icon className="h-4 w-4" />
                  <span>{index + 1}. {item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}