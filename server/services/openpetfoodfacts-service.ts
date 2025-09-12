import { logger } from "../logger";
import { storage } from "../storage";
import { WalmartScraper } from "./walmart-scraper";
import { PetSmartScraper } from "./petsmart-scraper";
import { AmazonScraper } from "./amazon-scraper";
import { TargetScraper } from "./target-scraper";
import { PetcoScraper } from "./petco-scraper";

export interface OpenPetFoodFactsProduct {
  product_name?: string;
  generic_name?: string;
  brands?: string;
  categories_tags?: string[];
  ingredients_text?: string;
  nutriments?: any;
  labels_tags?: string[];
  image_url?: string;
  nutrition_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  countries_tags?: string[];
  stores_tags?: string[];
  packaging_tags?: string[];
  allergens_tags?: string[];
  traces_tags?: string[];
  additives_tags?: string[];
  created_t?: number;
  last_modified_t?: number;
}

export class OpenPetFoodFactsService {
  private scrapers = [
    new WalmartScraper(),
    new PetSmartScraper(),
    new AmazonScraper(),
    new TargetScraper(),
    new PetcoScraper()
  ];

  /**
   * Parse Open Pet Food Facts product data and enhance with retailer information
   */
  async parseOpenPetFoodFactsProduct(product: OpenPetFoodFactsProduct, barcode: string) {
    try {
      logger.info('general', `Parsing Open Pet Food Facts product: ${product.product_name || 'Unknown'}`);

      // Extract basic product information
      const productName = product.product_name || product.generic_name || `Pet Product ${barcode}`;
      const brand = this.extractBrand(product.brands);
      const category = this.determineCategory(product.categories_tags || []);
      
      // Calculate enhanced cosmic score
      const cosmicScore = this.calculateCosmicScore(product);
      
      // Analyze ingredients for safety
      const ingredientAnalysis = this.analyzeIngredients(product.ingredients_text || '');
      
      // Determine cosmic clarity
      const cosmicClarity = this.determineCosmicClarity(ingredientAnalysis, product);
      
      // Get transparency level
      const transparencyLevel = this.getTransparencyLevel(product);

      // Create base product data
      let productData = {
        name: productName,
        brand: brand,
        category: category,
        description: this.generateDescription(product),
        ingredients: product.ingredients_text || "Ingredients not specified",
        imageUrl: product.image_url || null,
        barcode: barcode,
        cosmicScore: cosmicScore,
        cosmicClarity: cosmicClarity,
        transparencyLevel: transparencyLevel,
        isBlacklisted: false,
        suspiciousIngredients: ingredientAnalysis.suspicious,
        targetSpecies: this.extractTargetSpecies(product),
        animalType: 'pet',
        lastAnalyzed: new Date(),
        sourceUrl: `https://world.openpetfoodfacts.org/product/${barcode}`,
        nutritionGrade: product.nutrition_grade || null,
        novaGroup: product.nova_group || null,
        ecoscore: product.ecoscore_grade || null,
        allergens: this.extractAllergens(product.allergens_tags || []),
        additives: this.extractAdditives(product.additives_tags || []),
        countries: this.extractCountries(product.countries_tags || []),
        stores: this.extractStores(product.stores_tags || [])
      };

      // Enhance with retailer data
      const enhancedData = await this.enhanceWithRetailerData(productData);

      return enhancedData;

    } catch (error) {
      logger.error('general', `Error parsing Open Pet Food Facts product: ${error}`);
      return null;
    }
  }

  /**
   * Enhance product data with retailer scraper information (simplified for safety)
   */
  private async enhanceWithRetailerData(productData: any) {
    try {
      logger.info('general', `Note: Retailer enhancement available but skipped for performance (product: ${productData.name})`);
      
      // For now, skip retailer enhancement to avoid performance issues
      // This can be implemented asynchronously via background jobs later
      
      return productData;

    } catch (error) {
      logger.error('general', `Error in retailer enhancement: ${error}`);
      return productData; // Return original data if enhancement fails
    }
  }

  /**
   * Update all existing products with enhanced Open Pet Food Facts data (simplified for safety)
   */
  async updateAllProductsWithEnhancedData() {
    try {
      logger.info('general', 'Starting limited product database update with Open Pet Food Facts data');

      // Get first 50 products to avoid overwhelming the system
      const allProducts = await storage.getProducts(50, 0);
      let enhancedCount = 0;

      for (const product of allProducts) {
        try {
          if (product.barcode) {
            logger.info('general', `Processing product: ${product.name} (${product.barcode})`);

            // Try to fetch from Open Pet Food Facts
            const response = await fetch(`https://world.openpetfoodfacts.org/api/v2/product/${product.barcode}.json`, {
              headers: {
                'User-Agent': 'PawsitiveCheck - Version 1.0 - https://pawsitivecheck.replit.app'
              }
            });

            if (response.ok) {
              const data = await response.json();
              
              if (data.status === 1 && data.product) {
                // Parse the product data (without heavy retailer enhancement)
                const enhancedData = await this.parseOpenPetFoodFactsProduct(data.product, product.barcode);
                
                if (enhancedData) {
                  // Update only basic fields to avoid schema issues
                  const safeUpdateData = {
                    description: enhancedData.description,
                    ingredients: enhancedData.ingredients,
                    cosmicScore: enhancedData.cosmicScore,
                    cosmicClarity: enhancedData.cosmicClarity,
                    transparencyLevel: enhancedData.transparencyLevel,
                    suspiciousIngredients: enhancedData.suspiciousIngredients,
                    lastAnalyzed: new Date()
                  };

                  await storage.updateProduct(product.id, safeUpdateData);
                  enhancedCount++;
                  logger.info('general', `Enhanced product: ${product.name}`);
                }
              }
            }

            // Add delay to be respectful to APIs
            await new Promise(resolve => setTimeout(resolve, 200));

          }

        } catch (productError) {
          logger.error('general', `Error processing product ${product.id}: ${productError}`);
          continue;
        }
      }

      logger.info('general', `Product database update complete. Enhanced: ${enhancedCount} out of ${allProducts.length} products`);
      
      return {
        total: allProducts.length,
        enhanced: enhancedCount,
        message: "Limited update completed - processing first 50 products with barcodes"
      };

    } catch (error) {
      logger.error('general', `Error updating product database: ${error}`);
      throw error;
    }
  }

  // Helper methods for parsing Open Pet Food Facts data

  private extractBrand(brands?: string): string {
    if (!brands) return "Unknown Brand";
    return brands.split(',')[0].trim();
  }

  private determineCategory(categories: string[]): string {
    const categoryMap: { [key: string]: string } = {
      'treat': 'pet-treats',
      'snack': 'pet-treats', 
      'toy': 'pet-toys',
      'accessory': 'pet-accessories',
      'food': 'pet-food',
      'kibble': 'pet-food',
      'wet-food': 'pet-food',
      'dry-food': 'pet-food'
    };

    for (const category of categories) {
      const lower = category.toLowerCase();
      for (const [key, value] of Object.entries(categoryMap)) {
        if (lower.includes(key)) {
          return value;
        }
      }
    }

    return 'pet-food'; // Default category
  }

  private calculateCosmicScore(product: OpenPetFoodFactsProduct): number {
    let score = 60; // Base score

    // Ingredient information availability
    if (product.ingredients_text && product.ingredients_text.length > 50) score += 15;
    
    // Nutritional information
    if (product.nutriments && Object.keys(product.nutriments).length > 5) score += 10;
    
    // Labels and certifications
    if (product.labels_tags && product.labels_tags.length > 0) score += 8;
    
    // Image availability
    if (product.image_url) score += 5;
    
    // Nutrition grade
    if (product.nutrition_grade) {
      const gradeScore: { [key: string]: number } = { 'a': 10, 'b': 8, 'c': 5, 'd': 2, 'e': 0 };
      score += gradeScore[product.nutrition_grade.toLowerCase()] || 0;
    }
    
    // NOVA group (food processing level)
    if (product.nova_group) {
      const novaScore = [10, 8, 5, 2][product.nova_group - 1] || 0;
      score += novaScore;
    }

    return Math.min(score, 95); // Cap at 95
  }

  private analyzeIngredients(ingredients: string) {
    const suspicious: string[] = [];
    const dangerous: string[] = [];
    
    const ingredientsLower = ingredients.toLowerCase();
    
    // Check for problematic ingredients
    const suspiciousTerms = [
      'by-product', 'meal', 'corn syrup', 'bha', 'bht', 'ethoxyquin',
      'propylene glycol', 'carrageenan', 'sodium nitrite'
    ];
    
    const dangerousTerms = [
      'xylitol', 'chocolate', 'onion', 'garlic', 'grapes', 'raisins',
      'macadamia', 'artificial sweetener'
    ];

    suspiciousTerms.forEach(term => {
      if (ingredientsLower.includes(term)) {
        suspicious.push(term);
      }
    });

    dangerousTerms.forEach(term => {
      if (ingredientsLower.includes(term)) {
        dangerous.push(term);
      }
    });

    return { suspicious, dangerous };
  }

  private determineCosmicClarity(ingredientAnalysis: any, product: OpenPetFoodFactsProduct): string {
    if (ingredientAnalysis.dangerous.length > 0) return 'cursed';
    if (ingredientAnalysis.suspicious.length > 3) return 'questionable';
    if (ingredientAnalysis.suspicious.length > 0) return 'neutral';
    
    // Consider nutrition grade
    if (product.nutrition_grade === 'a' || product.nutrition_grade === 'b') return 'blessed';
    if (product.nutrition_grade === 'e') return 'questionable';
    
    return 'neutral';
  }

  private getTransparencyLevel(product: OpenPetFoodFactsProduct): string {
    let score = 0;
    
    if (product.ingredients_text && product.ingredients_text.length > 100) score += 2;
    if (product.nutriments && Object.keys(product.nutriments).length > 10) score += 2;
    if (product.labels_tags && product.labels_tags.length > 3) score += 1;
    if (product.image_url) score += 1;
    if (product.nutrition_grade) score += 1;
    
    if (score >= 6) return 'excellent';
    if (score >= 4) return 'good';
    if (score >= 2) return 'fair';
    return 'poor';
  }

  private generateDescription(product: OpenPetFoodFactsProduct): string {
    const name = product.product_name || 'Pet product';
    const brand = this.extractBrand(product.brands);
    
    let description = `${name} by ${brand}`;
    
    if (product.ingredients_text) {
      description += ` with detailed ingredient analysis from Open Pet Food Facts database`;
    }
    
    if (product.nutrition_grade) {
      description += `. Nutrition grade: ${product.nutrition_grade.toUpperCase()}`;
    }
    
    return description;
  }

  private extractTargetSpecies(product: OpenPetFoodFactsProduct): string[] {
    const categories = product.categories_tags || [];
    const species: string[] = [];
    
    categories.forEach(category => {
      const lower = category.toLowerCase();
      if (lower.includes('dog') || lower.includes('canine')) species.push('dog');
      if (lower.includes('cat') || lower.includes('feline')) species.push('cat');
      if (lower.includes('bird')) species.push('bird');
      if (lower.includes('fish')) species.push('fish');
      if (lower.includes('rabbit')) species.push('rabbit');
      if (lower.includes('hamster')) species.push('hamster');
    });
    
    return species.length > 0 ? species : ['pet'];
  }

  private extractAllergens(allergenTags: string[]): string[] {
    return allergenTags.map(tag => tag.replace('en:', '').replace('-', ' '));
  }

  private extractAdditives(additiveTags: string[]): string[] {
    return additiveTags.map(tag => tag.replace('en:', ''));
  }

  private extractCountries(countryTags: string[]): string[] {
    return countryTags.map(tag => tag.replace('en:', ''));
  }

  private extractStores(storeTags: string[]): string[] {
    return storeTags.map(tag => tag.replace('en:', ''));
  }
}

// Export singleton instance
export const openPetFoodFactsService = new OpenPetFoodFactsService();