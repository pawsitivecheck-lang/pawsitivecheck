import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Scale, AlertTriangle, TrendingDown, DollarSign, ExternalLink, Search, Camera, Bell } from "lucide-react";

export default function CorporateAccountability() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
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
              <Scale className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-hero-title">
                Corporate Accountability
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6" data-testid="text-hero-subtitle">
                Exposing regulatory failures, corporate cover-ups, and the urgent need for transparency in the pet industry
              </p>
              <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-lg p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Why Corporate Accountability Matters</h2>
                <p className="text-red-700 dark:text-red-300 text-lg leading-relaxed">
                  <strong>Without accountability, companies prioritize profits over pet lives.</strong> When corporations face no consequences for unsafe products, contaminated food, or deceptive marketing, they have no incentive to change. The result? More sick pets, more bereaved families, and an industry that treats animal suffering as an acceptable cost of doing business.
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Industry Crisis Numbers</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-lawsuit-amount">$2.6B</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Largest pet industry lawsuit</div>
                  <div className="text-xs text-red-600 mt-1">Hill's Pet Nutrition DCM case¹</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-purina-complaints">971</div>
                  <div className="text-sm text-red-700 dark:text-red-300">FDA complaints in January 2024</div>
                  <div className="text-xs text-red-600 mt-1">1,312 sick pets reported²</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600" data-testid="stat-human-victims">7</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Humans sickened by pet food</div>
                  <div className="text-xs text-red-600 mt-1">6 were children under 1 year³</div>
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
                        <span className="text-red-700 dark:text-red-300 block">103 pet deaths reported in January 2024 alone, yet companies deny responsibility and continue operations unchanged.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Human Health Risks Multiply:</strong>
                        <span className="text-red-700 dark:text-red-300 block">Contaminated pet food sickens entire families, with 6 infants under one year affected by a single company's failures.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Scientific Manipulation:</strong>
                        <span className="text-red-700 dark:text-red-300 block">Companies fund fake research and coordinate with academia to create false health scares about competitors' products.</span>
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
                        <span className="text-green-700 dark:text-green-300 block">Multi-million dollar lawsuits force companies to improve safety protocols and quality control systems.</span>
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
                  
                  {/* Hill's Pet Nutrition DCM Scandal */}
                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-red-800 dark:text-red-200">Hill's Pet Nutrition - Grain-Free Diet Deception¹</h4>
                      <Badge variant="destructive" className="text-sm">$2.6B Lawsuit</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <p><strong>Allegation:</strong> Fabricated scientific evidence linking grain-free diets to dilated cardiomyopathy (DCM) in dogs</p>
                      <p><strong>Market Manipulation:</strong> Lost 20% market share before FDA investigation, became fastest-growing company in 5 years after</p>
                      <p><strong>Scientific Fraud:</strong> Over 150 independent studies found no connection between grain-free diets and DCM</p>
                      <p><strong>Conspiracy:</strong> Coordinated with veterinary researchers and non-profits to spread misinformation</p>
                    </div>
                  </div>

                  {/* Purina Crisis Cover-up */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">Purina Crisis Cover-up²</h4>
                      <Badge variant="outline" className="text-sm">1,312 Sick Pets</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                      <p><strong>Crisis Response:</strong> Publicly claimed "no health or safety issues" despite 631 FDA reports by mid-January 2024</p>
                      <p><strong>Sick Animals:</strong> 1,184 of 1,312 sick pet reports linked to Purina products in January alone</p>
                      <p><strong>Death Toll:</strong> 97 of 103 reported pet deaths in January 2024 linked to Purina</p>
                      <p><strong>Regulatory Failure:</strong> Pet owners told "You don't have a chance to prove there is a problem with the pet food"</p>
                    </div>
                  </div>

                  {/* Oregon Testing Scandal */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Oregon Department Testing Scandal⁴</h4>
                      <Badge variant="outline" className="text-sm">Protocol Violation</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p><strong>Testing Fraud:</strong> Tested only opened packages instead of unopened samples (protocol violation)</p>
                      <p><strong>Contamination Risk:</strong> Opened samples can be contaminated from external sources</p>
                      <p><strong>Public Deception:</strong> Issued alarming press releases without disclosing improper testing procedures</p>
                      <p><strong>Impact:</strong> Created false panic while potentially covering up real contamination issues</p>
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
                        <p className="text-sm text-green-700 dark:text-green-300">Aflatoxin and Salmonella contamination settlement. Up to $150,000 per documented injury claim.</p>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-blue-800 dark:text-blue-200">Diamond Pet Foods/Costco</span>
                          <Badge className="bg-blue-600">$2M</Badge>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Salmonella outbreak that sickened pets and 49 people across 20 states.</p>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-purple-800 dark:text-purple-200">Mars Petcare</span>
                          <Badge variant="outline">Ongoing</Badge>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300">False "natural" marketing claims despite synthetic ingredients.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Active Investigations</h4>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-red-800 dark:text-red-200">Mid America Pet Food</span>
                          <Badge variant="destructive">Criminal Investigation</Badge>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">Salmonella outbreak affecting 7 humans, 6 children under 1 year old. Multi-state FDA/CDC investigation.</p>
                      </div>

                      <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-orange-800 dark:text-orange-200">Nestlé Purina</span>
                          <Badge variant="outline">Facility Violations</Badge>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-300">Denver facility odor lawsuit affecting 2,000+ households. Multiple class actions filed.</p>
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
                        <li>• <strong>No Pre-Market Approval:</strong> Products need not be nutritionally sufficient to go to market</li>
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
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">FDA-AAFCO Partnership Collapse (2024)⁴</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      In October 2024, a longstanding agreement between FDA and AAFCO ended, leaving the pet food industry with uncertainty about future ingredient approval processes. This regulatory vacuum creates accountability gaps that companies can exploit.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Recent Warning Letters & Violations³</h4>
                    <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p><strong>Mid America Pet Food (Nov 2024):</strong> CGMP violations, insanitary conditions</p>
                      <p><strong>Answers Pet Food (June 2025):</strong> Failed preventive controls, pathogen contamination</p>
                      <p><strong>Family Dollar:</strong> $41.675M plea agreement for insanitary conditions</p>
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
                      <li>• Fund biased research studies</li>
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

            {/* Scientific Citations */}
            <Card className="border-gray-200 dark:border-gray-700" data-testid="card-citations">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-gray-800 dark:text-gray-200">
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Legal & Regulatory Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong>1.</strong> Wolf Haldenstein Adler Freeman & Herz LLP. (2024). 
                    <em>$2.6 Billion Class Action Against Hill's Pet Nutrition.</em> 
                    <a href="https://www.prnewswire.com/news-releases/wolf-haldenstein-adler-freeman--herz-llp-announces-2-6-billion-unfair-competition-class-action-against-hills-pet-nutrition-two-affiliated-non-profits-and-numerous-veterinary-researchers-302057821.html" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                      View Source ↗
                    </a>
                  </div>
                  
                  <div>
                    <strong>2.</strong> Truth About Pet Food. (2024). 
                    <em>971 Pet Food Complaints Reported to FDA January 2024.</em> 
                    <a href="https://truthaboutpetfood.com/971-pet-food-complaints-reported-to-fda-january-2024/" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                      View Source ↗
                    </a>
                  </div>
                  
                  <div>
                    <strong>3.</strong> U.S. Food and Drug Administration. (2024). 
                    <em>Warning Letters - Mid America Pet Food LLC & Answers Pet Food.</em> 
                    <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                      View Source ↗
                    </a>
                  </div>
                  
                  <div>
                    <strong>4.</strong> Truth About Pet Food. (2024). 
                    <em>2024 Pet Food in Review - Regulatory Failures.</em> 
                    <a href="https://truthaboutpetfood.com/2024-pet-food-in-review/" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                      View Source ↗
                    </a>
                  </div>
                  
                  <div>
                    <strong>Additional Resources:</strong>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li>• FDA Center for Veterinary Medicine Compliance & Enforcement</li>
                      <li>• STAT News - Pet Food Safety & FDA Regulation Analysis</li>
                      <li>• Class Action Settlement Databases & Legal Filings</li>
                    </ul>
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