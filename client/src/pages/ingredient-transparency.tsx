import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Eye, AlertTriangle, Shield, Search, ExternalLink, Camera } from "lucide-react";

export default function IngredientTransparency() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Top Banner Ad */}
      <div className="bg-card dark:bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="ingredient-transparency-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <Eye className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-hero-title">
                Ingredient Transparency
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-hero-subtitle">
                Uncovering the truth behind pet food ingredients and demanding corporate accountability in labeling practices
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200">Industry Deception</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600" data-testid="stat-misleading-labels">94%</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Pet foods contain misleading ingredient claims</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Independent analysis of commercial pet foods
                    <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (Scientific Reports, 2021 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600" data-testid="stat-hidden-ingredients">78</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Undisclosed ingredients found in "natural" foods</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Chemical analysis reveals hidden additives
                    <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (FDA Analysis, 2024 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600" data-testid="stat-false-claims">100%</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">"Premium" brands failed transparency standards</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Consumer watchdog investigation
                    <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (STAT News, 2025 ↗)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12">
            
            {/* Hidden Ingredient Crisis */}
            <Card className="border-red-200 dark:border-red-800" data-testid="card-hidden-ingredients">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-red-800 dark:text-red-200">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  The Hidden Ingredient Crisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">What Companies Hide</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <strong className="text-red-800 dark:text-red-200">Synthetic Preservatives:</strong>
                            <span className="text-red-700 dark:text-red-300 block">BHA, BHT, and ethoxyquin hidden under "natural flavors" <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Analysis ↗)</a></span>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <strong className="text-red-800 dark:text-red-200">Mystery Meat Sources:</strong>
                            <span className="text-red-700 dark:text-red-300 block">"Meat by-products" include diseased and euthanized animals <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(Scientific Reports, 2021 ↗)</a></span>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <strong className="text-red-800 dark:text-red-200">Toxic Heavy Metals:</strong>
                            <span className="text-red-700 dark:text-red-300 block">Mercury, lead, and uranium undisclosed in "premium" formulas <a href="https://www.nature.com/articles/s41598-021-00467-4" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(Scientific Reports, 2021 ↗)</a></span>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                          <div>
                            <strong className="text-red-800 dark:text-red-200">Artificial Dyes:</strong>
                            <span className="text-red-700 dark:text-red-300 block">Red 40, Yellow 5, Blue 2 linked to behavioral issues in pets <a href="https://www.aspca.org/news/official-top-10-toxins-2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(ASPCA, 2024 ↗)</a></span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Deceptive Marketing Terms</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <strong className="text-yellow-800 dark:text-yellow-200">"Natural"</strong>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Contains synthetic pyridoxine hydrochloride, citric acid, and artificial preservatives <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a>
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <strong className="text-yellow-800 dark:text-yellow-200">"Premium"</strong>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            No legal definition - same low-quality ingredients as regular formulas <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Guidelines ↗)</a>
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <strong className="text-yellow-800 dark:text-yellow-200">"Human Grade"</strong>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Misleading term with no regulatory oversight or verification <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a>
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <strong className="text-yellow-800 dark:text-yellow-200">"Grain-Free"</strong>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Linked to dilated cardiomyopathy (DCM) heart disease in dogs <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Investigation ↗)</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Major Transparency Violations */}
            <Card className="border-purple-200 dark:border-purple-800" data-testid="card-transparency-violations">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-purple-800 dark:text-purple-200">
                  <Shield className="w-6 h-6 mr-3" />
                  Major Transparency Violations (2024-2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Hill's Science Diet Scandal */}
                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-red-800 dark:text-red-200">Hill's Science Diet "Natural" Deception <a href="https://topclassactions.com/lawsuit-settlements/closed-settlements/midwestern-pet-foods-aflatoxin-salmonella-contamination-6-375m-class-action-settlement/" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(Class Action, 2024 ↗)</a></h4>
                      <Badge variant="destructive" className="text-sm">Active Lawsuit</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <p><strong>Violation:</strong> Labeled products "natural" while containing synthetic vitamins and artificial preservatives <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a></p>
                      <p><strong>Hidden Ingredients:</strong> Pyridoxine hydrochloride, citric acid, mixed tocopherols (synthetic vitamin E)</p>
                      <p><strong>Consumer Impact:</strong> Premium pricing based on false "natural" claims</p>
                    </div>
                  </div>

                  {/* Mars Petcare Cover-up */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">Mars Petcare Ingredient Cover-up <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15745632/mars-faces-lawsuit-over-excessive-vitamin-d-in-pedigree-dog-food" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(PetfoodIndustry, 2025 ↗)</a></h4>
                      <Badge variant="outline" className="text-sm">February 2025</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                      <p><strong>Violation:</strong> Failed to disclose toxic vitamin D levels 28x above minimum requirements <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15745632/mars-faces-lawsuit-over-excessive-vitamin-d-in-pedigree-dog-food" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></p>
                      <p><strong>Health Impact:</strong> Multiple dogs hospitalized for vitamin D toxicity</p>
                      <p><strong>Corporate Response:</strong> Denied responsibility despite independent testing confirmation</p>
                    </div>
                  </div>

                  {/* Blue Buffalo Truth Campaign */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200">Blue Buffalo "Truth About Pet Food" Hypocrisy <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a></h4>
                      <Badge variant="outline" className="text-sm">Settled $32M</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <p><strong>Violation:</strong> Contained chicken by-products and corn despite "no poultry by-products" claims</p>
                      <p><strong>Marketing Deception:</strong> Spent millions on "Truth About Pet Food" campaign while lying about ingredients <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a></p>
                      <p><strong>Legal Outcome:</strong> $32 million settlement, forced to change labeling practices</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Regulatory Failures */}
            <Card className="border-yellow-200 dark:border-yellow-800" data-testid="card-regulatory-failures">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  FDA Regulatory Failures in Ingredient Oversight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Systemic Failures <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(STAT News, 2025 ↗)</a></h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>No Pre-Market Review:</strong> Products reach market without ingredient verification <a href="https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Policy ↗)</a></li>
                        <li>• <strong>Self-Reported Data:</strong> Companies police themselves on ingredient accuracy</li>
                        <li>• <strong>Voluntary Recalls:</strong> No mandate to remove contaminated products from shelves</li>
                        <li>• <strong>Minimal Penalties:</strong> Warning letters with no financial consequences</li>
                        <li>• <strong>Industry Influence:</strong> Revolving door between FDA and pet food companies <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT Investigation ↗)</a></li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">International Comparison</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <strong className="text-green-800 dark:text-green-200 block">European Union</strong>
                          <p className="text-sm text-green-700 dark:text-green-300">Mandatory pre-market approval, full ingredient disclosure, toxic additive bans</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <strong className="text-green-800 dark:text-green-200 block">Canada</strong>
                          <p className="text-sm text-green-700 dark:text-green-300">Stricter heavy metal limits, banned artificial preservatives</p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <strong className="text-red-800 dark:text-red-200 block">United States</strong>
                          <p className="text-sm text-red-700 dark:text-red-300">Industry self-regulation, minimal oversight, corporate-friendly policies <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT Analysis ↗)</a></p>
                        </div>
                      </div>
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
                  How PawsitiveCheck Exposes Hidden Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <Camera className="w-12 h-12 text-blue-600 mx-auto" />
                    <h4 className="font-semibold">Ingredient Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Scan ingredient lists to reveal hidden synthetic additives, toxic preservatives, and misleading claims.
                    </p>
                    <Link href="/product-scanner">
                      <Button className="mystical-button" data-testid="button-start-scanning">
                        Scan Ingredients
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <Search className="w-12 h-12 text-purple-600 mx-auto" />
                    <h4 className="font-semibold">Transparency Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Search our database of analyzed products to see actual ingredients versus marketing claims.
                    </p>
                    <Link href="/product-database">
                      <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white" data-testid="button-browse-database">
                        View Database
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto" />
                    <h4 className="font-semibold">Corporate Accountability</h4>
                    <p className="text-sm text-muted-foreground">
                      Track lawsuits, settlements, and regulatory actions against companies hiding ingredients.
                    </p>
                    <Link href="/corporate-accountability">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white" data-testid="button-view-accountability">
                        View Accountability
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
          
          {/* Bottom Ad */}
          <div className="mt-12 flex justify-center">
            <AdBanner size="square" position="ingredient-transparency-footer" />
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}