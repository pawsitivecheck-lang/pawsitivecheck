import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { analyzeProductSafety, generateProductGuidance, enhanceRecallInformation } from "./ai-service";
import { 
  insertProductSchema, 
  insertProductReviewSchema, 
  insertProductRecallSchema,
  insertIngredientBlacklistSchema,
  insertScanHistorySchema,
  insertPetProfileSchema,
  insertSavedProductSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public endpoint to seed sample products for search testing
  app.post('/api/seed-products', async (req, res) => {
    try {
      const sampleProducts = [
        {
          name: "Blue Buffalo Chicken & Rice Dog Food",
          brand: "Blue Buffalo",
          category: "pet-food",
          description: "Natural dog food made with real chicken, brown rice and vegetables",
          ingredients: "Deboned chicken, chicken meal, brown rice, barley, oatmeal, natural flavor",
          barcode: "012345678901",
          cosmicScore: 85,
          cosmicClarity: 'blessed',
          transparencyLevel: 'excellent',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        },
        {
          name: "Purina Pro Plan Cat Food",
          brand: "Purina",
          category: "pet-food", 
          description: "High protein dry cat food with real salmon",
          ingredients: "Salmon, rice flour, poultry by-product meal, corn protein meal, beef fat",
          barcode: "012345678902",
          cosmicScore: 72,
          cosmicClarity: 'blessed',
          transparencyLevel: 'good',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        },
        {
          name: "Greenies Dog Dental Treats",
          brand: "Greenies",
          category: "pet-treats",
          description: "Dental chews that clean teeth and freshen breath",
          ingredients: "Wheat flour, wheat protein isolate, glycerin, gelatin, water, natural flavors",
          barcode: "012345678903",
          cosmicScore: 78,
          cosmicClarity: 'blessed',
          transparencyLevel: 'good',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        },
        {
          name: "Kong Classic Dog Toy",
          brand: "Kong",
          category: "pet-toys",
          description: "Durable rubber toy for stuffing treats, made in USA",
          ingredients: "Natural rubber",
          barcode: "012345678906",
          cosmicScore: 95,
          cosmicClarity: 'blessed',
          transparencyLevel: 'excellent',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        }
      ];

      let added = 0;
      for (const product of sampleProducts) {
        try {
          const existing = await storage.getProductByBarcode(product.barcode);
          if (!existing) {
            await storage.createProduct(product);
            added++;
          }
        } catch (error) {
          // Product might already exist, skip
        }
      }

      res.json({ message: `Added ${added} sample products for search testing` });
    } catch (error) {
      console.error("Error seeding products:", error);
      res.status(500).json({ message: "Failed to seed products" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { limit = '50', offset = '0', search } = req.query;
      let products = await storage.getProducts(
        parseInt(limit as string), 
        parseInt(offset as string),
        search as string
      );
      
      // If searching and we have few results, supplement with Open Pet Food Facts
      if (search && typeof search === 'string' && search.trim().length >= 2 && products.length < 10) {
        try {
          const response = await fetch(`https://world.openpetfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(search.trim())}&page_size=10&json=1`, {
            headers: {
              'User-Agent': 'PawsitiveCheck - Version 1.0 - https://pawsitivecheck.replit.app'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.products && data.products.length > 0) {
              // Convert Open Pet Food Facts products to our format
              const openFoodFactsProducts = await Promise.all(
                data.products.slice(0, 5).map(async (product: any) => {
                  // Check if product already exists in our database
                  let existingProduct = null;
                  if (product.code) {
                    existingProduct = await storage.getProductByBarcode(product.code);
                  }
                  
                  if (existingProduct) {
                    return existingProduct; // Return existing product instead of creating duplicate
                  }
                  
                  // Calculate cosmic score based on available data quality
                  let cosmicScore = 60;
                  if (product.ingredients_text) cosmicScore += 15;
                  if (product.nutriments && Object.keys(product.nutriments).length > 5) cosmicScore += 10;
                  if (product.labels_tags && product.labels_tags.length > 0) cosmicScore += 10;
                  if (product.image_url) cosmicScore += 5;
                  
                  // Determine category
                  let category = 'pet-food';
                  const categories = product.categories_tags || [];
                  if (categories.some((cat: string) => cat.includes('treat') || cat.includes('snack'))) {
                    category = 'pet-treats';
                  } else if (categories.some((cat: string) => cat.includes('toy'))) {
                    category = 'pet-toys';
                  }
                  
                  // Check for suspicious ingredients
                  const suspiciousIngredients = [];
                  const ingredients = product.ingredients_text?.toLowerCase() || '';
                  if (ingredients.includes('by-product')) suspiciousIngredients.push('by-product meal');
                  if (ingredients.includes('corn syrup')) suspiciousIngredients.push('corn syrup');
                  if (ingredients.includes('artificial')) suspiciousIngredients.push('artificial additives');
                  
                  const productData = {
                    name: product.product_name || product.generic_name || `Pet Product ${product.code || 'Unknown'}`,
                    brand: product.brands || "Unknown Brand",
                    category,
                    description: product.ingredients_text ? 
                      `Pet food from Open Pet Food Facts with detailed ingredient analysis` : 
                      `Pet product from Open Pet Food Facts database`,
                    ingredients: product.ingredients_text || "Ingredients not specified",
                    imageUrl: product.image_url || null,
                    barcode: product.code || `opff-${Math.random().toString(36).substring(7)}`,
                    cosmicScore: Math.min(cosmicScore, 95),
                    cosmicClarity: suspiciousIngredients.length === 0 ? 'blessed' : 
                                  suspiciousIngredients.length <= 2 ? 'neutral' : 'questionable',
                    transparencyLevel: product.ingredients_text ? 'excellent' : 'good',
                    isBlacklisted: false,
                    suspiciousIngredients,
                    lastAnalyzed: new Date(),
                  };
                  
                  // Add to our database for future searches
                  try {
                    return await storage.createProduct(productData);
                  } catch (error) {
                    // Return the product data even if we can't save it
                    return { id: Math.random(), ...productData };
                  }
                })
              );
              
              // Add Open Pet Food Facts products to results (avoid duplicates)
              const existingBarcodes = new Set(products.map(p => p.barcode));
              const newProducts = openFoodFactsProducts.filter(p => 
                p && !existingBarcodes.has(p.barcode)
              );
              
              products = [...products, ...newProducts];
            }
          }
        } catch (error) {
          console.error('Open Pet Food Facts search error:', error);
          // Continue with local results only
        }
      }
      
      // Auto-populate database with sample products if empty
      if (products.length === 0 && !search) {
        const sampleProducts = [
          // TOP DOG FOODS - Market Leaders 2024
          {
            name: "Purina Pro Plan Adult Dog Food - Chicken & Rice",
            brand: "Purina Pro Plan",
            category: "pet-food",
            description: "Veterinary-recommended nutrition with real chicken as first ingredient",
            ingredients: "Chicken, rice, corn protein meal, poultry by-product meal, beef fat, natural flavor",
            barcode: "012345678901",
            cosmicScore: 82,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal'],
            lastAnalyzed: new Date(),
          },
          {
            name: "Blue Buffalo Life Protection Formula Adult Dog Food",
            brand: "Blue Buffalo", 
            category: "pet-food",
            description: "Natural dog food with deboned chicken and sweet potatoes",
            ingredients: "Deboned chicken, chicken meal, brown rice, barley, oatmeal, natural flavor",
            barcode: "012345678902",
            cosmicScore: 88,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Hill's Science Diet Adult Dog Food",
            brand: "Hill's Science Diet",
            category: "pet-food", 
            description: "Clinically proven nutrition for adult dogs with chicken meal",
            ingredients: "Chicken meal, cracked pearled barley, whole grain wheat, corn protein meal",
            barcode: "012345678903",
            cosmicScore: 85,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Royal Canin Medium Adult Dry Dog Food",
            brand: "Royal Canin",
            category: "pet-food",
            description: "Breed-specific nutrition for medium-sized dogs",
            ingredients: "Chicken by-product meal, brewers rice, corn, wheat, chicken fat",
            barcode: "012345678904",
            cosmicScore: 75,
            cosmicClarity: 'neutral' as const,
            transparencyLevel: 'good' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal', 'corn'],
            lastAnalyzed: new Date(),
          },
          // TOP CAT FOODS
          {
            name: "Hill's Science Diet Adult Indoor Cat Food",
            brand: "Hill's Science Diet",
            category: "pet-food",
            description: "Veterinary-recommended indoor cat formula with chicken",
            ingredients: "Chicken, brewers rice, corn protein meal, chicken liver flavor",
            barcode: "012345678905",
            cosmicScore: 83,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Purina Pro Plan Savor Adult Cat Food",
            brand: "Purina Pro Plan", 
            category: "pet-food",
            description: "High-protein cat food with real salmon",
            ingredients: "Salmon, rice flour, poultry by-product meal, corn protein meal, beef fat",
            barcode: "012345678906",
            cosmicScore: 78,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'good' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal'],
            lastAnalyzed: new Date(),
          },
          {
            name: "Royal Canin Feline Health Indoor Adult Cat Food",
            brand: "Royal Canin",
            category: "pet-food",
            description: "Indoor cat formula for healthy digestion and weight control",
            ingredients: "Chicken by-product meal, brewers rice, corn, wheat protein",
            barcode: "012345678907",
            cosmicScore: 72,
            cosmicClarity: 'neutral' as const,
            transparencyLevel: 'good' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal', 'corn'],
            lastAnalyzed: new Date(),
          },
          {
            name: "IAMS ProActive Health Adult Indoor Cat Food",
            brand: "IAMS",
            category: "pet-food",
            description: "Complete nutrition for indoor cats with real chicken",
            ingredients: "Chicken, chicken by-product meal, ground whole grain corn, brewers rice",
            barcode: "012345678908",
            cosmicScore: 74,
            cosmicClarity: 'neutral' as const,
            transparencyLevel: 'good' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal', 'corn'],
            lastAnalyzed: new Date(),
          },
          // TOP PET TREATS
          {
            name: "Greenies Original Dental Dog Treats",
            brand: "Greenies",
            category: "pet-treats",
            description: "Veterinarian-recommended dental chews that clean teeth",
            ingredients: "Wheat flour, wheat protein isolate, glycerin, gelatin, water, natural flavors",
            barcode: "012345678909",
            cosmicScore: 81,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'good' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Milk-Bone Original Dog Biscuits",
            brand: "Milk-Bone",
            category: "pet-treats",
            description: "Classic dog biscuits for daily treating and training",
            ingredients: "Wheat flour, beef meal, milk, salt, natural flavor, malted barley flour",
            barcode: "012345678910",
            cosmicScore: 68,
            cosmicClarity: 'neutral' as const,
            transparencyLevel: 'fair' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['beef meal'],
            lastAnalyzed: new Date(),
          },
          {
            name: "Temptations Classic Cat Treats - Chicken Flavor",
            brand: "Temptations",
            category: "pet-treats", 
            description: "Crunchy and soft cat treats cats can't resist",
            ingredients: "Chicken by-product meal, ground corn, animal fat, brewers rice",
            barcode: "012345678911",
            cosmicScore: 65,
            cosmicClarity: 'neutral' as const,
            transparencyLevel: 'fair' as const,
            isBlacklisted: false,
            suspiciousIngredients: ['by-product meal', 'corn'],
            lastAnalyzed: new Date(),
          },
          // TOP PET TOYS
          {
            name: "KONG Classic Dog Toy",
            brand: "KONG",
            category: "pet-toys",
            description: "Durable rubber toy perfect for stuffing treats, made in USA",
            ingredients: "Natural rubber",
            barcode: "012345678912",
            cosmicScore: 96,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "ZippyPaws Skinny Peltz Squeaky Plush Dog Toy",
            brand: "ZippyPaws",
            category: "pet-toys",
            description: "Soft squeaky plush toy for interactive play",
            ingredients: "Polyester fabric, polyester fill, squeaker",
            barcode: "012345678913",
            cosmicScore: 89,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Outward Hound Hide-A-Squirrel Puzzle Toy",
            brand: "Outward Hound",
            category: "pet-toys",
            description: "Interactive puzzle toy that keeps dogs mentally stimulated",
            ingredients: "Plush fabric, polyester fill, squeakers",
            barcode: "012345678914",
            cosmicScore: 92,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "West Paw Zogoflex Hurley Dog Bone",
            brand: "West Paw",
            category: "pet-toys",
            description: "Eco-friendly, durable dog bone made from recyclable material",
            ingredients: "Zogoflex (recyclable TPE)",
            barcode: "012345678915",
            cosmicScore: 94,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          // MORE PREMIUM OPTIONS
          {
            name: "Wellness CORE Grain-Free Original Dog Food",
            brand: "Wellness",
            category: "pet-food",
            description: "High-protein, grain-free dog food with deboned turkey",
            ingredients: "Deboned turkey, turkey meal, chicken meal, peas, potatoes",
            barcode: "012345678916",
            cosmicScore: 91,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          },
          {
            name: "Nutro Ultra Adult Dog Food",
            brand: "Nutro",
            category: "pet-food",
            description: "Natural dog food with a trio of proteins from chicken, lamb, and salmon",
            ingredients: "Chicken, chicken meal, whole brown rice, split peas, rice bran",
            barcode: "012345678917",
            cosmicScore: 86,
            cosmicClarity: 'blessed' as const,
            transparencyLevel: 'excellent' as const,
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          }
        ];

        // Add sample products to database
        for (const product of sampleProducts) {
          try {
            await storage.createProduct(product);
          } catch (error) {
            console.log(`Skipped product ${product.name}: might already exist`);
          }
        }

        // Fetch products again after adding samples
        products = await storage.getProducts(
          parseInt(limit as string), 
          parseInt(offset as string),
          search as string
        );
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found in the cosmic database" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get('/api/products/barcode/:barcode', async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const product = await storage.getProductByBarcode(barcode);
      if (!product) {
        return res.status(404).json({ message: "Product not found in cosmic records" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product by barcode:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Internet product search endpoint
  app.post('/api/products/internet-search', isAuthenticated, async (req: any, res) => {
    try {
      const { type, query } = req.body;
      
      if (type === 'barcode') {
        let productData = null;
        let source = 'mock';
        let message = 'Product discovered through cosmic internet divination';
        
        // Try Open Pet Food Facts API first (pet-specific database)
        try {
          const response = await fetch(`https://world.openpetfoodfacts.org/api/v2/product/${query}.json`, {
            headers: {
              'User-Agent': 'PawsitiveCheck - Version 1.0 - https://pawsitivecheck.replit.app'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.status === 1 && data.product) {
              const product = data.product;
              
              // Calculate cosmic score based on available data quality
              let cosmicScore = 60;
              if (product.ingredients_text) cosmicScore += 15;
              if (product.nutriments && Object.keys(product.nutriments).length > 5) cosmicScore += 10;
              if (product.labels_tags && product.labels_tags.length > 0) cosmicScore += 10;
              if (product.image_url) cosmicScore += 5;
              
              // Determine category
              let category = 'pet-food';
              const categories = product.categories_tags || [];
              if (categories.some((cat: string) => cat.includes('treat') || cat.includes('snack'))) {
                category = 'pet-treats';
              } else if (categories.some((cat: string) => cat.includes('toy'))) {
                category = 'pet-toys';
              } else if (categories.some((cat: string) => cat.includes('accessory'))) {
                category = 'pet-accessories';
              }
              
              // Check for suspicious ingredients
              const suspiciousIngredients = [];
              const ingredients = product.ingredients_text?.toLowerCase() || '';
              if (ingredients.includes('by-product')) suspiciousIngredients.push('by-product meal');
              if (ingredients.includes('corn syrup')) suspiciousIngredients.push('corn syrup');
              if (ingredients.includes('artificial')) suspiciousIngredients.push('artificial additives');
              
              productData = {
                name: product.product_name || product.generic_name || `Pet Product ${query}`,
                brand: product.brands || "Unknown Brand",
                category,
                description: product.ingredients_text ? 
                  `Pet food with detailed ingredient analysis from Open Pet Food Facts` : 
                  `Pet product from Open Pet Food Facts database`,
                ingredients: product.ingredients_text || "Ingredients not specified",
                imageUrl: product.image_url || null,
                barcode: query,
                cosmicScore: Math.min(cosmicScore, 95),
                cosmicClarity: suspiciousIngredients.length === 0 ? 'blessed' : 
                              suspiciousIngredients.length <= 2 ? 'neutral' : 'questionable',
                transparencyLevel: product.ingredients_text ? 'excellent' : 'good',
                isBlacklisted: false,
                suspiciousIngredients,
                lastAnalyzed: new Date(),
              };
              source = 'open-pet-food-facts';
              message = 'Pet product found in cosmic Open Pet Food Facts database';
            }
          }
        } catch (error) {
          console.error('Open Pet Food Facts API error:', error);
          // Continue to try other sources
        }
        
        // Try UPC Database API as fallback
        if (!productData && process.env.UPC_DATABASE_API_KEY) {
          try {
            const response = await fetch(`https://api.upcdatabase.org/product/${query}`, {
              headers: {
                'Authorization': `Bearer ${process.env.UPC_DATABASE_API_KEY}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              
              // Only accept pet-related products
              const isPetProduct = data.title && (
                data.title.toLowerCase().includes('dog') ||
                data.title.toLowerCase().includes('cat') ||
                data.title.toLowerCase().includes('pet') ||
                data.title.toLowerCase().includes('puppy') ||
                data.title.toLowerCase().includes('kitten') ||
                data.title.toLowerCase().includes('feline') ||
                data.title.toLowerCase().includes('canine') ||
                data.category?.toLowerCase().includes('pet')
              );
              
              if (isPetProduct) {
                // Determine category from title
                let category = 'pet-food';
                const title = data.title.toLowerCase();
                if (title.includes('toy') || title.includes('ball') || title.includes('rope')) {
                  category = 'pet-toys';
                } else if (title.includes('treat') || title.includes('snack')) {
                  category = 'pet-treats';
                } else if (title.includes('leash') || title.includes('collar') || title.includes('bed')) {
                  category = 'pet-accessories';
                }
                
                productData = {
                  name: data.title,
                  brand: data.brand || "Unknown Brand",
                  category,
                  description: data.description || `Pet product with barcode ${query}`,
                  ingredients: data.ingredients || "Ingredients not specified",
                  imageUrl: null,
                  barcode: query,
                  cosmicScore: Math.floor(Math.random() * 30) + 70, // Real products get higher scores
                  cosmicClarity: 'blessed',
                  transparencyLevel: 'good',
                  isBlacklisted: false,
                  suspiciousIngredients: [],
                  lastAnalyzed: new Date(),
                };
                source = 'upc-database';
                message = 'Pet product discovered through cosmic barcode divination';
              } else {
                // Not a pet product, return error
                return res.status(404).json({
                  message: 'Product found but not pet-related. PawsitiveCheck focuses on pet product safety.'
                });
              }
            }
          } catch (error) {
            console.error('UPC Database API error:', error);
            // Fall back to mock data
          }
        }
        
        // Fall back to mock data if API failed or no API key
        if (!productData) {
          productData = {
            name: `Internet Product ${query.slice(-4)}`,
            brand: "Global Pet Co",
            category: "pet-food",
            description: `Premium pet product discovered through internet divination. Barcode: ${query}`,
            ingredients: "Chicken, rice, vegetables, vitamins, minerals",
            imageUrl: null,
            barcode: query,
            cosmicScore: Math.floor(Math.random() * 50) + 50,
            cosmicClarity: Math.random() > 0.5 ? 'blessed' : 'questionable',
            transparencyLevel: 'good',
            isBlacklisted: false,
            suspiciousIngredients: [],
            lastAnalyzed: new Date(),
          };
          source = 'mock';
        }

        // Add to database
        const product = await storage.createProduct(productData);
        
        res.json({
          source,
          product,
          message
        });
        
      } else if (type === 'image') {
        // Mock image recognition - in production, this would integrate with:
        // - Google Vision API
        // - AWS Rekognition
        // - Custom ML models
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock image analysis result
        const mockProduct = {
          name: "Vision-Detected Pet Product",
          brand: "Mystical Vision Co",
          category: "pet-treats",
          description: "Product identified through cosmic vision analysis of uploaded image",
          ingredients: "Natural ingredients detected through visual analysis",
          imageUrl: query, // Store the analyzed image
          barcode: `IMG${Date.now()}`,
          cosmicScore: Math.floor(Math.random() * 40) + 60,
          cosmicClarity: Math.random() > 0.7 ? 'blessed' : 'questionable',
          transparencyLevel: 'good',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        };

        // Add to database
        const product = await storage.createProduct(mockProduct);
        
        res.json({
          source: 'image-recognition',
          product,
          message: 'Product identified through mystical image analysis'
        });
        
      } else {
        return res.status(400).json({ message: 'Invalid search type' });
      }
      
    } catch (error) {
      console.error("Error in internet product search:", error);
      res.status(500).json({ message: "Failed to search cosmic internet" });
    }
  });

  // Mystical product analysis
  app.post('/api/products/:id/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found in cosmic realm" });
      }

      // Use AI analysis first
      const aiAnalysis = await analyzeProductSafety({
        name: product.name,
        brand: product.brand,
        ingredients: product.ingredients || 'Not specified',
        category: product.category,
        description: product.description || ''
      });

      // Generate user guidance
      const guidance = await generateProductGuidance(aiAnalysis);

      // Combine with existing blacklist logic for additional safety
      const blacklistedIngredients = await storage.getBlacklistedIngredients();
      const additionalSuspicious: string[] = [];
      let scoreAdjustment = 0;
      
      // Check for blacklisted ingredients
      for (const blacklisted of blacklistedIngredients) {
        if (product.ingredients.toLowerCase().includes(blacklisted.ingredientName.toLowerCase())) {
          additionalSuspicious.push(blacklisted.ingredientName);
          if (blacklisted.severity === 'high') scoreAdjustment -= 20;
          else if (blacklisted.severity === 'medium') scoreAdjustment -= 10;
          else scoreAdjustment -= 5;
        }
      }

      // Combine AI analysis with blacklist adjustments
      const finalScore = Math.max(0, Math.min(100, aiAnalysis.cosmicScore + scoreAdjustment));
      const allSuspiciousIngredients = Array.from(new Set([...aiAnalysis.suspiciousIngredients, ...additionalSuspicious]));

      const analysis = {
        cosmicScore: finalScore,
        cosmicClarity: finalScore >= 80 ? 'blessed' : finalScore >= 50 ? 'questionable' : 'cursed',
        transparencyLevel: aiAnalysis.transparencyLevel,
        suspiciousIngredients: allSuspiciousIngredients,
        disposalInstructions: aiAnalysis.disposalInstructions,
        userGuidance: guidance,
        lastAnalyzed: new Date(),
      };

      const updatedProduct = await storage.updateProductAnalysis(id, analysis);
      res.json({
        product: updatedProduct,
        analysis: {
          ...analysis,
          aleisterVerdict: analysis.cosmicClarity === 'blessed' ? "The ingredients sing with purity" :
                          analysis.cosmicClarity === 'questionable' ? "The shadows hide much" :
                          "Banish this from your realm!",
          severusVerdict: analysis.cosmicClarity === 'blessed' ? "Cosmic clarity achieved" :
                         analysis.cosmicClarity === 'questionable' ? "Proceed with caution" :
                         "Dark forces detected"
        }
      });
    } catch (error) {
      console.error("Error analyzing product:", error);
      res.status(500).json({ message: "Mystical analysis failed" });
    }
  });

  // Product reviews
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/products/:id/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const reviewData = insertProductReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // User reviews
  app.get('/api/user/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviews = await storage.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  // Recalls
  app.get('/api/recalls', async (req, res) => {
    try {
      const recalls = await storage.getActiveRecalls();
      res.json(recalls);
    } catch (error) {
      console.error("Error fetching recalls:", error);
      res.status(500).json({ message: "Failed to fetch cosmic warnings" });
    }
  });

  app.post('/api/recalls', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Only Audit Syndicate members can create recalls" });
      }

      const recallData = insertProductRecallSchema.parse(req.body);
      const recall = await storage.createRecall(recallData);
      res.status(201).json(recall);
    } catch (error) {
      console.error("Error creating recall:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recall data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recall" });
    }
  });

  // Ingredient blacklist
  app.get('/api/blacklist', async (req, res) => {
    try {
      const blacklist = await storage.getBlacklistedIngredients();
      res.json(blacklist);
    } catch (error) {
      console.error("Error fetching blacklist:", error);
      res.status(500).json({ message: "Failed to fetch cosmic blacklist" });
    }
  });

  app.post('/api/blacklist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Only Audit Syndicate members can modify the blacklist" });
      }

      const ingredientData = insertIngredientBlacklistSchema.parse({
        ...req.body,
        addedByUserId: userId
      });
      const ingredient = await storage.addIngredientToBlacklist(ingredientData);
      res.status(201).json(ingredient);
    } catch (error) {
      console.error("Error adding to blacklist:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add ingredient to blacklist" });
    }
  });

  // Scan history
  app.get('/api/scans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scans = await storage.getUserScanHistory(userId);
      res.json(scans);
    } catch (error) {
      console.error("Error fetching scan history:", error);
      res.status(500).json({ message: "Failed to fetch mystical scan history" });
    }
  });

  app.post('/api/scans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scanData = insertScanHistorySchema.parse({
        ...req.body,
        userId
      });
      const scan = await storage.createScanHistory(scanData);
      res.status(201).json(scan);
    } catch (error) {
      console.error("Error creating scan history:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record mystical scan" });
    }
  });

  // Admin analytics
  app.get('/api/admin/analytics', isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch cosmic analytics" });
    }
  });

  // Get Google Maps API key for frontend
  app.get('/api/google-maps-key', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Google Maps API key not configured' });
    }
    res.json({ key: apiKey });
  });

  // Veterinary search using Google Places API for nationwide coverage
  app.post('/api/vets/search', async (req, res) => {
    try {
      const { query, location, radius } = req.body;
      const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
      
      // Default search coordinates (Lansing, MI as user location)
      let lat = 42.3314;  // Lansing, MI coordinates
      let lng = -84.5467;
      
      // Convert radius from miles to meters (default 15 miles if not provided)
      const radiusInMiles = radius || 15;
      let searchRadius = Math.round(radiusInMiles * 1609.34); // Convert miles to meters
      
      // Always use GPS location when provided - this takes absolute priority
      if (location && location.lat && location.lng) {
        lat = location.lat;
        lng = location.lng;
      }

      // Try Google Places API first for nationwide coverage
      if (!googleApiKey) {
        console.warn('⚠️  Google Places API key not found, falling back to local data');
        throw new Error('Google API key not available');
      }

      try {
        // Step 1: Search for veterinary places with multiple approaches
        console.log(`🔍 Searching for veterinarians near ${lat}, ${lng} with radius ${searchRadius}m`);
        
        let searchData = { results: [] };
        
        // Try multiple search approaches to find veterinary offices
        const searchQueries = [
          // Primary veterinary care search
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&type=veterinary_care&key=${googleApiKey}`,
          // Text search for veterinarians
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=veterinarian+near+${lat},${lng}&radius=${searchRadius}&key=${googleApiKey}`,
          // Text search for animal hospitals
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=animal+hospital+near+${lat},${lng}&radius=${searchRadius}&key=${googleApiKey}`,
          // Text search for vet clinics
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=vet+clinic+near+${lat},${lng}&radius=${searchRadius}&key=${googleApiKey}`
        ];
        
        for (const searchUrl of searchQueries) {
          try {
            console.log(`Trying search: ${searchUrl.includes('nearbysearch') ? 'nearby veterinary_care' : searchUrl.includes('veterinarian') ? 'text search veterinarian' : searchUrl.includes('animal+hospital') ? 'text search animal hospital' : 'text search vet clinic'}`);
            
            const searchResponse = await fetch(searchUrl, {
              signal: AbortSignal.timeout(8000)
            });
            
            if (!searchResponse.ok) {
              console.warn(`Search failed with status ${searchResponse.status}`);
              continue;
            }
            
            const responseData = await searchResponse.json();
            
            if (responseData.results && responseData.results.length > 0) {
              console.log(`✅ Found ${responseData.results.length} results with this search`);
              searchData = responseData;
              break;
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            console.warn(`Search query failed:`, error.message);
            continue;
          }
        }
        
        console.log(`🏥 Google Places returned ${searchData.results?.length || 0} veterinary locations total`);
        
        if (!searchData.results || searchData.results.length === 0) {
          console.log('🔍 No veterinary results from Google Places after trying all search methods, using fallback');
          throw new Error('No results from Google Places');
        }
        
        // Step 2: Get detailed information for each place (in batches to avoid API limits)
        const detailedPractices = [];
        const maxResults = Math.min(searchData.results.length, 20); // Limit to prevent excessive API calls
        
        for (let i = 0; i < maxResults; i++) {
          const place = searchData.results[i];
          
          try {
            // Get place details including phone, website, hours, etc.
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,geometry,types,business_status&key=${googleApiKey}`;
            
            const detailsResponse = await fetch(detailsUrl, {
              signal: AbortSignal.timeout(5000) // 5 second timeout per request
            });
            
            if (!detailsResponse.ok) {
              console.warn(`Failed to get details for ${place.name}`);
              continue;
            }
            
            const detailsData = await detailsResponse.json();
            const details = detailsData.result;
            
            if (!details || details.business_status === 'CLOSED_PERMANENTLY') {
              console.log(`Skipping ${place.name} - permanently closed`);
              continue;
            }
            
            // Calculate accurate distance using Haversine formula
            const R = 3959; // Earth's radius in miles
            const placeLat = details.geometry?.location?.lat || place.geometry?.location?.lat;
            const placeLng = details.geometry?.location?.lng || place.geometry?.location?.lng;
            
            if (!placeLat || !placeLng) {
              console.warn(`No coordinates for ${place.name}`);
              continue;
            }
            
            const dLat = (placeLat - lat) * Math.PI / 180;
            const dLng = (placeLng - lng) * Math.PI / 180;
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            // Parse address components
            const addressParts = details.formatted_address ? details.formatted_address.split(', ') : ['Address not available'];
            const zipMatch = details.formatted_address?.match(/\\b(\\d{5})(?:-\\d{4})?\\b/);
            const stateMatch = details.formatted_address?.match(/\\b([A-Z]{2})\\b/);
            
            // Build services array based on Google place types and name
            const services = ['General Veterinary Care'];
            const nameAndTypes = `${details.name || place.name} ${(place.types || []).join(' ')}`.toLowerCase();
            
            if (nameAndTypes.includes('hospital') || nameAndTypes.includes('animal hospital')) {
              services.push('Advanced Diagnostics', 'Surgery', 'Emergency Care', 'X-rays');
            }
            if (nameAndTypes.includes('clinic')) {
              services.push('Wellness Exams', 'Vaccinations', 'Preventive Medicine');
            }
            if (nameAndTypes.includes('emergency') || nameAndTypes.includes('24')) {
              services.push('24/7 Emergency Services', 'Critical Care');
            }
            if (nameAndTypes.includes('dental')) {
              services.push('Dental Care');
            }
            if (nameAndTypes.includes('exotic')) {
              services.push('Exotic Pet Care');
            }
            
            // Build specialties
            const specialties = ['General Veterinary Care'];
            if (nameAndTypes.includes('small animal')) specialties.push('Small Animal Care');
            if (nameAndTypes.includes('large animal')) specialties.push('Large Animal Care');
            if (nameAndTypes.includes('equine')) specialties.push('Equine Care');
            if (nameAndTypes.includes('exotic')) specialties.push('Exotic Animal Care');
            if (nameAndTypes.includes('emergency')) specialties.push('Emergency Medicine');
            
            // Format hours
            let formattedHours = {
              'Monday': 'Call for hours',
              'Tuesday': 'Call for hours',
              'Wednesday': 'Call for hours',
              'Thursday': 'Call for hours',
              'Friday': 'Call for hours',
              'Saturday': 'Call for hours',
              'Sunday': 'Call for hours'
            };
            
            if (details.opening_hours?.weekday_text) {
              const dayMap: {[key: string]: string} = {
                'Monday': 'Monday',
                'Tuesday': 'Tuesday', 
                'Wednesday': 'Wednesday',
                'Thursday': 'Thursday',
                'Friday': 'Friday',
                'Saturday': 'Saturday',
                'Sunday': 'Sunday'
              };
              
              details.opening_hours.weekday_text.forEach((dayText: string) => {
                const parts = dayText.split(': ');
                if (parts.length === 2) {
                  const day = parts[0];
                  const hours = parts[1];
                  if (dayMap[day]) {
                    formattedHours[dayMap[day] as keyof typeof formattedHours] = hours === 'Closed' ? 'Closed' : hours;
                  }
                }
              });
            }
            
            const practice = {
              id: `google-${place.place_id}`,
              name: details.name || place.name,
              address: addressParts.length > 1 ? addressParts[0] : details.formatted_address || 'Address not available',
              city: addressParts.length > 2 ? addressParts[addressParts.length - 3] : 'City not specified',
              state: stateMatch ? stateMatch[1] : 'State not specified',
              zipCode: zipMatch ? zipMatch[1] : '',
              phone: details.formatted_phone_number || '(Contact for phone)',
              website: details.website || '',
              rating: Math.round((details.rating || 4.2) * 10) / 10,
              reviewCount: details.user_ratings_total || 0,
              services: Array.from(new Set(services)), // Remove duplicates
              hours: formattedHours,
              specialties: Array.from(new Set(specialties)), // Remove duplicates
              emergencyServices: nameAndTypes.includes('emergency') || nameAndTypes.includes('24'),
              distance: Math.round(distance * 10) / 10,
              latitude: placeLat,
              longitude: placeLng
            };
            
            detailedPractices.push(practice);
            console.log(`✅ Added: ${practice.name} (${practice.distance}mi away, ${practice.rating}⭐)`);
            
            // Small delay between API requests to avoid rate limiting
            if (i < maxResults - 1) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
          } catch (detailError) {
            console.warn(`Error getting details for ${place.name}:`, detailError);
            // Add basic info without details if coordinates available
            const placeLat = place.geometry?.location?.lat;
            const placeLng = place.geometry?.location?.lng;
            
            if (placeLat && placeLng) {
              const R = 3959;
              const dLat = (placeLat - lat) * Math.PI / 180;
              const dLng = (placeLng - lng) * Math.PI / 180;
              const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) * 
                Math.sin(dLng/2) * Math.sin(dLng/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              const distance = R * c;
              
              detailedPractices.push({
                id: `google-basic-${place.place_id}`,
                name: place.name,
                address: place.vicinity || 'Address not available',
                city: 'City not specified',
                state: 'State not specified',
                zipCode: '',
                phone: '(Contact for phone)',
                website: '',
                rating: Math.round((place.rating || 4.2) * 10) / 10,
                reviewCount: place.user_ratings_total || 0,
                services: ['General Veterinary Care'],
                hours: {
                  'Monday': 'Call for hours',
                  'Tuesday': 'Call for hours',
                  'Wednesday': 'Call for hours', 
                  'Thursday': 'Call for hours',
                  'Friday': 'Call for hours',
                  'Saturday': 'Call for hours',
                  'Sunday': 'Call for hours'
                },
                specialties: ['General Veterinary Care'],
                emergencyServices: false,
                distance: Math.round(distance * 10) / 10,
                latitude: placeLat,
                longitude: placeLng
              });
            }
          }
        }
        
        console.log(`🎯 Successfully processed ${detailedPractices.length} practices from Google Places`);
        let practices = detailedPractices;

        // If no Google Places results, fall back to local Lansing data for that area
        if (practices.length === 0 && Math.abs(lat - 42.3314) < 0.5 && Math.abs(lng + 84.5467) < 0.5) {
          console.log('🏥 No Google results for Lansing area, using local vet data');
          practices = [
          {
            id: 'lansing-1',
            name: 'Miller Animal Clinic',
            address: '6515 W. Saginaw Hwy',
            city: 'Lansing',
            state: 'MI',
            zipCode: '48917',
            phone: '(517) 321-6406',
            website: 'https://milleranimalclinic.com/',
            rating: 4.5,
            reviewCount: 189,
            services: ['General Veterinary Care', 'Surgery', 'Dental Care', 'Wellness Exams', 'Vaccinations'],
            hours: {
              'Monday': '8:00 AM - 7:00 PM',
              'Tuesday': '8:00 AM - 7:00 PM',
              'Wednesday': '8:00 AM - 6:00 PM',
              'Thursday': '8:00 AM - 7:00 PM',
              'Friday': '8:00 AM - 6:00 PM',
              'Saturday': '9:00 AM - 5:00 PM',
              'Sunday': 'Closed'
            },
            specialties: ['Small Animal Care', 'Over 70 Years Experience'],
            emergencyServices: false,
            distance: 3.2,
            latitude: 42.7025,
            longitude: -84.6891
          },
          {
            id: 'lansing-2',
            name: 'Eastside Animal Hospital',
            address: 'East Lansing Area',
            city: 'East Lansing',
            state: 'MI',
            zipCode: '48823',
            phone: '(517) 332-2511',
            website: 'https://eastsideanimalhospital.net/',
            rating: 4.7,
            reviewCount: 156,
            services: ['General Veterinary Care', 'Exotic Pet Care', 'Dental Care', 'X-rays', 'Surgery'],
            hours: {
              'Monday': '8:00 AM - 5:30 PM',
              'Tuesday': '8:00 AM - 5:30 PM',
              'Wednesday': '8:00 AM - 5:30 PM',
              'Thursday': '8:00 AM - 5:30 PM',
              'Friday': '8:00 AM - 5:30 PM',
              'Saturday': 'By Appointment',
              'Sunday': 'Closed'
            },
            specialties: ['Exotic Small Mammals', 'Pocket Pets', 'Established 1988'],
            emergencyServices: false,
            distance: 2.8,
            latitude: 42.7370,
            longitude: -84.4839
          },
          {
            id: 'lansing-3',
            name: 'Waverly Animal Hospital',
            address: '233 S Waverly Rd',
            city: 'Lansing',
            state: 'MI',
            zipCode: '48917',
            phone: '(517) 321-4508',
            website: 'https://www.waverlyanimalhospital.com/',
            rating: 4.3,
            reviewCount: 234,
            services: ['Veterinary Care', 'Boarding', 'Grooming', 'Dog Daycare', 'Wellness Exams'],
            hours: {
              'Monday': '8:00 AM - 6:00 PM',
              'Tuesday': '8:00 AM - 6:00 PM',
              'Wednesday': '8:00 AM - 6:00 PM',
              'Thursday': '8:00 AM - 6:00 PM',
              'Friday': '8:00 AM - 6:00 PM',
              'Saturday': '9:00 AM - 4:00 PM',
              'Sunday': 'Closed'
            },
            specialties: ['Full Service Hospital', 'Boarding & Grooming', 'Since 1962'],
            emergencyServices: false,
            distance: 2.1,
            latitude: 42.7228,
            longitude: -84.5547
          },
          {
            id: 'lansing-4',
            name: 'Pennsylvania Veterinary Care',
            address: '5438 S Pennsylvania Ave',
            city: 'Lansing',
            state: 'MI',
            zipCode: '48911',
            phone: '(517) 393-8010',
            website: 'https://www.pennvetcare.com/',
            rating: 4.6,
            reviewCount: 178,
            services: ['General Veterinary Care', 'Surgery', 'Digital X-Rays', 'Dental Care', 'Microchipping'],
            hours: {
              'Monday': '8:00 AM - 6:00 PM',
              'Tuesday': '7:00 AM - 6:00 PM',
              'Wednesday': '8:00 AM - 6:00 PM',
              'Thursday': '7:00 AM - 6:00 PM',
              'Friday': '8:00 AM - 2:00 PM',
              'Saturday': 'Closed',
              'Sunday': 'Closed'
            },
            specialties: ['Fear Free Certified', 'Regenerative Medicine', 'Since 1992'],
            emergencyServices: false,
            distance: 4.1,
            latitude: 42.6652,
            longitude: -84.5553
          },
          {
            id: 'lansing-5',
            name: 'Lake Lansing Road Animal Clinic',
            address: '1615 Lake Lansing Rd',
            city: 'Lansing',
            state: 'MI',
            zipCode: '48912',
            phone: '(517) 484-8031',
            website: 'https://lansingvetclinic.com/',
            rating: 4.4,
            reviewCount: 298,
            services: ['General Veterinary Care', 'Surgery', 'Dental Care', 'Wellness Exams', 'Medical Care'],
            hours: {
              'Monday': '8:00 AM - 5:30 PM',
              'Tuesday': '8:00 AM - 5:30 PM',
              'Wednesday': '8:00 AM - 5:30 PM',
              'Thursday': '8:00 AM - 5:30 PM',
              'Friday': '8:00 AM - 5:30 PM',
              'Saturday': '8:00 AM - 1:00 PM, 2:00 PM - 5:30 PM',
              'Sunday': 'Closed'
            },
            specialties: ['Full Service Hospital', 'Comprehensive Care', 'Since 1985'],
            emergencyServices: false,
            distance: 1.9,
            latitude: 42.7542,
            longitude: -84.5324
          },
          {
            id: 'lansing-6',
            name: 'Jolly Road Veterinary Hospital',
            address: '3276 E Jolly Rd',
            city: 'Lansing',
            state: 'MI',
            zipCode: '48910',
            phone: '(517) 977-1095',
            website: 'https://jollyrdveterinaryhospital.com/',
            rating: 4.2,
            reviewCount: 167,
            services: ['Medical Services', 'Preventive Medicine', 'Avian Medicine', 'Surgery', 'Exotic Pets'],
            hours: {
              'Monday': '8:00 AM - 5:30 PM',
              'Tuesday': '8:00 AM - 5:30 PM',
              'Wednesday': '10:00 AM - 7:00 PM',
              'Thursday': '8:00 AM - 5:30 PM',
              'Friday': '8:00 AM - 5:00 PM',
              'Saturday': 'Closed',
              'Sunday': 'Closed'
            },
            specialties: ['Avian Medicine', 'Exotic Pet Care', 'Family-Focused Care'],
            emergencyServices: false,
            distance: 3.4,
            latitude: 42.6825,
            longitude: -84.5102
          },
          {
            id: 'lansing-7',
            name: 'East Lansing Veterinary Clinic',
            address: 'East Lansing Area',
            city: 'East Lansing',
            state: 'MI',
            zipCode: '48823',
            phone: '(517) 351-8417',
            website: 'https://eastlansingvetclinic.com/',
            rating: 4.8,
            reviewCount: 245,
            services: ['Small Animal Care', 'Exotic Pet Care', 'Surgery', 'Acupuncture', 'Dermatology'],
            hours: {
              'Monday': '8:00 AM - 5:30 PM',
              'Tuesday': '8:00 AM - 5:30 PM',
              'Wednesday': '8:00 AM - 5:30 PM',
              'Thursday': '8:00 AM - 5:30 PM',
              'Friday': '8:00 AM - 5:30 PM',
              'Saturday': 'By Appointment',
              'Sunday': 'Closed'
            },
            specialties: ['Dogs & Cats', 'Exotic & Pocket Pets', 'Since 1970'],
            emergencyServices: false,
            distance: 2.6,
            latitude: 42.7360,
            longitude: -84.4755
          },
          {
            id: 'lansing-8',
            name: 'Abbott Road Animal Clinic',
            address: '6180 Abbott Road',
            city: 'East Lansing',
            state: 'MI',
            zipCode: '48823',
            phone: '(517) 351-6595',
            website: 'https://www.abbottroadanimalclinic.com/',
            rating: 4.5,
            reviewCount: 189,
            services: ['Medical Care', 'Surgery', 'Dental Care', 'Wellness Care', 'Vaccinations'],
            hours: {
              'Monday': '8:00 AM - 5:30 PM',
              'Tuesday': '8:00 AM - 5:30 PM',
              'Wednesday': '8:00 AM - 5:30 PM',
              'Thursday': '8:00 AM - 5:30 PM',
              'Friday': '8:00 AM - 5:30 PM',
              'Saturday': 'Closed',
              'Sunday': 'Closed'
            },
            specialties: ['Full Service Hospital', 'East Lansing & Surrounding Communities'],
            emergencyServices: false,
            distance: 3.1,
            latitude: 42.7280,
            longitude: -84.4655
          }
        ];
        }

        // Enhanced filtering by search query
        let filteredPractices = practices;
        if (query && query !== 'veterinarian' && query.trim().length > 0) {
          const searchTerms = query.toLowerCase().trim();
          filteredPractices = practices.filter((practice: any) => {
            // Multi-criteria scoring system
            let relevanceScore = 0;
            
            // Name match (highest priority)
            if (practice.name.toLowerCase().includes(searchTerms)) relevanceScore += 10;
            
            // Services match
            const serviceMatches = practice.services.filter((service: string) => 
              service.toLowerCase().includes(searchTerms)
            );
            relevanceScore += serviceMatches.length * 5;
            
            // Specialties match
            const specialtyMatches = practice.specialties.filter((specialty: string) => 
              specialty.toLowerCase().includes(searchTerms)
            );
            relevanceScore += specialtyMatches.length * 7;
            
            // Location match
            if (practice.city.toLowerCase().includes(searchTerms) || 
                practice.state.toLowerCase().includes(searchTerms)) {
              relevanceScore += 3;
            }
            
            // Emergency search priority
            if (searchTerms.includes('emergency') && practice.emergencyServices) {
              relevanceScore += 15;
            }
            
            practice.relevanceScore = relevanceScore;
            return relevanceScore > 0;
          });
          
          // Sort by relevance first, then distance
          filteredPractices.sort((a: any, b: any) => {
            const scoreDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (a.distance || 999) - (b.distance || 999);
          });
        } else {
          // Sort by distance and rating when no specific search
          filteredPractices.sort((a: any, b: any) => {
            const distanceWeight = a.distance || 999;
            const ratingBonus = (a.rating - 4.0) * 2; // Bonus for higher ratings
            const aScore = distanceWeight - ratingBonus;
            
            const bDistanceWeight = b.distance || 999;
            const bRatingBonus = (b.rating - 4.0) * 2;
            const bScore = bDistanceWeight - bRatingBonus;
            
            return aScore - bScore;
          });
        }

        res.json({
          practices: filteredPractices,
          total: filteredPractices.length,
          searchQuery: query || 'veterinarian',
          location: location || null,
          source: 'Google Places API'
        });

      } catch (googleError) {
        console.log("Google Places API failed, using fallback:", googleError);
        
        // For Lansing area, combine database and local data as fallback
        if (Math.abs(lat - 42.3314) < 0.5 && Math.abs(lng + 84.5467) < 0.5) {
          console.log('📍 Using detailed Lansing area veterinary data as fallback');
          
          // First get any database entries
          const dbOffices = await storage.getVeterinaryOffices();
          let allVets = [];
          
          // Add database veterinary offices with distance calculation
          if (dbOffices && dbOffices.length > 0) {
            console.log(`Found ${dbOffices.length} veterinary offices in database`);
            for (const office of dbOffices) {
              if (office.latitude && office.longitude) {
                // Calculate distance using Haversine formula
                const R = 3959; // Earth's radius in miles
                const dLat = (office.latitude - lat) * Math.PI / 180;
                const dLng = (office.longitude - lng) * Math.PI / 180;
                const a = 
                  Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(office.latitude * Math.PI / 180) * 
                  Math.sin(dLng/2) * Math.sin(dLng/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;
                
                // Only include if within radius
                if (distance <= radiusInMiles) {
                  allVets.push({
                    id: `db-${office.id}`,
                    name: office.name,
                    address: office.address,
                    city: office.city,
                    state: office.state,
                    zipCode: office.zipCode,
                    phone: office.phone,
                    website: office.website || '',
                    rating: office.rating || 4.2,
                    reviewCount: office.reviewCount || 0,
                    services: office.services || ['General Veterinary Care'],
                    hours: office.hours || {},
                    specialties: office.specialties || ['General Veterinary Care'],
                    emergencyServices: office.emergencyServices || false,
                    distance: Math.round(distance * 10) / 10,
                    latitude: office.latitude,
                    longitude: office.longitude,
                    description: office.description
                  });
                }
              }
            }
          }
          
          // Then add hardcoded fallback data
          const lansingVets = [
            {
              id: 'lansing-fallback-1',
              name: 'Miller Animal Clinic',
              address: '6515 W. Saginaw Hwy',
              city: 'Lansing',
              state: 'MI',
              zipCode: '48917',
              phone: '(517) 321-6406',
              website: 'https://milleranimalclinic.com/',
              rating: 4.5,
              reviewCount: 189,
              services: ['General Veterinary Care', 'Surgery', 'Dental Care', 'Wellness Exams', 'Vaccinations'],
              hours: {
                'Monday': '8:00 AM - 7:00 PM',
                'Tuesday': '8:00 AM - 7:00 PM',
                'Wednesday': '8:00 AM - 6:00 PM',
                'Thursday': '8:00 AM - 7:00 PM',
                'Friday': '8:00 AM - 6:00 PM',
                'Saturday': '9:00 AM - 5:00 PM',
                'Sunday': 'Closed'
              },
              specialties: ['Small Animal Care', 'Over 70 Years Experience'],
              emergencyServices: false,
              distance: 3.2,
              latitude: 42.7025,
              longitude: -84.6891
            },
            {
              id: 'lansing-fallback-2',
              name: 'Pennsylvania Veterinary Care',
              address: '5438 S Pennsylvania Ave',
              city: 'Lansing',
              state: 'MI',
              zipCode: '48911',
              phone: '(517) 393-8010',
              website: 'https://www.pennvetcare.com/',
              rating: 4.6,
              reviewCount: 178,
              services: ['General Veterinary Care', 'Surgery', 'Digital X-Rays', 'Dental Care', 'Microchipping'],
              hours: {
                'Monday': '8:00 AM - 6:00 PM',
                'Tuesday': '7:00 AM - 6:00 PM',
                'Wednesday': '8:00 AM - 6:00 PM',
                'Thursday': '7:00 AM - 6:00 PM',
                'Friday': '8:00 AM - 2:00 PM',
                'Saturday': 'Closed',
                'Sunday': 'Closed'
              },
              specialties: ['Fear Free Certified', 'Regenerative Medicine', 'Since 1992'],
              emergencyServices: false,
              distance: 4.1,
              latitude: 42.6652,
              longitude: -84.5553
            },
            {
              id: 'lansing-fallback-3',
              name: 'Lake Lansing Road Animal Clinic',
              address: '1615 Lake Lansing Rd',
              city: 'Lansing',
              state: 'MI',
              zipCode: '48912',
              phone: '(517) 484-8031',
              website: 'https://lansingvetclinic.com/',
              rating: 4.4,
              reviewCount: 298,
              services: ['General Veterinary Care', 'Surgery', 'Dental Care', 'Wellness Exams', 'Medical Care'],
              hours: {
                'Monday': '8:00 AM - 5:30 PM',
                'Tuesday': '8:00 AM - 5:30 PM',
                'Wednesday': '8:00 AM - 5:30 PM',
                'Thursday': '8:00 AM - 5:30 PM',
                'Friday': '8:00 AM - 5:30 PM',
                'Saturday': '8:00 AM - 1:00 PM, 2:00 PM - 5:30 PM',
                'Sunday': 'Closed'
              },
              specialties: ['Full Service Hospital', 'Comprehensive Care', 'Since 1985'],
              emergencyServices: false,
              distance: 1.9,
              latitude: 42.7542,
              longitude: -84.5324
            },
            {
              id: 'lansing-fallback-4',
              name: 'Michigan State University Emergency Vet',
              address: '736 Wilson Rd',
              city: 'East Lansing',
              state: 'MI',
              zipCode: '48824',
              phone: '(517) 353-5420',
              website: 'https://cvm.msu.edu/hospital',
              rating: 4.7,
              reviewCount: 312,
              services: ['24/7 Emergency Care', 'Critical Care', 'Surgery', 'Advanced Diagnostics', 'Specialty Medicine', 'Trauma Care'],
              hours: {
                'Monday': '24 Hours',
                'Tuesday': '24 Hours',
                'Wednesday': '24 Hours',
                'Thursday': '24 Hours',
                'Friday': '24 Hours',
                'Saturday': '24 Hours',
                'Sunday': '24 Hours'
              },
              specialties: ['Emergency Medicine', 'Critical Care', 'Teaching Hospital', 'Specialty Services'],
              emergencyServices: true,
              distance: 2.4,
              latitude: 42.7011,
              longitude: -84.4822
            }
          ];
          
          // Filter fallback data by distance and add to results
          const filteredFallbackVets = lansingVets.filter(vet => vet.distance <= radiusInMiles);
          allVets.push(...filteredFallbackVets);
          
          // Remove duplicates and sort by distance
          const uniqueVets = allVets.filter((vet, index, self) => 
            index === self.findIndex(v => v.name === vet.name)
          );
          
          console.log(`Returning ${uniqueVets.length} total veterinary practices (${dbOffices?.length || 0} from database)`);
          
          res.json({ 
            practices: uniqueVets.sort((a, b) => a.distance - b.distance),
            total: uniqueVets.length,
            searchQuery: query || 'veterinarian',
            location: location || null,
            source: 'Database + Local Fallback (Lansing)'
          });
          return;
        }

        // Database fallback for other locations
        console.log('🗄️ Using database fallback for location search');
        const offices = await storage.getVeterinaryOffices();
        
        if (!offices || offices.length === 0) {
          return res.status(404).json({
            practices: [],
            total: 0,
            searchQuery: query || 'veterinarian',
            location: location || null,
            source: 'Database (Empty)',
            message: 'No veterinary practices found. Please try a different location.'
          });
        }
        
        // Convert database records to our standard format and calculate distances
        const practices = offices.map((office: any, index: number) => {
          // Calculate distance if coordinates are available
          let distance = 999; // Default large distance
          if (office.latitude && office.longitude) {
            const R = 3959; // Earth's radius in miles
            const dLat = (office.latitude - lat) * Math.PI / 180;
            const dLng = (office.longitude - lng) * Math.PI / 180;
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(office.latitude * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            distance = R * c;
          }
          
          return {
            id: `db-${office.id || index}`,
            name: office.name || `Veterinary Practice ${index + 1}`,
            address: office.address || 'Address not available',
            city: office.city || 'City not specified',
            state: office.state || 'State not specified',
            zipCode: office.zipCode || '',
            phone: office.phone || '(Contact for phone)',
            website: office.website || '',
            rating: office.rating || 4.2,
            reviewCount: office.reviewCount || 0,
            services: office.services || ['General Veterinary Care'],
            hours: office.hours || {
              'Monday': 'Call for hours',
              'Tuesday': 'Call for hours',
              'Wednesday': 'Call for hours',
              'Thursday': 'Call for hours',
              'Friday': 'Call for hours',
              'Saturday': 'Call for hours',
              'Sunday': 'Call for hours'
            },
            specialties: office.specialties || ['General Veterinary Care'],
            emergencyServices: office.emergencyServices || false,
            distance: Math.round(distance * 10) / 10,
            latitude: office.latitude || null,
            longitude: office.longitude || null
          };
        });
        
        // Sort by distance
        practices.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));
        
        res.json({
          practices,
          total: practices.length,
          searchQuery: query || 'veterinarian',
          location: location || null,
          source: 'Database'
        });
      }
    } catch (error) {
      console.error('Veterinary search error:', error);
      res.status(500).json({
        practices: [],
        total: 0,
        searchQuery: query || 'veterinarian',
        location: location || null,
        source: 'Error',
        message: 'Search service temporarily unavailable. Please try again.'
      });
    }
  });

  // Save veterinary office route
  app.post('/api/veterinary-offices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const officeData = insertVeterinaryOfficeSchema.parse(req.body);
      
      const newOffice = await storage.addVeterinaryOffice({
        ...officeData,
        createdBy: userId,
      });
      
      res.status(201).json(newOffice);
    } catch (error) {
      console.error("Error saving veterinary office:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid veterinary office data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save veterinary office" });
    }
  });

  // Get all veterinary offices  
  app.get('/api/veterinary-offices', async (req, res) => {
    try {
      const offices = await storage.getVeterinaryOffices();
      res.json(offices || []);
    } catch (error) {
      console.error("Error fetching veterinary offices:", error);
      res.status(500).json({ message: "Failed to fetch veterinary offices" });
    }
  });

  // Update veterinary office
  app.put('/api/veterinary-offices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const officeData = insertVeterinaryOfficeSchema.partial().parse(req.body);
      
      const updatedOffice = await storage.updateVeterinaryOffice(id, officeData, userId);
      
      if (!updatedOffice) {
        return res.status(404).json({ message: "Veterinary office not found or access denied" });
      }
      
      res.json(updatedOffice);
    } catch (error) {
      console.error("Error updating veterinary office:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid veterinary office data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update veterinary office" });
    }
  });

  // Delete veterinary office
  app.delete('/api/veterinary-offices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.removeVeterinaryOffice(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Veterinary office not found or access denied" });
      }
      
      res.json({ message: "Veterinary office deleted successfully" });
    } catch (error) {
      console.error("Error deleting veterinary office:", error);
      res.status(500).json({ message: "Failed to delete veterinary office" });
    }
  });

  // Saved products routes
  app.get('/api/saved-products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedProducts = await storage.getSavedProducts(userId);
      res.json(savedProducts);
    } catch (error) {
      console.error("Error fetching saved products:", error);
      res.status(500).json({ message: "Failed to fetch saved products" });
    }
  });

  app.post('/api/saved-products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productData = insertSavedProductSchema.parse({
        ...req.body,
        userId,
      });
      
      const savedProduct = await storage.savePetProduct(productData);
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error("Error saving product for pet:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid saved product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save product for pet" });
    }
  });

  app.put('/api/saved-products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const updates = insertSavedProductSchema.partial().parse(req.body);
      const savedProduct = await storage.updateSavedProduct(id, updates);
      
      if (!savedProduct || savedProduct.userId !== userId) {
        return res.status(404).json({ message: "Saved product not found or access denied" });
      }
      
      res.json(savedProduct);
    } catch (error) {
      console.error("Error updating saved product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid saved product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update saved product" });
    }
  });

  app.delete('/api/saved-products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.removeSavedProduct(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Saved product not found or access denied" });
      }
      
      res.json({ message: "Saved product removed successfully" });
    } catch (error) {
      console.error("Error removing saved product:", error);
      res.status(500).json({ message: "Failed to remove saved product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
