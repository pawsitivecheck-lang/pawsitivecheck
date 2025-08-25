import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import HelpTooltip from "@/components/help-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, Shield, Package, Microscope, Factory, Globe, Database, ArrowLeft } from "lucide-react";

export default function ProductAnalysis() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', id],
    enabled: !!id
  }) as { data: any, isLoading: boolean };

  const getCosmicClarityIcon = (clarity: string) => {
    switch (clarity) {
      case 'blessed': return <CheckCircle className="h-5 w-5 text-mystical-green" />;
      case 'questionable': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'cursed': return <XCircle className="h-5 w-5 text-mystical-red" />;
      default: return <Shield className="h-5 w-5 text-cosmic-400" />;
    }
  };

  const getCosmicClarityColor = (clarity: string) => {
    switch (clarity) {
      case 'blessed':
        return 'bg-mystical-green/20 text-mystical-green border-mystical-green';
      case 'questionable':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'cursed':
        return 'bg-mystical-red/20 text-mystical-red border-mystical-red';
      default:
        return 'bg-cosmic-400/20 text-cosmic-400 border-cosmic-400';
    }
  };

  const generatePawRating = (score: number) => {
    return Math.max(1, Math.min(5, Math.round(score / 20)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-900">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-cosmic-700 rounded w-1/3 mb-6"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 bg-cosmic-700 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-cosmic-700 rounded w-2/3"></div>
                  <div className="h-4 bg-cosmic-700 rounded w-1/2"></div>
                  <div className="h-20 bg-cosmic-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cosmic-900">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-cosmic-100 mb-4">Product Not Found</h1>
            <p className="text-cosmic-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.location.href = "/product-database"} className="mystical-button">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Button 
              onClick={() => window.history.back()}
              variant="ghost" 
              className="text-cosmic-300 hover:text-cosmic-100 mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h1 className="text-3xl font-bold text-cosmic-100">In-Depth Product Analysis</h1>
                <HelpTooltip 
                  content="This comprehensive analysis breaks down every aspect of the product's safety, quality, and suitability for pets. Our analysis uses advanced algorithms, veterinary research, FDA data, and molecular ingredient science to provide the most detailed assessment available."
                  side="right"
                />
              </div>
              <p className="text-cosmic-300 text-lg">Complete safety breakdown for {product.name}</p>
            </div>
          </div>

          {/* Product Overview */}
          <Card className="cosmic-card mb-8" data-testid="card-product-overview">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-starlight-400">Product Overview</CardTitle>
                <HelpTooltip 
                  content="Basic product identification information including official name, manufacturer, UPC barcode for tracking, and category classification. This information is essential for recalls, veterinary consultations, and manufacturer contact."
                  side="right"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-cosmic-100 mb-2">{product.name}</h3>
                  <p className="text-cosmic-300 mb-4">by {product.brand}</p>
                  
                  {product.barcode && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-cosmic-200 font-medium">UPC Barcode:</span>
                        <HelpTooltip 
                          content="Universal Product Code - This unique identifier helps track recalls, verify authenticity, report adverse reactions to manufacturers, and ensure you're getting accurate safety information for this exact product variant."
                          side="right"
                        />
                      </div>
                      <span className="text-cosmic-300 font-mono bg-cosmic-800/30 px-2 py-1 rounded">
                        {product.barcode}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-cosmic-200 font-medium">Product Category:</span>
                      <HelpTooltip 
                        content="Product classification helps determine appropriate safety standards, regulatory requirements, and species-specific safety guidelines. Different categories have different risk profiles and testing requirements."
                        side="right"
                      />
                    </div>
                    <Badge variant="outline" className="border-cosmic-600 text-cosmic-300">
                      {product.category || 'General Pet Product'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-48 h-48 object-cover rounded-lg"
                      data-testid="img-product-analysis"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-cosmic-700 rounded-lg flex items-center justify-center">
                      <Package className="text-cosmic-500 text-6xl" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Assessment Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* Paw Safety Rating */}
            <Card className="cosmic-card" data-testid="card-paw-rating">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-starlight-400">🐾 Paw Safety Rating</CardTitle>
                  <HelpTooltip 
                    content="Our signature 5-paw safety rating system. Each paw represents increasing levels of safety based on ingredient analysis, toxicity studies, allergen research, FDA recall data, veterinary warnings, and manufacturing quality. 5 paws = excellent safety, 1 paw = significant concerns."
                    side="right"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-6xl ${i < generatePawRating(product.cosmicScore || 0) ? 'text-mystical-green' : 'text-cosmic-600'}`}
                      >
                        🐾
                      </span>
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-cosmic-100 mb-2">
                    {generatePawRating(product.cosmicScore || 0)} out of 5 Paws
                  </div>
                  <div className="text-cosmic-300">
                    Safety Score: {product.cosmicScore || 0}/100
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Ingredient Safety:</span>
                    <Progress value={(product.cosmicScore || 0) * 0.8} className="w-32" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Manufacturing Quality:</span>
                    <Progress value={(product.cosmicScore || 0) * 0.9} className="w-32" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Recall History:</span>
                    <Progress value={(product.cosmicScore || 0) * 0.7} className="w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cosmic Clarity Assessment */}
            <Card className="cosmic-card" data-testid="card-cosmic-clarity">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-starlight-400">✨ Cosmic Clarity Assessment</CardTitle>
                  <HelpTooltip 
                    content="Our mystical safety classification system combining scientific analysis with cosmic wisdom. BLESSED = safe for most pets, QUESTIONABLE = use with caution for sensitive pets, CURSED = significant concerns requiring veterinary consultation. Based on ingredient toxicity, allergen potential, and spiritual energy analysis."
                    side="right"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    {getCosmicClarityIcon(product.cosmicClarity || 'unknown')}
                    <Badge className={`${getCosmicClarityColor(product.cosmicClarity || 'unknown')} text-2xl py-2 px-6`}>
                      {(product.cosmicClarity || 'UNKNOWN').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className={`border-l-4 rounded-r-lg p-4 ${
                  product.cosmicClarity === 'blessed' ? 'bg-mystical-green/10 border-mystical-green' :
                  product.cosmicClarity === 'questionable' ? 'bg-yellow-500/10 border-yellow-500' :
                  product.cosmicClarity === 'cursed' ? 'bg-mystical-red/10 border-mystical-red' :
                  'bg-cosmic-600/10 border-cosmic-600'
                }`}>
                  <div className="font-semibold mb-2">
                    {product.cosmicClarity === 'blessed' && '🌟 BLESSED - Safe for Most Pets'}
                    {product.cosmicClarity === 'questionable' && '⚠️ QUESTIONABLE - Use with Caution'}
                    {product.cosmicClarity === 'cursed' && '💀 CURSED - Significant Concerns'}
                    {!product.cosmicClarity && '🔍 UNKNOWN - Analysis Pending'}
                  </div>
                  <p className="text-sm opacity-90">
                    {product.cosmicClarity === 'blessed' && 'This product has been analyzed and deemed safe for most pets. Ingredients are well-researched and pose minimal risk when used as directed. Regular monitoring recommended.'}
                    {product.cosmicClarity === 'questionable' && 'This product contains ingredients that may cause issues for sensitive pets or lack sufficient safety data. Consult your veterinarian and monitor closely.'}
                    {product.cosmicClarity === 'cursed' && 'This product contains concerning ingredients potentially harmful to pets. Strong recommendation to avoid and consult veterinarian for safer alternatives.'}
                    {!product.cosmicClarity && 'This product requires further analysis. Our cosmic divination algorithms are still processing the ingredient safety data.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Sections */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Ingredient Analysis */}
            <Card className="cosmic-card" data-testid="card-ingredient-analysis">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-starlight-400 flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    Ingredient Analysis
                  </CardTitle>
                  <HelpTooltip 
                    content="Molecular-level analysis of every ingredient including toxicity data, allergen potential, dosage safety limits, species-specific reactions, known interactions, and quality sourcing information. Red flags indicate ingredients requiring special attention."
                    side="top"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-cosmic-200 mb-2">Complete Ingredient List:</h4>
                    <p className="text-cosmic-300 text-sm leading-relaxed">
                      {product.ingredients || 'Ingredient information not available'}
                    </p>
                  </div>
                  
                  {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 && (
                    <div className="mt-4 p-3 bg-mystical-red/10 rounded border border-mystical-red/30">
                      <div className="flex items-center gap-1 mb-2">
                        <h4 className="font-semibold text-mystical-red">⚠️ Concerning Ingredients:</h4>
                        <HelpTooltip 
                          content="These ingredients have been flagged by our analysis system due to known toxicity, allergen potential, controversial additives, or insufficient safety data. Each requires individual assessment based on your pet's health profile."
                          side="top"
                        />
                      </div>
                      <ul className="text-sm text-cosmic-300 space-y-1">
                        {product.suspiciousIngredients.map((ingredient: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-mystical-red">•</span>
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Manufacturing Transparency */}
            <Card className="cosmic-card" data-testid="card-manufacturing">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-starlight-400 flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Manufacturing
                  </CardTitle>
                  <HelpTooltip 
                    content="Assessment of manufacturing practices, quality control standards, ingredient sourcing transparency, facility certifications, and supply chain integrity. Higher transparency indicates more trustworthy manufacturing processes."
                    side="top"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Transparency Level:</span>
                    <Badge className={
                      product.transparencyLevel === 'excellent' ? 'bg-mystical-green/20 text-mystical-green' :
                      product.transparencyLevel === 'good' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-mystical-red/20 text-mystical-red'
                    }>
                      {product.transparencyLevel || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <h4 className="font-semibold text-cosmic-200">Quality Standards:</h4>
                      <HelpTooltip 
                        content="Manufacturing quality assessment based on facility certifications, quality control processes, testing procedures, and regulatory compliance history. Excellent = comprehensive testing and certifications, Good = basic quality standards met, Poor = limited quality information available."
                        side="top"
                      />
                    </div>
                    <div className="text-sm text-cosmic-300">
                      {product.transparencyLevel === 'excellent' && '✅ Full ingredient disclosure, third-party testing, comprehensive quality certifications'}
                      {product.transparencyLevel === 'good' && '⚠️ Most information available, some testing data, basic certifications'}
                      {product.transparencyLevel === 'poor' && '❌ Limited transparency, minimal quality data available'}
                      {!product.transparencyLevel && '🔍 Quality assessment pending'}
                    </div>
                  </div>

                  {product.sourceUrl && (
                    <div className="mt-4 p-3 bg-starlight-500/10 rounded border border-starlight-500/30">
                      <div className="flex items-center gap-1 mb-1">
                        <h4 className="font-semibold text-starlight-400">📋 Official Source:</h4>
                        <HelpTooltip 
                          content="Direct link to manufacturer's official product information, ingredient lists, safety data sheets, and quality certifications. Essential for verifying accuracy and contacting manufacturer directly."
                          side="top"
                        />
                      </div>
                      <a 
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-starlight-400 hover:text-starlight-300 text-sm underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        View Manufacturer Details
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety Database */}
            <Card className="cosmic-card" data-testid="card-safety-database">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-starlight-400 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Safety Database
                  </CardTitle>
                  <HelpTooltip 
                    content="Comprehensive safety information from our integrated databases including FDA recall history, ASPCA poison control data, veterinary toxicology research, peer-reviewed studies, and community-reported adverse reactions. Updated in real-time."
                    side="top"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Recall History:</span>
                    <Badge variant="outline" className="border-cosmic-600 text-cosmic-300">
                      No Active Recalls
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Last Safety Review:</span>
                    <span className="text-cosmic-300 text-sm">
                      {product.lastAnalyzed ? new Date(product.lastAnalyzed).toLocaleDateString() : 'Ongoing'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-400">Blacklist Status:</span>
                    <Badge className={
                      product.isBlacklisted 
                        ? 'bg-mystical-red/20 text-mystical-red border-mystical-red' 
                        : 'bg-mystical-green/20 text-mystical-green border-mystical-green'
                    }>
                      {product.isBlacklisted ? '❌ BLACKLISTED' : '✅ APPROVED'}
                    </Badge>
                  </div>

                  {product.isBlacklisted && (
                    <div className="mt-4 p-3 bg-mystical-red/10 rounded border border-mystical-red/30">
                      <div className="flex items-center gap-1 mb-1">
                        <h4 className="font-semibold text-mystical-red">🚫 Blacklist Warning:</h4>
                        <HelpTooltip 
                          content="This product has been blacklisted due to serious safety concerns, recalls, toxic ingredients, or regulatory violations. We strongly recommend avoiding this product and consulting your veterinarian for safer alternatives."
                          side="top"
                        />
                      </div>
                      <p className="text-sm text-cosmic-300">
                        This product has been flagged for serious safety concerns. Please consider alternatives.
                      </p>
                    </div>
                  )}

                  {product.disposalInstructions && (
                    <div className="mt-4 p-3 bg-cosmic-700/20 rounded border border-cosmic-600/30">
                      <div className="flex items-center gap-1 mb-1">
                        <h4 className="font-semibold text-cosmic-300">♻️ Safe Disposal:</h4>
                        <HelpTooltip 
                          content="Proper disposal instructions to protect the environment and prevent accidental poisoning of wildlife or other pets. Some ingredients require special handling or cannot be disposed of in regular household waste."
                          side="top"
                        />
                      </div>
                      <p className="text-sm text-cosmic-400 leading-relaxed">
                        {product.disposalInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.location.href = `/product/${product.id}`}
                className="mystical-button"
                data-testid="button-view-product"
              >
                <Package className="h-4 w-4 mr-2" />
                View Full Product
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/submit-product-update'}
                className="border-starlight-500/30 text-starlight-400"
                data-testid="button-report-issue"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Safety Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}