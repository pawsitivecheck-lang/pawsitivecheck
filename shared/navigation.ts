import { Shield, Heart, Users, PawPrint, Tractor } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
}

// Main site navigation - used across navbar hamburger menu and mobile menus
export const MAIN_NAVIGATION: NavigationItem[] = [
  { 
    name: 'Recall Alerts', 
    href: '/recalls', 
    icon: Shield,
    description: 'Stay informed about pet product recalls and safety alerts'
  },
  { 
    name: 'Vet Locator', 
    href: '/vet-finder', 
    icon: Heart,
    description: 'Find trusted veterinarians and pet healthcare providers nearby'
  },
  { 
    name: 'Community', 
    href: '/community', 
    icon: Users,
    description: 'Connect with other pet owners and share product reviews'
  },
  { 
    name: 'Pet Profiles', 
    href: '/pets', 
    icon: PawPrint,
    description: 'Manage your pet profiles and track their product history'
  },
  { 
    name: 'Livestock Management', 
    href: '/livestock', 
    icon: Tractor,
    description: 'Comprehensive livestock health and nutrition management'
  },
];

// Footer navigation - separate from main navigation (legal/info pages)
export const FOOTER_NAVIGATION = {
  mission: [
    { name: 'Comprehensive Safety Analysis', href: '/comprehensive-safety-analysis' },
    { name: 'Ingredient Transparency', href: '/ingredient-transparency' },
    { name: 'Corporate Accountability', href: '/corporate-accountability' },
    { name: 'Pet Health Protection', href: '/pet-health-protection' },
  ],
  legal: [
    { name: 'Admin', href: '/admin' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Community Guidelines', href: '/terms' },
  ],
};

// Helper function to get conditional livestock link based on authentication
export const getConditionalLivestockLink = (isAuthenticated: boolean): NavigationItem => ({
  name: isAuthenticated ? 'Livestock Management' : 'Livestock Management Preview',
  href: isAuthenticated ? '/livestock' : '/livestock-preview',
  icon: Tractor,
  description: 'Comprehensive livestock health and nutrition management'
});