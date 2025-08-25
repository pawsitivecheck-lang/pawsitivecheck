import {
  users,
  products,
  productReviews,
  productRecalls,
  ingredientBlacklist,
  scanHistory,
  petProfiles,
  savedProducts,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type ProductReview,
  type InsertProductReview,
  type ProductRecall,
  type InsertProductRecall,
  type IngredientBlacklist,
  type InsertIngredientBlacklist,
  type ScanHistory,
  type InsertScanHistory,
  type PetProfile,
  type InsertPetProfile,
  type SavedProduct,
  type InsertSavedProduct,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, ilike, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(limit?: number, offset?: number, search?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductAnalysis(id: number, analysis: {
    cosmicScore: number;
    cosmicClarity: string;
    transparencyLevel: string;
    suspiciousIngredients: string[];
    lastAnalyzed: Date;
  }): Promise<Product | undefined>;
  
  // Review operations
  getProductReviews(productId: number): Promise<ProductReview[]>;
  getUserReviews(userId: string): Promise<ProductReview[]>;
  createReview(review: InsertProductReview): Promise<ProductReview>;
  updateReview(id: number, updates: Partial<InsertProductReview>): Promise<ProductReview | undefined>;
  deleteReview(id: number, userId: string): Promise<boolean>;
  
  // Recall operations
  getActiveRecalls(): Promise<ProductRecall[]>;
  getProductRecalls(productId: number): Promise<ProductRecall[]>;
  createRecall(recall: InsertProductRecall): Promise<ProductRecall>;
  updateRecall(id: number, updates: Partial<InsertProductRecall>): Promise<ProductRecall | undefined>;
  
  // Ingredient blacklist operations
  getBlacklistedIngredients(): Promise<IngredientBlacklist[]>;
  addIngredientToBlacklist(ingredient: InsertIngredientBlacklist): Promise<IngredientBlacklist>;
  removeIngredientFromBlacklist(id: number): Promise<boolean>;
  
  // Scan history operations
  getUserScanHistory(userId: string): Promise<ScanHistory[]>;
  createScanHistory(scan: InsertScanHistory): Promise<ScanHistory>;
  
  // Pet profile operations
  getUserPetProfiles(userId: string): Promise<PetProfile[]>;
  getPetProfile(id: number): Promise<PetProfile | undefined>;
  createPetProfile(pet: InsertPetProfile): Promise<PetProfile>;
  updatePetProfile(id: number, updates: Partial<InsertPetProfile>): Promise<PetProfile | undefined>;
  deletePetProfile(id: number, userId: string): Promise<boolean>;
  
  // Saved product operations
  getUserSavedProducts(userId: string): Promise<SavedProduct[]>;
  getPetSavedProducts(petId: number): Promise<SavedProduct[]>;
  getSavedProduct(userId: string, petId: number, productId: number): Promise<SavedProduct | undefined>;
  saveProductForPet(savedProduct: InsertSavedProduct): Promise<SavedProduct>;
  updateSavedProduct(id: number, updates: Partial<InsertSavedProduct>): Promise<SavedProduct | undefined>;
  removeSavedProduct(id: number, userId: string): Promise<boolean>;
  
  // Analytics for admin
  getAnalytics(): Promise<{
    totalProducts: number;
    totalUsers: number;
    cursedProducts: number;
    blessedProducts: number;
    activeRecalls: number;
    blacklistedIngredients: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(limit = 50, offset = 0, search?: string): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (search) {
      query = query.where(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.brand, `%${search}%`),
          ilike(products.ingredients, `%${search}%`)
        )
      ) as typeof query;
    }
    
    return await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.barcode, barcode));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async updateProductAnalysis(id: number, analysis: {
    cosmicScore: number;
    cosmicClarity: string;
    transparencyLevel: string;
    suspiciousIngredients: string[];
    lastAnalyzed: Date;
  }): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({
        ...analysis,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Review operations
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.productId, productId))
      .orderBy(desc(productReviews.createdAt));
  }

  async getUserReviews(userId: string): Promise<ProductReview[]> {
    return await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.userId, userId))
      .orderBy(desc(productReviews.createdAt));
  }

  async createReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db.insert(productReviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, updates: Partial<InsertProductReview>): Promise<ProductReview | undefined> {
    const [review] = await db
      .update(productReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(productReviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(productReviews)
      .where(and(eq(productReviews.id, id), eq(productReviews.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Recall operations
  async getActiveRecalls(): Promise<ProductRecall[]> {
    return await db
      .select()
      .from(productRecalls)
      .where(eq(productRecalls.isActive, true))
      .orderBy(desc(productRecalls.recallDate));
  }

  async getProductRecalls(productId: number): Promise<ProductRecall[]> {
    return await db
      .select()
      .from(productRecalls)
      .where(eq(productRecalls.productId, productId))
      .orderBy(desc(productRecalls.recallDate));
  }

  async createRecall(recall: InsertProductRecall): Promise<ProductRecall> {
    const [newRecall] = await db.insert(productRecalls).values(recall).returning();
    return newRecall;
  }

  async updateRecall(id: number, updates: Partial<InsertProductRecall>): Promise<ProductRecall | undefined> {
    const [recall] = await db
      .update(productRecalls)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(productRecalls.id, id))
      .returning();
    return recall;
  }

  // Ingredient blacklist operations
  async getBlacklistedIngredients(): Promise<IngredientBlacklist[]> {
    return await db
      .select()
      .from(ingredientBlacklist)
      .where(eq(ingredientBlacklist.isActive, true))
      .orderBy(desc(ingredientBlacklist.createdAt));
  }

  async addIngredientToBlacklist(ingredient: InsertIngredientBlacklist): Promise<IngredientBlacklist> {
    const [newIngredient] = await db.insert(ingredientBlacklist).values(ingredient).returning();
    return newIngredient;
  }

  async removeIngredientFromBlacklist(id: number): Promise<boolean> {
    const result = await db
      .update(ingredientBlacklist)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(ingredientBlacklist.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Scan history operations
  async getUserScanHistory(userId: string): Promise<ScanHistory[]> {
    return await db
      .select()
      .from(scanHistory)
      .where(eq(scanHistory.userId, userId))
      .orderBy(desc(scanHistory.scannedAt));
  }

  async createScanHistory(scan: InsertScanHistory): Promise<ScanHistory> {
    const [newScan] = await db.insert(scanHistory).values(scan).returning();
    return newScan;
  }

  // Pet profile operations
  async getUserPetProfiles(userId: string): Promise<PetProfile[]> {
    return await db
      .select()
      .from(petProfiles)
      .where(and(eq(petProfiles.userId, userId), eq(petProfiles.isActive, true)))
      .orderBy(desc(petProfiles.createdAt));
  }

  async getPetProfile(id: number): Promise<PetProfile | undefined> {
    const [pet] = await db.select().from(petProfiles).where(eq(petProfiles.id, id));
    return pet;
  }

  async createPetProfile(pet: InsertPetProfile): Promise<PetProfile> {
    const [newPet] = await db.insert(petProfiles).values(pet).returning();
    return newPet;
  }

  async updatePetProfile(id: number, updates: Partial<InsertPetProfile>): Promise<PetProfile | undefined> {
    const [pet] = await db
      .update(petProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(petProfiles.id, id))
      .returning();
    return pet;
  }

  async deletePetProfile(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(petProfiles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(petProfiles.id, id), eq(petProfiles.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Saved product operations
  async getUserSavedProducts(userId: string): Promise<SavedProduct[]> {
    return await db
      .select()
      .from(savedProducts)
      .where(eq(savedProducts.userId, userId))
      .orderBy(desc(savedProducts.createdAt));
  }

  async getPetSavedProducts(petId: number): Promise<SavedProduct[]> {
    return await db
      .select()
      .from(savedProducts)
      .where(eq(savedProducts.petId, petId))
      .orderBy(desc(savedProducts.createdAt));
  }

  async getSavedProduct(userId: string, petId: number, productId: number): Promise<SavedProduct | undefined> {
    const [saved] = await db
      .select()
      .from(savedProducts)
      .where(
        and(
          eq(savedProducts.userId, userId),
          eq(savedProducts.petId, petId),
          eq(savedProducts.productId, productId)
        )
      );
    return saved;
  }

  async saveProductForPet(savedProduct: InsertSavedProduct): Promise<SavedProduct> {
    const [newSavedProduct] = await db.insert(savedProducts).values(savedProduct).returning();
    return newSavedProduct;
  }

  async updateSavedProduct(id: number, updates: Partial<InsertSavedProduct>): Promise<SavedProduct | undefined> {
    const [saved] = await db
      .update(savedProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(savedProducts.id, id))
      .returning();
    return saved;
  }

  async removeSavedProduct(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(savedProducts)
      .where(and(eq(savedProducts.id, id), eq(savedProducts.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Analytics for admin
  async getAnalytics(): Promise<{
    totalProducts: number;
    totalUsers: number;
    cursedProducts: number;
    blessedProducts: number;
    activeRecalls: number;
    blacklistedIngredients: number;
  }> {
    const [analytics] = await db.select({
      totalProducts: sql<number>`count(distinct ${products.id})`,
      totalUsers: sql<number>`count(distinct ${users.id})`,
      cursedProducts: sql<number>`count(distinct case when ${products.cosmicClarity} = 'cursed' then ${products.id} end)`,
      blessedProducts: sql<number>`count(distinct case when ${products.cosmicClarity} = 'blessed' then ${products.id} end)`,
      activeRecalls: sql<number>`count(distinct case when ${productRecalls.isActive} = true then ${productRecalls.id} end)`,
      blacklistedIngredients: sql<number>`count(distinct case when ${ingredientBlacklist.isActive} = true then ${ingredientBlacklist.id} end)`,
    }).from(products)
    .leftJoin(users, sql`true`)
    .leftJoin(productRecalls, eq(productRecalls.productId, products.id))
    .leftJoin(ingredientBlacklist, sql`true`);

    return analytics;
  }
}

export const storage = new DatabaseStorage();
