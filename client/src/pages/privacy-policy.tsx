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
              Last updated: August 25, 2025
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
                  <li>• Account information through Replit authentication (email, name, profile image)</li>
                  <li>• Pet profile data (names, species, breeds, age, weight, medical conditions, allergies)</li>
                  <li>• Animal preferences and tagging selections</li>
                  <li>• Communication preferences and notification settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Usage Information</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Barcode scans and product image uploads for identification</li>
                  <li>• Product safety analysis history and cosmic scores</li>
                  <li>• Community reviews, ratings, and health tracking data</li>
                  <li>• Search queries for products across 38+ animal species</li>
                  <li>• Animal tag associations and product suitability preferences</li>
                  <li>• Recall alert subscription preferences</li>
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
                  <li>• Provide AI-powered product safety analysis and cosmic scoring</li>
                  <li>• Enable barcode scanning and image-based product identification</li>
                  <li>• Maintain pet profiles and animal-specific product recommendations</li>
                  <li>• Process community reviews with health tracking capabilities</li>
                  <li>• Deliver targeted recall alerts based on your pet species and products</li>
                  <li>• Provide offline PWA functionality and push notifications</li>
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
                  We share information with trusted third-party providers including Replit (authentication), Google AdSense (advertising), external product databases (Open Pet Food Facts), and cloud storage providers for PWA functionality, all under strict confidentiality agreements.
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
              <CardTitle className="text-starlight-400">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Encryption of data in transit and at rest</li>
                <li>• Regular security assessments and updates</li>
                <li>• Access controls and authentication requirements</li>
                <li>• Secure data centers and infrastructure</li>
                <li>• Employee training on data protection</li>
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
                To exercise these rights, please contact us at pawsitivecheck@gmail.com. Note that some data required for PWA offline functionality may be stored locally on your device and can be managed through your browser settings.
              </p>
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
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>Email: pawsitivecheck@gmail.com</p>
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