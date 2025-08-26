import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Scale, AlertTriangle, TrendingDown, DollarSign, ExternalLink, Search, Camera, Bell, Sparkles } from "lucide-react";

export default function CorporateAccountability() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-mystical-purple text-cosmic-100">
      <Navbar />
      
      {/* Top Banner Ad */}
      <div className="bg-card dark:bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="corporate-accountability-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="relative inline-block">
                <Scale className="w-16 h-16 text-starlight-400 mx-auto mb-4" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-starlight-400 mb-4 font-header" data-testid="text-hero-title">
                Corporate Accountability
              </h1>
              <p className="text-xl text-cosmic-200 max-w-3xl mx-auto mb-6" data-testid="text-hero-subtitle">
                Exposing regulatory failures, corporate cover-ups, and the urgent need for transparency in the pet industry
              </p>
              <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-lg p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Why Corporate Accountability Matters</h2>
                <p className="text-red-700 dark:text-red-300 text-lg leading-relaxed">
                  <strong>Without accountability, companies prioritize profits over pet lives.</strong> When corporations face no consequences for unsafe products, contaminated food, or deceptive marketing, they have no incentive to change. The result? More sick pets, more bereaved families, and an industry that treats animal suffering as an acceptable cost of doing business.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-red-300">Industry Crisis Numbers</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-lawsuit-amount">$6.375M</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Largest settlement paid in 2024</div>
                  <div className="text-xs text-red-600 mt-1">
                    Midwestern Pet Foods contamination
                    <a href="https://topclassactions.com/lawsuit-settlements/closed-settlements/midwestern-pet-foods-aflatoxin-salmonella-contamination-6-375m-class-action-settlement/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (Top Class Actions, 2024 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-recent-violations">17+</div>
                  <div className="text-sm text-red-700 dark:text-red-300">FDA warning letters issued 2025</div>
                  <div className="text-xs text-red-600 mt-1">
                    Including bird flu contamination
                    <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (PetfoodIndustry, 2025 ↗)
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-human-victims">7</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Humans sickened by pet food</div>
                  <div className="text-xs text-red-600 mt-1">
                    6 were children under 1 year
                    <a href="https://a-capp.msu.edu/article/a-case-study-of-melamine-as-a-counterfeit-food-product-additive-in-chinese-human-and-animal-food-supply-chain-networks/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      (MSU Case Study ↗)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Accountability is Critical */}
          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950" data-testid="card-why-accountability">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center text-blue-800 dark:text-blue-200">
                <Scale className="w-6 h-6 mr-3" />
                The Critical Need for Corporate Accountability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-red-700 dark:text-red-300">What Happens Without Accountability:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Pet Deaths Go Unaddressed:</strong>
                        <span className="text-red-700 dark:text-red-300 block">103 pet deaths reported in January 2024 alone <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News, 2025 ↗)</a>, yet companies deny responsibility and continue operations unchanged.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Human Health Risks Multiply:</strong>
                        <span className="text-red-700 dark:text-red-300 block">Contaminated pet food sickens entire families, with 6 infants under one year affected by a single company's failures <a href="https://a-capp.msu.edu/article/a-case-study-of-melamine-as-a-counterfeit-food-product-additive-in-chinese-human-and-animal-food-supply-chain-networks/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(MSU Case Study ↗)</a>.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Scientific Manipulation:</strong>
                        <span className="text-red-700 dark:text-red-300 block">Companies fund fake research and coordinate with academia to create false health scares about competitors' products <a href="https://cvm.msu.edu/news/perspectives-magazine/perspectives-winter-2018/defining-and-fighting-food-fraud" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(MSU Veterinary Medicine ↗)</a>.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Regulatory Capture:</strong>
                        <span className="text-red-700 dark:text-red-300 block">Weak enforcement allows repeat offenders to continue contaminating products with toxic heavy metals and pathogens.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-green-700 dark:text-green-300">The Power of Accountability:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-green-800 dark:text-green-200">Financial Consequences Drive Change:</strong>
                        <span className="text-green-700 dark:text-green-300 block">Multi-million dollar lawsuits force companies to improve safety protocols and quality control systems <a href="https://topclassactions.com/lawsuit-settlements/closed-settlements/midwestern-pet-foods-aflatoxin-salmonella-contamination-6-375m-class-action-settlement/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(Top Class Actions ↗)</a>.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-green-800 dark:text-green-200">Public Exposure Prevents Cover-ups:</strong>
                        <span className="text-green-700 dark:text-green-300 block">Transparency platforms like PawsitiveCheck make it impossible for companies to hide safety violations from consumers.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-green-800 dark:text-green-200">Consumer Empowerment:</strong>
                        <span className="text-green-700 dark:text-green-300 block">Armed with real safety data, pet owners can make informed choices and vote with their wallets.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-green-800 dark:text-green-200">Industry-Wide Reform:</strong>
                        <span className="text-green-700 dark:text-green-300 block">When one company faces consequences, competitors proactively improve their practices to avoid similar exposure.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">The Bottom Line:</h4>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  <strong>Every lawsuit filed, every recall exposed, and every safety violation documented creates pressure for systemic change.</strong> 
                  Corporate accountability isn't just about punishing past wrongs—it's about preventing future tragedies by making unsafe practices too expensive to continue.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Sections */}
          <div className="space-y-12">
            
            {/* Major Corporate Scandals */}
            <Card className="border-red-200 dark:border-red-800" data-testid="card-major-scandals">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-red-800 dark:text-red-200">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Major Corporate Scandals & Cover-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  
                  {/* Bird Flu Pet Food Crisis */}
                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-red-800 dark:text-red-200">H5N1 Bird Flu Pet Food Crisis <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></h4>
                      <Badge variant="destructive" className="text-sm">2025 Outbreak</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <p><strong>Multiple Cat Deaths:</strong> Wild Coast, Northwest Naturals, Savage Pet raw foods contaminated with H5N1 <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></p>
                      <p><strong>Legal Action:</strong> Wild Coast Pet Foods sued after 4-year-old cat "Kira" died from H5N1 contamination <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></p>
                      <p><strong>Public Health Risk:</strong> Pet-to-human transmission concerns, especially dangerous for children</p>
                      <p><strong>Corporate Response:</strong> Delayed recalls and inadequate warnings about bird flu risks to consumers</p>
                    </div>
                  </div>

                  {/* Mars/Pedigree Vitamin D Poisoning */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">Mars/Pedigree Vitamin D Toxicity <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15745632/mars-faces-lawsuit-over-excessive-vitamin-d-in-pedigree-dog-food" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(PetfoodIndustry, 2025 ↗)</a></h4>
                      <Badge variant="outline" className="text-sm">2025 Lawsuit</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                      <p><strong>Toxic Levels:</strong> Independent testing found 28x minimum vitamin D requirements (5x safe maximum) <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15745632/mars-faces-lawsuit-over-excessive-vitamin-d-in-pedigree-dog-food" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></p>
                      <p><strong>Health Impact:</strong> Causing vomiting, weight loss, diarrhea, potential death in dogs</p>
                      <p><strong>Corporate Negligence:</strong> Products remained on market despite dangerous overdose levels</p>
                      <p><strong>Legal Action:</strong> Class action filed February 2025 for New York General Business Law violations <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15745632/mars-faces-lawsuit-over-excessive-vitamin-d-in-pedigree-dog-food" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a></p>
                    </div>
                  </div>

                  {/* Answers Pet Food FDA Defiance */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Answers Pet Food vs FDA <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lystn-llc-dba-answers-pet-food-694680-06182025" className="text-blue-600 hover:underline text-sm font-normal" target="_blank" rel="noopener noreferrer">(FDA Warning Letter, 2025 ↗)</a></h4>
                      <Badge variant="outline" className="text-sm">June 2025</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p><strong>Contamination Crisis:</strong> Salmonella and Listeria found in 4 product lots, facility surfaces contaminated</p>
                      <p><strong>Corporate Defiance:</strong> Company sued FDA challenging zero-tolerance Salmonella policy as "unconstitutional" <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lystn-llc-dba-answers-pet-food-694680-06182025" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Warning Letter ↗)</a></p>
                      <p><strong>Regulatory Failure:</strong> Failed to implement preventive controls despite repeated violations</p>
                      <p><strong>Consumer Risk:</strong> 3 consumer complaints of dog illnesses triggered FDA emergency inspection</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Class Action Lawsuits */}
            <Card className="border-purple-200 dark:border-purple-800" data-testid="card-class-actions">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-purple-800 dark:text-purple-200">
                  <DollarSign className="w-6 h-6 mr-3" />
                  Major Class Action Settlements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Recent Settlements</h4>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green-800 dark:text-green-200">Midwestern Pet Foods</span>
                          <Badge className="bg-green-600">$6.375M</Badge>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">2024 settlement for aflatoxin contamination <a href="https://topclassactions.com/lawsuit-settlements/closed-settlements/midwestern-pet-foods-aflatoxin-salmonella-contamination-6-375m-class-action-settlement/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(Top Class Actions ↗)</a>. Payments up to $128.65 reported by October 2024.</p>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-blue-800 dark:text-blue-200">ZuPreem Pet Foods</span>
                          <Badge className="bg-blue-600">March 2025</Badge>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Class action for false "natural" labeling despite synthetic pyridoxine hydrochloride, citric acid <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a>.</p>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-purple-800 dark:text-purple-200">Multiple "Natural" Claims</span>
                          <Badge variant="outline">2025 Trend</Badge>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300">Merrick Pet Care, Wellness Pet Food, Mars Petcare facing similar "natural" labeling lawsuits <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a>.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Active Investigations</h4>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-red-800 dark:text-red-200">Blue Ridge Beef</span>
                          <Badge variant="destructive">2025 Recall</Badge>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">Nearly 5 tons of puppy/kitten products recalled across 16 states for salmonella and listeria <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lystn-llc-dba-answers-pet-food-694680-06182025" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(FDA Warning ↗)</a>.</p>
                      </div>

                      <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-orange-800 dark:text-orange-200">Wild Coast Pet Foods</span>
                          <Badge variant="outline">H5N1 Lawsuit</Badge>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-300">Sued after cat death from bird flu contamination in raw chicken food <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a>. Failure to warn consumers.</p>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Legal Trend:</strong> Pet food has increasingly become a target for litigation, with class-action lawsuits becoming the primary accountability mechanism.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Failures */}
            <Card className="border-orange-200 dark:border-orange-800" data-testid="card-regulatory-failures">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-orange-800 dark:text-orange-200">
                  <TrendingDown className="w-6 h-6 mr-3" />
                  FDA Regulatory Failures & Structural Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-red-600">Limited FDA Authority</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>No Pre-Market Approval:</strong> Products need not be nutritionally sufficient to go to market <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a></li>
                        <li>• <strong>Labeling Only:</strong> FDA only ensures products are labeled truthfully and free of harmful substances</li>
                        <li>• <strong>No Quality Standards:</strong> High quality not required for market entry</li>
                        <li>• <strong>Third-Party Standards:</strong> AAFCO and WSAVA set nutritional standards, not FDA</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-orange-600">Enforcement Gaps</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Budget Cuts:</strong> Shrinking oversight due to federal budget cuts at CVM</li>
                        <li>• <strong>Patchy Regulation:</strong> Limited enforcement with gaps in coverage</li>
                        <li>• <strong>Reactive Approach:</strong> Many adverse events go uninvestigated until crisis</li>
                        <li>• <strong>Warning Letters:</strong> Companies get 15 days to respond, often insufficient</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">FDA Enforcement Surge (2025)⁴</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Despite mass layoffs at FDA's Center for Veterinary Medicine, enforcement actions increased dramatically in 2025 <a href="https://www.statnews.com/2025/04/04/pet-food-safety-fda-regulation-recalls/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(STAT News ↗)</a>. New H5N1 bird flu guidance requires pet food companies to update safety plans, but many continue operating with contaminated products <a href="https://www.petfoodindustry.com/pet-food-lawsuits-litigation/news/15741551/raw-pet-food-company-sued-after-cat-infected-with-bird-flu" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(PetfoodIndustry ↗)</a>.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Recent Warning Letters & Violations (2025)³</h4>
                    <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p><strong>Answers Pet Food (June 2025):</strong> Listeria on food-contact surfaces, 4 contaminated product lots</p>
                      <p><strong>CBD Pet Supplement Companies (April 2025):</strong> 4 companies cited for unapproved drug claims</p>
                      <p><strong>Blue Ridge Beef:</strong> Expanded recall for nearly 5 tons across 16 states</p>
                      <p><strong>Wild Coast, Savage Pet:</strong> H5N1 bird flu contamination in raw foods</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporate Evasion Tactics */}
            <Card className="border-gray-200 dark:border-gray-700" data-testid="card-evasion-tactics">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-gray-800 dark:text-gray-200">
                  <Scale className="w-6 h-6 mr-3" />
                  Common Corporate Evasion Tactics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-red-600">Denial & Deflection</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Dismiss legitimate complaints as "rumors"</li>
                      <li>• Claim "no evidence" despite FDA reports</li>
                      <li>• Blame pet owners or external factors</li>
                      <li>• Use legal settlements without admitting wrongdoing</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-orange-600">Scientific Manipulation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Fund biased research studies <a href="https://cvm.msu.edu/news/perspectives-magazine/perspectives-winter-2018/defining-and-fighting-food-fraud" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">(MSU Veterinary Medicine ↗)</a></li>
                      <li>• Coordinate with veterinary researchers</li>
                      <li>• Create false scientific consensus</li>
                      <li>• Suppress contradictory evidence</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-purple-600">Regulatory Gaming</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Exploit FDA authority limitations</li>
                      <li>• Use voluntary recall timing strategically</li>
                      <li>• Rely on supplier certifications without verification</li>
                      <li>• Minimize recall scope definitions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How PawsitiveCheck Fights Back */}
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950" data-testid="card-pawsitivecheck-fights">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-blue-800 dark:text-blue-200">
                  <Scale className="w-6 h-6 mr-3" />
                  How PawsitiveCheck Promotes Corporate Accountability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <Camera className="w-12 h-12 text-blue-600 mx-auto" />
                    <h4 className="font-semibold">Independent Product Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Unbiased safety analysis free from corporate influence or marketing manipulation.
                    </p>
                    <Link href="/product-scanner">
                      <Button className="mystical-button" data-testid="button-analyze-products">
                        Analyze Products
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <Search className="w-12 h-12 text-green-600 mx-auto" />
                    <h4 className="font-semibold">Transparent Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Access real ingredient information and safety data companies don't want you to see.
                    </p>
                    <Link href="/product-database">
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid="button-search-transparency">
                        Search Database
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <Bell className="w-12 h-12 text-red-600 mx-auto" />
                    <h4 className="font-semibold">Real-Time Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about recalls and violations companies try to minimize or hide.
                    </p>
                    <Link href="/recalls">
                      <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" data-testid="button-recall-alerts">
                        Get Alerts
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-red-100 dark:bg-red-900 rounded-lg border-2 border-red-300 dark:border-red-700">
                  <h4 className="font-bold text-xl text-red-800 dark:text-red-200 mb-4">🚨 Your Action Can Save Lives - Here's How:</h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Immediate Actions:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">📋</span>
                          <span><strong>Report Problems:</strong> File FDA Safety Reports for every incident - companies only respond to documented pressure</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">💰</span>
                          <span><strong>Join Lawsuits:</strong> Class actions are often the only way to force corporate change and get compensation</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">🔍</span>
                          <span><strong>Research Before Buying:</strong> Use PawsitiveCheck to avoid companies with poor safety records</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Long-term Impact:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">📢</span>
                          <span><strong>Spread Awareness:</strong> Share safety information - silence enables corporate negligence</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">🏛️</span>
                          <span><strong>Demand Reform:</strong> Contact representatives about strengthening FDA pet food oversight</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">🤝</span>
                          <span><strong>Support Transparency:</strong> Choose companies that voluntarily exceed minimum safety standards</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-200 dark:bg-red-800 rounded">
                    <p className="text-red-800 dark:text-red-200 font-semibold text-center">
                      💡 Remember: Every pet owner who stays silent enables the next preventable tragedy. Your voice matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
          
          {/* Bottom Ad */}
          <div className="mt-12 flex justify-center">
            <AdBanner size="square" position="corporate-accountability-footer" />
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}