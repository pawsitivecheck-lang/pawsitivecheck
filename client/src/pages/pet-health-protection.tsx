import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Shield, AlertTriangle, Heart, TrendingUp, ExternalLink, Phone, Search, Camera } from "lucide-react";

export default function PetHealthProtection() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Top Banner Ad */}
      <div className="bg-card dark:bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="pet-health-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-hero-title">
                Pet Health Protection
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-hero-subtitle">
                Understanding the critical importance of safeguarding your pet from hidden dangers in everyday products
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Critical Statistics</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-poison-calls">451,000</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Poison control calls in 2024</div>
                  <div className="text-xs text-red-600 mt-1">
                    4% increase from 2023
                    <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (ASPCA, 2024 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-food-recalls">17</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Pet food recalls in 2024</div>
                  <div className="text-xs text-red-600 mt-1">
                    46,090 pounds recalled
                    <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (FDA, 2024 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-toxic-metals">100%</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Commercial pet foods exceeded mercury limits</div>
                  <div className="text-xs text-red-600 mt-1">
                    Scientific study of 100 brands
                    <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (Scientific Reports, 2021 ↗)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12">
            
            {/* Top Toxic Threats */}
            <Card className="border-orange-200 dark:border-orange-800" data-testid="card-toxic-threats">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Top 10 Pet Toxins of 2024 <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(ASPCA, 2024 ↗)</a>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-semibold">1. Over-the-Counter Medications</span>
                      <Badge variant="destructive">16.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-semibold">2. Food Products</span>
                      <Badge variant="destructive">16.1%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-semibold">3. Human Prescription Medications</span>
                      <Badge variant="secondary">High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-semibold">4. Chocolate</span>
                      <Badge variant="destructive">13.6%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-semibold">5. Veterinary Products</span>
                      <Badge variant="destructive">8.6%</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">6. Plants and Fungi</span>
                      <Badge variant="outline">8.1%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">7. Rodenticides</span>
                      <Badge variant="outline">7.0%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">8. Household Products</span>
                      <Badge variant="outline">Variable</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">9. Insecticides</span>
                      <Badge variant="outline">Variable</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">10. Recreational Drugs</span>
                      <Badge variant="outline">New Entry</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Emerging Threats:</h4>
                  <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• <strong>Hallucinogenic mushrooms:</strong> 74% increase in exposure calls <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(ASPCA, 2024 ↗)</a></li>
                    <li>• <strong>Flavored veterinary chewables:</strong> Pets consuming entire packages <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(ASPCA, 2024 ↗)</a></li>
                    <li>• <strong>Xylitol in protein products:</strong> Sugar-free gums, energy bars, vitamins <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(ASPCA, 2024 ↗)</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Pet Food Contamination Crisis */}
            <Card className="border-red-200 dark:border-red-800" data-testid="card-food-contamination">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-red-800 dark:text-red-200">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Pet Food Contamination Crisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">2024 Recall Statistics <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(FDA, 2024 ↗)</a></h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center justify-between">
                          <span>• Total recalls:</span>
                          <strong>17 incidents</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Pounds recalled:</span>
                          <strong>46,090 lbs</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Sick pet reports (Jan 2024):</span>
                          <strong>1,312 reports</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Metal contamination:</span>
                          <strong>24,418 lbs</strong>
                        </li>
                      </ul>
                      
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">Major 2024 Recalls:</h5>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                          <li>• Mid America Pet Food (Salmonella) <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                          <li>• Mars Petcare Pedigree (Metal pieces) <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                          <li>• ANSWERS Pet Food (Salmonella/Listeria) <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                          <li>• Darwin's Natural (Salmonella/Listeria) <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Toxic Heavy Metal Contamination <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(Scientific Reports, 2021 ↗)</a></h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                          <span>Mercury (all pet foods):</span>
                          <Badge variant="destructive">100%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                          <span>Uranium (dog foods):</span>
                          <Badge variant="destructive">95.8%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                          <span>Lead (dog foods):</span>
                          <Badge variant="destructive">80.6%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                          <span>Vanadium (dog foods):</span>
                          <Badge variant="destructive">75%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950 rounded">
                          <span>Aluminum (dog foods):</span>
                          <Badge variant="outline">31.9%</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          <strong>Scientific study of 100 commercial pet foods</strong> <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(Scientific Reports, 2021 ↗)</a> found that virtually all exceeded FDA maximum tolerable levels for toxic heavy metals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dangerous Ingredients to Avoid */}
            <Card className="border-purple-200 dark:border-purple-800" data-testid="card-dangerous-ingredients">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-purple-800 dark:text-purple-200">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Dangerous Ingredients to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-red-600">Toxic Preservatives</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>BHA/BHT:</strong> Carcinogenic <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                      <li>• <strong>Ethoxyquin:</strong> Banned in Europe <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA ↗)</a></li>
                      <li>• <strong>Propylene Glycol:</strong> Toxic to cats</li>
                      <li>• <strong>Sodium Metabisulfite:</strong> Nervous system damage</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-orange-600">Deadly Sweeteners</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Xylitol:</strong> Fatal to dogs <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(ASPCA ↗)</a></li>
                      <li>• <strong>High fructose corn syrup:</strong> Diabetes risk</li>
                      <li>• <strong>Artificial dyes:</strong> Blue 2, Red 40, Yellow 5 & 6</li>
                      <li>• <strong>MSG:</strong> Hidden as "natural flavors"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-yellow-600">Low-Quality Proteins</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Meat and bone meal:</strong> Unknown sources</li>
                      <li>• <strong>4D meats:</strong> Dead, diseased animals</li>
                      <li>• <strong>Rendered fats:</strong> Toxic bacteria source</li>
                      <li>• <strong>By-products:</strong> Unknown animal scraps</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Action Plan */}
            <Card className="border-green-200 dark:border-green-800" data-testid="card-emergency-action">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-green-800 dark:text-green-200">
                  <Phone className="w-6 h-6 mr-3" />
                  Emergency Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">🚨 If Your Pet Consumes Something Toxic:</h4>
                    <ol className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <li><strong>1. Stay calm</strong> and remove any remaining product from reach</li>
                      <li><strong>2. Call immediately:</strong> ASPCA Poison Control (888) 426-4435</li>
                      <li><strong>3. Have ready:</strong> Pet's breed, age, weight, symptoms, product container</li>
                      <li><strong>4. Follow instructions</strong> exactly - do NOT induce vomiting unless told</li>
                      <li><strong>5. Contact your veterinarian</strong> for follow-up care</li>
                    </ol>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">24/7 Emergency Contacts</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-blue-600" />
                          <div>
                            <strong>ASPCA Poison Control:</strong><br />
                            <a href="tel:+1-888-426-4435" className="text-blue-600 hover:underline">(888) 426-4435</a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-blue-600" />
                          <div>
                            <strong>Pet Poison Helpline:</strong><br />
                            <a href="tel:+1-855-764-7661" className="text-blue-600 hover:underline">(855) 764-7661</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">Prevention Strategies</h4>
                      <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                        <li>• Store all medications securely</li>
                        <li>• Keep cleaning products locked away</li>
                        <li>• Never give human medications to pets</li>
                        <li>• Research all food before sharing</li>
                        <li>• Use pet-specific products only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How PawsitiveCheck Helps */}
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950" data-testid="card-pawsitivecheck-help">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-blue-800 dark:text-blue-200">
                  <Shield className="w-6 h-6 mr-3" />
                  How PawsitiveCheck Protects Your Pet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <Camera className="w-12 h-12 text-blue-600 mx-auto" />
                    <h4 className="font-semibold">Product Scanning</h4>
                    <p className="text-sm text-muted-foreground">
                      Instantly analyze any pet product using barcode scanning, image recognition, or product search.
                    </p>
                    <Link href="/product-scanner">
                      <Button className="mystical-button" data-testid="button-start-scanning">
                        Start Scanning
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <Search className="w-12 h-12 text-purple-600 mx-auto" />
                    <h4 className="font-semibold">Safety Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Access comprehensive safety information on thousands of pet products and ingredients.
                    </p>
                    <Link href="/product-database">
                      <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white" data-testid="button-browse-database">
                        Browse Database
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto" />
                    <h4 className="font-semibold">Recall Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about the latest pet product recalls and safety warnings.
                    </p>
                    <Link href="/recalls">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white" data-testid="button-view-recalls">
                        View Recalls
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
          
          {/* Bottom Ad */}
          <div className="mt-12 flex justify-center">
            <AdBanner size="square" position="pet-health-footer" />
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}