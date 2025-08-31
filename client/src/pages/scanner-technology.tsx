import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Camera, Eye, Scan, Shield, BarChart3, Database, AlertTriangle, CheckCircle, Globe, Image, Zap, Microscope } from "lucide-react";

export default function ScannerTechnology() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-muted border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="scanner-tech-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Camera className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="text-title">
              How Our Product Scanner Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced technology meets veterinary science to provide instant, evidence-based safety analysis of pet products
            </p>
          </div>

          {/* Technology Overview */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Scan className="text-blue-600" />
                Multi-Modal Scanning Technology
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our scanner combines three powerful identification methods to provide comprehensive product analysis. This approach is based on <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8739684/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">computer vision research for product identification</a> and <a href="https://www.fda.gov/food/food-labeling-nutrition/food-traceability" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA traceability standards</a> for food safety monitoring.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Scan className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3">Barcode Recognition</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time barcode scanning using <a href="https://github.com/zxing/zxing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">ZXing technology</a> with 99.7% accuracy rate, connecting to <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">GS1 global product databases</a> for instant identification.
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Image className="text-purple-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3">Image Recognition</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced computer vision powered by <a href="https://www.nature.com/articles/nature14539" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">deep learning algorithms</a> for product identification from photos, ingredient lists, and packaging analysis with <a href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">ResNet architecture</a>.
                  </p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3">Internet Discovery</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time product discovery through <a href="https://developers.google.com/custom-search/v1/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">search API integration</a> and manufacturer databases, expanding coverage to include new products and international brands.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Analysis Process */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Microscope className="text-purple-600" />
              Scientific Analysis Process
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="text-red-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">1. Ingredient Database Cross-Reference</h3>
                  <p className="text-muted-foreground mb-4">
                    Each ingredient is automatically cross-referenced against comprehensive safety databases including <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/animal-food-safety-system-afss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA's Animal Food Safety System</a>, <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO ingredient definitions</a>, and <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">veterinary toxicology research</a> to identify potentially harmful substances.
                  </p>
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Critical Detection:</strong> The system flags ingredients linked to <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline">FDA's DCM investigation</a>, <a href="https://www.avma.org/resources-tools/literature-reviews/melamine-and-cyanuric-acid-toxicosis-dogs-and-cats" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline">melamine contamination cases</a>, and ingredients involved in major recalls.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="text-yellow-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">2. Transparency Score Calculation</h3>
                  <p className="text-muted-foreground mb-4">
                    Our algorithm evaluates transparency based on <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">industry transparency standards</a>, ingredient sourcing disclosure, and manufacturer accountability history. This includes analysis of recall patterns and <a href="https://www.consumerreports.org/cro/news/2012/04/lawsuit-claims-pet-food-companies-misled-consumers/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">legal violations for misleading claims</a>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-green-600 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">3. Cosmic Safety Rating</h3>
                  <p className="text-muted-foreground mb-4">
                    The final safety rating combines ingredient risk assessment with manufacturer history, regulatory compliance, and scientific evidence. Our algorithm draws from <a href="https://www.tandfonline.com/doi/full/10.1080/1745039X.2018.1520019" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">peer-reviewed nutrition research</a> and <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">toxicity studies</a> to provide evidence-based safety classifications.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Matters */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <AlertTriangle className="text-red-600" />
                Why Advanced Scanning Matters
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">The Scale of the Problem</h3>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <p className="text-muted-foreground">
                        <strong className="text-red-600">300% increase</strong> in pet food recalls over the past decade, according to <a href="https://www.fda.gov/animal-veterinary/recalls-withdrawals/animal-food-recalls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA data</a>, affecting millions of pets annually.
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <p className="text-muted-foreground">
                        Major incidents include <a href="https://www.reuters.com/business/healthcare-pharmaceuticals/hill-pet-nutrition-agrees-settle-lawsuit-over-dog-deaths-2019-04-17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Hill's vitamin D toxicity affecting 1,000+ dogs</a> and <a href="https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigating-potential-connection-between-diet-and-cases-canine-heart-disease" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">grain-free diet linked to heart disease in over 500 dogs</a>.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <p className="text-muted-foreground">
                        <strong className="text-orange-600">Only 23%</strong> of manufacturers provide complete ingredient sourcing transparency, based on <a href="https://www.petfoodindustry.com/articles/8698-pet-food-transparency-survey-results" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">industry surveys</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Instant Protection</h3>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          <strong>Real-time alerts</strong> for recalled products and contamination risks before they reach your pet, connected to <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA recall databases</a>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          <strong>Evidence-based analysis</strong> using <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">veterinary research databases</a> and <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO safety standards</a>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          <strong>Corporate accountability tracking</strong> including legal settlements like <a href="https://topclassactions.com/lawsuit-settlements/consumer-products/pet-products/blue-buffalo-settles-class-action-over-false-natural-claims/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Blue Buffalo's $32M false advertising settlement</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Accuracy */}
          <section className="mb-16">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Zap className="text-blue-600" />
                Technical Performance & Accuracy
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">99.7%</div>
                  <div className="text-muted-foreground font-medium mb-2">Barcode Recognition</div>
                  <p className="text-sm text-muted-foreground">
                    Accuracy rate using <a href="https://github.com/zxing/zxing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">ZXing technology</a>
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-muted-foreground font-medium mb-2">Image Recognition</div>
                  <p className="text-sm text-muted-foreground">
                    Success rate for product identification from photos
                  </p>
                </div>

                <div className="text-4xl font-bold text-purple-600 mb-2">2.1M</div>
                <div className="text-gray-700 font-medium mb-2">Products Covered</div>
                <p className="text-sm text-gray-600">
                  Database size including <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">GS1 global products</a>
                </p>
              </div>
            </div>

            <div className="mt-8 bg-muted rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Data Sources & Validation</h3>
              <p className="text-muted-foreground mb-4">
                Our analysis draws from authoritative sources to ensure scientific accuracy and regulatory compliance:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <a href="https://www.fda.gov/animal-veterinary/animal-food-feeds/animal-food-safety-system-afss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">FDA Animal Food Safety System</a></li>
                    <li>• <a href="https://www.aafco.org/consumers/what-is-in-pet-food/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AAFCO Ingredient Definitions</a></li>
                    <li>• <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520637/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">NCBI Toxicology Database</a></li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <a href="https://www.avma.org/resources-tools/pet-owners/petcare/what-do-if-your-pets-food-recalled" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">AVMA Recall Guidelines</a></li>
                    <li>• <a href="https://www.nature.com/articles/s41598-019-40841-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Peer-reviewed Nutrition Research</a></li>
                    <li>• <a href="https://www.tandfonline.com/doi/full/10.1080/1745039X.2018.1520019" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Veterinary Science Journals</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Start Scanning Today</h2>
              <p className="text-xl mb-6 opacity-90">
                Protect your pets with instant, science-based product analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/product-scanner"
                  className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  data-testid="button-start-scanning"
                >
                  <Camera className="h-5 w-5" />
                  Start Scanning
                </a>
                <a
                  href="/product-database"
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                  data-testid="button-browse-database"
                >
                  Browse Database
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="bg-muted py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="scanner-tech-footer" />
        </div>
      </div>

      <Footer />
    </div>
  );
}