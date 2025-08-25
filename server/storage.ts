import {
  users,
  products,
  productReviews,
  productRecalls,
  ingredientBlacklist,
  scanHistory,
  petProfiles,
  savedProducts,
  veterinaryOffices,
  productUpdateSubmissions,
  healthRecords,
  medicalEvents,
  animalTags,
  productTags,
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
  type VeterinaryOffice,
  type InsertVeterinaryOffice,
  type ProductUpdateSubmission,
  type InsertProductUpdateSubmission,
  type HealthRecord,
  type InsertHealthRecord,
  type MedicalEvent,
  type InsertMedicalEvent,
  type AnimalTag,
  type InsertAnimalTag,
  type ProductTag,
  type InsertProductTag,
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
  
  // Veterinary office operations
  getVeterinaryOffices(limit?: number, offset?: number, search?: string, latitude?: number, longitude?: number): Promise<VeterinaryOffice[]>;
  getVeterinaryOffice(id: number): Promise<VeterinaryOffice | undefined>;
  createVeterinaryOffice(office: InsertVeterinaryOffice): Promise<VeterinaryOffice>;
  updateVeterinaryOffice(id: number, updates: Partial<InsertVeterinaryOffice>): Promise<VeterinaryOffice | undefined>;
  deleteVeterinaryOffice(id: number, userId: string): Promise<boolean>;
  
  // Product update submission operations
  getUserProductUpdateSubmissions(userId: string): Promise<ProductUpdateSubmission[]>;
  getAllProductUpdateSubmissions(status?: string): Promise<ProductUpdateSubmission[]>;
  getProductUpdateSubmission(id: number): Promise<ProductUpdateSubmission | undefined>;
  createProductUpdateSubmission(submission: InsertProductUpdateSubmission): Promise<ProductUpdateSubmission>;
  updateProductUpdateSubmission(id: number, updates: Partial<InsertProductUpdateSubmission>): Promise<ProductUpdateSubmission | undefined>;
  reviewProductUpdateSubmission(id: number, reviewData: {
    status: string;
    adminNotes?: string;
    reviewedByUserId: string;
  }): Promise<ProductUpdateSubmission | undefined>;
  
  // Health tracking operations
  getPetHealthRecords(petId: number): Promise<HealthRecord[]>;
  getHealthRecord(id: number): Promise<HealthRecord | undefined>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  updateHealthRecord(id: number, updates: Partial<InsertHealthRecord>): Promise<HealthRecord | undefined>;
  deleteHealthRecord(id: number, userId: string): Promise<boolean>;
  
  // Medical event operations
  getPetMedicalEvents(petId: number): Promise<MedicalEvent[]>;
  getMedicalEvent(id: number): Promise<MedicalEvent | undefined>;
  createMedicalEvent(event: InsertMedicalEvent): Promise<MedicalEvent>;
  updateMedicalEvent(id: number, updates: Partial<InsertMedicalEvent>): Promise<MedicalEvent | undefined>;
  deleteMedicalEvent(id: number, userId: string): Promise<boolean>;

  // Animal tag operations
  getAnimalTags(filters?: { type?: string; parentId?: number }): Promise<AnimalTag[]>;
  getAnimalTag(id: number): Promise<AnimalTag | undefined>;
  createAnimalTag(tag: InsertAnimalTag): Promise<AnimalTag>;
  updateAnimalTag(id: number, updates: Partial<InsertAnimalTag>): Promise<AnimalTag | undefined>;
  
  // Product tag operations
  getProductTags(productId: number): Promise<(ProductTag & { tag: AnimalTag })[]>;
  addProductTags(productId: number, tagIds: number[], userId: string, relevanceScores?: number[]): Promise<ProductTag[]>;
  removeProductTag(productId: number, tagId: number): Promise<boolean>;

  // Analytics for admin
  getAnalytics(): Promise<{
    totalProducts: number;
    totalUsers: number;
    cursedProducts: number;
    blessedProducts: number;
    activeRecalls: number;
    blacklistedIngredients: number;
    veterinaryOffices: number;
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

  // Veterinary office operations
  async getVeterinaryOffices(limit = 50, offset = 0, search?: string, latitude?: number, longitude?: number): Promise<VeterinaryOffice[]> {
    let query = db.select().from(veterinaryOffices);
    
    let whereConditions = [eq(veterinaryOffices.isActive, true)];
    
    if (search) {
      whereConditions.push(
        or(
          ilike(veterinaryOffices.name, `%${search}%`),
          ilike(veterinaryOffices.city, `%${search}%`),
          ilike(veterinaryOffices.state, `%${search}%`),
          ilike(veterinaryOffices.zipCode, `%${search}%`)
        )!
      );
    }
    
    return query
      .where(and(...whereConditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(veterinaryOffices.createdAt));
  }

  async getVeterinaryOffice(id: number): Promise<VeterinaryOffice | undefined> {
    const [office] = await db
      .select()
      .from(veterinaryOffices)
      .where(and(eq(veterinaryOffices.id, id), eq(veterinaryOffices.isActive, true)));
    return office;
  }

  async createVeterinaryOffice(office: InsertVeterinaryOffice): Promise<VeterinaryOffice> {
    const [newOffice] = await db.insert(veterinaryOffices).values(office).returning();
    return newOffice;
  }

  async updateVeterinaryOffice(id: number, updates: Partial<InsertVeterinaryOffice>): Promise<VeterinaryOffice | undefined> {
    const [office] = await db
      .update(veterinaryOffices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(veterinaryOffices.id, id))
      .returning();
    return office;
  }

  async deleteVeterinaryOffice(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(veterinaryOffices)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(veterinaryOffices.id, id), eq(veterinaryOffices.addedByUserId, userId)));
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
    veterinaryOffices: number;
  }> {
    const [analytics] = await db.select({
      totalProducts: sql<number>`count(distinct ${products.id})`,
      totalUsers: sql<number>`count(distinct ${users.id})`,
      cursedProducts: sql<number>`count(distinct case when ${products.cosmicClarity} = 'cursed' then ${products.id} end)`,
      blessedProducts: sql<number>`count(distinct case when ${products.cosmicClarity} = 'blessed' then ${products.id} end)`,
      activeRecalls: sql<number>`count(distinct case when ${productRecalls.isActive} = true then ${productRecalls.id} end)`,
      blacklistedIngredients: sql<number>`count(distinct case when ${ingredientBlacklist.isActive} = true then ${ingredientBlacklist.id} end)`,
      veterinaryOffices: sql<number>`count(distinct case when ${veterinaryOffices.isActive} = true then ${veterinaryOffices.id} end)`,
    }).from(products)
    .leftJoin(users, sql`true`)
    .leftJoin(productRecalls, eq(productRecalls.productId, products.id))
    .leftJoin(ingredientBlacklist, sql`true`)
    .leftJoin(veterinaryOffices, sql`true`);

    return analytics;
  }
  
  // Product update submission operations
  async getUserProductUpdateSubmissions(userId: string): Promise<ProductUpdateSubmission[]> {
    return await db.select().from(productUpdateSubmissions)
      .where(eq(productUpdateSubmissions.submittedByUserId, userId))
      .orderBy(desc(productUpdateSubmissions.submittedAt));
  }

  async getAllProductUpdateSubmissions(status?: string): Promise<ProductUpdateSubmission[]> {
    let query = db.select().from(productUpdateSubmissions);
    
    if (status) {
      query = query.where(eq(productUpdateSubmissions.status, status)) as typeof query;
    }
    
    return await query.orderBy(desc(productUpdateSubmissions.submittedAt));
  }

  async getProductUpdateSubmission(id: number): Promise<ProductUpdateSubmission | undefined> {
    const [submission] = await db.select().from(productUpdateSubmissions)
      .where(eq(productUpdateSubmissions.id, id));
    return submission;
  }

  async createProductUpdateSubmission(submission: InsertProductUpdateSubmission): Promise<ProductUpdateSubmission> {
    const [created] = await db.insert(productUpdateSubmissions)
      .values(submission)
      .returning();
    return created;
  }

  async updateProductUpdateSubmission(id: number, updates: Partial<InsertProductUpdateSubmission>): Promise<ProductUpdateSubmission | undefined> {
    const [updated] = await db.update(productUpdateSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(productUpdateSubmissions.id, id))
      .returning();
    return updated;
  }

  async reviewProductUpdateSubmission(id: number, reviewData: {
    status: string;
    adminNotes?: string;
    reviewedByUserId: string;
  }): Promise<ProductUpdateSubmission | undefined> {
    const [reviewed] = await db.update(productUpdateSubmissions)
      .set({
        status: reviewData.status,
        adminNotes: reviewData.adminNotes,
        reviewedByUserId: reviewData.reviewedByUserId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(productUpdateSubmissions.id, id))
      .returning();
    return reviewed;
  }

  // Health tracking operations
  async getPetHealthRecords(petId: number): Promise<HealthRecord[]> {
    return await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.petId, petId))
      .orderBy(desc(healthRecords.recordDate));
  }

  async getHealthRecord(id: number): Promise<HealthRecord | undefined> {
    const [record] = await db.select().from(healthRecords).where(eq(healthRecords.id, id));
    return record;
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const [newRecord] = await db.insert(healthRecords).values(record).returning();
    return newRecord;
  }

  async updateHealthRecord(id: number, updates: Partial<InsertHealthRecord>): Promise<HealthRecord | undefined> {
    const [record] = await db
      .update(healthRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(healthRecords.id, id))
      .returning();
    return record;
  }

  async deleteHealthRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(healthRecords)
      .where(and(eq(healthRecords.id, id), eq(healthRecords.userId, userId)));
    return result.rowCount > 0;
  }

  // Medical event operations
  async getPetMedicalEvents(petId: number): Promise<MedicalEvent[]> {
    return await db
      .select()
      .from(medicalEvents)
      .where(eq(medicalEvents.petId, petId))
      .orderBy(desc(medicalEvents.eventDate));
  }

  async getMedicalEvent(id: number): Promise<MedicalEvent | undefined> {
    const [event] = await db.select().from(medicalEvents).where(eq(medicalEvents.id, id));
    return event;
  }

  async createMedicalEvent(event: InsertMedicalEvent): Promise<MedicalEvent> {
    const [newEvent] = await db.insert(medicalEvents).values(event).returning();
    return newEvent;
  }

  async updateMedicalEvent(id: number, updates: Partial<InsertMedicalEvent>): Promise<MedicalEvent | undefined> {
    const [event] = await db
      .update(medicalEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medicalEvents.id, id))
      .returning();
    return event;
  }

  async deleteMedicalEvent(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(medicalEvents)
      .where(and(eq(medicalEvents.id, id), eq(medicalEvents.userId, userId)));
    return result.rowCount > 0;
  }

  // Animal tag operations
  async getAnimalTags(filters?: { type?: string; parentId?: number }): Promise<AnimalTag[]> {
    let query = db.select().from(animalTags).where(eq(animalTags.isActive, true));
    
    if (filters?.type) {
      query = query.where(eq(animalTags.type, filters.type));
    }
    
    if (filters?.parentId !== undefined) {
      if (filters.parentId === null) {
        query = query.where(sql`${animalTags.parentId} IS NULL`);
      } else {
        query = query.where(eq(animalTags.parentId, filters.parentId));
      }
    }
    
    return await query.orderBy(animalTags.name);
  }

  async getAnimalTag(id: number): Promise<AnimalTag | undefined> {
    const [tag] = await db.select().from(animalTags).where(eq(animalTags.id, id));
    return tag;
  }

  async createAnimalTag(tag: InsertAnimalTag): Promise<AnimalTag> {
    const [newTag] = await db.insert(animalTags).values(tag).returning();
    return newTag;
  }

  async updateAnimalTag(id: number, updates: Partial<InsertAnimalTag>): Promise<AnimalTag | undefined> {
    const [tag] = await db
      .update(animalTags)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(animalTags.id, id))
      .returning();
    return tag;
  }

  // Product tag operations
  async getProductTags(productId: number): Promise<(ProductTag & { tag: AnimalTag })[]> {
    return await db
      .select({
        id: productTags.id,
        productId: productTags.productId,
        tagId: productTags.tagId,
        relevanceScore: productTags.relevanceScore,
        addedByUserId: productTags.addedByUserId,
        isVerified: productTags.isVerified,
        createdAt: productTags.createdAt,
        tag: animalTags,
      })
      .from(productTags)
      .innerJoin(animalTags, eq(productTags.tagId, animalTags.id))
      .where(and(
        eq(productTags.productId, productId),
        eq(animalTags.isActive, true)
      ))
      .orderBy(desc(productTags.relevanceScore), animalTags.name);
  }

  async addProductTags(productId: number, tagIds: number[], userId: string, relevanceScores?: number[]): Promise<ProductTag[]> {
    const tagData = tagIds.map((tagId, index) => ({
      productId,
      tagId,
      addedByUserId: userId,
      relevanceScore: relevanceScores?.[index] || 100,
    }));

    return await db
      .insert(productTags)
      .values(tagData)
      .onConflictDoUpdate({
        target: [productTags.productId, productTags.tagId],
        set: {
          relevanceScore: sql`EXCLUDED.relevance_score`,
          addedByUserId: sql`EXCLUDED.added_by_user_id`,
        },
      })
      .returning();
  }

  async removeProductTag(productId: number, tagId: number): Promise<boolean> {
    const result = await db
      .delete(productTags)
      .where(and(eq(productTags.productId, productId), eq(productTags.tagId, tagId)));
    return result.rowCount > 0;
  }

  // Analytics for admin
  async getAnalytics(): Promise<{
    totalProducts: number;
    totalUsers: number;
    cursedProducts: number;
    blessedProducts: number;
    activeRecalls: number;
    blacklistedIngredients: number;
    veterinaryOffices: number;
  }> {
    const [
      totalProducts,
      totalUsers,
      cursedProducts,
      blessedProducts,
      activeRecalls,
      blacklistedIngredients,
      veterinaryOffices,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(products),
      db.select({ count: sql`count(*)` }).from(users),
      db.select({ count: sql`count(*)` }).from(products).where(eq(products.cosmicClarity, 'cursed')),
      db.select({ count: sql`count(*)` }).from(products).where(eq(products.cosmicClarity, 'blessed')),
      db.select({ count: sql`count(*)` }).from(productRecalls).where(eq(productRecalls.isActive, true)),
      db.select({ count: sql`count(*)` }).from(ingredientBlacklist).where(eq(ingredientBlacklist.isActive, true)),
      db.select({ count: sql`count(*)` }).from(veterinaryOffices).where(eq(veterinaryOffices.isActive, true)),
    ]);

    return {
      totalProducts: Number(totalProducts[0].count),
      totalUsers: Number(totalUsers[0].count),
      cursedProducts: Number(cursedProducts[0].count),
      blessedProducts: Number(blessedProducts[0].count),
      activeRecalls: Number(activeRecalls[0].count),
      blacklistedIngredients: Number(blacklistedIngredients[0].count),
      veterinaryOffices: Number(veterinaryOffices[0].count),
    };
  }
}

export const storage = new DatabaseStorage();
