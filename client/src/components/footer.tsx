import { PawPrint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* Mission, Features, Contact Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-white mb-3" data-testid="text-mission-title">Our Mission</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/product-scanner" className="hover:text-white transition-colors cursor-pointer" data-testid="link-mission-analysis">
                  Comprehensive Safety Analysis
                </a>
              </li>
              <li>
                <a href="/ingredient-transparency" className="hover:text-white transition-colors cursor-pointer" data-testid="link-mission-transparency">
                  Ingredient Transparency
                </a>
              </li>
              <li>
                <a href="/corporate-accountability" className="hover:text-white transition-colors cursor-pointer" data-testid="link-mission-truth">
                  Corporate Accountability
                </a>
              </li>
              <li>
                <a href="/pet-health-protection" className="hover:text-white transition-colors cursor-pointer" data-testid="link-mission-protection">
                  Pet Health Protection
                </a>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-white mb-3" data-testid="text-features-title">Key Features</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/scanner-technology" className="hover:text-white transition-colors cursor-pointer" data-testid="link-feature-scanner">
                  Product Scanner
                </a>
              </li>
              <li>
                <a href="/safety-database-info" className="hover:text-white transition-colors cursor-pointer" data-testid="link-feature-database">
                  Safety Database
                </a>
              </li>
              <li>
                <a href="/recall-system-info" className="hover:text-white transition-colors cursor-pointer" data-testid="link-feature-alerts">
                  Recall Alerts
                </a>
              </li>
              <li>
                <a href="/community-reviews-info" className="hover:text-white transition-colors cursor-pointer" data-testid="link-feature-community">
                  Community Reviews
                </a>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-3" data-testid="text-contact-title">Contact & Support</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <div className="space-y-1">
                  <a href="mailto:pawsitivecheck@gmail.com" className="hover:text-white transition-colors cursor-pointer block font-medium" data-testid="link-contact-email">
                    📧 pawsitivecheck@gmail.com
                  </a>
                  <div className="text-xs text-gray-400 ml-4">
                    General inquiries, support & feedback
                  </div>
                </div>
              </li>
              <li>
                <div className="space-y-1">
                  <a href="/community-reviews-info" className="hover:text-white transition-colors cursor-pointer block font-medium" data-testid="link-contact-community">
                    💬 Community Portal
                  </a>
                  <div className="text-xs text-gray-400 ml-4">
                    Reviews, discussions & product insights
                  </div>
                </div>
              </li>
              <li>
                <div className="space-y-1">
                  <a href="tel:+1-888-426-4435" className="hover:text-white transition-colors cursor-pointer block font-medium" data-testid="link-contact-poison-control">
                    📞 1-888-426-4435
                  </a>
                  <div className="text-xs text-gray-400 ml-4">
                    ASPCA Pet Poison Control Center
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <a 
              href="/admin" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="link-footer-admin"
            >
              Admin
            </a>
            <a 
              href="/privacy-policy" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="link-footer-privacy-policy"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="link-footer-terms-service"
            >
              Terms of Service
            </a>
            <button 
              onClick={() => {
                // Re-show cookie consent by clearing stored consent
                localStorage.removeItem('cookie-consent');
                window.location.reload();
              }}
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="button-footer-cookie-preferences"
            >
              Cookie Preferences
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm" data-testid="text-footer-copyright">
              © 2025 PawsitiveCheck - Professional pet product safety analysis platform
            </p>
            <p className="text-gray-500 text-xs mt-2" data-testid="text-footer-motto">
              "Transparency for safer pets, accountability for better products"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}