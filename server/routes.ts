import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
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

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { limit = '50', offset = '0', search } = req.query;
      const products = await storage.getProducts(
        parseInt(limit as string), 
        parseInt(offset as string),
        search as string
      );
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
        // Mock internet barcode search - in production, this would integrate with APIs like:
        // - Open Food Facts API
        // - UPC Database
        // - Barcode Lookup APIs
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock product data based on barcode pattern
        const mockProduct = {
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

        // Add to database
        const product = await storage.createProduct(mockProduct);
        
        res.json({
          source: 'internet',
          product,
          message: 'Product discovered through cosmic internet divination'
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

      // Mystical analysis logic
      const blacklistedIngredients = await storage.getBlacklistedIngredients();
      const suspiciousIngredients: string[] = [];
      let cosmicScore = 100;
      
      // Check for blacklisted ingredients
      for (const blacklisted of blacklistedIngredients) {
        if (product.ingredients.toLowerCase().includes(blacklisted.ingredientName.toLowerCase())) {
          suspiciousIngredients.push(blacklisted.ingredientName);
          if (blacklisted.severity === 'high') cosmicScore -= 30;
          else if (blacklisted.severity === 'medium') cosmicScore -= 15;
          else cosmicScore -= 5;
        }
      }

      // Additional mystical factors
      const naturalKeywords = ['organic', 'natural', 'grass-fed', 'free-range', 'human-grade'];
      const artificialKeywords = ['artificial', 'preservative', 'dye', 'color', 'flavor enhancer'];
      
      let naturalCount = 0;
      let artificialCount = 0;
      
      for (const keyword of naturalKeywords) {
        if (product.ingredients.toLowerCase().includes(keyword)) naturalCount++;
      }
      for (const keyword of artificialKeywords) {
        if (product.ingredients.toLowerCase().includes(keyword)) artificialCount++;
      }

      cosmicScore += naturalCount * 5;
      cosmicScore -= artificialCount * 10;
      cosmicScore = Math.max(0, Math.min(100, cosmicScore));

      // Determine cosmic clarity
      let cosmicClarity = 'unknown';
      if (cosmicScore >= 80) cosmicClarity = 'blessed';
      else if (cosmicScore >= 50) cosmicClarity = 'questionable';
      else cosmicClarity = 'cursed';

      // Determine transparency level
      let transparencyLevel = 'poor';
      if (naturalCount > artificialCount) transparencyLevel = 'excellent';
      else if (naturalCount === artificialCount) transparencyLevel = 'good';

      const analysis = {
        cosmicScore,
        cosmicClarity,
        transparencyLevel,
        suspiciousIngredients,
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

  const httpServer = createServer(app);
  return httpServer;
}
