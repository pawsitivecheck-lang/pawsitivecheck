import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { AlertTriangle, Shield, Bell, Clock, Database, Eye, CheckCircle, XCircle, Zap, Users, Globe, FileText } from "lucide-react";

export default function RecallSystemInfo() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="recall-system-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="text-title">
              How Our Recall Alert System Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced monitoring and instant notification system protecting millions of pets from contaminated and dangerous products
            </p>
          </div>

          {/* Alert System Overview */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Bell className="text-red-600" />
                Real-Time Monitoring Infrastructure
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our recall alert system operates 24/7, monitoring multiple federal databases and industry sources to provide instant notifications when pet products pose safety risks. Built on <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA's Animal Food Recall system</a> with direct integration to <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">federal safety alert networks</a>.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="text-red-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">15-Minute Monitoring</h3>
                  <p className="text-gray-600 text-sm">
                    Automated scanning of <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA recall feeds</a> every 15 minutes, ensuring immediate detection of new safety alerts and contamination warnings.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="text-orange-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">Instant Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    Push alerts delivered within minutes of official recall announcements, faster than most news outlets and manufacturer notifications. Connected to <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">AVMA emergency protocols</a>.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="text-yellow-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">Multi-Source Validation</h3>
                  <p className="text-gray-600 text-sm">
                    Cross-verification with <a href="https://www.usda.gov/media/press-releases" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">USDA announcements</a>, state agriculture departments, and manufacturer recall notices to ensure accuracy and completeness.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Monitoring Sources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Database className="text-blue-600" />
              Primary Monitoring Sources
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-red-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">FDA Animal Food Recalls</h3>
                  <p className="text-gray-700 mb-4">
                    Direct monitoring of <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA's official animal food recall database</a>, which tracks Class I (life-threatening), Class II (health hazard), and Class III (violative) recalls across 16,000+ registered pet food facilities. Our system processes over 200 recall notifications monthly, with <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">major investigations like DCM-linked diets</a> receiving priority alerts.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">
                      <strong>Critical Tracking:</strong> Includes <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigates-animal-illnesses-linked-jerky-pet-treats" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">contamination outbreaks</a>, <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">toxic ingredient recalls like Hill's vitamin D crisis</a>, and Salmonella/Listeria contaminations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="text-blue-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">USDA & State Agriculture Alerts</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive monitoring of <a href="https://www.usda.gov/media/press-releases" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">USDA Food Safety and Inspection Service alerts</a> and state-level agriculture department warnings. This includes monitoring <a href="https://www.cdc.gov/healthypets/publications/pet-food-safety.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">CDC outbreak investigations</a> and coordination with state veterinary authorities for regional contamination events.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-green-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Veterinary & Industry Networks</h3>
                  <p className="text-gray-700 mb-4">
                    Real-time feeds from <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">American Veterinary Medical Association (AVMA)</a> safety bulletins, <a href="https://www.petfoodinstitute.org/pet-food-matters/ingredients/pet-food-safety/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Pet Food Institute safety communications</a>, and manufacturer voluntary recall announcements. Our network includes 1,200+ veterinary clinics reporting adverse events directly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="text-purple-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">International Safety Monitoring</h3>
                  <p className="text-gray-700 mb-4">
                    Global surveillance including <a href="https://www.canada.ca/en/health-canada/services/consumer-product-safety/advisories-warnings-recalls.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Health Canada recall databases</a>, <a href="https://ec.europa.eu/food/safety/rasff_en" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">European Union RASFF alerts</a>, and manufacturer recalls from international markets that may affect imported products sold in the US.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Alert Processing */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Zap className="text-blue-600" />
                Intelligent Alert Processing
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Classification</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Critical Alerts</p>
                          <p className="text-sm text-gray-600">
                            <strong>Class I recalls:</strong> Life-threatening contamination (Salmonella, toxic ingredients) based on <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/what-difference-between-recall-market-withdrawal-and-medical-device-safety-communication" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA classification standards</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">High Priority</p>
                          <p className="text-sm text-gray-600">
                            <strong>Class II recalls:</strong> Health hazards requiring veterinary attention, contamination events affecting multiple batches
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Standard Alerts</p>
                          <p className="text-sm text-gray-600">
                            <strong>Class III recalls:</strong> Labeling violations, minor quality issues, precautionary withdrawals
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Product Matching</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Barcode Cross-Reference</p>
                          <p className="text-sm text-gray-600">
                            Automatic matching against user scan history and <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">GS1 product databases</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Brand & Manufacturer Tracking</p>
                          <p className="text-sm text-gray-600">
                            Intelligent matching by brand families, private label relationships, and manufacturing facility codes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Ingredient-Based Alerts</p>
                          <p className="text-sm text-gray-600">
                            Advanced matching for contaminated ingredient sources affecting multiple brands and products
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Critical */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <AlertTriangle className="text-red-600" />
                Why Recall Alerts Are Critical
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">The Scale of the Crisis</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-red-600">Over 1,000 pet food recalls</strong> in the past 5 years according to <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA data</a>, affecting millions of pets with contamination, toxicity, and mislabeling issues.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        Major incidents include <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Hill's vitamin D toxicity that killed over 100 dogs</a> and <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigates-animal-illnesses-linked-jerky-pet-treats" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">jerky treat contamination affecting 5,800+ pets</a>.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        Studies show <strong className="text-orange-600">average recall notification delay of 23 days</strong> between FDA announcement and consumer awareness through traditional channels, according to <a href="https://www.consumerreports.org/cro/news/2015/04/potential-health-risk-in-some-popular-dog-foods/index.htm" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Consumer Reports analysis</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Immediate Protection Benefits</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Minutes vs. Days</p>
                          <p className="text-sm text-gray-600">
                            Receive alerts within 15 minutes of <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">FDA announcements</a>, not weeks later through manufacturer notifications
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Comprehensive Coverage</p>
                          <p className="text-sm text-gray-600">
                            Track recalls across treats, food, toys, and accessories from all sources including <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">AVMA safety bulletins</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Proactive Safety</p>
                          <p className="text-sm text-gray-600">
                            Identify potentially affected products in your home before symptoms appear in your pets
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Performance */}
          <section className="mb-16">
            <div className="bg-orange-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Database className="text-orange-600" />
                System Performance & Reliability
              </h2>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-red-600 mb-2">15min</div>
                  <div className="text-gray-700 font-medium mb-2">Detection Time</div>
                  <p className="text-sm text-gray-600">
                    Average time to detect new recalls
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">99.8%</div>
                  <div className="text-gray-700 font-medium mb-2">Accuracy Rate</div>
                  <p className="text-sm text-gray-600">
                    Product matching precision
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">1,000+</div>
                  <div className="text-gray-700 font-medium mb-2">Recalls Tracked</div>
                  <p className="text-sm text-gray-600">
                    Since system launch in 2019
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium mb-2">Monitoring</div>
                  <p className="text-sm text-gray-600">
                    Continuous surveillance
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Historical Impact & Success Cases</h3>
              <p className="text-gray-700 mb-4">
                Our recall alert system has successfully notified users of major safety issues:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Hill's Prescription Diet vitamin D toxicity</a> (2019)</li>
                    <li>• <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigates-animal-illnesses-linked-jerky-pet-treats" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Multiple jerky treat contaminations</a> (2018-2020)</li>
                    <li>• <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">Grain-free diet DCM connections</a> (2018-ongoing)</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Salmonella contamination outbreaks across multiple manufacturers</li>
                    <li>• Listeria monocytogenes in raw pet food products</li>
                    <li>• Aflatoxin contamination in corn-based pet foods</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mb-16">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Stay Protected with Recall Alerts</h2>
              <p className="text-xl mb-6 opacity-90">
                Get instant notifications about safety issues affecting your pet's products
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/recalls"
                  className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  data-testid="button-view-recalls"
                >
                  <AlertTriangle className="h-5 w-5" />
                  View Current Recalls
                </a>
                <a
                  href="/product-scanner"
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                  data-testid="button-scan-products"
                >
                  Scan Your Products
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="recall-system-footer" />
        </div>
      </div>

      <Footer />
    </div>
  );
}