import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Cookie, Shield, BarChart, Eye, Sparkles, ArrowLeft, Info, Clock, Database, Lock, Settings } from "lucide-react";
import { useCookiePreferences } from "@/components/cookie-consent";

export default function CookiePolicy() {
  const { openPreferences } = useCookiePreferences();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-b from-purple-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <CardHeader className="pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Cookie Policy
            </CardTitle>
          </div>
          <p className="text-lg text-muted-foreground">
            Effective Date: January 1, 2025
          </p>
          <div className="flex gap-2 mt-4">
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              GDPR Compliant
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Privacy-First
            </Badge>
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              DNT Respected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Our Commitment to Your Privacy
            </h2>
            <p className="text-muted-foreground">
              At PawsitiveCheck, we believe in transparency and respect for your digital privacy. This Cookie Policy explains what cookies are, 
              how we use them, and how you can control your cookie preferences. We use minimal cookies necessary to provide our service while 
              respecting your privacy choices.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-900 dark:text-purple-100">
                    <strong>Annual Consent Review:</strong> We ask for your cookie preferences annually to ensure continued transparency 
                    and compliance with privacy regulations. Your consent expires after 365 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What Are Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              What Are Cookies?
            </h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit a website. They help the website remember 
              information about your visit, such as your preferences and login status, making your next visit easier and more productive.
            </p>
          </section>

          {/* Cookie Categories */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Cookie Categories We Use
            </h2>
            
            <div className="space-y-4">
              {/* Essential Cookies */}
              <Card className="border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Essential Cookies
                        </h3>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Always Active
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        These cookies are necessary for the website to function properly and cannot be disabled. They are usually 
                        only set in response to actions made by you, such as logging in or filling in forms.
                      </p>
                      <div className="bg-card/50 rounded-lg p-3 space-y-2">
                        <h4 className="font-medium text-sm text-foreground">Examples:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• <strong>Session cookies:</strong> Keep you logged in during your visit</li>
                          <li>• <strong>Security cookies:</strong> Protect against CSRF attacks</li>
                          <li>• <strong>Consent cookies:</strong> Remember your cookie preferences</li>
                          <li>• <strong>Load balancing:</strong> Ensure website stability</li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Duration: Session or up to 1 year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Cookies */}
              <Card className="border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Analytics Cookies
                        </h3>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          Optional
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        These cookies help us understand how visitors interact with our website by collecting and reporting 
                        information anonymously. We use this data to improve our services and user experience.
                      </p>
                      <div className="bg-card/50 rounded-lg p-3 space-y-2">
                        <h4 className="font-medium text-sm text-foreground">What we track:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Pages visited and time spent</li>
                          <li>• Features used (product search, barcode scanning)</li>
                          <li>• Error messages encountered</li>
                          <li>• Device type and browser information</li>
                          <li>• General geographic location (country level)</li>
                        </ul>
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2 mt-2">
                          <p className="text-xs text-blue-900 dark:text-blue-100">
                            <strong>Privacy Note:</strong> We never track individual users or store personally identifiable information 
                            in our analytics. All data is aggregated and anonymized.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Duration: 30 days to 2 years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marketing Cookies */}
              <Card className="border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Marketing Cookies
                        </h3>
                        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                          Optional
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        These cookies may be set through our site by our advertising partners to build a profile of your interests 
                        and show you relevant content on other sites. They are based on uniquely identifying your browser and device.
                      </p>
                      <div className="bg-card/50 rounded-lg p-3 space-y-2">
                        <h4 className="font-medium text-sm text-foreground">Purpose:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Show relevant product recommendations</li>
                          <li>• Understand effectiveness of our content</li>
                          <li>• Limit the number of times you see the same content</li>
                          <li>• Measure campaign performance</li>
                        </ul>
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2 mt-2">
                          <p className="text-xs text-purple-900 dark:text-purple-100">
                            <strong>Current Status:</strong> We do not currently use marketing cookies, but this may change in the future. 
                            You will always have control over these preferences.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Duration: 30 days to 1 year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Functional Cookies */}
              <Card className="border-yellow-200 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Functional Cookies
                        </h3>
                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                          Optional
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                        and settings. They may be set by us or by third-party providers whose services we use.
                      </p>
                      <div className="bg-card/50 rounded-lg p-3 space-y-2">
                        <h4 className="font-medium text-sm text-foreground">Features enabled:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Remember your display preferences (theme, layout)</li>
                          <li>• Save your pet profiles across sessions</li>
                          <li>• Remember recently viewed products</li>
                          <li>• Enable Progressive Web App features</li>
                          <li>• Store offline data for better performance</li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Duration: 30 days to 1 year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Do Not Track */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              Do Not Track (DNT) Support
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-muted-foreground">
                We respect the "Do Not Track" (DNT) browser setting. When DNT is enabled in your browser, we automatically:
              </p>
              <ul className="mt-3 space-y-2 text-muted-foreground ml-4">
                <li>• Disable all analytics cookies</li>
                <li>• Disable all marketing cookies</li>
                <li>• Disable all functional cookies except those essential for core functionality</li>
                <li>• Do not show the cookie consent banner</li>
              </ul>
              <p className="mt-3 text-sm text-green-700 dark:text-green-300">
                Your DNT preference is detected automatically and respected without any action required from you.
              </p>
            </div>
          </section>

          {/* Data Storage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Data Storage & Synchronization
            </h2>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Your cookie preferences are stored in two ways:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-foreground mb-2">Local Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      Preferences are saved in your browser's local storage for immediate access and offline functionality.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-foreground mb-2">Server Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      For logged-in users, preferences are synced to our secure servers to maintain consistency across devices.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Managing Your Cookie Preferences
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You have full control over your cookie preferences. You can:
              </p>
              <div className="space-y-3">
                <Card className="border-purple-200 dark:border-purple-700">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-foreground mb-2">Update Preferences Anytime</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Click the "Cookie Settings" link in the footer of any page to update your preferences.
                    </p>
                    <Button 
                      onClick={openPreferences}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Open Cookie Settings
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-foreground mb-2">Browser Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      You can also control cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• View and delete existing cookies</li>
                      <li>• Block all cookies or third-party cookies</li>
                      <li>• Set preferences for specific websites</li>
                      <li>• Enable "Do Not Track" mode</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              Security Measures
            </h2>
            <p className="text-muted-foreground">
              We implement strong security measures to protect your data:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• All cookies are encrypted and transmitted over HTTPS</li>
              <li>• Session cookies are marked as HttpOnly and Secure</li>
              <li>• We use SameSite attributes to prevent CSRF attacks</li>
              <li>• Cookie data is never shared with third parties without your explicit consent</li>
              <li>• Regular security audits ensure our cookie handling remains secure</li>
            </ul>
          </section>

          {/* Updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Updates to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, 
              operational, or regulatory reasons. We will notify you of any material changes by:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Updating the "Effective Date" at the top of this policy</li>
              <li>• Showing a notice on our website</li>
              <li>• Requesting renewed consent if required by law</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have questions about our Cookie Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-card rounded-lg p-4">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:pawsitivecheck@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                  pawsitivecheck@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Subject Line:</strong> Cookie Policy Inquiry
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={openPreferences}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Manage Cookie Preferences
              </Button>
              <Link to="/privacy-policy">
                <Button variant="outline" className="w-full border-purple-300 dark:border-purple-600">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}