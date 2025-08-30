import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from "@/components/ad-banner";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-cosmic-100">
      {/* Top Ad */}
      <div className="bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="privacy-header" />
        </div>
      </div>
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            className="mb-4 text-starlight-400 hover:text-starlight-300"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to PawsitiveCheck
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-starlight-500 to-mystical-purple rounded-full flex items-center justify-center mb-6 animate-glow">
              <Shield className="text-2xl text-cosmic-900" />
            </div>
            <h1 className="font-mystical text-4xl font-bold text-starlight-500 mb-4" data-testid="text-privacy-title">
              Privacy Policy
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-privacy-subtitle">
              Your cosmic data protection and mystical privacy rights
            </p>
            <p className="text-cosmic-400 mt-2">
              Last updated: August 30, 2025
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Information We Collect */}
          <Card className="cosmic-card" data-testid="card-information-collect">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Database className="mr-3 h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Personal Information</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Account information through secure Replit authentication (email, name, profile image)</li>
                  <li>• Pet profile data including names, species, breeds, age, weight, medical conditions, allergies, and health history</li>
                  <li>• Animal preferences, tagging selections, and species-specific requirements for comprehensive animal care</li>
                  <li>• Notification preferences including product recalls, safety alerts, and system updates</li>
                  <li>• Content moderation data when users flag inappropriate content or reviews</li>
                  <li>• Device identifiers and installation data for PWA functionality</li>
                  <li>• Biometric data (camera scans) processed locally for barcode and image scanning features</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Usage Information</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Barcode scans and product image uploads for identification using camera and file upload</li>
                  <li>• Product safety analysis history and cosmic scores from our curated database</li>
                  <li>• Community reviews, ratings, content flags, and health tracking data</li>
                  <li>• Search queries for products from our curated U.S. & Canada animal care database</li>
                  <li>• Animal tag associations and product suitability preferences</li>
                  <li>• Recall alert subscription preferences and notification settings</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Automatically Collected Data</h3>
                <ul className="space-y-1 ml-4">
                  <li>• IP address and general location for region-specific recall alerts</li>
                  <li>• Device information for PWA installation and camera access</li>
                  <li>• Browser type, operating system, and device capabilities</li>
                  <li>• PWA usage data and offline access patterns</li>
                  <li>• Cookies for authentication, preferences, and analytics</li>
                  <li>• Product scanning performance and accuracy metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="cosmic-card" data-testid="card-information-use">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Eye className="mr-3 h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Service Provision</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Provide AI-powered product safety analysis and cosmic scoring for our curated database</li>
                  <li>• Enable multi-modal scanning: barcode, image recognition, and file upload identification</li>
                  <li>• Maintain pet profiles and animal-specific product recommendations from verified U.S. & Canada products</li>
                  <li>• Process community reviews with content moderation and health tracking capabilities</li>
                  <li>• Deliver targeted recall alerts and safety notifications based on your pets and preferences</li>
                  <li>• Provide offline PWA functionality, push notifications, and data synchronization</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Improvement and Analytics</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Analyze usage patterns to improve our services</li>
                  <li>• Enhance our mystical analysis algorithms</li>
                  <li>• Optimize user interface and experience</li>
                  <li>• Conduct research and data analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Communication</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Send service updates and security alerts</li>
                  <li>• Provide customer support and assistance</li>
                  <li>• Share relevant product safety information</li>
                  <li>• Send marketing communications (with your consent)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="cosmic-card" data-testid="card-information-sharing">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Users className="mr-3 h-5 w-5" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Service Providers</h3>
                <p className="ml-4">
                  We share information with trusted third-party providers including authentication services (Replit), external product databases (<a href="https://world.openpetfoodfacts.org" target="_blank" rel="noopener noreferrer" className="text-starlight-400 hover:text-starlight-300 underline">Open Pet Food Facts</a>, <a href="https://www.fda.gov/animal-veterinary" target="_blank" rel="noopener noreferrer" className="text-starlight-400 hover:text-starlight-300 underline">FDA databases</a>) for U.S. & Canada market products, cloud storage providers for file uploads and PWA functionality, AI/ML service providers for product analysis, mapping services for veterinary finder functionality, and analytics providers for system improvement. All partnerships operate under strict data processing agreements compliant with <a href="https://gdpr.eu" target="_blank" rel="noopener noreferrer" className="text-starlight-400 hover:text-starlight-300 underline">GDPR</a>, <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-starlight-400 hover:text-starlight-300 underline">CCPA</a>, and other applicable privacy regulations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Legal Requirements</h3>
                <p className="ml-4">
                  We may disclose information when required by law, regulation, legal process, or governmental request, or to protect rights, property, or safety.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Business Transfers</h3>
                <p className="ml-4">
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="cosmic-card" data-testid="card-data-security">
            <CardHeader>
              <CardTitle className="text-starlight-400">Data Security and AI Ethics</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                We implement industry-leading security measures and ethical AI practices to protect your personal information and ensure algorithmic fairness. Our comprehensive security framework includes:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• End-to-end encryption of data in transit and at rest using AES-256 standards</li>
                <li>• Regular third-party security audits, penetration testing, and vulnerability assessments</li>
                <li>• Multi-factor authentication, role-based access controls, and zero-trust architecture</li>
                <li>• SOC 2 Type II compliant data centers with 24/7 monitoring and incident response</li>
                <li>• Comprehensive employee training on data protection, privacy regulations, and ethical AI practices</li>
                <li>• Algorithmic bias testing and fairness assessments for AI-powered analysis features</li>
                <li>• Regular deletion of unnecessary data and automated data retention policies</li>
                <li>• Incident response procedures with notification protocols for any potential data breaches</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="cosmic-card" data-testid="card-your-rights">
            <CardHeader>
              <CardTitle className="text-starlight-400">Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <p>You have the following rights regarding your personal information:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-mystical-purple mb-2">Access & Portability</h4>
                  <p className="text-sm">Request a copy of your personal data and receive it in a structured format.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-mystical-purple mb-2">Correction</h4>
                  <p className="text-sm">Update or correct inaccurate personal information.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-mystical-purple mb-2">Deletion</h4>
                  <p className="text-sm">Request deletion of your personal data under certain circumstances.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-mystical-purple mb-2">Opt-out</h4>
                  <p className="text-sm">Withdraw consent for processing or opt-out of marketing communications.</p>
                </div>
              </div>
              
              <p className="text-sm text-cosmic-300 mt-4">
                To exercise these rights, please contact us through the platform's support system with proper identity verification. We will respond within 30 days as required by applicable privacy laws. Note that some data required for PWA offline functionality may be stored locally on your device and can be managed through your browser settings. For residents of California, Virginia, Colorado, and other states with comprehensive privacy laws, additional rights may apply.
              </p>
            </CardContent>
          </Card>

          {/* Do Not Track */}
          <Card className="cosmic-card" data-testid="card-dnt">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Shield className="mr-3 h-5 w-5" />
                Do Not Track (DNT) Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Automatic DNT Detection</h3>
                <p className="mb-3">
                  We fully respect "Do Not Track" (DNT) browser settings and automatically detect when you have enabled DNT in your browser.
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Server-side detection:</strong> Our servers check for DNT headers (DNT: 1) in all requests</li>
                  <li>• <strong>Client-side detection:</strong> We also check browser DNT settings via JavaScript</li>
                  <li>• <strong>Automatic compliance:</strong> When DNT is detected, we automatically disable all non-essential tracking</li>
                  <li>• <strong>No consent banner:</strong> DNT users skip cookie consent and get minimal tracking by default</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">What We Don't Track with DNT</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Analytics cookies (_ga, _gid, analytics-session)</li>
                  <li>• Marketing cookies (ad-preferences, campaign-data)</li>
                  <li>• Functional cookies (user-preferences, ui-settings)</li>
                  <li>• Cross-site tracking or data sharing</li>
                  <li>• Behavioral analytics or user profiling</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Essential Functions Still Work</h3>
                <p className="mb-3">
                  Even with DNT enabled, all core PawsitiveCheck features remain fully functional:
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Product safety scanning and analysis</li>
                  <li>• Pet profile management and health tracking</li>
                  <li>• Safety database searches and recall alerts</li>
                  <li>• Account authentication and session management</li>
                  <li>• Offline PWA functionality and data sync</li>
                </ul>
              </div>
              
              <div className="bg-cosmic-800 border border-mystical-purple rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">💡 How to Enable DNT</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Chrome/Edge:</strong> Settings → Privacy and security → Send "Do not track" request</p>
                  <p><strong>Firefox:</strong> Settings → Privacy & Security → Send websites "Do Not Track" signal</p>
                  <p><strong>Safari:</strong> Preferences → Privacy → Prevent cross-site tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="cosmic-card" data-testid="card-cookies">
            <CardHeader>
              <CardTitle className="text-starlight-400">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. Our Progressive Web App (PWA) also stores data locally for offline functionality.
              </p>
              <p className="mb-4">
                <strong>DNT Users:</strong> If you have "Do Not Track" enabled, we automatically disable all non-essential cookies and tracking without requiring manual consent.
              </p>
              <p>
                For detailed information about the cookies we use, please see our Cookie Policy accessible through the cookie consent banner.
              </p>
            </CardContent>
          </Card>

          {/* PWA and Data Storage */}
          <Card className="cosmic-card" data-testid="card-pwa-storage">
            <CardHeader>
              <CardTitle className="text-starlight-400">PWA and Offline Data Storage</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                PawsitiveCheck operates as a Progressive Web App (PWA) that can be installed on your device. To provide offline functionality, we store certain data locally on your device:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Cached product information for offline access</li>
                <li>• Your pet profiles and preferences</li>
                <li>• Recent scan history and analysis results</li>
                <li>• Application assets and interface elements</li>
                <li>• Push notification preferences and registration data</li>
              </ul>
              <p className="mt-4 text-sm text-cosmic-300">
                You can clear this stored data by uninstalling the PWA or clearing your browser's application data.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="cosmic-card" data-testid="card-contact">
            <CardHeader>
              <CardTitle className="text-starlight-400">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us through the platform's built-in support system or reach out via our official channels:
              </p>
              <div className="space-y-2">
                <p>Platform: Use the contact form in your account settings</p>
                <p>We typically respond within 24-48 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}