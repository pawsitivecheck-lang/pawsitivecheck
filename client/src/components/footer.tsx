export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-cosmic-900 border-t border-cosmic-700 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
          <a 
            href="/admin" 
            className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
            data-testid="link-footer-admin"
          >
            Admin
          </a>
          <a 
            href="/privacy-policy" 
            className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
            data-testid="link-footer-privacy-policy"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms-of-service" 
            className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
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
            className="text-cosmic-400 hover:text-starlight-400 text-sm transition-colors"
            data-testid="button-footer-cookie-preferences"
          >
            Cookie Preferences
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-cosmic-400 text-sm" data-testid="text-footer-copyright">
            © 2024 PawsitiveCheck - Protected by cosmic forces and mystical encryption
          </p>
          <p className="text-cosmic-500 text-xs mt-2" data-testid="text-footer-motto">
            "In truth we trust, in transparency we thrive" - The Audit Syndicate
          </p>
        </div>
      </div>
    </footer>
  );
}