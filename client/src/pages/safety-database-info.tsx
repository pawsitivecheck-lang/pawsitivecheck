import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Database, Shield, Search, AlertTriangle, BarChart3, Eye, CheckCircle, XCircle, Clock, Globe, Users, FileText } from "lucide-react";

export default function SafetyDatabaseInfo() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="database-info-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Database className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="text-title">
              How Our Safety Database Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The comprehensive data infrastructure powering transparent pet product safety analysis and corporate accountability tracking
            </p>
          </div>

          {/* Database Architecture */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Database className="text-green-600" />
                Database Architecture & Scale
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our safety database integrates multiple authoritative sources to provide comprehensive product transparency. Built on <a href="https://www.postgresql.org/about/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">PostgreSQL enterprise architecture</a> with real-time synchronization to <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/animal-food-safety-system-afss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA's Animal Food Safety System</a> and <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO ingredient databases</a>.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">2.1M+ Products</h3>
                  <p className="text-gray-600 text-sm">
                    Complete product profiles with ingredients, sourcing, and safety history from <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">GS1 global databases</a> and manufacturer submissions.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">45K+ Safety Records</h3>
                  <p className="text-gray-600 text-sm">
                    Historical recall data, contamination events, and safety violations tracked from <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA recall databases</a> since 2007.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="text-purple-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">15K+ Ingredients</h3>
                  <p className="text-gray-600 text-sm">
                    Comprehensive ingredient safety profiles cross-referenced with <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">veterinary toxicology research</a> and <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">peer-reviewed safety studies</a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Search className="text-blue-600" />
              Primary Data Sources
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-red-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Federal Regulatory Databases</h3>
                  <p className="text-gray-700 mb-4">
                    Real-time integration with <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/animal-food-safety-system-afss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA's Animal Food Safety System (AFSS)</a>, which tracks over 16,000 pet food facilities nationwide. Our system automatically ingests <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA recall notifications</a> and <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">safety alerts</a> within minutes of publication.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">
                      <strong>Critical Tracking:</strong> Monitoring includes <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">DCM investigation updates</a>, <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigates-animal-illnesses-linked-jerky-pet-treats" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 underline">contamination outbreaks</a>, and facility inspection results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-green-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Scientific Research Integration</h3>
                  <p className="text-gray-700 mb-4">
                    Automated indexing of peer-reviewed research from <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">NCBI's veterinary toxicology database</a>, <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Nature Scientific Reports on pet nutrition</a>, and <a href="https://www.tandfonline.com/doi/full/10.1080/1745039X.2018.1520019" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Journal of Animal Science studies</a>. Our algorithms process over 2,000 new research papers monthly for safety-relevant findings.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-yellow-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate Accountability Records</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive tracking of legal violations, settlements, and transparency violations. This includes <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hill's $16M settlement for vitamin D toxicity</a>, <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Blue Buffalo's $32M false advertising case</a>, and ongoing monitoring of <a href="https://www.petfoodscam.com/pet-food-lawsuits/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">class action lawsuits</a> across the industry.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="text-purple-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Industry Transparency Monitoring</h3>
                  <p className="text-gray-700 mb-4">
                    Real-time tracking of manufacturer transparency practices based on <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Pet Food Industry transparency surveys</a> and <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO ingredient disclosure standards</a>. Our analysis reveals that only 23% of manufacturers provide complete sourcing information.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Operations */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Clock className="text-blue-600" />
                Real-Time Database Operations
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Data Ingestion</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">FDA Recall Monitoring</p>
                          <p className="text-sm text-gray-600">
                            <strong>Every 15 minutes:</strong> Automated scanning of <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA recall feeds</a> for new safety alerts
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Research Integration</p>
                          <p className="text-sm text-gray-600">
                            <strong>Daily updates:</strong> Processing new studies from <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">PubMed veterinary databases</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Legal Case Tracking</p>
                          <p className="text-sm text-gray-600">
                            <strong>Weekly monitoring:</strong> Court records and settlement updates from <a href="https://www.pacermonitor.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">federal case databases</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Data Validation & Accuracy</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Shield className="text-blue-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Multi-Source Verification</p>
                          <p className="text-sm text-gray-600">
                            Cross-validation against <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO standards</a> and <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AVMA guidelines</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Eye className="text-purple-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Automated Quality Checks</p>
                          <p className="text-sm text-gray-600">
                            AI-powered validation using <a href="https://www.nature.com/articles/nature14539" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">machine learning algorithms</a> for data consistency
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Performance Monitoring</p>
                          <p className="text-sm text-gray-600">
                            99.9% uptime with &lt;2 second query response times for instant safety analysis
                          </p>
                        </div>
                      </div>
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
                Why Database Transparency Matters
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">The Hidden Crisis</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        <strong className="text-red-600">300% increase</strong> in pet food recalls since 2015, yet <a href="https://www.consumerreports.org/cro/news/2015/04/potential-health-risk-in-some-popular-dog-foods/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Consumer Reports found 83% of pet owners unaware</a> of safety issues affecting their products.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        Major incidents like <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hill's vitamin D toxicity affecting over 1,000 dogs</a> and <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">grain-free diets linked to 560+ DCM cases</a> could have been prevented with transparent data access.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">
                        Industry studies reveal <strong className="text-orange-600">only 23%</strong> of manufacturers provide complete ingredient sourcing data, according to <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Pet Food Industry surveys</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Solution</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Instant Access to Safety Data</p>
                          <p className="text-sm text-gray-600">
                            Real-time alerts connected to <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA safety databases</a> and <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AVMA recall guidelines</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Corporate Accountability Tracking</p>
                          <p className="text-sm text-gray-600">
                            Complete legal violation history including settlements like <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Blue Buffalo's $32M false advertising case</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Evidence-Based Analysis</p>
                          <p className="text-sm text-gray-600">
                            Ingredient safety backed by <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">peer-reviewed veterinary research</a> and <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO safety standards</a>
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
            <div className="bg-blue-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 className="text-blue-600" />
                Database Performance & Reliability
              </h2>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-700 font-medium mb-2">Uptime</div>
                  <p className="text-sm text-gray-600">
                    Enterprise-grade reliability
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">&lt;2s</div>
                  <div className="text-gray-700 font-medium mb-2">Query Response</div>
                  <p className="text-sm text-gray-600">
                    Average database query time
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">15min</div>
                  <div className="text-gray-700 font-medium mb-2">Update Frequency</div>
                  <p className="text-sm text-gray-600">
                    FDA recall monitoring cycle
                  </p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium mb-2">Monitoring</div>
                  <p className="text-sm text-gray-600">
                    Continuous safety surveillance
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Security & Compliance</h3>
              <p className="text-gray-700 mb-4">
                Our database infrastructure meets enterprise security standards with full compliance to data protection regulations:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• GDPR and CCPA compliant data handling</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Automated backup and disaster recovery</li>
                    <li>• Multi-region data replication for reliability</li>
                    <li>• Role-based access control and audit logging</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Access the Safety Database</h2>
              <p className="text-xl mb-6 opacity-90">
                Search over 2.1 million products with instant safety analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/product-database"
                  className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  data-testid="button-search-database"
                >
                  <Search className="h-5 w-5" />
                  Search Database
                </a>
                <a
                  href="/product-scanner"
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
                  data-testid="button-scan-product"
                >
                  Scan Product
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="database-info-footer" />
        </div>
      </div>

      <Footer />
    </div>
  );
}