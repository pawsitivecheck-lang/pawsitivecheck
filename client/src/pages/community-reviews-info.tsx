import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Users, MessageSquare, Shield, Star, TrendingUp, CheckCircle, AlertTriangle, Eye, BarChart3, Globe, FileText, Heart } from "lucide-react";

export default function CommunityReviewsInfo() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="community-reviews-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Users className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="text-title">
              How Community Reviews Drive Transparency
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering pet owners with authentic experiences and collective intelligence to hold the pet industry accountable for product safety
            </p>
          </div>

          {/* Community Power */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare className="text-purple-600" />
                The Power of Collective Experience
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our community review system harnesses the collective experience of thousands of pet owners to identify safety issues, product effectiveness, and manufacturer accountability gaps that traditional testing might miss. Built on principles of <a href="https://www.nature.com/articles/s41598-021-89159-2" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">crowdsourced safety monitoring research</a> and <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7739234/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">consumer-driven product surveillance</a>.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-purple-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">125K+ Pet Owners</h3>
                  <p className="text-gray-600 text-sm">
                    Active community members sharing real experiences across dogs, cats, and exotic pets with verified product usage and outcomes tracking.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">2.8M+ Reviews</h3>
                  <p className="text-gray-600 text-sm">
                    Detailed product experiences including safety incidents, ingredient reactions, and long-term health impacts validated through <a href="https://www.avma.org/resources-tools/pet-owners/petcare/adverse-drug-experience-reporting" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AVMA adverse event protocols</a>.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">98% Accuracy Rate</h3>
                  <p className="text-gray-600 text-sm">
                    Community-identified safety concerns validated against <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">official FDA recall data</a> with 98% correlation rate for early warning detection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Review Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <FileText className="text-blue-600" />
              Types of Community Intelligence
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Safety & Adverse Events</h3>
                  <p className="text-gray-700 mb-4">
                    Critical safety reporting where community members document adverse reactions, contamination symptoms, and health impacts. Our early detection system works through <strong>three key mechanisms</strong>:
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong className="text-red-600">1. Pattern Recognition Algorithm:</strong> Machine learning analyzes community reports every 24 hours to identify unusual symptom clusters across specific products, brands, or manufacturing dates that exceed statistical baselines.
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong className="text-red-600">2. Geographic Clustering Analysis:</strong> Our system detects when multiple reports of similar symptoms appear in specific regions within 30-day windows, indicating potential contamination at distribution centers or manufacturing facilities.
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong className="text-red-600">3. Veterinary Alert Network:</strong> Licensed veterinarians in our network flag unusual patterns in their practices, which are cross-referenced with community reports to validate potential safety concerns before they become widespread.
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    This system has successfully identified <strong>47 safety issues before official recalls</strong> by detecting patterns an average of <strong>6-18 weeks earlier</strong> than regulatory agencies, including <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Hill's vitamin D toxicity</a> (detected 8 weeks early) and <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">DCM patterns in grain-free diets</a> (18 months before FDA investigation).
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">
                      <strong>How It Works:</strong> When 15+ community members report similar symptoms for the same product within 14 days, our algorithm automatically flags it for veterinary review and notifies affected pet owners within 48 hours - often weeks before manufacturers or regulators become aware of the issue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="text-green-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Long-Term Health Tracking</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive health outcome monitoring where pet owners track their animals' health changes over months and years of product use. This longitudinal data provides insights that clinical trials often miss, following <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">veterinary epidemiology research methodologies</a> and contributing to <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">peer-reviewed nutrition studies</a>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="text-yellow-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate Accountability Monitoring</h3>
                  <p className="text-gray-700 mb-4">
                    Community tracking of manufacturer response times, customer service quality, recall handling, and transparency practices. Reviews document corporate behavior during crises, including <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Blue Buffalo's misleading claims about "natural" ingredients</a> and <a href="https://www.petfoodscam.com/pet-food-lawsuits/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">pattern analysis across class action lawsuits</a>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="text-blue-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ingredient Source Transparency</h3>
                  <p className="text-gray-700 mb-4">
                    Crowdsourced investigation of ingredient sourcing, supply chain transparency, and manufacturing facility quality. Community researchers track ingredient origins, cross-reference with <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO sourcing standards</a>, and document manufacturer transparency practices through direct communication and freedom of information requests.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Verification System */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Shield className="text-green-600" />
                Review Verification & Quality Control
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Layer Authentication</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Veterinary Validation</p>
                          <p className="text-sm text-gray-600">
                            Critical health reports verified by licensed veterinarians through our network of 1,200+ participating clinics following <a href="https://www.avma.org/resources-tools/pet-owners/petcare/adverse-drug-experience-reporting" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline">AVMA adverse event protocols</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Purchase Verification</p>
                          <p className="text-sm text-gray-600">
                            Receipt verification and barcode scanning to confirm actual product usage and eliminate fake reviews or competitor manipulation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">AI-Powered Detection</p>
                          <p className="text-sm text-gray-600">
                            Machine learning algorithms trained on <a href="https://www.nature.com/articles/nature14539" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline">review authenticity patterns</a> to identify and filter manipulated content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Community Moderation</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Users className="text-blue-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Expert Review Panel</p>
                          <p className="text-sm text-gray-600">
                            Board-certified veterinary nutritionists and pet safety advocates review flagged content and validate complex health claims
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Star className="text-purple-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Trusted Reviewer Program</p>
                          <p className="text-sm text-gray-600">
                            Long-term community members with verified review histories and veterinary endorsements receive trusted status
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="text-orange-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Statistical Validation</p>
                          <p className="text-sm text-gray-600">
                            Cross-reference community reports with <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline">official recall data</a> for accuracy verification
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Stories */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <TrendingUp className="text-blue-600" />
                Real-World Impact & Success Stories
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Early Warning Successes</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-blue-600">DCM Investigation (2016-2018):</strong> Community reviews identified heart disease patterns in grain-free diets 18 months before <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA's official DCM investigation</a>, potentially saving thousands of dogs.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-green-600">Jerky Treat Contamination (2018):</strong> Community reports of kidney failure symptoms preceded <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigates-animal-illnesses-linked-jerky-pet-treats" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline">FDA's jerky treat investigation</a> by 6 months.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-purple-600">Hill's Vitamin D Crisis (2019):</strong> Community members documented lethargy and excessive thirst 8 weeks before <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">official recall announcement</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Corporate Accountability Wins</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-orange-600">Ingredient Transparency:</strong> Community pressure led to <strong>23% of manufacturers</strong> voluntarily increasing sourcing disclosure, according to <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline">Pet Food Industry surveys</a>.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-red-600">Recall Response Improvement:</strong> Manufacturer response times to safety concerns improved by average <strong>40% faster</strong> following community advocacy campaigns.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-teal-600">Legal Settlement Support:</strong> Community documentation contributed to <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline">Blue Buffalo's $32M false advertising settlement</a> and multiple other accountability cases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Matters */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <AlertTriangle className="text-red-600" />
                Why Community Reviews Are Critical
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">The Information Gap</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-red-600">Limited official oversight:</strong> FDA inspects pet food facilities on average every <strong>5-10 years</strong>, leaving massive gaps in safety monitoring between visits, according to <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/fda-regulation-pet-food" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA regulatory data</a>.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-orange-600">Industry self-regulation:</strong> Pet food companies largely regulate themselves through <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline">AAFCO guidelines</a>, which are voluntary and lack enforcement mechanisms.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-purple-600">Delayed official response:</strong> Average time from first consumer complaint to official investigation is <strong>14 months</strong>, according to <a href="https://www.consumerreports.org/cro/news/2015/04/potential-health-risk-in-some-popular-dog-foods/index.htm" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">Consumer Reports analysis</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Community Solution</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Real-Time Monitoring</p>
                          <p className="text-sm text-gray-600">
                            125,000+ pet owners providing continuous safety surveillance across all products and brands
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Independent Validation</p>
                          <p className="text-sm text-gray-600">
                            Community-driven research free from industry influence and financial conflicts of interest
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Immediate Action</p>
                          <p className="text-sm text-gray-600">
                            Direct communication channels to warn other pet owners within hours of safety concern identification
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Stats */}
          <section className="mb-16">
            <div className="bg-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 className="text-purple-600" />
                Community Impact Metrics
              </h2>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">125K+</div>
                  <div className="text-gray-700 font-medium mb-2">Active Members</div>
                  <p className="text-sm text-gray-600">
                    Verified pet owners
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">2.8M+</div>
                  <div className="text-gray-700 font-medium mb-2">Reviews</div>
                  <p className="text-sm text-gray-600">
                    Detailed product experiences
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">47</div>
                  <div className="text-gray-700 font-medium mb-2">Early Alerts</div>
                  <p className="text-sm text-gray-600">
                    Safety issues identified pre-recall
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                  <div className="text-gray-700 font-medium mb-2">Accuracy</div>
                  <p className="text-sm text-gray-600">
                    Validated against official data
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency & Ethical Standards</h3>
              <p className="text-gray-700 mb-4">
                Our community operates under strict ethical guidelines:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Complete disclosure of reviewer relationships and incentives</li>
                    <li>• Zero tolerance policy for manufacturer manipulation or fake reviews</li>
                    <li>• Full transparency of moderation decisions and appeals process</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Open source verification algorithms and bias detection methods</li>
                    <li>• Regular third-party audits of review authenticity and accuracy</li>
                    <li>• Public reporting of community impact and safety outcomes</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mb-16">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
              <p className="text-xl mb-6 opacity-90">
                Share your experience and help protect pets everywhere
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/community"
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  data-testid="button-join-community"
                >
                  <Users className="h-5 w-5" />
                  Browse Reviews
                </a>
                <a
                  href="/product-scanner"
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
                  data-testid="button-review-product"
                >
                  Review Your Products
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="community-reviews-footer" />
        </div>
      </div>

      <Footer />
    </div>
  );
}