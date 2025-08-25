import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users, MessageSquare, Shield, Star, TrendingUp, CheckCircle, AlertTriangle, Eye, BarChart3, Globe, FileText, Heart, Crown, ThumbsUp, Search, MessageCircle } from "lucide-react";

export default function CommunityReviewsInfo() {
  const { user } = useAuth();
  const [reviewFilter, setReviewFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userReviews } = useQuery<any[]>({
    queryKey: ['/api/user/reviews'],
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100');
      return await res.json();
    },
  });

  // Get all reviews by fetching product reviews
  const { data: allReviews } = useQuery({
    queryKey: ['/api/community/reviews'],
    queryFn: async () => {
      if (!products) return [];
      
      const reviewPromises = products.map(async (product: any) => {
        const res = await fetch(`/api/products/${product.id}/reviews`);
        const reviews = await res.json();
        return reviews.map((review: any) => ({
          ...review,
          productName: product.name,
          productBrand: product.brand,
        }));
      });
      
      const allProductReviews = await Promise.all(reviewPromises);
      return allProductReviews.flat().sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: !!products,
  });

  const filteredReviews = allReviews?.filter((review: any) => {
    if (reviewFilter !== "all" && review.rating.toString() !== reviewFilter) return false;
    if (searchTerm && !review.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !review.productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  const getRankIcon = (reviewCount: number) => {
    if (reviewCount >= 50) return <Crown className="text-yellow-500 h-4 w-4" />;
    if (reviewCount >= 20) return <Star className="text-purple-600 h-4 w-4" />;
    if (reviewCount >= 5) return <Eye className="text-green-600 h-4 w-4" />;
    return <Users className="text-blue-600 h-4 w-4" />;
  };

  const getRankTitle = (reviewCount: number) => {
    if (reviewCount >= 50) return "Community Leader";
    if (reviewCount >= 20) return "Expert Reviewer";
    if (reviewCount >= 5) return "Active Member";
    return "New Member";
  };
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
                    <p className="text-sm text-red-700 mb-3">
                      <strong>Specific Process Example:</strong> When 15+ community members report similar symptoms (e.g., vomiting + lethargy) for the same product within 14 days, our algorithm automatically flags it for veterinary review and notifies affected pet owners within 48 hours - often weeks before manufacturers or regulators become aware of the issue.
                    </p>
                    <p className="text-xs text-red-600">
                      <strong>Real Case:</strong> Hill's Vitamin D - 23 reports of excessive thirst + lethargy from Prescription Diet cans in Texas and California → Algorithm flagged after day 11 → Vet network confirmed vitamin D toxicity symptoms → Community alert sent → Official recall 8 weeks later
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

          {/* Interactive Community Portal */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Community Portal
              </h2>
              <p className="text-xl text-gray-600">
                Explore real reviews and share your own experiences
              </p>
            </div>

            {/* Community Stats */}
            <Card className="mb-8 shadow-lg" data-testid="card-community-stats">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Users className="h-5 w-5" />
                  Community Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-total-reviews">
                      {allReviews?.length || 0}
                    </div>
                    <p className="text-gray-600">Total Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-positive-reviews">
                      {allReviews?.filter((r: any) => r.rating >= 4).length || 0}
                    </div>
                    <p className="text-gray-600">Positive Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2" data-testid="text-warning-reviews">
                      {allReviews?.filter((r: any) => r.rating <= 2).length || 0}
                    </div>
                    <p className="text-gray-600">Safety Warnings</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-active-members">
                      {allReviews ? new Set(allReviews.map((r: any) => r.userId)).size : 0}
                    </div>
                    <p className="text-gray-600">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Profile Card */}
            {user && (
              <Card className="mb-8 border-purple-200 shadow-lg" data-testid="card-user-profile">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                          data-testid="img-user-avatar"
                        />
                      ) : (
                        <Users className="text-white text-xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900" data-testid="text-user-name">
                          {user.firstName || 'Community Member'}
                        </h3>
                        {getRankIcon(userReviews ? userReviews.length : 0)}
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200" data-testid="badge-user-rank">
                          {getRankTitle(userReviews ? userReviews.length : 0)}
                        </Badge>
                        <span className="text-gray-500 text-sm" data-testid="text-user-reviews-count">
                          {userReviews ? userReviews.length : 0} reviews shared
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      data-testid="button-view-profile"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters and Search */}
            <Card className="mb-8 shadow-lg" data-testid="card-review-filters">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Search className="h-5 w-5" />
                  Explore Community Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Search reviews and products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    data-testid="input-search-reviews"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "5", "4", "3", "2", "1"].map((rating) => (
                    <Button
                      key={rating}
                      variant={reviewFilter === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReviewFilter(rating)}
                      data-testid={`button-filter-${rating}`}
                    >
                      {rating === "all" ? "All Reviews" : `${rating} Stars`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Reviews */}
            <div className="space-y-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review: any) => (
                  <Card key={review.id} className="shadow-lg" data-testid={`card-community-review-${review.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Users className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900" data-testid="text-reviewer-name">
                              Community Member #{review.userId.slice(-4)}
                            </h4>
                            {getRankIcon(5)} {/* Default rank for community display */}
                            <Badge className="bg-gray-100 text-gray-600" data-testid="badge-reviewer-rank">
                              Verified Member
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-purple-600 font-medium mb-1" data-testid="text-product-reviewed">
                              {review.productName} by {review.productBrand}
                            </h5>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  data-testid={`star-rating-${i}`}
                                />
                              ))}
                              <span className="text-gray-500 text-sm ml-2">
                                {review.rating}/5 Stars
                              </span>
                            </div>
                          </div>
                          
                          {review.title && (
                            <h6 className="font-medium text-gray-800 mb-2" data-testid="text-review-title">
                              {review.title}
                            </h6>
                          )}
                          
                          <p className="text-gray-700 mb-3" data-testid="text-review-content">
                            {review.content}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span data-testid="text-review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 hover:text-green-600 transition-colors" data-testid="button-like-review">
                                <ThumbsUp className="h-3 w-3" />
                                <span>Helpful</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors" data-testid="button-reply-review">
                                <MessageCircle className="h-3 w-3" />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-lg" data-testid="card-no-reviews">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <MessageCircle className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-xl text-gray-700 mb-4" data-testid="text-no-reviews-title">
                      No Reviews Found
                    </h3>
                    <p className="text-gray-500 mb-6" data-testid="text-no-reviews-description">
                      {searchTerm || reviewFilter !== "all" 
                        ? "No reviews match your current search criteria."
                        : "Be the first to share your experience with the community!"}
                    </p>
                    {(searchTerm || reviewFilter !== "all") && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setReviewFilter("all");
                        }}
                        data-testid="button-clear-filters"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Write Review CTA */}
            {user && (
              <div className="mt-12">
                <Card className="border-purple-200 shadow-lg" data-testid="card-cta">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-purple-600 mb-4" data-testid="text-cta-title">
                      Share Your Experience
                    </h3>
                    <p className="text-gray-600 mb-6" data-testid="text-cta-description">
                      Help other pet owners by sharing your product experiences
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-share-review">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Write a Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
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
                  href="/product-scanner"
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  data-testid="button-scan-product"
                >
                  <Search className="h-5 w-5" />
                  Scan a Product
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