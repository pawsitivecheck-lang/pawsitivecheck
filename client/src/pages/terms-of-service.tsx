import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ScrollText, Shield, Users, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-cosmic-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
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
              <ScrollText className="text-2xl text-cosmic-900" />
            </div>
            <h1 className="font-mystical text-4xl font-bold text-starlight-500 mb-4" data-testid="text-terms-title">
              Terms of Service
            </h1>
            <p className="text-cosmic-300 text-lg" data-testid="text-terms-subtitle">
              Cosmic agreement for the mystical analysis realm
            </p>
            <p className="text-cosmic-400 mt-2">
              Last updated: August 25, 2025
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card className="cosmic-card" data-testid="card-acceptance">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Shield className="mr-3 h-5 w-5" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                Welcome to PawsitiveCheck, the mystical realm of pet product analysis. By accessing or using our services, you enter into a cosmic agreement with us and agree to be bound by these Terms of Service ("Terms").
              </p>
              <p>
                If you do not agree to these Terms, you may not access or use our services. Your continued use of PawsitiveCheck constitutes acceptance of any modifications to these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Description of Services */}
          <Card className="cosmic-card" data-testid="card-services">
            <CardHeader>
              <CardTitle className="text-starlight-400">Description of Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <p>
                PawsitiveCheck provides mystical analysis and transparency services for pet products, including:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Product scanning and cosmic safety analysis</li>
                <li>• Ingredient transparency and blacklist detection</li>
                <li>• Community reviews and ratings platform</li>
                <li>• Product recall alerts and safety notifications</li>
                <li>• Database of analyzed pet products</li>
              </ul>
              <p className="mt-4 text-cosmic-300 text-sm">
                Our services are provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="cosmic-card" data-testid="card-user-accounts">
            <CardHeader>
              <CardTitle className="flex items-center text-starlight-400">
                <Users className="mr-3 h-5 w-5" />
                User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Account Creation</h3>
                <ul className="space-y-1 ml-4">
                  <li>• You must provide accurate and complete information</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>• One account per person; no sharing accounts</li>
                  <li>• You must be at least 13 years old to use our services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">User Conduct</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Post false, misleading, or fraudulent content</li>
                  <li>• Violate any laws or regulations</li>
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Use automated tools to scrape or access our services</li>
                  <li>• Post content that infringes on intellectual property rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card className="cosmic-card" data-testid="card-user-content">
            <CardHeader>
              <CardTitle className="text-starlight-400">User-Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Content License</h3>
                <p>
                  By posting reviews, ratings, or other content, you grant PawsitiveCheck a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content in connection with our services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Content Standards</h3>
                <p className="mb-2">All user content must:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Be truthful and based on genuine experience</li>
                  <li>• Respect the rights and dignity of others</li>
                  <li>• Comply with applicable laws and regulations</li>
                  <li>• Not contain promotional or commercial content</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-purple mb-2">Content Moderation</h3>
                <p>
                  We reserve the right to review, edit, or remove any user content that violates these Terms or our community guidelines. We may also suspend or terminate accounts for repeated violations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="cosmic-card" data-testid="card-intellectual-property">
            <CardHeader>
              <CardTitle className="text-starlight-400">Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                PawsitiveCheck and its content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mb-4">
                You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract the source code of that software.
              </p>
              <p>
                The PawsitiveCheck name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of PawsitiveCheck or its affiliates.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="cosmic-card border-mystical-red/30" data-testid="card-disclaimers">
            <CardHeader>
              <CardTitle className="flex items-center text-mystical-red">
                <AlertTriangle className="mr-3 h-5 w-5" />
                Important Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-cosmic-200">
              <div>
                <h3 className="font-semibold text-mystical-red mb-2">Pet Safety Disclaimer</h3>
                <p className="text-sm">
                  Our mystical analysis and cosmic scores are for informational purposes only and should not replace professional veterinary advice. Always consult with a qualified veterinarian regarding your pet's health and dietary needs.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-mystical-red mb-2">Accuracy of Information</h3>
                <p className="text-sm">
                  While we strive for accuracy, we cannot guarantee that all product information, analyses, or user reviews are complete, accurate, or up-to-date. Users should verify information independently.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-mystical-red mb-2">Third-Party Content</h3>
                <p className="text-sm">
                  We are not responsible for the accuracy, completeness, or reliability of third-party content, including user reviews, external links, or product information provided by manufacturers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="cosmic-card" data-testid="card-liability">
            <CardHeader>
              <CardTitle className="text-starlight-400">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                To the fullest extent permitted by law, PawsitiveCheck shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our total liability for any claim arising from these Terms or your use of our services shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="cosmic-card" data-testid="card-termination">
            <CardHeader>
              <CardTitle className="text-starlight-400">Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                You may terminate your account at any time by contacting us. We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
              <p>
                Upon termination, your right to use our services will cease immediately. Provisions that by their nature should survive termination shall survive, including ownership provisions and limitation of liability.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="cosmic-card" data-testid="card-changes">
            <CardHeader>
              <CardTitle className="text-starlight-400">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. If we make changes, we will post the updated Terms and update the "Last updated" date.
              </p>
              <p>
                Your continued use of our services after any such changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using our services.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="cosmic-card" data-testid="card-contact">
            <CardHeader>
              <CardTitle className="text-starlight-400">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-cosmic-200">
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
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
  );
}