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

  const httpServer = createServer(app);
  return httpServer;
}
