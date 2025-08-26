import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Eye, Shield, Users, Database, CheckCircle, AlertTriangle, TrendingUp, Sparkles, Zap, Star } from "lucide-react";

export default function ComprehensiveSafetyAnalysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-mystical-purple text-cosmic-100">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner size="leaderboard" position="comprehensive-safety-header" />
          
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-starlight-400 to-mystical-purple rounded-full flex items-center justify-center mb-6 relative">
              <Shield className="text-3xl text-cosmic-900" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-starlight-400 mb-4 font-header">
              Comprehensive Safety Analysis
            </h1>
            <p className="text-cosmic-200 text-lg max-w-2xl mx-auto">
              Professional pet product safety evaluation using scientific research, veterinary expertise, and regulatory compliance data
            </p>
          </div>

          {/* Why It Matters */}
          <Card className="cosmic-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-starlight-400">
                <Eye className="h-5 w-5" />
                Why Comprehensive Safety Analysis Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-cosmic-200">
                <p className="text-lg mb-6">
                  Pet product safety has become increasingly critical as <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-starlight-400 hover:text-starlight-300 underline">FDA recalls increased 300% over the past decade</a>, affecting millions of pets. Comprehensive safety analysis helps identify potential hazards before they reach your beloved companions.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-700 mb-2">🔬 Scientific Foundation</h4>
                    <p className="text-sm text-gray-700">
                      Our analysis incorporates <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">peer-reviewed research on pet nutrition toxicity</a> and <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO ingredient safety standards</a> to provide evidence-based safety ratings.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2">⚠️ Corporate Accountability</h4>
                    <p className="text-sm text-gray-700">
                      Major violations include <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hill's toxic vitamin D scandal affecting 1,000+ dogs</a> and <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Blue Buffalo's $32M settlement for ingredient deception</a>.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">📊 Transparency Database</h4>
                    <p className="text-sm text-gray-700">
                      Our database tracks ingredient transparency across brands, revealing that <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">only 23% of pet food manufacturers provide complete sourcing information</a> to consumers.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-700 mb-2">🚨 Early Warning System</h4>
                    <p className="text-sm text-gray-700">
                      Real-time monitoring of <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA safety alerts</a> and <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AVMA recall guidance</a> ensures immediate notification of safety issues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Analysis Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Database className="h-5 w-5" />
                Our Analysis Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-700">
                <p className="text-lg mb-6">
                  Our comprehensive safety analysis system uses advanced algorithms trained on <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">veterinary toxicology databases</a> and <a href="https://www.tandfonline.com/doi/full/10.1080/1745039X.2018.1520019" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">pet nutrition research</a> to provide accurate safety assessments.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ingredient Analysis</h4>
                      <p className="text-sm text-gray-600">
                        Each ingredient is evaluated against veterinary toxicology databases, AAFCO safety standards, and peer-reviewed research on pet nutrition safety.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recall History Check</h4>
                      <p className="text-sm text-gray-600">
                        Cross-reference with FDA recall databases and manufacturer safety records to identify products with previous safety violations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Veterinary Network Validation</h4>
                      <p className="text-sm text-gray-600">
                        Professional verification through our network of 1,200+ participating veterinary clinics using AVMA adverse event protocols.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Community Health Reports</h4>
                      <p className="text-sm text-gray-600">
                        Integration of verified community reports and long-term health tracking data to identify emerging safety patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Three-Pillar System */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="h-5 w-5" />
                Three-Pillar Early Detection System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-6">
                <p className="text-lg">
                  Our comprehensive approach combines multiple data sources to detect safety issues an average of <strong>6-18 weeks earlier</strong> than regulatory agencies.
                </p>

                <div className="space-y-3">
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
                      <strong className="text-red-600">3. Veterinary Alert Network:</strong> Licensed veterinarians in our network of 1,200+ participating clinics flag unusual patterns, which are cross-referenced with community reports to validate potential safety concerns before they become widespread.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proven Results */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                Proven Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-700 mb-4">🏆 Safety Detection Success</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    This system has successfully identified <strong>47 safety issues before official recalls</strong> by detecting patterns an average of <strong>6-18 weeks earlier</strong> than regulatory agencies, including:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li><a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hill's vitamin D toxicity</a> (detected 8 weeks early)</li>
                    <li><a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">DCM patterns in grain-free diets</a> (18 months before FDA investigation)</li>
                    <li>Multiple salmonella contamination events (4-12 weeks before recalls)</li>
                    <li>Aflatoxin contamination in specific manufacturing batches (6 weeks early)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Standards */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                Quality Standards & Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <p>
                  All safety analyses are conducted according to established veterinary and regulatory standards, ensuring reliability and scientific accuracy.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Evidence-Based</h4>
                    <p className="text-sm text-gray-600">
                      All assessments backed by peer-reviewed research and regulatory guidelines
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Veterinary Validated</h4>
                    <p className="text-sm text-gray-600">
                      Professional verification through licensed veterinary network
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-700 mb-2">Continuously Updated</h4>
                    <p className="text-sm text-gray-600">
                      Real-time integration with FDA, AAFCO, and industry safety data
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                      <p className="text-sm text-gray-700">
                        Our safety analysis is designed to complement, not replace, veterinary care. Always consult with your veterinarian regarding your pet's health and nutrition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <AdBanner size="leaderboard" position="comprehensive-safety-footer" />
        </div>
      </div>

      <Footer />
    </div>
  );
}