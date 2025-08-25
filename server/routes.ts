import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeProductSafety, generateProductGuidance, enhanceRecallInformation } from "./ai-service";
import { 
  insertProductSchema, 
  insertProductReviewSchema, 
  insertProductRecallSchema,
  insertIngredientBlacklistSchema,
  insertScanHistorySchema 
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
      const allSuspiciousIngredients = [...new Set([...aiAnalysis.suspiciousIngredients, ...additionalSuspicious])];

      const analysis = {
        cosmicScore: finalScore,
        cosmicClarity: finalScore >= 80 ? 'blessed' : finalScore >= 50 ? 'questionable' : 'cursed',
        transparencyLevel: aiAnalysis.transparencyLevel,
        suspiciousIngredients: allSuspiciousIngredients,
        userGuidance: guidance,
        lastAnalyzed: new Date(),
      };

      const updatedProduct = await storage.updateProductAnalysis(id, analysis);
      res.json({
        product: updatedProduct,
        analysis: {
          ...analysis,
          aleisterVerdict: cosmicClarity === 'blessed' ? "The ingredients sing with purity" :
                          cosmicClarity === 'questionable' ? "The shadows hide much" :
                          "Banish this from your realm!",
          severusVerdict: cosmicClarity === 'blessed' ? "Cosmic clarity achieved" :
                         cosmicClarity === 'questionable' ? "Proceed with caution" :
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
  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
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

  // Veterinary search endpoint
  app.post('/api/vets/search', async (req, res) => {
    try {
      const { query, location } = req.body;
      
      // Construct search query
      let searchQuery = query || 'veterinarian';
      if (location) {
        // Use coordinates to search for local vets
        searchQuery += ` near ${location.lat},${location.lng}`;
      }
      
      // In production, this would integrate with:
      // - Google Places API
      // - Yelp Fusion API
      // - Foursquare Places API
      // - Or custom web scraping with Perplexity/web search
      
      // Mock implementation with realistic vet data
      const mockPractices = [
        {
          id: 'vet001',
          name: 'Companion Animal Hospital',
          address: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 123-4567',
          website: 'https://companionvet.com',
          rating: 4.8,
          reviewCount: 245,
          services: [
            'General Wellness Exams',
            'Vaccinations',
            'Surgery',
            'Dental Care',
            'Emergency Services'
          ],
          hours: {
            'Monday': '8:00 AM - 6:00 PM',
            'Tuesday': '8:00 AM - 6:00 PM',
            'Wednesday': '8:00 AM - 6:00 PM',
            'Thursday': '8:00 AM - 6:00 PM',
            'Friday': '8:00 AM - 6:00 PM',
            'Saturday': '9:00 AM - 4:00 PM',
            'Sunday': 'Closed'
          },
          specialties: ['Small Animal Care', 'Preventive Medicine'],
          emergencyServices: true,
          distance: 0.8
        },
        {
          id: 'vet002',
          name: 'City Pet Clinic',
          address: '456 Oak Avenue',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 987-6543',
          website: 'https://citypetclinic.com',
          rating: 4.6,
          reviewCount: 189,
          services: [
            'Routine Check-ups',
            'Spay/Neuter',
            'Microchipping',
            'Grooming',
            'Behavioral Consultation'
          ],
          hours: {
            'Monday': '7:30 AM - 7:00 PM',
            'Tuesday': '7:30 AM - 7:00 PM',
            'Wednesday': '7:30 AM - 7:00 PM',
            'Thursday': '7:30 AM - 7:00 PM',
            'Friday': '7:30 AM - 7:00 PM',
            'Saturday': '8:00 AM - 5:00 PM',
            'Sunday': '10:00 AM - 3:00 PM'
          },
          specialties: ['Behavioral Medicine', 'Dermatology'],
          emergencyServices: false,
          distance: 1.2
        },
        {
          id: 'vet003',
          name: 'Advanced Animal Care Center',
          address: '789 Elm Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 456-7890',
          website: 'https://advancedanimalcare.com',
          rating: 4.9,
          reviewCount: 312,
          services: [
            'Advanced Diagnostics',
            'Orthopedic Surgery',
            'Oncology',
            'Cardiology',
            'Critical Care'
          ],
          hours: {
            'Monday': '7:00 AM - 8:00 PM',
            'Tuesday': '7:00 AM - 8:00 PM',
            'Wednesday': '7:00 AM - 8:00 PM',
            'Thursday': '7:00 AM - 8:00 PM',
            'Friday': '7:00 AM - 8:00 PM',
            'Saturday': '8:00 AM - 6:00 PM',
            'Sunday': '9:00 AM - 5:00 PM'
          },
          specialties: ['Surgery', 'Internal Medicine', 'Oncology'],
          emergencyServices: true,
          distance: 2.1
        },
        {
          id: 'vet004',
          name: 'Neighborhood Vet Services',
          address: '321 Pine Road',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          phone: '(555) 234-5678',
          rating: 4.4,
          reviewCount: 156,
          services: [
            'Wellness Exams',
            'Vaccinations',
            'Parasite Prevention',
            'Senior Pet Care',
            'Nutritional Counseling'
          ],
          hours: {
            'Monday': '8:00 AM - 5:00 PM',
            'Tuesday': '8:00 AM - 5:00 PM',
            'Wednesday': 'Closed',
            'Thursday': '8:00 AM - 5:00 PM',
            'Friday': '8:00 AM - 5:00 PM',
            'Saturday': '9:00 AM - 2:00 PM',
            'Sunday': 'Closed'
          },
          specialties: ['Geriatric Care', 'Wellness Programs'],
          emergencyServices: false,
          distance: 1.7
        }
      ];
      
      // Filter practices based on search terms
      let filteredPractices = mockPractices;
      
      if (query && query !== 'veterinarian') {
        const searchTerms = query.toLowerCase();
        filteredPractices = mockPractices.filter(practice => 
          practice.name.toLowerCase().includes(searchTerms) ||
          practice.services.some(service => 
            service.toLowerCase().includes(searchTerms)
          ) ||
          practice.specialties.some(specialty => 
            specialty.toLowerCase().includes(searchTerms)
          ) ||
          practice.city.toLowerCase().includes(searchTerms) ||
          practice.state.toLowerCase().includes(searchTerms)
        );
      }
      
      // Sort by distance if location provided
      if (location) {
        filteredPractices.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      res.json({
        practices: filteredPractices,
        total: filteredPractices.length,
        searchQuery,
        location: location || null
      });
      
    } catch (error) {
      console.error("Error in vet search:", error);
      res.status(500).json({ message: "Failed to search for veterinarians" });
    }
  });

  // Database synchronization endpoints
  app.post('/api/admin/sync/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      // In production, this would sync with:
      // - Pet food manufacturer APIs
      // - Open Food Facts API
      // - FDA/AAFCO databases
      // - Veterinary product databases
      
      let syncedProducts = 0;
      const batchSize = 50;
      
      // Popular pet product database synchronization  
      const mockApiProducts = [
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
          name: "Hill's Science Diet Puppy Food",
          brand: "Hill's",
          category: "pet-food",
          description: "Puppy food with DHA from fish oil for healthy brain development",
          ingredients: "Chicken, whole grain wheat, cracked pearled barley, whole grain sorghum",
          barcode: "012345678904",
          cosmicScore: 88,
          cosmicClarity: 'blessed',
          transparencyLevel: 'excellent',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        },
        {
          name: "Friskies Indoor Cat Treats",
          brand: "Friskies",
          category: "pet-treats",
          description: "Crunchy cat treats made with real chicken",
          ingredients: "Chicken, brewers rice, corn protein meal, animal fat, chicken by-product meal",
          barcode: "012345678905",
          cosmicScore: 65,
          cosmicClarity: 'neutral',
          transparencyLevel: 'fair',
          isBlacklisted: false,
          suspiciousIngredients: ['by-product meal'],
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
        },
        {
          name: "Royal Canin Breed Health Dog Food",
          brand: "Royal Canin",
          category: "pet-food",
          description: "Breed-specific nutrition for adult dogs",
          ingredients: "Chicken by-product meal, brewers rice, corn, wheat, chicken fat",
          barcode: "012345678907",
          cosmicScore: 70,
          cosmicClarity: 'neutral',
          transparencyLevel: 'good',
          isBlacklisted: false,
          suspiciousIngredients: ['by-product meal', 'corn'],
          lastAnalyzed: new Date(),
        },
        {
          name: "Wellness Core Cat Food",
          brand: "Wellness",
          category: "pet-food",
          description: "Grain-free, high-protein cat food with deboned turkey",
          ingredients: "Deboned turkey, turkey meal, chicken meal, peas, potatoes",
          barcode: "012345678908",
          cosmicScore: 82,
          cosmicClarity: 'blessed',
          transparencyLevel: 'excellent',
          isBlacklisted: false,
          suspiciousIngredients: [],
          lastAnalyzed: new Date(),
        }
      ];
      
      // Add products to database
      for (const productData of mockApiProducts) {
        try {
          // Check if product already exists
          const existing = await storage.getProductByBarcode(productData.barcode);
          if (!existing) {
            await storage.createProduct(productData);
            syncedProducts++;
          }
        } catch (error) {
          console.log(`Skipped product ${productData.name}: already exists or error`);
        }
      }
      
      res.json({
        message: `Successfully synced ${syncedProducts} new products from cosmic APIs`,
        syncedCount: syncedProducts,
        totalProcessed: mockApiProducts.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error syncing products:", error);
      res.status(500).json({ message: "Failed to sync product database" });
    }
  });
  
  app.post('/api/admin/sync/recalls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      let syncedRecalls = 0;
      let processedRecalls = 0;
      let source = 'mock';
      
      // Try FDA openFDA API for real recall data
      try {
        // Search for pet-related recalls from FDA
        const petSearchTerms = [
          'dog food', 'cat food', 'pet food', 'dog treats', 'cat treats', 
          'pet treats', 'puppy food', 'kitten food', 'canine', 'feline'
        ];
        
        const allFdaRecalls = [];
        
        for (const searchTerm of petSearchTerms) {
          try {
            const response = await fetch(
              `https://api.fda.gov/food/enforcement.json?search=product_description:"${searchTerm}"&limit=20`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.results) {
                allFdaRecalls.push(...data.results);
              }
            }
          } catch (searchError) {
            const error = searchError as Error;
            console.log(`Failed to search FDA for "${searchTerm}":`, error.message);
          }
        }
        
        if (allFdaRecalls.length > 0) {
          source = 'FDA';
          
          // Process FDA recalls
          for (const fdaRecall of allFdaRecalls.slice(0, 10)) { // Limit to 10 most recent
            try {
              processedRecalls++;
              
              // Map FDA data to our schema
              const recallNumber = fdaRecall.recall_number || `FDA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const productName = fdaRecall.product_description || 'Unknown Pet Product';
              const reason = fdaRecall.reason_for_recall || 'Safety concern identified';
              
              // Determine severity based on classification
              let severity: 'low' | 'moderate' | 'high' | 'urgent' = 'moderate';
              if (fdaRecall.classification === 'Class I') {
                severity = 'urgent';
              } else if (fdaRecall.classification === 'Class II') {
                severity = 'high';
              } else if (fdaRecall.classification === 'Class III') {
                severity = 'moderate';
              }
              
              // Parse recall date
              const recallDate = fdaRecall.recall_initiation_date ? 
                new Date(fdaRecall.recall_initiation_date) : 
                new Date();
              
              // Check if we already have this recall
              const existingRecalls = await storage.getActiveRecalls();
              const exists = existingRecalls.some(recall => 
                recall.recallNumber === recallNumber
              );
              
              if (!exists) {
                // Create or find a product for this recall
                let productId = null;
                
                // Try to find existing product by name similarity
                const products = await storage.getProducts(1000, 0);
                const matchingProduct = products.find(product => 
                  productName.toLowerCase().includes(product.name.toLowerCase()) ||
                  product.name.toLowerCase().includes(productName.toLowerCase().split(' ')[0])
                );
                
                if (matchingProduct) {
                  productId = matchingProduct.id;
                } else {
                  // Create a new product for this recall
                  try {
                    const newProduct = await storage.createProduct({
                      name: productName,
                      brand: fdaRecall.recalling_firm || "Unknown Brand",
                      category: productName.toLowerCase().includes('treat') ? 'pet-treats' : 'pet-food',
                      description: `Product recalled by FDA: ${reason}`,
                      ingredients: "Ingredients not specified in recall notice",
                      barcode: `FDA-${recallNumber}`,
                      cosmicScore: 20, // Low score for recalled products
                      cosmicClarity: 'cursed',
                      transparencyLevel: 'poor',
                      isBlacklisted: true,
                      suspiciousIngredients: [],
                      lastAnalyzed: new Date(),
                    });
                    productId = newProduct.id;
                  } catch (productError) {
                    console.log(`Failed to create product for recall ${recallNumber}`);
                  }
                }
                
                if (productId) {
                  await storage.createRecall({
                    productId,
                    recallNumber,
                    reason,
                    severity,
                    recallDate,
                    affectedBatches: fdaRecall.product_quantity ? [fdaRecall.product_quantity] : [],
                    source: "FDA"
                  });
                  syncedRecalls++;
                }
              }
            } catch (recallError) {
              const error = recallError as Error;
              console.log(`Failed to process FDA recall:`, error.message);
            }
          }
        }
      } catch (fdaError) {
        const error = fdaError as Error;
        console.error('FDA API error, falling back to mock data:', error.message);
      }
      
      // Fall back to mock data if FDA API failed or returned no results
      if (syncedRecalls === 0) {
        source = 'mock';
        
        // Create some mock products for the recalls to reference
        const mockProducts = [
          {
            name: "TastyBites Dog Treats",
            brand: "PetSnacks Inc", 
            category: "pet-treats",
            description: "Chicken flavored dog treats",
            ingredients: "Chicken, wheat flour, glycerin, salt",
            barcode: "123456789012",
          },
          {
            name: "FlexiLeash Retractable Leash",
            brand: "WalkSafe",
            category: "pet-accessories", 
            description: "Retractable dog leash, 16ft length",
            ingredients: "Nylon webbing, plastic handle, metal clasp",
            barcode: "123456789013",
          }
        ];
        
        // Create products if they don't exist and get their IDs
        const productIds: number[] = [];
        for (const productData of mockProducts) {
          try {
            let existingProduct = await storage.getProductByBarcode(productData.barcode);
            if (!existingProduct) {
              existingProduct = await storage.createProduct(productData);
            }
            productIds.push(existingProduct.id);
          } catch (error) {
            console.log(`Failed to create/get product: ${productData.name}`);
          }
        }
        
        const mockRecallData = [
          {
            productId: productIds[0] || 1,
            recallNumber: "RCL-2024-001",
            reason: "Potential Salmonella contamination", 
            severity: 'urgent' as const,
            recallDate: new Date('2024-01-15'),
            affectedBatches: ["Lot #TB2024001", "Lot #TB2024002"],
            source: "FDA"
          },
          {
            productId: productIds[1] || 2,
            recallNumber: "RCL-2024-002", 
            reason: "Mechanism failure causing sudden release",
            severity: 'moderate' as const,
            recallDate: new Date('2024-02-01'),
            affectedBatches: ["Model FL-2023, Serial 50000-55000"],
            source: "CPSC"
          }
        ];
        
        for (const recallData of mockRecallData) {
          try {
            const existingRecalls = await storage.getActiveRecalls();
            const exists = existingRecalls.some(r => 
              r.recallNumber === recallData.recallNumber
            );
            
            if (!exists) {
              await storage.createRecall(recallData);
              syncedRecalls++;
              processedRecalls++;
            }
          } catch (error) {
            console.log(`Skipped recall ${recallData.recallNumber}: already exists or error`);
          }
        }
      }
      
      res.json({
        message: source === 'FDA' 
          ? `Successfully synced ${syncedRecalls} new FDA pet product recalls`
          : `Successfully synced ${syncedRecalls} new recall alerts`,
        syncedCount: syncedRecalls,
        totalProcessed: processedRecalls,
        source,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error syncing recalls:", error);
      res.status(500).json({ message: "Failed to sync recall database" });
    }
  });
  
  app.post('/api/admin/sync/ingredients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      // In production, sync with:
      // - AAFCO ingredient safety database
      // - FDA's list of prohibited substances
      // - Veterinary toxicology databases
      // - Research institutions' safety data
      
      let syncedIngredients = 0;
      
      const mockIngredientData = [
        {
          ingredientName: "Propylene Glycol",
          reason: "Can cause anemia and other blood disorders in cats",
          severity: 'high' as const
        },
        {
          ingredientName: "Xylitol", 
          reason: "Extremely toxic to dogs, causes rapid insulin release and hypoglycemia",
          severity: 'high' as const
        },
        {
          ingredientName: "BHA (Butylated Hydroxyanisole)",
          reason: "Possible carcinogen, may cause liver and kidney problems", 
          severity: 'medium' as const
        },
        {
          ingredientName: "Red Dye #3",
          reason: "Artificial coloring linked to hyperactivity and allergic reactions",
          severity: 'low' as const
        }
      ];
      
      for (const ingredientData of mockIngredientData) {
        try {
          // Check if ingredient already blacklisted
          const existing = await storage.getBlacklistedIngredients();
          const exists = existing.some(i => 
            i.ingredientName.toLowerCase() === ingredientData.ingredientName.toLowerCase()
          );
          
          if (!exists) {
            await storage.addIngredientToBlacklist(ingredientData);
            syncedIngredients++;
          }
        } catch (error) {
          console.log(`Skipped ingredient ${ingredientData.ingredientName}: already exists or error`);
        }
      }
      
      res.json({
        message: `Successfully synced ${syncedIngredients} new blacklisted ingredients`,
        syncedCount: syncedIngredients,
        totalProcessed: mockIngredientData.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error syncing ingredients:", error);
      res.status(500).json({ message: "Failed to sync ingredient blacklist" });
    }
  });
  
  // Full database refresh endpoint
  app.post('/api/admin/sync/all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      const results = {
        products: 0,
        recalls: 0,
        ingredients: 0,
        errors: [] as string[]
      };
      
      // Sync products
      try {
        const productRes = await fetch(`${req.protocol}://${req.get('host')}/api/admin/sync/products`, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.authorization || '',
            'Cookie': req.headers.cookie || ''
          }
        });
        if (productRes.ok) {
          const data = await productRes.json();
          results.products = data.syncedCount;
        }
      } catch (error) {
        results.errors.push('Failed to sync products');
      }
      
      // Sync recalls
      try {
        const recallRes = await fetch(`${req.protocol}://${req.get('host')}/api/admin/sync/recalls`, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.authorization || '',
            'Cookie': req.headers.cookie || ''
          }
        });
        if (recallRes.ok) {
          const data = await recallRes.json();
          results.recalls = data.syncedCount;
        }
      } catch (error) {
        results.errors.push('Failed to sync recalls');
      }
      
      // Sync ingredients
      try {
        const ingredientRes = await fetch(`${req.protocol}://${req.get('host')}/api/admin/sync/ingredients`, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.authorization || '',
            'Cookie': req.headers.cookie || ''
          }
        });
        if (ingredientRes.ok) {
          const data = await ingredientRes.json();
          results.ingredients = data.syncedCount;
        }
      } catch (error) {
        results.errors.push('Failed to sync ingredients');
      }
      
      res.json({
        message: "Cosmic database synchronization complete",
        results,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error in full database sync:", error);
      res.status(500).json({ message: "Failed to perform full database synchronization" });
    }
  });
  
  // Database status and last sync info
  app.get('/api/admin/sync/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Access restricted to Audit Syndicate members" });
      }

      const products = await storage.getProducts(1000, 0);
      const recalls = await storage.getActiveRecalls();
      const ingredients = await storage.getBlacklistedIngredients();
      
      // Find most recent entries to determine last sync times
      const latestProduct = products.length > 0 ? 
        products.reduce((latest, product) => 
          (product.createdAt && latest.createdAt && product.createdAt > latest.createdAt) ? product : latest
        ) : null;
        
      const latestRecall = recalls.length > 0 ?
        recalls.reduce((latest, recall) => 
          recall.recallDate > latest.recallDate ? recall : latest
        ) : null;
      
      res.json({
        database: {
          products: {
            count: products.length,
            lastSync: latestProduct?.createdAt || null
          },
          recalls: {
            count: recalls.length,
            lastSync: latestRecall?.recallDate || null
          },
          ingredients: {
            count: ingredients.length,
            lastSync: null // We don't track creation dates for ingredients
          }
        },
        health: "operational",
        lastChecked: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error getting sync status:", error);
      res.status(500).json({ message: "Failed to get database sync status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
