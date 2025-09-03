import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdBanner from "@/components/ad-banner";
import HelpTooltip from "@/components/help-tooltip";
import AnimalTags from "@/components/animal-tags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SaveToPetButton } from "@/components/save-to-pet-button";
import { Package, Shield, AlertTriangle, CheckCircle, XCircle, Heart, Star, ArrowLeft, ExternalLink, AlertCircle, Activity, Clock, TrendingDown, TrendingUp, WandSparkles } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', id],
    enabled: !!id
  }) as { data: any, isLoading: boolean };

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/products', id, 'reviews'],
    enabled: !!id
  }) as { data: any[], isLoading: boolean };

  const { data: recalls, isLoading: recallsLoading } = useQuery({
    queryKey: ['/api/recalls'],
  }) as { data: any[], isLoading: boolean };

  const { data: blacklistedIngredients } = useQuery({
    queryKey: ['/api/blacklisted-ingredients'],
  }) as { data: any[], isLoading: boolean };

  const { data: productTags } = useQuery({
    queryKey: ['/api/products', id, 'tags'],
    enabled: !!id && !!product,
  }) as { data: any[], isLoading: boolean };

  // Filter recalls for this specific product
  const productRecalls = recalls?.filter(recall => recall.productId === parseInt(id!)) || [];
  
  // Filter reviews by safety concerns
  const safetyReviews = reviews?.filter(review => 
    review.content?.toLowerCase().includes('sick') || 
    review.content?.toLowerCase().includes('allergic') ||
    review.content?.toLowerCase().includes('reaction') ||
    review.content?.toLowerCase().includes('vomit') ||
    review.content?.toLowerCase().includes('diarrhea') ||
    review.content?.toLowerCase().includes('itchy') ||
    review.content?.toLowerCase().includes('unsafe') ||
    review.rating <= 2
  ) || [];

  const positiveReviews = reviews?.filter(review => 
    review.rating >= 4 && !safetyReviews.includes(review)
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-20 bg-muted rounded"></div>
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
            <Link href="/product-database">
              <Button className="mystical-button">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      case 'blessed': return 'bg-mystical-green/20 text-mystical-green border-mystical-green/30';
      case 'questionable': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cursed': return 'bg-mystical-red/20 text-mystical-red border-mystical-red/30';
      default: return 'bg-cosmic-600/20 text-cosmic-400 border-cosmic-600/30';
    }
  };

  const generatePawRating = (cosmicScore: number): number => {
    return Math.max(1, Math.min(5, Math.round(cosmicScore / 20)));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate': 
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-cosmic-600/20 text-cosmic-400 border-cosmic-600/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'moderate':
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getOverallSafetyRating = () => {
    let score = product.cosmicScore || 50;
    
    // Reduce score based on recalls
    if (productRecalls.length > 0) {
      const urgentRecalls = productRecalls.filter(r => r.severity === 'urgent').length;
      const moderateRecalls = productRecalls.filter(r => r.severity === 'moderate' || r.severity === 'medium').length;
      score -= (urgentRecalls * 30) + (moderateRecalls * 20) + (productRecalls.length * 10);
    }
    
    // Reduce score based on safety reviews
    if (safetyReviews.length > 0 && reviews.length > 0) {
      const safetyRatio = safetyReviews.length / reviews.length;
      score -= safetyRatio * 40;
    }
    
    // Check blacklisted ingredients
    const productIngredients = product.ingredients?.toLowerCase() || '';
    const blacklistedMatches = blacklistedIngredients?.filter(ing => 
      productIngredients.includes(ing.ingredient.toLowerCase())
    ).length || 0;
    score -= blacklistedMatches * 25;
    
    return Math.max(0, Math.min(100, score));
  };

  return (
    <div className="min-h-screen bg-cosmic-900">
      <Navbar />
      
      {/* Top Banner Ad */}
      <div className="bg-card dark:bg-card border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="product-detail-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Back Navigation */}
          <div className="mb-6">
            <Link href="/product-database">
              <Button variant="ghost" className="text-cosmic-300 hover:text-cosmic-100" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product Database
              </Button>
            </Link>
          </div>

          {/* Product Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Product Image */}
            <div className="space-y-4">
              <Card className="cosmic-card" data-testid="card-product-image">
                <CardContent className="p-6">
                  <div className="relative">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-80 object-cover rounded-lg"
                        data-testid="img-product-detail"
                      />
                    ) : (
                      <div className="w-full h-80 bg-cosmic-700 rounded-lg flex items-center justify-center" data-testid="placeholder-product-image">
                        <Package className="text-cosmic-500 text-6xl" />
                      </div>
                    )}
                    
                    {/* Blacklist Warning */}
                    {product.isBlacklisted && (
                      <div className="absolute top-4 right-4 bg-mystical-red rounded-full p-3 animate-pulse" data-testid="icon-blacklisted">
                        <XCircle className="text-white h-6 w-6" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-cosmic-100 mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-xl text-cosmic-300 mb-2" data-testid="text-product-brand">
                  by {product.brand}
                </p>

                {/* UPC/Barcode */}
                {product.barcode && (
                  <div className="flex items-center gap-2 mb-4" data-testid="product-barcode">
                    <div className="flex items-center gap-1">
                      <span className="text-cosmic-200 font-medium">UPC:</span>
                      <HelpTooltip 
                        content="Universal Product Code - This unique barcode helps track recalls, verify authenticity, and identify the exact product variant. Essential for reporting issues to manufacturers or veterinarians."
                        side="right"
                      />
                    </div>
                    <span className="text-cosmic-300 font-mono bg-cosmic-800/30 px-2 py-1 rounded text-sm">
                      {product.barcode}
                    </span>
                  </div>
                )}

                {/* Paw Rating */}
                {product.cosmicScore !== undefined && (
                  <div className="flex items-center gap-2 mb-4" data-testid="paw-rating">
                    <div className="flex items-center gap-1">
                      <span className="text-cosmic-200 font-medium">Safety Rating:</span>
                      <HelpTooltip 
                        content={`Our signature Paw Safety Rating system: ${generatePawRating(product.cosmicScore!)} out of 5 paws (${product.cosmicScore}/100). This comprehensive score analyzes ingredient safety, toxicity research, FDA recalls, veterinary warnings, allergen data, and manufacturing quality. Each paw represents increasingly safer levels for your beloved pets.`}
                        side="right"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-2xl ${i < generatePawRating(product.cosmicScore!) ? 'text-mystical-green' : 'text-cosmic-600'}`}
                          data-testid={`paw-${i}`}
                        >
                          🐾
                        </span>
                      ))}
                      <span className="text-cosmic-300 ml-2">
                        ({product.cosmicScore}/100)
                      </span>
                    </div>
                  </div>
                )}

                {/* Cosmic Clarity */}
                {product.cosmicClarity && product.cosmicClarity !== 'unknown' && (
                  <div className="flex items-center gap-3 mb-6">
                    {getCosmicClarityIcon(product.cosmicClarity)}
                    <div className="flex items-center gap-1">
                      <span className="text-cosmic-200 font-medium">Cosmic Clarity:</span>
                      <HelpTooltip 
                        content={`Cosmic Clarity Assessment - Our mystical safety classification: BLESSED (safe for most pets), QUESTIONABLE (use with caution, may cause issues for sensitive pets), CURSED (concerning ingredients, avoid if possible). This analysis combines ancient wisdom with modern science, reviewing ingredient toxicity, veterinary research, FDA data, and cosmic safety energies.`}
                        side="right"
                      />
                    </div>
                    <Badge className={getCosmicClarityColor(product.cosmicClarity)} data-testid="badge-cosmic-clarity">
                      {product.cosmicClarity.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {/* Animal Tags */}
                {productTags && productTags.length > 0 && (
                  <div className="mb-6" data-testid="section-animal-tags">
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-cosmic-200 font-medium">Suitable For:</span>
                      <HelpTooltip 
                        content="Species, breed, and size recommendations based on product specifications, ingredients, and community feedback. These tags help you find products specifically designed for your pet's characteristics."
                        side="right"
                      />
                    </div>
                    <AnimalTags 
                      tags={productTags.map(pt => ({ ...pt.tag, relevanceScore: pt.relevanceScore }))}
                      variant="secondary"
                      size="sm"
                      maxTags={8}
                      showScore={false}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <SaveToPetButton 
                  productId={product.id}
                  productName={product.name}
                  size="lg"
                  className="flex-1"
                />
                <Link href={`/product-scanner?search=${encodeURIComponent(product.name)}`}>
                  <Button variant="outline" size="lg" className="border-starlight-500/30 text-starlight-400">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Scan Similar
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Recalls Section - Show prominently if any exist */}
              {productRecalls && productRecalls.length > 0 && (
                <Card className="border-red-500/50 bg-red-950/20" data-testid="card-active-recalls">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Active Recalls ({productRecalls.length})
                      <Badge variant="destructive" className="bg-red-600">URGENT</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productRecalls.map((recall: any) => (
                      <div key={recall.id} className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-red-300 mb-1">
                              Recall #{recall.recallNumber}
                            </h4>
                            <p className="text-red-200 text-sm">
                              Severity: <span className="font-medium capitalize">{recall.severity}</span> • 
                              Date: {new Date(recall.recallDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getSeverityColor(recall.severity)}>
                            {getSeverityIcon(recall.severity)}
                            <span className="ml-1 capitalize">{recall.severity}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-red-100 mb-3">{recall.reason}</p>
                        
                        {recall.affectedBatches && recall.affectedBatches.length > 0 && (
                          <div className="mb-3">
                            <span className="text-red-300 font-medium">Affected Batches: </span>
                            <span className="text-red-200">{recall.affectedBatches.join(', ')}</span>
                          </div>
                        )}
                        
                        {recall.disposalInstructions && (
                          <div className="mb-3 p-3 bg-red-900/30 rounded border border-red-500/20">
                            <span className="text-red-300 font-medium">Disposal Instructions: </span>
                            <p className="text-red-200 mt-1">{recall.disposalInstructions}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-red-300">Source:</span>
                            <span className="text-red-200">{recall.source || 'FDA'}</span>
                          </div>
                          {recall.sourceUrl && (
                            <a 
                              href={recall.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Official Recall
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Product Description */}
              <Card className="cosmic-card" data-testid="card-description">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-starlight-400">Comprehensive Product Information</CardTitle>
                    <HelpTooltip 
                      content="Complete product details including description, target species, disposal instructions, and official sources. This information helps ensure safe and appropriate use for your pets."
                      side="right"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.description && (
                    <div>
                      <h4 className="font-medium text-purple-200 mb-2">Product Description:</h4>
                      <p className="text-cosmic-300 leading-relaxed" data-testid="text-product-description">
                        {product.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Target Species */}
                  {product.targetSpecies && product.targetSpecies.length > 0 && (
                    <div>
                      <h4 className="font-medium text-purple-200 mb-2">Designed For:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.targetSpecies.map((species: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-cosmic-700 text-cosmic-200">
                            {species}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Animal Type */}
                  {product.animalType && product.animalType !== 'pet' && (
                    <div>
                      <h4 className="font-medium text-purple-200 mb-2">Animal Category:</h4>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-300 capitalize">
                        {product.animalType}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Disposal Instructions */}
                  {product.disposalInstructions && (
                    <div className="p-4 bg-cosmic-800/30 rounded-lg border border-cosmic-600/30">
                      <h4 className="font-medium text-purple-200 mb-2">Disposal Instructions:</h4>
                      <p className="text-cosmic-300 text-sm">{product.disposalInstructions}</p>
                    </div>
                  )}
                  
                  {/* Source Links */}
                  {(product.sourceUrl || (product.sourceUrls && product.sourceUrls.length > 0)) && (
                    <div>
                      <h4 className="font-medium text-purple-200 mb-2">Sources & References:</h4>
                      <div className="space-y-2">
                        {product.sourceUrl && (
                          <a 
                            href={product.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-starlight-400 hover:text-starlight-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Official Product Information
                          </a>
                        )}
                        {product.sourceUrls && product.sourceUrls.map((url: string, index: number) => (
                          <a 
                            key={index}
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-starlight-400 hover:text-starlight-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Safety Analysis Source {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Ingredients Analysis */}
              <Card className="cosmic-card" data-testid="card-ingredients">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-starlight-400">Comprehensive Ingredient Analysis</CardTitle>
                    <HelpTooltip 
                      content="Advanced ingredient safety analysis using veterinary databases, FDA warnings, AAFCO standards, and toxicology research. Ingredients are categorized by safety level and potential concerns for different pet types."
                      side="right"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ingredient Breakdown */}
                  <div>
                    <h4 className="font-medium text-purple-200 mb-3 flex items-center gap-2">
                      📋 Complete Ingredient List
                      <Badge variant="outline" className="text-xs border-cosmic-500/30 text-cosmic-300">
                        Listed by weight (heaviest first)
                      </Badge>
                    </h4>
                    {product.ingredients ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-cosmic-800/20 border border-cosmic-600/30 rounded-lg">
                          <p className="text-cosmic-300 leading-relaxed text-sm" data-testid="text-product-ingredients">
                            {product.ingredients}
                          </p>
                        </div>
                        
                        {/* Ingredient Parsing and Display */}
                        {(() => {
                          const ingredients = product.ingredients.split(/[,;]/).map((ing: string) => ing.trim()).filter((ing: string) => ing.length > 0);
                          const totalIngredients = ingredients.length;
                          
                          if (totalIngredients > 0) {
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div className="text-center p-2 bg-blue-950/20 border border-blue-500/30 rounded">
                                  <div className="font-semibold text-blue-300">{totalIngredients}</div>
                                  <div className="text-blue-200">Total Ingredients</div>
                                </div>
                                <div className="text-center p-2 bg-green-950/20 border border-green-500/30 rounded">
                                  <div className="font-semibold text-green-300">
                                    {Math.max(0, totalIngredients - (product.suspiciousIngredients?.length || 0))}
                                  </div>
                                  <div className="text-green-200">Generally Safe</div>
                                </div>
                                <div className="text-center p-2 bg-orange-950/20 border border-orange-500/30 rounded">
                                  <div className="font-semibold text-orange-300">{product.suspiciousIngredients?.length || 0}</div>
                                  <div className="text-orange-200">Flagged Items</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-200 text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Ingredient information not available for this product. Contact the manufacturer for detailed ingredient lists.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Critical Blacklisted Ingredients */}
                  {blacklistedIngredients && blacklistedIngredients.length > 0 && (
                    <div>
                      {(() => {
                        const productIngredients = product.ingredients?.toLowerCase() || '';
                        // Improved matching - word boundaries and exact matches
                        const blacklistedMatches = blacklistedIngredients.filter(ing => {
                          const ingredient = ing.ingredientName.toLowerCase();
                          // Check for exact word matches, not just substring
                          const regex = new RegExp(`\\b${ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                          return regex.test(productIngredients) || productIngredients.includes(ingredient);
                        });
                        
                        if (blacklistedMatches.length > 0) {
                          return (
                            <div className="p-4 bg-red-950/30 border-2 border-red-500/50 rounded-lg">
                              <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                                <XCircle className="h-5 w-5" />
                                🚨 CRITICAL SAFETY WARNING - Harmful Ingredients Detected
                              </h4>
                              <div className="space-y-3">
                                {blacklistedMatches.map((match: any, index: number) => (
                                  <div key={index} className="p-3 bg-red-900/30 border border-red-500/30 rounded">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="destructive" className="bg-red-600 text-white font-semibold">
                                        ⚠️ {match.ingredientName}
                                      </Badge>
                                      <Badge variant="outline" className="border-red-400/50 text-red-300 text-xs">
                                        {match.severity || 'High Risk'}
                                      </Badge>
                                    </div>
                                    <p className="text-red-200 text-sm font-medium mb-1">Why it's dangerous:</p>
                                    <p className="text-red-100 text-sm">{match.reason}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 p-3 bg-red-800/20 border border-red-400/30 rounded">
                                <p className="text-red-100 text-sm font-semibold">
                                  ⚠️ RECOMMENDATION: Do not use this product. Consult your veterinarian immediately if your pet has consumed this product.
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                  
                  {/* Flagged Ingredients with Detailed Info */}
                  {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 && (
                    <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-lg">
                      <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Ingredients Requiring Caution ({product.suspiciousIngredients.length})
                      </h4>
                      <div className="space-y-3">
                        {product.suspiciousIngredients.map((ingredient: string, index: number) => {
                          // Enhanced ingredient information
                          const getIngredientInfo = (ing: string) => {
                            const lower = ing.toLowerCase();
                            if (lower.includes('bha') || lower.includes('bht')) {
                              return {
                                concern: 'Artificial Preservative',
                                description: 'May cause allergic reactions in sensitive pets. Long-term effects under study.',
                                severity: 'Medium'
                              };
                            }
                            if (lower.includes('ethoxyquin')) {
                              return {
                                concern: 'Chemical Preservative',
                                description: 'Banned in human food in many countries. Potential liver and kidney effects.',
                                severity: 'High'
                              };
                            }
                            if (lower.includes('by-product') || lower.includes('meal')) {
                              return {
                                concern: 'Quality Concern',
                                description: 'Lower quality protein source. Nutritional value varies significantly.',
                                severity: 'Low'
                              };
                            }
                            if (lower.includes('corn') && lower.includes('syrup')) {
                              return {
                                concern: 'High Sugar Content',
                                description: 'Can contribute to obesity and dental problems in pets.',
                                severity: 'Medium'
                              };
                            }
                            return {
                              concern: 'General Caution',
                              description: 'This ingredient has been flagged based on veterinary research or safety databases.',
                              severity: 'Medium'
                            };
                          };
                          
                          const info = getIngredientInfo(ingredient);
                          
                          return (
                            <div key={index} className="p-3 bg-orange-900/20 border border-orange-500/20 rounded">
                              <div className="flex items-start gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={`border-orange-500/50 text-orange-300 mt-0.5 ${
                                    info.severity === 'High' ? 'border-red-500/50 text-red-300 bg-red-950/20' :
                                    info.severity === 'Low' ? 'border-yellow-500/50 text-yellow-300 bg-yellow-950/20' :
                                    'border-orange-500/50 text-orange-300 bg-orange-950/20'
                                  }`}
                                >
                                  {ingredient}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-orange-200">{info.concern}</span>
                                    <Badge variant="outline" className="text-xs border-orange-400/30 text-orange-300">
                                      {info.severity} Risk
                                    </Badge>
                                  </div>
                                  <p className="text-orange-100 text-xs">{info.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-orange-800/20 border border-orange-400/30 rounded">
                        <p className="text-orange-100 text-sm">
                          💡 <strong>Recommendation:</strong> While these ingredients may not be immediately harmful, consider consulting your veterinarian, especially for pets with sensitivities or health conditions.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Safe Ingredients Summary */}
                  {product.ingredients && (!product.suspiciousIngredients || product.suspiciousIngredients.length === 0) && (
                    <div className="p-4 bg-green-950/20 border border-green-500/30 rounded-lg">
                      <h4 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        ✅ No Major Concerns Identified
                      </h4>
                      <p className="text-green-200 text-sm">
                        Our analysis found no immediately concerning ingredients in this product. However, always monitor your pet for any adverse reactions when introducing new foods.
                      </p>
                    </div>
                  )}

                  {/* Additional Safety Notes */}
                  <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                      ℹ️ Important Safety Notes
                    </h4>
                    <ul className="text-blue-200 text-xs space-y-1">
                      <li>• Always introduce new foods gradually over 7-10 days</li>
                      <li>• Monitor your pet for any allergic reactions or digestive upset</li>
                      <li>• Ingredient quality and sourcing can vary between batches</li>
                      <li>• Consult your veterinarian for pet-specific dietary recommendations</li>
                      <li>• This analysis is for informational purposes only and doesn't replace veterinary advice</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Comprehensive Safety Assessment */}
              {product.cosmicClarity && product.cosmicClarity !== 'unknown' && (
                <Card className="cosmic-card" data-testid="card-safety-assessment">
                  <CardHeader>
                    <CardTitle className="text-starlight-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Comprehensive Safety Assessment
                      <HelpTooltip 
                        content="Our multi-factor safety analysis considers ingredient toxicity, manufacturing standards, regulatory compliance, veterinary research, recall history, and consumer reports to provide a comprehensive safety evaluation."
                        side="right"
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Safety Rating */}
                    <div className={`border-l-4 rounded-r-lg p-6 ${
                      product.cosmicClarity === 'blessed' ? 'bg-mystical-green/10 border-mystical-green' :
                      product.cosmicClarity === 'questionable' ? 'bg-yellow-500/10 border-yellow-500' :
                      'bg-mystical-red/10 border-mystical-red'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getCosmicClarityIcon(product.cosmicClarity)}
                          <div>
                            <span className="font-bold text-lg">
                              {product.cosmicClarity === 'blessed' && 'SAFE FOR PETS'}
                              {product.cosmicClarity === 'questionable' && 'USE WITH CAUTION'}
                              {product.cosmicClarity === 'cursed' && 'NOT RECOMMENDED'}
                            </span>
                            <p className="text-sm mt-1 opacity-90">
                              Overall Safety Classification
                            </p>
                          </div>
                        </div>
                        {product.cosmicScore !== undefined && (
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${
                              product.cosmicScore >= 80 ? 'text-mystical-green' :
                              product.cosmicScore >= 50 ? 'text-yellow-500' :
                              'text-mystical-red'
                            }`}>
                              {product.cosmicScore}
                            </div>
                            <div className="text-sm opacity-80">Safety Score</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">
                          {product.cosmicClarity === 'blessed' && 
                            'This product has passed comprehensive safety analysis and meets high standards for pet consumption. Ingredients are well-researched, properly sourced, and pose minimal risk when used as directed. Manufacturing standards appear adequate with good transparency.'
                          }
                          {product.cosmicClarity === 'questionable' && 
                            'This product contains some ingredients or characteristics that require careful consideration. While not immediately dangerous, there are factors that may affect sensitive pets or require veterinary guidance. Use discretion and monitor your pet closely.'
                          }
                          {product.cosmicClarity === 'cursed' && 
                            'This product contains significant safety concerns that make it unsuitable for pet consumption. Issues may include toxic ingredients, poor manufacturing standards, regulatory violations, or documented adverse effects. We strongly recommend avoiding this product.'
                          }
                        </p>
                        
                        {/* Quick Risk Factors */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <div className={`p-3 rounded-lg text-center ${
                            product.cosmicClarity === 'blessed' ? 'bg-green-950/30' :
                            product.cosmicClarity === 'questionable' ? 'bg-yellow-950/30' :
                            'bg-red-950/30'
                          }`}>
                            <div className="text-xs opacity-75">Ingredient Safety</div>
                            <div className="font-semibold">
                              {product.cosmicClarity === 'blessed' ? 'Excellent' :
                               product.cosmicClarity === 'questionable' ? 'Moderate' : 'Poor'}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg text-center ${
                            product.transparencyLevel === 'excellent' ? 'bg-green-950/30' :
                            product.transparencyLevel === 'good' ? 'bg-blue-950/30' :
                            'bg-red-950/30'
                          }`}>
                            <div className="text-xs opacity-75">Transparency</div>
                            <div className="font-semibold capitalize">
                              {product.transparencyLevel || 'Unknown'}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg text-center ${
                            (product.suspiciousIngredients?.length || 0) === 0 ? 'bg-green-950/30' :
                            (product.suspiciousIngredients?.length || 0) <= 2 ? 'bg-yellow-950/30' :
                            'bg-red-950/30'
                          }`}>
                            <div className="text-xs opacity-75">Risk Factors</div>
                            <div className="font-semibold">
                              {(product.suspiciousIngredients?.length || 0) === 0 ? 'None' :
                               (product.suspiciousIngredients?.length || 0) <= 2 ? 'Few' : 'Multiple'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Safety Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Positive Factors */}
                      <div className="p-4 bg-green-950/20 border border-green-500/30 rounded-lg">
                        <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Safety Strengths
                        </h4>
                        <ul className="space-y-2 text-sm text-green-200">
                          {product.cosmicClarity === 'blessed' && (
                            <>
                              <li>• No known toxic ingredients detected</li>
                              <li>• Ingredients are well-researched and documented</li>
                              <li>• Manufacturing transparency appears adequate</li>
                              <li>• No recent recall history</li>
                              <li>• Meets or exceeds industry safety standards</li>
                            </>
                          )}
                          {product.cosmicClarity === 'questionable' && (
                            <>
                              <li>• Most ingredients are considered safe</li>
                              <li>• No immediately dangerous substances</li>
                              <li>• Basic safety standards appear to be met</li>
                              {(product.suspiciousIngredients?.length || 0) <= 2 && <li>• Limited number of concerning ingredients</li>}
                            </>
                          )}
                          {product.cosmicClarity === 'cursed' && (
                            <>
                              <li>• Product packaging includes basic safety information</li>
                              <li>• Some standard ingredients are still present</li>
                            </>
                          )}
                          {product.ingredients && product.ingredients.length > 50 && (
                            <li>• Detailed ingredient disclosure provided</li>
                          )}
                          {product.transparencyLevel === 'excellent' && (
                            <li>• Excellent manufacturing transparency</li>
                          )}
                          {(!productRecalls || productRecalls.length === 0) && (
                            <li>• No active recalls or safety alerts</li>
                          )}
                        </ul>
                      </div>

                      {/* Risk Factors */}
                      <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
                        <h4 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                          ⚠️ Safety Concerns
                        </h4>
                        <ul className="space-y-2 text-sm text-red-200">
                          {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 ? (
                            <li>• Contains {product.suspiciousIngredients.length} flagged ingredient{product.suspiciousIngredients.length > 1 ? 's' : ''}</li>
                          ) : (
                            <li>• No major ingredient concerns identified</li>
                          )}
                          
                          {product.cosmicClarity === 'cursed' && (
                            <>
                              <li>• Contains ingredients with known safety issues</li>
                              <li>• May pose significant health risks</li>
                              <li>• Not recommended by veterinary standards</li>
                            </>
                          )}
                          
                          {product.cosmicClarity === 'questionable' && (
                            <>
                              <li>• Some ingredients may affect sensitive pets</li>
                              <li>• Limited safety data on certain components</li>
                              <li>• Requires careful monitoring during use</li>
                            </>
                          )}
                          
                          {product.transparencyLevel === 'poor' && (
                            <li>• Limited manufacturing transparency</li>
                          )}
                          
                          {!product.ingredients && (
                            <li>• Ingredient information not readily available</li>
                          )}
                          
                          {productRecalls && productRecalls.length > 0 && (
                            <li>• Product has {productRecalls.length} active recall{productRecalls.length > 1 ? 's' : ''}</li>
                          )}
                          
                          {product.cosmicClarity === 'blessed' && (!productRecalls || productRecalls.length === 0) && (
                            <li>• No significant safety concerns identified</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Veterinary Recommendations */}
                    <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-lg">
                      <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                        🩺 Veterinary Guidance
                      </h4>
                      <div className="space-y-3 text-sm text-blue-200">
                        {product.cosmicClarity === 'blessed' && (
                          <>
                            <p><strong>General Use:</strong> This product appears safe for most healthy pets when used as directed. No special precautions required beyond normal dietary introduction protocols.</p>
                            <p><strong>Special Considerations:</strong> Monitor for individual sensitivities. Consult your veterinarian if your pet has specific dietary restrictions or health conditions.</p>
                          </>
                        )}
                        
                        {product.cosmicClarity === 'questionable' && (
                          <>
                            <p><strong>Recommended Approach:</strong> Consult your veterinarian before use, especially for pets with sensitivities, allergies, or health conditions.</p>
                            <p><strong>Monitoring:</strong> Watch closely for any adverse reactions including digestive upset, lethargy, or behavioral changes. Discontinue if problems occur.</p>
                            <p><strong>Special Cases:</strong> Not recommended for pregnant, nursing, young, elderly, or immunocompromised pets without veterinary approval.</p>
                          </>
                        )}
                        
                        {product.cosmicClarity === 'cursed' && (
                          <>
                            <p><strong>Strong Recommendation:</strong> Do not use this product. Consult your veterinarian immediately if your pet has already consumed this product.</p>
                            <p><strong>Alternative Options:</strong> Ask your veterinarian for safer product alternatives that meet your pet's specific nutritional needs.</p>
                            <p><strong>If Already Used:</strong> Monitor your pet closely and contact your veterinarian if any symptoms develop.</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Recall History & Regulatory Status */}
                    <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-lg">
                      <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
                        📢 Recall History & Regulatory Status
                      </h4>
                      {productRecalls && productRecalls.length > 0 ? (
                        <div className="space-y-4">
                          <div className="p-3 bg-red-950/30 border-2 border-red-500/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="h-5 w-5 text-red-400" />
                              <span className="font-bold text-red-300">
                                🚨 ACTIVE RECALL ALERT - {productRecalls.length} Recall{productRecalls.length > 1 ? 's' : ''} Found
                              </span>
                            </div>
                            <div className="space-y-3">
                              {productRecalls.map((recall: any) => (
                                <div key={recall.id} className="p-3 bg-red-900/30 border border-red-500/30 rounded">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <Badge variant="destructive" className="bg-red-600 text-white font-semibold mb-2">
                                        Recall #{recall.recallNumber}
                                      </Badge>
                                      <h5 className="font-semibold text-red-200">{recall.reason}</h5>
                                    </div>
                                    <Badge variant="outline" className="border-red-400/50 text-red-300 text-xs">
                                      {new Date(recall.dateIssued).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                  <p className="text-red-100 text-sm mb-2">{recall.description}</p>
                                  <div className="text-xs text-red-200">
                                    <p><strong>Affected Products:</strong> {recall.affectedProducts}</p>
                                    {recall.healthHazard && (
                                      <p className="mt-1"><strong>Health Risk:</strong> {recall.healthHazard}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 p-3 bg-red-800/20 border border-red-400/30 rounded">
                              <p className="text-red-100 text-sm font-bold">
                                ⚠️ CRITICAL WARNING: This product is under active recall. Do not use this product and contact your veterinarian immediately if your pet has consumed it. Check with the manufacturer for recall status updates.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-950/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-4 w-4 text-green-400" />
                              <span className="font-semibold text-green-300">✅ No Active Recalls</span>
                            </div>
                            <p className="text-green-200 text-sm">
                              This product currently has no active recalls or FDA warnings on record. 
                              Our system monitors FDA databases and manufacturer announcements for safety alerts.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="text-center p-2 bg-green-950/20 border border-green-500/30 rounded">
                              <div className="font-semibold text-green-300">Clean</div>
                              <div className="text-green-200">FDA Status</div>
                            </div>
                            <div className="text-center p-2 bg-blue-950/20 border border-blue-500/30 rounded">
                              <div className="font-semibold text-blue-300">Monitored</div>
                              <div className="text-blue-200">Safety Tracking</div>
                            </div>
                            <div className="text-center p-2 bg-purple-950/20 border border-purple-500/30 rounded">
                              <div className="font-semibold text-purple-300">Current</div>
                              <div className="text-purple-200">Database Status</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 p-3 bg-orange-800/20 border border-orange-400/30 rounded">
                        <p className="text-orange-100 text-xs">
                          <strong>Recall Monitoring:</strong> We continuously monitor FDA, USDA, and manufacturer databases for safety alerts. 
                          Recall status can change rapidly - always verify current status with the manufacturer before use.
                        </p>
                      </div>
                    </div>

                    {/* Scientific Analysis Details */}
                    <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-lg">
                      <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        🔬 Analysis Methodology & Sources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-200">
                        <div>
                          <h5 className="font-medium mb-2">Safety Factors Evaluated:</h5>
                          <ul className="space-y-1">
                            <li>• Ingredient toxicity database cross-reference</li>
                            <li>• FDA recall and warning history</li>
                            <li>• USDA safety alert monitoring</li>
                            <li>• Veterinary research and case studies</li>
                            <li>• AAFCO nutritional adequacy standards</li>
                            <li>• Consumer adverse event reports</li>
                            <li>• Manufacturing facility inspection records</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Risk Assessment Criteria:</h5>
                          <ul className="space-y-1">
                            <li>• Acute toxicity potential</li>
                            <li>• Long-term health implications</li>
                            <li>• Allergen and sensitivity factors</li>
                            <li>• Manufacturing quality indicators</li>
                            <li>• Regulatory compliance status</li>
                            <li>• Historical recall patterns</li>
                            <li>• Pathogen contamination risk</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-purple-900/20 border border-purple-400/20 rounded">
                        <p className="text-xs text-purple-100">
                          <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not replace professional veterinary advice. Safety assessments are based on available data and may not account for individual pet sensitivities or health conditions. Recall status can change without notice. Always consult your veterinarian for personalized recommendations and verify current recall status with manufacturers.
                        </p>
                      </div>
                    </div>

                    {/* Comprehensive Data Sources & References */}
                    <div className="p-4 bg-slate-950/20 border border-slate-500/30 rounded-lg">
                      <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        📚 Data Sources & Scientific References
                      </h4>
                      
                      <div className="space-y-4 text-xs text-slate-200">
                        {/* Regulatory & Government Sources */}
                        <div>
                          <h5 className="font-semibold text-slate-300 mb-2">🏛️ Regulatory & Government Databases</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="space-y-1">
                              <li>• <strong>FDA Center for Veterinary Medicine (CVM)</strong> - Pet food safety regulations, recalls, and adverse event reports</li>
                              <li>• <strong>USDA FSIS</strong> - Meat and poultry inspection data for pet food ingredients</li>
                              <li>• <strong>EPA ECOTOX Database</strong> - Environmental toxicity data for chemical substances</li>
                              <li>• <strong>AAFCO Official Publication</strong> - Nutritional adequacy standards and ingredient definitions</li>
                            </ul>
                            <ul className="space-y-1">
                              <li>• <strong>Health Canada Veterinary Drugs Directorate</strong> - Canadian pet food safety standards</li>
                              <li>• <strong>European Food Safety Authority (EFSA)</strong> - EU guidelines on pet food safety</li>
                              <li>• <strong>FDA Reportable Food Registry</strong> - Food safety incident tracking</li>
                              <li>• <strong>CFIA Safe Food for Canadians Regulations</strong> - Canadian food safety compliance</li>
                            </ul>
                          </div>
                        </div>

                        {/* Veterinary & Academic Sources */}
                        <div>
                          <h5 className="font-semibold text-slate-300 mb-2">🩺 Veterinary Research & Academic Institutions</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="space-y-1">
                              <li>• <strong>American Veterinary Medical Association (AVMA)</strong> - Veterinary nutrition guidelines and research</li>
                              <li>• <strong>World Small Animal Veterinary Association (WSAVA)</strong> - Global nutrition guidelines</li>
                              <li>• <strong>Journal of the American Veterinary Medical Association</strong> - Peer-reviewed veterinary research</li>
                              <li>• <strong>Veterinary Clinics of North America</strong> - Clinical nutrition studies</li>
                            </ul>
                            <ul className="space-y-1">
                              <li>• <strong>University of California, Davis School of Veterinary Medicine</strong> - Pet nutrition research</li>
                              <li>• <strong>Cornell University College of Veterinary Medicine</strong> - Toxicology studies</li>
                              <li>• <strong>Journal of Animal Science</strong> - Animal nutrition and safety research</li>
                              <li>• <strong>American College of Veterinary Nutrition (ACVN)</strong> - Professional nutrition standards</li>
                            </ul>
                          </div>
                        </div>

                        {/* Toxicology & Safety Databases */}
                        <div>
                          <h5 className="font-semibold text-slate-300 mb-2">⚗️ Toxicology & Safety Research</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="space-y-1">
                              <li>• <strong>ASPCA Animal Poison Control Center</strong> - Toxicity data and case studies</li>
                              <li>• <strong>Pet Poison Helpline Database</strong> - Veterinary toxicology incidents</li>
                              <li>• <strong>NIH National Toxicology Program</strong> - Chemical safety assessments</li>
                              <li>• <strong>TOXNET (Toxicology Data Network)</strong> - Comprehensive toxicology database</li>
                            </ul>
                            <ul className="space-y-1">
                              <li>• <strong>European Chemicals Agency (ECHA)</strong> - Chemical safety information</li>
                              <li>• <strong>OECD Guidelines for Testing of Chemicals</strong> - International safety testing standards</li>
                              <li>• <strong>Society of Toxicology</strong> - Peer-reviewed toxicology research</li>
                              <li>• <strong>Veterinary Toxicology Basic and Clinical Principles</strong> - Reference textbook</li>
                            </ul>
                          </div>
                        </div>

                        {/* Industry & Professional Organizations */}
                        <div>
                          <h5 className="font-semibold text-slate-300 mb-2">🏢 Industry Standards & Professional Organizations</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="space-y-1">
                              <li>• <strong>Pet Food Institute (PFI)</strong> - Industry safety standards and best practices</li>
                              <li>• <strong>Association of American Feed Control Officials (AAFCO)</strong> - Feed regulation and standards</li>
                              <li>• <strong>Global Food Safety Initiative (GFSI)</strong> - International food safety benchmarks</li>
                              <li>• <strong>Safe Quality Food (SQF) Program</strong> - Food safety certification standards</li>
                            </ul>
                            <ul className="space-y-1">
                              <li>• <strong>British Retail Consortium (BRC)</strong> - Global food safety standards</li>
                              <li>• <strong>International Association of Food Protection</strong> - Food safety research</li>
                              <li>• <strong>Pet Food Manufacturers' Association (PFMA)</strong> - UK pet food industry standards</li>
                              <li>• <strong>National Animal Supplement Council (NASC)</strong> - Pet supplement safety guidelines</li>
                            </ul>
                          </div>
                        </div>

                        {/* Scientific Journals & Publications */}
                        <div>
                          <h5 className="font-semibold text-slate-300 mb-2">📖 Key Scientific Publications & Journals</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="space-y-1">
                              <li>• <strong>Journal of Animal Physiology and Animal Nutrition</strong> - Nutrition research</li>
                              <li>• <strong>Animal Feed Science and Technology</strong> - Feed safety and quality</li>
                              <li>• <strong>Food and Chemical Toxicology</strong> - Ingredient safety studies</li>
                              <li>• <strong>Applied Animal Behaviour Science</strong> - Nutrition and behavior</li>
                            </ul>
                            <ul className="space-y-1">
                              <li>• <strong>Veterinary Medicine International</strong> - Open access veterinary research</li>
                              <li>• <strong>PLoS ONE</strong> - Open access scientific research</li>
                              <li>• <strong>BMC Veterinary Research</strong> - Peer-reviewed veterinary studies</li>
                              <li>• <strong>Topics in Companion Animal Medicine</strong> - Clinical nutrition articles</li>
                            </ul>
                          </div>
                        </div>

                        {/* Data Validation & Methodology */}
                        <div className="mt-4 p-3 bg-slate-900/30 border border-slate-400/20 rounded">
                          <h5 className="font-semibold text-slate-300 mb-2">🔍 Data Validation Methodology</h5>
                          <div className="text-xs text-slate-200 space-y-1">
                            <p>• <strong>Cross-referencing:</strong> All safety claims are verified across multiple authoritative sources</p>
                            <p>• <strong>Peer Review:</strong> Prioritizing peer-reviewed scientific publications over industry claims</p>
                            <p>• <strong>Recency:</strong> Emphasizing recent studies (last 10 years) while considering landmark research</p>
                            <p>• <strong>Authority:</strong> Weighting government agencies and academic institutions over commercial sources</p>
                            <p>• <strong>Transparency:</strong> Clearly distinguishing between established facts and emerging research</p>
                            <p>• <strong>Updates:</strong> Regular database updates to reflect latest safety information and recalls</p>
                          </div>
                        </div>

                        {/* Access & Verification */}
                        <div className="mt-4 p-3 bg-blue-950/20 border border-blue-400/20 rounded">
                          <h5 className="font-semibold text-blue-300 mb-2">🔗 Source Verification & Access</h5>
                          <div className="text-xs text-blue-200 space-y-1">
                            <p>• <strong>Real-time Data:</strong> FDA recalls and USDA alerts are monitored in real-time through official APIs</p>
                            <p>• <strong>Database Access:</strong> Direct access to AAFCO databases, veterinary journals, and toxicology databases</p>
                            <p>• <strong>Professional Networks:</strong> Collaboration with licensed veterinarians and animal nutritionists</p>
                            <p>• <strong>Verification Protocol:</strong> Each safety claim requires minimum 2 authoritative source confirmations</p>
                            <p>• <strong>Update Frequency:</strong> Sources reviewed and updated monthly, critical safety alerts updated immediately</p>
                            <p>• <strong>Audit Trail:</strong> Complete documentation of source materials and analysis methodology</p>
                          </div>
                        </div>

                        {/* Legal & Compliance Notice */}
                        <div className="mt-4 p-3 bg-amber-950/20 border border-amber-400/20 rounded">
                          <h5 className="font-semibold text-amber-300 mb-2">⚖️ Legal & Compliance</h5>
                          <p className="text-xs text-amber-200">
                            <strong>Important:</strong> This safety analysis is compiled from publicly available scientific and regulatory sources. 
                            While we strive for accuracy, this information is for educational purposes only and does not constitute veterinary advice. 
                            Product formulations may change without notice. Always consult the product label, manufacturer information, 
                            and your veterinarian before making feeding decisions. Individual pet responses may vary regardless of general safety profiles.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className={`p-4 rounded-lg border ${
                      product.cosmicClarity === 'blessed' ? 'bg-green-950/20 border-green-500/30' :
                      product.cosmicClarity === 'questionable' ? 'bg-yellow-950/20 border-yellow-500/30' :
                      'bg-red-950/20 border-red-500/30'
                    }`}>
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                        product.cosmicClarity === 'blessed' ? 'text-green-300' :
                        product.cosmicClarity === 'questionable' ? 'text-yellow-300' :
                        'text-red-300'
                      }`}>
                        📋 Recommended Actions
                      </h4>
                      <div className={`space-y-2 text-sm ${
                        product.cosmicClarity === 'blessed' ? 'text-green-200' :
                        product.cosmicClarity === 'questionable' ? 'text-yellow-200' :
                        'text-red-200'
                      }`}>
                        {product.cosmicClarity === 'blessed' && (
                          <>
                            <p>✅ <strong>Safe to use</strong> following standard feeding guidelines</p>
                            <p>📝 Introduce gradually over 7-10 days as with any new food</p>
                            <p>👀 Monitor for individual reactions during transition period</p>
                            <p>📞 Contact veterinarian if any concerns arise</p>
                          </>
                        )}
                        
                        {product.cosmicClarity === 'questionable' && (
                          <>
                            <p>🩺 <strong>Consult veterinarian</strong> before first use</p>
                            <p>📋 Review ingredient list with your vet</p>
                            <p>👁️ Monitor closely for 48-72 hours after introduction</p>
                            <p>⚠️ Avoid use in pets with known sensitivities</p>
                            <p>📞 Have emergency vet contact ready during trial period</p>
                            {productRecalls && productRecalls.length > 0 && (
                              <p>🚨 <strong>Check recall status</strong> before any use</p>
                            )}
                          </>
                        )}
                        
                        {(product.cosmicClarity === 'cursed' || (productRecalls && productRecalls.length > 0)) && (
                          <>
                            <p>🚫 <strong>Do not use this product</strong></p>
                            <p>🩺 Consult veterinarian for safe alternatives</p>
                            <p>⚠️ If already used, monitor pet closely</p>
                            <p>📞 Contact vet immediately if symptoms develop</p>
                            <p>🗑️ Dispose of product safely according to instructions</p>
                            {productRecalls && productRecalls.length > 0 && (
                              <p>📢 <strong>Report to manufacturer</strong> if pet consumed recalled product</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Section */}
              <Card className="cosmic-card" data-testid="card-reviews">
                <CardHeader>
                  <CardTitle className="text-starlight-400 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Community Reviews
                    {reviews && reviews.length > 0 && (
                      <Badge variant="secondary" className="bg-starlight-500/20 text-starlight-300">
                        {reviews.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-cosmic-700 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-cosmic-700 rounded w-full mb-1"></div>
                          <div className="h-3 bg-cosmic-700 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-cosmic-700 last:border-b-0 pb-4 last:pb-0" data-testid={`review-${review.id}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-cosmic-600'}`}
                                />
                              ))}
                            </div>
                            <span className="text-cosmic-400 text-sm">
                              by {review.userId} • {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-cosmic-200 mb-2 font-medium">{review.title}</p>
                          <p className="text-cosmic-300 text-sm">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-cosmic-600 mx-auto mb-4" />
                      <p className="text-cosmic-400 mb-4">No reviews yet. Be the first to share your experience!</p>
                      <Link href="/community">
                        <Button variant="outline" className="border-starlight-500/30 text-starlight-400">
                          Write a Review
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submit Product Update */}
              <Card className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer border border-border hover:border-amber-300 dark:hover:border-amber-600" data-testid="card-submit-update">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                    <WandSparkles className="text-amber-600 h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Submit Product Update</h3>
                  <p className="text-muted-foreground text-sm mb-4">Help improve our database with corrections and new info for this product</p>
                  <Link href={`/submit-product-update?productId=${id}&name=${encodeURIComponent(product.name)}&brand=${encodeURIComponent(product.brand)}&barcode=${product.barcode || ''}`}>
                    <Button className="w-full bg-amber-600 text-white hover:bg-amber-700" data-testid="button-submit-update">
                      Submit Update
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Comprehensive Product Stats */}
              <Card className="cosmic-card" data-testid="card-quick-stats">
                <CardHeader>
                  <CardTitle className="text-starlight-400">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-300">Category:</span>
                    <Badge variant="secondary" className="bg-cosmic-700">{product.category || 'Unknown'}</Badge>
                  </div>
                  
                  <Separator className="bg-cosmic-700" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-300">UPC/Barcode:</span>
                    <span className="text-cosmic-200 font-mono text-sm">{product.barcode || 'N/A'}</span>
                  </div>
                  
                  {product.animalType && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-300">Animal Type:</span>
                        <Badge variant="outline" className="capitalize border-purple-500/30 text-purple-300">
                          {product.animalType}
                        </Badge>
                      </div>
                    </>
                  )}
                  
                  {product.lastAnalyzed && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-300">Last Analyzed:</span>
                        <span className="text-cosmic-200 text-sm">
                          {new Date(product.lastAnalyzed).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {product.transparencyLevel && product.transparencyLevel !== 'unknown' && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-300">Transparency:</span>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${
                            product.transparencyLevel === 'excellent' ? 'border-green-500/30 text-green-300' :
                            product.transparencyLevel === 'good' ? 'border-blue-500/30 text-blue-300' :
                            product.transparencyLevel === 'pending' ? 'border-yellow-500/30 text-yellow-300' :
                            'border-cosmic-500/30 text-cosmic-300'
                          }`}
                        >
                          {product.transparencyLevel}
                        </Badge>
                      </div>
                    </>
                  )}
                  
                  {productRecalls && productRecalls.length > 0 && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex items-center gap-2 text-mystical-red">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {productRecalls.length} Active Recall{productRecalls.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {product.isBlacklisted && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex items-center gap-2 text-mystical-red">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Contains Blacklisted Ingredients</span>
                      </div>
                    </>
                  )}
                  
                  {/* Additional Links */}
                  {(product.sourceUrl || (product.sourceUrls && product.sourceUrls.length > 0)) && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="space-y-2">
                        <span className="text-cosmic-300 text-sm">External Sources:</span>
                        {product.sourceUrl && (
                          <a 
                            href={product.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-starlight-400 hover:text-starlight-300 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Official Info
                          </a>
                        )}
                        {product.sourceUrls && product.sourceUrls.slice(0, 2).map((url: string, index: number) => (
                          <a 
                            key={index}
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-starlight-400 hover:text-starlight-300 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Source {index + 1}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Ad Sidebar */}
              <div className="flex justify-center">
                <AdBanner size="square" position="product-detail-sidebar" />
              </div>
            </div>
          </div>
          
          {/* Bottom Ad */}
          <div className="mt-12 flex justify-center">
            <AdBanner size="leaderboard" position="product-detail-footer" />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}