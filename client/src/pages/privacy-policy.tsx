import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from "@/components/ad-banner";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-cosmic-100">
      {/* Top Ad */}
      <div className="bg-white border-b border-gray-200 py-3">
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
                  <li>• Account information (email, name) when you register</li>
                  <li>• Profile information and preferences you provide</li>
                  <li>• Communication preferences and contact details</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Usage Information</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Product scans and analysis history</li>
                  <li>• Reviews and ratings you submit</li>
                  <li>• Search queries and browsing patterns</li>
                  <li>• Device information and technical data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Automatically Collected Data</h3>
                <ul className="space-y-1 ml-4">
                  <li>• IP address and location data</li>
                  <li>• Browser type and operating system</li>
                  <li>• Cookies and similar tracking technologies</li>
                  <li>• Usage analytics and performance metrics</li>
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
                  <li>• Provide product safety analysis and cosmic scoring</li>
                  <li>• Maintain your account and personalized experience</li>
                  <li>• Process and display your reviews and ratings</li>
                  <li>• Send important product recall notifications</li>
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
                  We may share information with trusted third-party service providers who assist in operating our platform, conducting business, or serving users, provided they agree to maintain confidentiality.
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
                To exercise these rights, please contact us at pawsitivecheck@gmail.com
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
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can manage your cookie preferences through our cookie consent banner or browser settings.
              </p>
              <p>
                For detailed information about the cookies we use, please see our Cookie Policy accessible through the cookie consent banner.
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