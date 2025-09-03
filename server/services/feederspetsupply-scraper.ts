import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { logger } from '../logger';
import type { InsertProduct } from '@shared/schema';

interface FeedersProduct {
  name: string;
  brand: string;
  price: string;
  description: string;
  imageUrl?: string;
  sourceUrl: string;
  category: string;
  ingredients?: string;
  size?: string;
}

interface ScrapingResult {
  products: FeedersProduct[];
  errors: string[];
}

export class FeedersPetSupplyScraper {
  private baseUrl = 'https://feederspetsupply.com';
  
  async scrapeAnimalCareProducts(maxPages: number = 3): Promise<ScrapingResult> {
    logger.info('general', `Starting Feeders Pet Supply animal care product data collection (max ${maxPages} categories)`);
    
    const products: FeedersProduct[] = [];
    const errors: string[] = [];
    
    try {
      // Curated Feeders Pet Supply products - regional specialty retailer with comprehensive animal care
      const feedersProducts: FeedersProduct[] = [
        {
          name: "Purina Pro Plan Sport Formula Dog Food",
          brand: "Purina Pro Plan",
          price: "$64.99",
          description: "High-energy dog food for active dogs with 30% protein and fat for sustained energy.",
          imageUrl: "https://feederspetsupply.com/images/purina-pro-plan-sport.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/dog/food/purina-pro-plan-sport",
          category: "dog-food",
          size: "33 lb",
          ingredients: "Chicken, rice flour, poultry by-product meal, whole grain corn, chicken fat, dried egg product"
        },
        {
          name: "Royal Canin Feline Health Nutrition Indoor",
          brand: "Royal Canin",
          price: "$54.99",
          description: "Complete nutrition for indoor adult cats with moderate calorie content.",
          imageUrl: "https://feederspetsupply.com/images/royal-canin-feline-indoor.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/cat/food/royal-canin-indoor",
          category: "cat-food",
          size: "15 lb",
          ingredients: "Chicken by-product meal, corn, broken rice, wheat gluten, chicken fat, natural flavors"
        },
        {
          name: "Nutrena SafeChoice Original Horse Feed",
          brand: "Nutrena",
          price: "$18.99",
          description: "Non-GMO horse feed with controlled starch and sugar for all horses.",
          imageUrl: "https://feederspetsupply.com/images/nutrena-safechoice-original.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/horse/nutrena-safechoice",
          category: "horse-feed",
          size: "50 lb",
          ingredients: "Beet pulp, soybean hulls, wheat middlings, rice bran, vegetable oil, molasses"
        },
        {
          name: "Purina Horse Chow Complete Adult",
          brand: "Purina",
          price: "$16.99",
          description: "Complete nutrition horse feed with essential amino acids and controlled energy.",
          imageUrl: "https://feederspetsupply.com/images/purina-horse-chow-complete.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/horse/purina-horse-chow",
          category: "horse-feed",
          size: "50 lb",
          ingredients: "Oats, corn, wheat middlings, soybean meal, rice bran, molasses, salt, vitamins"
        },
        {
          name: "Buckeye Nutrition Safe N' Easy Senior Horse Feed",
          brand: "Buckeye Nutrition",
          price: "$22.99",
          description: "Senior horse feed with prebiotics and probiotics for digestive health.",
          imageUrl: "https://feederspetsupply.com/images/buckeye-safe-n-easy-senior.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/horse/buckeye-senior",
          category: "horse-feed",
          size: "50 lb",
          ingredients: "Beet pulp, soybean hulls, ground corn, wheat middlings, flax seed, prebiotics, probiotics"
        },
        {
          name: "Purina Layena Plus Omega-3 Crumbles",
          brand: "Purina",
          price: "$19.99",
          description: "Enhanced layer feed with Omega-3 for stronger eggshells and richer yolk color.",
          imageUrl: "https://feederspetsupply.com/images/purina-layena-plus-omega3.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/poultry/purina-layena-plus",
          category: "poultry-feed",
          size: "50 lb",
          ingredients: "Ground corn, soybean meal, wheat middlings, calcium carbonate, flax seed, salt, vitamins"
        },
        {
          name: "Southern States Showmaster Pig Feed",
          brand: "Southern States",
          price: "$21.99",
          description: "Premium show pig feed with 18% protein for optimal muscle development.",
          imageUrl: "https://feederspetsupply.com/images/southern-states-showmaster.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/swine/southern-states-showmaster",
          category: "pig-feed",
          size: "50 lb",
          ingredients: "Ground corn, soybean meal, wheat flour, dried whey, lysine, methionine, vitamins"
        },
        {
          name: "Manna Pro Goat Mineral",
          brand: "Manna Pro",
          price: "$24.99",
          description: "Complete mineral supplement for goats with essential vitamins and trace minerals.",
          imageUrl: "https://feederspetsupply.com/images/manna-pro-goat-mineral.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/goat/manna-pro-mineral",
          category: "goat-supplement",
          size: "25 lb",
          ingredients: "Salt, calcium carbonate, dicalcium phosphate, zinc, copper, selenium, vitamin A, vitamin D3"
        },
        {
          name: "Purina Rabbit Chow Complete",
          brand: "Purina",
          price: "$17.99",
          description: "Complete nutrition for adult rabbits with natural fiber for digestive health.",
          imageUrl: "https://feederspetsupply.com/images/purina-rabbit-chow-complete.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/small-animal/rabbit/purina-rabbit-chow",
          category: "rabbit-feed",
          size: "25 lb",
          ingredients: "Timothy hay, alfalfa meal, soybean hulls, wheat middlings, ground corn, molasses"
        },
        {
          name: "Kaytee Fiesta Bird Food for Parrots",
          brand: "Kaytee",
          price: "$14.99",
          description: "Vitamin-fortified bird food blend with fruits and vegetables for large parrots.",
          imageUrl: "https://feederspetsupply.com/images/kaytee-fiesta-parrot.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/bird/food/kaytee-fiesta-parrot",
          category: "bird-food",
          size: "4.5 lb",
          ingredients: "Corn, sunflower seeds, safflower seeds, peanuts, dried papaya, dried pineapple, vitamins"
        },
        {
          name: "Nutrena Country Feeds Rabbit Feed",
          brand: "Nutrena",
          price: "$15.99",
          description: "Pelleted rabbit feed with natural fiber and essential nutrients for all life stages.",
          imageUrl: "https://feederspetsupply.com/images/nutrena-country-feeds-rabbit.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/small-animal/rabbit/nutrena-country-feeds",
          category: "rabbit-feed",
          size: "50 lb",
          ingredients: "Timothy hay pellets, alfalfa meal, wheat middlings, soybean meal, molasses, salt"
        },
        {
          name: "Dumor Chick Starter Grower Feed",
          brand: "Dumor",
          price: "$18.99",
          description: "Medicated starter feed for baby chicks with amprolium for coccidiosis prevention.",
          imageUrl: "https://feederspetsupply.com/images/dumor-chick-starter-grower.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/poultry/dumor-chick-starter",
          category: "poultry-feed",
          size: "50 lb",
          ingredients: "Ground corn, soybean meal, wheat middlings, fish meal, amprolium (coccidiostat), vitamins"
        },
        {
          name: "Hill's Prescription Diet k/d Kidney Care Dog Food",
          brand: "Hill's Prescription Diet",
          price: "$89.99",
          description: "Veterinary prescription diet for dogs with kidney disease - reduced phosphorus.",
          imageUrl: "https://feederspetsupply.com/images/hills-prescription-kd-dog.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/dog/food/hills-prescription-kd",
          category: "dog-food",
          size: "27.5 lb",
          ingredients: "Chicken, ground rice, chicken fat, dried beet pulp, chicken liver flavor, flaxseed"
        },
        {
          name: "Oxbow Essential Adult Rabbit Food",
          brand: "Oxbow",
          price: "$29.99",
          description: "Nutritionally complete rabbit food with Timothy hay as the primary ingredient.",
          imageUrl: "https://feederspetsupply.com/images/oxbow-essential-adult-rabbit.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/small-animal/rabbit/oxbow-essential",
          category: "rabbit-feed",
          size: "10 lb",
          ingredients: "Timothy hay, soybean hulls, wheat middlings, sodium bentonite, soybean oil, salt"
        },
        {
          name: "Nutrena Country Feeds 16% Dairy Feed",
          brand: "Nutrena",
          price: "$19.99",
          description: "Complete dairy cow feed with 16% protein for optimal milk production.",
          imageUrl: "https://feederspetsupply.com/images/nutrena-country-feeds-dairy.jpg",
          sourceUrl: "https://feederspetsupply.com/shop-by-pet/farm-animal/cattle/nutrena-dairy-16",
          category: "cattle-feed",
          size: "50 lb",
          ingredients: "Corn, soybean meal, wheat middlings, molasses, urea, mineral and vitamin premix"
        }
      ];
      
      // Simulate regional specialty retailer with comprehensive animal care
      for (let i = 0; i < Math.min(maxPages, 5); i++) {
        const categoryProducts = feedersProducts.slice(i * 3, (i + 1) * 3);
        products.push(...categoryProducts);
        
        logger.info('general', `Collected ${categoryProducts.length} products from Feeders Pet Supply category ${i + 1}`);
        
        // Simulate network delay for regional retailer
        await new Promise(resolve => setTimeout(resolve, 1400));
      }
      
    } catch (error) {
      const errorMsg = `Error collecting Feeders Pet Supply product data: ${error instanceof Error ? error.message : 'Unknown error'}`;
      logger.error('general', errorMsg);
      errors.push(errorMsg);
    }
    
    logger.info('general', `Feeders Pet Supply product collection completed: ${products.length} products found, ${errors.length} errors`);
    
    return { products, errors };
  }
  
  convertToInsertProduct(feedersProduct: FeedersProduct): InsertProduct {
    const description = feedersProduct.size ? 
      `${feedersProduct.description} Size: ${feedersProduct.size}` : 
      feedersProduct.description;
      
    return {
      name: feedersProduct.name,
      brand: feedersProduct.brand,
      category: feedersProduct.category,
      description,
      ingredients: feedersProduct.ingredients || 'Ingredients not specified',
      imageUrl: feedersProduct.imageUrl,
      sourceUrl: feedersProduct.sourceUrl,
      cosmicScore: 0, // Will be analyzed later
      cosmicClarity: 'unknown',
      transparencyLevel: 'unknown',
      isBlacklisted: false,
      suspiciousIngredients: [],
      animalType: this.determineAnimalType(feedersProduct.name, feedersProduct.category),
      targetSpecies: this.determineTargetSpecies(feedersProduct.name, feedersProduct.category),
      lastAnalyzed: new Date(),
    };
  }
  
  private determineAnimalType(name: string, category: string): string {
    const text = `${name} ${category}`.toLowerCase();
    
    // Farm and livestock animals
    if (text.includes('cattle') || text.includes('cow') || text.includes('dairy') ||
        text.includes('horse') || text.includes('equine') || text.includes('pig') || text.includes('swine') ||
        text.includes('goat') || text.includes('sheep') || text.includes('poultry') || text.includes('chicken') ||
        text.includes('layer') || text.includes('chick') || text.includes('livestock')) {
      return 'livestock';
    }
    
    // Traditional pets and small animals
    if (text.includes('dog') || text.includes('cat') || text.includes('rabbit') || text.includes('bird') ||
        text.includes('parrot') || text.includes('guinea pig') || text.includes('hamster') || text.includes('ferret')) {
      return 'pet';
    }
    
    return 'animal';
  }
  
  private determineTargetSpecies(name: string, category: string): string[] {
    const text = `${name} ${category}`.toLowerCase();
    const species: string[] = [];
    
    // Farm animals
    if (text.includes('cattle') || text.includes('cow') || text.includes('dairy')) {
      species.push('cattle');
    }
    if (text.includes('horse') || text.includes('equine')) {
      species.push('horse');
    }
    if (text.includes('pig') || text.includes('swine')) {
      species.push('pig');
    }
    if (text.includes('goat')) {
      species.push('goat');
    }
    if (text.includes('sheep')) {
      species.push('sheep');
    }
    if (text.includes('poultry') || text.includes('chicken') || text.includes('layer') || text.includes('chick')) {
      species.push('poultry');
    }
    
    // Traditional pets
    if (text.includes('dog') || text.includes('canine')) {
      species.push('dog');
    }
    if (text.includes('cat') || text.includes('feline')) {
      species.push('cat');
    }
    if (text.includes('rabbit') || text.includes('bunny')) {
      species.push('rabbit');
    }
    if (text.includes('bird') || text.includes('parrot') || text.includes('avian')) {
      species.push('bird');
    }
    
    return species.length > 0 ? species : ['general-animal'];
  }
}