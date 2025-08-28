import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveToPetButton } from "@/components/save-to-pet-button";
import HelpTooltip from "@/components/help-tooltip";
import { CheckCircle, AlertTriangle, XCircle, Eye, Package, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    brand: string;
    description?: string;
    barcode?: string;
    cosmicScore?: number;
    cosmicClarity?: string;
    transparencyLevel?: string;
    isBlacklisted?: boolean;
    imageUrl?: string;
    sourceUrl?: string;
    suspiciousIngredients?: string[];
    disposalInstructions?: string;
  };
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const getCosmicClarityIcon = (clarity: string) => {
    switch (clarity) {
      case 'blessed':
        return <CheckCircle className="text-mystical-green h-4 w-4" />;
      case 'questionable':
        return <AlertTriangle className="text-yellow-500 h-4 w-4" />;
      case 'cursed':
        return <XCircle className="text-mystical-red h-4 w-4" />;
      default:
        return <Eye className="text-cosmic-400 h-4 w-4" />;
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

  const getCosmicVerdict = (clarity: string, score: number) => {
    switch (clarity) {
      case 'blessed':
        return "The ingredients sing with purity";
      case 'questionable':
        return "The shadows hide much";
      case 'cursed':
        return "Banish this from your realm!";
      default:
        return "Awaiting cosmic analysis";
    }
  };

  const generatePawRating = (score: number) => {
    return Math.max(1, Math.min(5, Math.round(score / 20)));
  };

  return (
    <Card className="cosmic-card hover:border-starlight-500/40 transition-all group cursor-pointer" onClick={onClick} data-testid={`product-card-${product.id}`}>
      <CardContent className="p-6">
        {/* Product Image */}
        <div className="relative mb-4">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
              data-testid="img-product"
            />
          ) : (
            <div className="w-full h-48 bg-cosmic-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" data-testid="placeholder-product-image">
              <Package className="text-cosmic-500 text-4xl" />
            </div>
          )}
          
          {/* Blacklist Warning */}
          {product.isBlacklisted && (
            <div className="absolute top-2 right-2 bg-mystical-red rounded-full p-2 animate-pulse" data-testid="icon-blacklisted">
              <XCircle className="text-white h-4 w-4" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-xl text-cosmic-100 mb-1" data-testid="text-product-name">
                {product.name}
              </h3>
              <p className="text-cosmic-300 text-sm" data-testid="text-product-brand">
                by {product.brand}
              </p>
              {product.barcode && (
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-cosmic-400 text-xs font-mono" data-testid="text-product-barcode">
                    UPC: {product.barcode}
                  </p>
                  <HelpTooltip 
                    content="Universal Product Code (UPC) - A unique barcode identifier for this specific product. Used for scanning and tracking product authenticity, recalls, and manufacturer information."
                    side="right"
                  />
                </div>
              )}
            </div>
            
            {/* Paw Rating */}
            {product.cosmicScore !== undefined && (
              <div className="flex items-center gap-2" data-testid="paw-rating">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < generatePawRating(product.cosmicScore!) ? 'text-mystical-green' : 'text-cosmic-600'}
                      data-testid={`paw-${i}`}
                    >
                      🐾
                    </span>
                  ))}
                </div>
                <HelpTooltip 
                  content={`Paw Safety Rating: ${generatePawRating(product.cosmicScore!)} out of 5 paws. Based on comprehensive ingredient analysis, veterinary research, and safety databases. More paws = safer for your pet. Score: ${product.cosmicScore}/100`}
                  side="left"
                />
              </div>
            )}
          </div>

          {/* Safety Assessment */}
          {product.cosmicClarity && product.cosmicClarity !== 'unknown' && (
            <div className={`border-l-4 rounded-r-lg p-3 ${
              product.cosmicClarity === 'blessed' ? 'bg-mystical-green/10 border-mystical-green' :
              product.cosmicClarity === 'questionable' ? 'bg-yellow-500/10 border-yellow-500' :
              'bg-mystical-red/10 border-mystical-red'
            }`} data-testid="safety-assessment-section">
              <div className="flex items-center gap-2 mb-2">
                {getCosmicClarityIcon(product.cosmicClarity)}
                <p className="text-sm font-semibold" data-testid="text-safety-status">
                  Safety Status: {product.cosmicClarity === 'blessed' ? 'SAFE' : 
                                   product.cosmicClarity === 'questionable' ? 'CAUTION' : 'AVOID'}
                </p>
                <HelpTooltip 
                  content={`Cosmic Clarity Safety Assessment: ${
                    product.cosmicClarity === 'blessed' 
                      ? 'BLESSED - This product has been analyzed and deemed safe for most pets. Ingredients are well-researched and pose minimal risk when used as directed.'
                      : product.cosmicClarity === 'questionable'
                      ? 'QUESTIONABLE - This product contains ingredients that may cause issues for sensitive pets or lack sufficient safety data. Use with caution and consult your veterinarian.'
                      : 'CURSED - This product contains concerning ingredients that are potentially harmful to pets. We strongly recommend avoiding this product and consulting your veterinarian for alternatives.'
                  } Our analysis considers ingredient toxicity, allergen potential, FDA recalls, veterinary warnings, and peer-reviewed research.`}
                  side="top"
                />
              </div>
              <p className="text-xs mb-2" data-testid="text-safety-guidance">
                {product.cosmicClarity === 'blessed' 
                  ? "This product appears safe for most pets based on ingredient analysis. Always introduce new foods gradually."
                  : product.cosmicClarity === 'questionable'
                  ? "This product has some concerns. Check ingredients carefully and consult your veterinarian if your pet has sensitivities."
                  : "This product has significant safety concerns. Consider alternatives and consult your veterinarian before use."}
              </p>
              {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 && (
                <div className="mt-2 p-2 bg-mystical-red/5 rounded border border-mystical-red/20">
                  <p className="text-xs font-medium text-mystical-red mb-1">Concerning ingredients found:</p>
                  <p className="text-xs text-cosmic-300" data-testid="text-concerning-ingredients">
                    {product.suspiciousIngredients.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Product Stats */}
          <div className="space-y-2 text-sm">
            {product.cosmicScore !== undefined && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-400">Safety Score:</span>
                  <HelpTooltip 
                    content={`Comprehensive Safety Score (${product.cosmicScore}/100): Calculated using advanced algorithms that analyze ingredient toxicity data, FDA recall history, veterinary research, allergen potential, manufacturing standards, and consumer reports. 80-100 = Excellent, 60-79 = Good, 40-59 = Fair, 20-39 = Poor, 0-19 = Dangerous.`}
                    side="top"
                  />
                </div>
                <span className={
                  product.cosmicScore >= 80 ? 'text-mystical-green font-semibold' :
                  product.cosmicScore >= 50 ? 'text-yellow-500 font-semibold' :
                  'text-mystical-red font-semibold'
                } data-testid="text-safety-score">
                  {product.cosmicScore}/100
                </span>
              </div>
            )}
            
            {product.transparencyLevel && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-400">Transparency:</span>
                  <HelpTooltip 
                    content={`Manufacturing Transparency Level: Measures how open and honest the manufacturer is about their ingredients, sourcing, testing procedures, and quality control. Excellent = Full ingredient disclosure, third-party testing, source transparency. Good = Most information available, some testing data. Poor = Limited information, vague ingredient lists, no testing transparency.`}
                    side="top"
                  />
                </div>
                <span className={
                  product.transparencyLevel === 'excellent' ? 'text-mystical-green' :
                  product.transparencyLevel === 'good' ? 'text-yellow-500' :
                  'text-mystical-red'
                } data-testid="text-transparency">
                  {product.transparencyLevel}
                </span>
              </div>
            )}

            {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-cosmic-400">Concerns:</span>
                  <HelpTooltip 
                    content={`Ingredient Concerns Detected: ${product.suspiciousIngredients.length} potentially problematic ingredients found. These may include known toxins, allergens, preservatives with safety concerns, artificial additives, or ingredients flagged by veterinary authorities. Specific ingredients: ${product.suspiciousIngredients.join(', ')}. Always consult your veterinarian before using products with concerning ingredients.`}
                    side="top"
                  />
                </div>
                <span className="text-mystical-red font-semibold" data-testid="text-concerns">
                  {product.suspiciousIngredients.length} ingredient{product.suspiciousIngredients.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Source Link */}
          {product.sourceUrl && (
            <div className="p-2 bg-starlight-500/5 rounded border border-starlight-500/20 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-cosmic-400 text-xs">Official Source</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(product.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(product.brand + ' pet products')}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-starlight-400 hover:text-starlight-300 text-xs underline bg-transparent border-none p-0 cursor-pointer"
                  data-testid={`product-source-link-${product.id}`}
                >
                  View Brand Info →
                </button>
              </div>
            </div>
          )}

          {/* Disposal Instructions */}
          {product.disposalInstructions && (
            <div className="p-3 bg-cosmic-700/20 rounded border border-cosmic-600/30 mb-3">
              <h4 className="text-cosmic-300 text-xs font-semibold mb-2 flex items-center gap-2">
                ♻️ Safe Disposal Instructions
              </h4>
              <p className="text-cosmic-400 text-xs leading-relaxed" data-testid={`disposal-instructions-${product.id}`}>
                {product.disposalInstructions}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className={`flex-1 ${
                product.cosmicClarity === 'blessed' 
                  ? 'bg-mystical-green/20 text-mystical-green hover:bg-mystical-green/30' :
                product.cosmicClarity === 'cursed' 
                  ? 'bg-mystical-red/20 text-mystical-red hover:bg-mystical-red/30' :
                product.cosmicClarity === 'questionable'
                  ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                  'bg-cosmic-600/20 text-cosmic-300 hover:bg-cosmic-600/30'
              }`}
              data-testid="button-view-analysis"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              {product.cosmicClarity === 'blessed' 
                ? 'View Details' :
              product.cosmicClarity === 'cursed' 
                ? 'View Concerns' :
              product.cosmicClarity === 'questionable'
                ? 'View Analysis' :
                'Analyze Safety'
              }
            </Button>
            
            <SaveToPetButton 
              productId={product.id}
              productName={product.name}
              size="default"
              variant="outline"
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
