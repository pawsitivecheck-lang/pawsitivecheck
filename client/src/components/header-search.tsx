import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

interface HeaderSearchProps {
  isMobile?: boolean;
}

export default function HeaderSearch({ isMobile = false }: HeaderSearchProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLocation(`/product-database?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md mx-4'}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-10 pr-16 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-10"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-3 rounded-full"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}