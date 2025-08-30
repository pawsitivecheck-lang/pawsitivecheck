import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Heart, Eye, Scale, Database, Clock, AlertTriangle, Zap } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-mystical text-starlight-400 mb-4">
              Terms of Service & Community Guidelines
            </h1>
            <p className="text-cosmic-300 text-lg">
              Discover the mystical rules that govern our cosmic pet safety realm
            </p>
            <p className="text-cosmic-400 text-sm mt-2">
              Last Updated: August 30, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Mascot Disclaimer */}
            <Card className="cosmic-card border-mystical-purple/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-purple">
                  <Zap className="h-5 w-5" />
                  Severus's Mystical Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-mystical-purple/10 border border-mystical-purple/30 rounded-lg p-4">
                  <h3 className="font-semibold text-mystical-purple mb-2">🐾 Important Notice About Our Cosmic Commentary</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li>Severus's "curses" and "blessings" are <strong>metaphorical expressions</strong> used for entertainment and product categorization</li>
                    <li>All cosmic scores, clarity ratings, and mystical assessments are <strong>algorithmic interpretations</strong> of ingredient analysis</li>
                    <li>References to "syndicate members," "truth seekers," and mystical ranks are <strong>gamification features</strong> and user engagement tools</li>
                    <li>Our cosmic mascots provide <strong>educational guidance</strong>, not veterinary advice or medical recommendations</li>
                  </ul>
                </div>
                <p className="text-cosmic-400 text-sm italic">
                  Remember: Always consult with qualified veterinary professionals for your pet's health and safety decisions.
                </p>
              </CardContent>
            </Card>

            {/* Service Agreement */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <Scale className="h-5 w-5" />
                  Service Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Acceptance of Terms</h3>
                  <p className="text-cosmic-300">
                    By accessing PawsitiveCheck, you agree to these terms and our commitment to pet safety transparency. 
                    Our platform provides analysis tools and community features to help pet owners make informed decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Platform Purpose</h3>
                  <p className="text-cosmic-300">
                    PawsitiveCheck is designed to analyze pet products, track safety information, manage pet health records, 
                    and provide livestock management tools. We combine ingredient analysis with community insights for comprehensive pet product transparency.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User-Generated Content Rules */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-green">
                  <Heart className="h-5 w-5" />
                  Community Guidelines & Content Moderation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">User-Generated Content Policy</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li><strong>Reviews & Comments:</strong> Must be honest, constructive, and based on actual experience</li>
                    <li><strong>Safety Reports:</strong> Provide factual information about adverse reactions or safety concerns</li>
                    <li><strong>Product Photos:</strong> Upload clear, relevant images of products you've used</li>
                    <li><strong>Health Records:</strong> Keep accurate records for your pets and livestock</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Prohibited Content</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li>False or misleading product information</li>
                    <li>Spam, promotional content, or commercial solicitation</li>
                    <li>Harassment, discrimination, or inappropriate behavior</li>
                    <li>Copyright infringement or unauthorized content</li>
                    <li>Content promoting unsafe pet care practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Moderation Process</h3>
                  <p className="text-cosmic-300">
                    Our community moderators and automated systems review reported content. Users may report inappropriate content 
                    through our reporting system. Content that violates guidelines may be flagged, removed, or result in account restrictions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-blue">
                  <Database className="h-5 w-5" />
                  Data Retention & Deletion Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Image & Barcode Data</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li><strong>Uploaded Images:</strong> Stored securely for product analysis and community reference</li>
                    <li><strong>Barcode Scans:</strong> Used to identify products and maintain database accuracy</li>
                    <li><strong>Camera Data:</strong> Processed locally when possible, images stored only with consent</li>
                    <li><strong>Retention Period:</strong> Images and scan data retained for analysis improvement and safety tracking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">User Account Data</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li><strong>Pet Profiles:</strong> Health records, preferences, and safety information</li>
                    <li><strong>Livestock Data:</strong> Herd management, health tracking, and production records</li>
                    <li><strong>Reviews & Activity:</strong> Community contributions and safety reports</li>
                    <li><strong>Scan History:</strong> Product analysis history and safety tracking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Data Deletion Rights</h3>
                  <p className="text-cosmic-300">
                    Users can delete individual profiles, specific content, or request complete account deletion through 
                    the Data Management section in their profile. Deletion requests are processed within 30 days, 
                    with some data retained for safety and legal compliance purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-yellow">
                  <Eye className="h-5 w-5" />
                  Notification Preferences & Opt-In Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Alert Categories</h3>
                  <ul className="text-cosmic-300 space-y-2 list-disc ml-4">
                    <li><strong>Recall Alerts:</strong> Immediate notifications about product recalls affecting your saved products</li>
                    <li><strong>Safety Alerts:</strong> Important safety updates and ingredient warnings</li>
                    <li><strong>Product Updates:</strong> Changes to products in your saved lists or scan history</li>
                    <li><strong>Community Updates:</strong> New reviews, comments, or community discussions</li>
                    <li><strong>System Notifications:</strong> Account security, policy updates, and platform changes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Opt-In Preferences</h3>
                  <p className="text-cosmic-300">
                    All marketing communications require explicit opt-in consent. Safety-critical alerts (recalls, warnings) 
                    are enabled by default but can be customized in your notification preferences. You maintain full control 
                    over communication frequency and types.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Compliance */}
            <Card className="cosmic-card border-mystical-red/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mystical-red">
                  <AlertTriangle className="h-5 w-5" />
                  Legal Disclaimers & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Medical Disclaimer</h3>
                  <p className="text-cosmic-300">
                    PawsitiveCheck provides informational tools and community insights. We do not provide veterinary advice, 
                    medical recommendations, or professional consultations. Always consult qualified veterinary professionals 
                    for health decisions regarding your pets or livestock.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Accuracy Limitations</h3>
                  <p className="text-cosmic-300">
                    While we strive for accuracy, product information, analyses, and community content may contain errors. 
                    Users should verify critical information independently and exercise personal judgment in product selection.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-cosmic-200 mb-2">Platform Changes</h3>
                  <p className="text-cosmic-300">
                    We reserve the right to modify these terms, update platform features, or discontinue services with 
                    appropriate notice. Continued use constitutes acceptance of updated terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Updates */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <Clock className="h-5 w-5" />
                  Updates & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-cosmic-300">
                  These terms are regularly updated to reflect platform improvements and regulatory requirements. 
                  Users are notified of significant changes through email and platform announcements.
                </p>
                
                <p className="text-cosmic-300">
                  For questions about these terms, data practices, or platform features, contact our support team 
                  through your account dashboard or community forums.
                </p>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => window.history.back()} 
                    className="bg-starlight-500 hover:bg-starlight-400 text-white"
                  >
                    Return to Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}