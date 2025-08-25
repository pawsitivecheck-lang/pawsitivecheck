import { useParams, Link } from "wouter";
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
import { SaveToPetButton } from "@/components/save-to-pet-button";
import { Package, Shield, AlertTriangle, CheckCircle, XCircle, Heart, Star, ArrowLeft, ExternalLink } from "lucide-react";

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
              
              {/* Description */}
              {product.description && (
                <Card className="cosmic-card" data-testid="card-description">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-starlight-400">Product Description</CardTitle>
                      <HelpTooltip 
                        content="Official product description provided by the manufacturer. This information helps you understand the product's intended use, target animals, and key features. Always verify with your veterinarian if you have questions about suitability for your specific pet."
                        side="right"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cosmic-300 leading-relaxed" data-testid="text-product-description">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ingredients */}
              <Card className="cosmic-card" data-testid="card-ingredients">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-starlight-400">Ingredients</CardTitle>
                    <HelpTooltip 
                      content="Complete ingredient list as declared by the manufacturer. Ingredients are typically listed in descending order by weight. Our analysis flags potentially problematic ingredients based on veterinary research, FDA warnings, allergen data, and toxicology studies. Red flags may include artificial preservatives, known toxins, common allergens, or controversial additives."
                      side="right"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-cosmic-300 leading-relaxed" data-testid="text-product-ingredients">
                    {product.ingredients || 'Ingredient information not available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Safety Assessment */}
              {product.cosmicClarity && product.cosmicClarity !== 'unknown' && (
                <Card className="cosmic-card" data-testid="card-safety-assessment">
                  <CardHeader>
                    <CardTitle className="text-starlight-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Safety Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`border-l-4 rounded-r-lg p-4 ${
                      product.cosmicClarity === 'blessed' ? 'bg-mystical-green/10 border-mystical-green' :
                      product.cosmicClarity === 'questionable' ? 'bg-yellow-500/10 border-yellow-500' :
                      'bg-mystical-red/10 border-mystical-red'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {getCosmicClarityIcon(product.cosmicClarity)}
                        <span className="font-semibold">
                          {product.cosmicClarity === 'blessed' && 'Safe for Pets'}
                          {product.cosmicClarity === 'questionable' && 'Use with Caution'}
                          {product.cosmicClarity === 'cursed' && 'Not Recommended'}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">
                        {product.cosmicClarity === 'blessed' && 'This product meets our safety standards and is generally safe for most pets.'}
                        {product.cosmicClarity === 'questionable' && 'This product contains ingredients that may cause issues for some sensitive pets.'}
                        {product.cosmicClarity === 'cursed' && 'This product contains concerning ingredients and is not recommended for pet consumption.'}
                      </p>
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
              {/* Quick Stats */}
              <Card className="cosmic-card" data-testid="card-quick-stats">
                <CardHeader>
                  <CardTitle className="text-starlight-400">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-300">Category:</span>
                    <Badge variant="secondary" className="bg-cosmic-700">{product.category || 'Unknown'}</Badge>
                  </div>
                  <Separator className="bg-cosmic-700" />
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-300">Barcode:</span>
                    <span className="text-cosmic-200 font-mono text-sm">{product.barcode || 'N/A'}</span>
                  </div>
                  {product.isBlacklisted && (
                    <>
                      <Separator className="bg-cosmic-700" />
                      <div className="flex items-center gap-2 text-mystical-red">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Contains Blacklisted Ingredients</span>
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