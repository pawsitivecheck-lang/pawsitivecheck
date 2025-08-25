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
  livestockOperations,
  livestockHerds,
  feedManagement,
  livestockHealthRecords,
  farmAnimals,
  breedingRecords,
  productionRecords,
  animalMovements,
  farmAnimalProducts,
  informationSources,
  informationalResources,
  farmProductReviews,
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
  type LivestockOperation,
  type InsertLivestockOperation,
  type LivestockHerd,
  type InsertLivestockHerd,
  type FeedManagement,
  type InsertFeedManagement,
  type LivestockHealthRecord,
  type InsertLivestockHealthRecord,
  type FarmAnimal,
  type InsertFarmAnimal,
  type BreedingRecord,
  type InsertBreedingRecord,
  type ProductionRecord,
  type InsertProductionRecord,
  type AnimalMovement,
  type InsertAnimalMovement,
  type FarmAnimalProduct,
  type InsertFarmAnimalProduct,
  type InformationSource,
  type InsertInformationSource,
  type InformationalResource,
  type InsertInformationalResource,
  type FarmProductReview,
  type InsertFarmProductReview,
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

  // Livestock operation methods
  getLivestockOperations(userId: string): Promise<LivestockOperation[]>;
  getLivestockOperation(id: number, userId: string): Promise<LivestockOperation | undefined>;
  createLivestockOperation(operation: InsertLivestockOperation): Promise<LivestockOperation>;
  updateLivestockOperation(id: number, updates: Partial<InsertLivestockOperation>, userId: string): Promise<LivestockOperation | undefined>;
  deleteLivestockOperation(id: number, userId: string): Promise<boolean>;

  // Livestock herd methods
  getLivestockHerds(operationId: number, userId: string): Promise<LivestockHerd[]>;
  getLivestockHerd(id: number, userId: string): Promise<LivestockHerd | undefined>;
  createLivestockHerd(herd: InsertLivestockHerd): Promise<LivestockHerd>;
  updateLivestockHerd(id: number, updates: Partial<InsertLivestockHerd>, userId: string): Promise<LivestockHerd | undefined>;
  deleteLivestockHerd(id: number, userId: string): Promise<boolean>;

  // Feed management methods (for herds)
  getFeedManagement(herdId: number, userId: string): Promise<FeedManagement[]>;
  getFeedRecord(id: number, userId: string): Promise<FeedManagement | undefined>;
  createFeedRecord(feed: InsertFeedManagement): Promise<FeedManagement>;
  updateFeedRecord(id: number, updates: Partial<InsertFeedManagement>, userId: string): Promise<FeedManagement | undefined>;
  deleteFeedRecord(id: number, userId: string): Promise<boolean>;

  // Pet feed management methods
  getPetFeedManagement(petId: number, userId: string): Promise<FeedManagement[]>;
  createPetFeedRecord(feed: InsertFeedManagement): Promise<FeedManagement>;
  updatePetFeedRecord(id: number, updates: Partial<InsertFeedManagement>, userId: string): Promise<FeedManagement | undefined>;
  deletePetFeedRecord(id: number, userId: string): Promise<boolean>;

  // Livestock health record methods
  getLivestockHealthRecords(herdId: number, userId: string): Promise<LivestockHealthRecord[]>;
  getLivestockHealthRecord(id: number, userId: string): Promise<LivestockHealthRecord | undefined>;
  createLivestockHealthRecord(record: InsertLivestockHealthRecord): Promise<LivestockHealthRecord>;
  updateLivestockHealthRecord(id: number, updates: Partial<InsertLivestockHealthRecord>, userId: string): Promise<LivestockHealthRecord | undefined>;
  deleteLivestockHealthRecord(id: number, userId: string): Promise<boolean>;

  // Farm animal methods
  getFarmAnimals(herdId: number, userId: string): Promise<FarmAnimal[]>;
  getAllFarmAnimals(userId: string): Promise<FarmAnimal[]>;
  getFarmAnimal(id: number, userId: string): Promise<FarmAnimal | undefined>;
  createFarmAnimal(animal: InsertFarmAnimal): Promise<FarmAnimal>;
  updateFarmAnimal(id: number, updates: Partial<InsertFarmAnimal>, userId: string): Promise<FarmAnimal | undefined>;
  deleteFarmAnimal(id: number, userId: string): Promise<boolean>;

  // Breeding record methods
  getBreedingRecords(userId: string, animalId?: number): Promise<BreedingRecord[]>;
  getBreedingRecord(id: number, userId: string): Promise<BreedingRecord | undefined>;
  createBreedingRecord(record: InsertBreedingRecord): Promise<BreedingRecord>;
  updateBreedingRecord(id: number, updates: Partial<InsertBreedingRecord>, userId: string): Promise<BreedingRecord | undefined>;
  deleteBreedingRecord(id: number, userId: string): Promise<boolean>;

  // Production record methods
  getProductionRecords(animalId: number, userId: string): Promise<ProductionRecord[]>;
  getProductionRecord(id: number, userId: string): Promise<ProductionRecord | undefined>;
  createProductionRecord(record: InsertProductionRecord): Promise<ProductionRecord>;
  updateProductionRecord(id: number, updates: Partial<InsertProductionRecord>, userId: string): Promise<ProductionRecord | undefined>;
  deleteProductionRecord(id: number, userId: string): Promise<boolean>;

  // Animal movement methods
  getAnimalMovements(animalId: number, userId: string): Promise<AnimalMovement[]>;
  getAnimalMovement(id: number, userId: string): Promise<AnimalMovement | undefined>;
  createAnimalMovement(movement: InsertAnimalMovement): Promise<AnimalMovement>;
  updateAnimalMovement(id: number, updates: Partial<InsertAnimalMovement>, userId: string): Promise<AnimalMovement | undefined>;
  deleteAnimalMovement(id: number, userId: string): Promise<boolean>;

  // Farm animal product methods
  getFarmAnimalProducts(userId: string, filters?: { productType?: string; targetSpecies?: string; category?: string }): Promise<FarmAnimalProduct[]>;
  getFarmAnimalProduct(id: number, userId: string): Promise<FarmAnimalProduct | undefined>;
  createFarmAnimalProduct(product: InsertFarmAnimalProduct): Promise<FarmAnimalProduct>;
  updateFarmAnimalProduct(id: number, updates: Partial<InsertFarmAnimalProduct>, userId: string): Promise<FarmAnimalProduct | undefined>;
  deleteFarmAnimalProduct(id: number, userId: string): Promise<boolean>;

  // Information source methods
  getInformationSources(filters?: { sourceType?: string; category?: string; specialties?: string[] }): Promise<InformationSource[]>;
  getInformationSource(id: number): Promise<InformationSource | undefined>;
  createInformationSource(source: InsertInformationSource): Promise<InformationSource>;
  updateInformationSource(id: number, updates: Partial<InsertInformationSource>): Promise<InformationSource | undefined>;
  deleteInformationSource(id: number): Promise<boolean>;

  // Informational resource methods
  getInformationalResources(userId: string, filters?: { resourceType?: string; category?: string; targetSpecies?: string; isFavorite?: boolean }): Promise<InformationalResource[]>;
  getInformationalResource(id: number, userId: string): Promise<InformationalResource | undefined>;
  createInformationalResource(resource: InsertInformationalResource): Promise<InformationalResource>;
  updateInformationalResource(id: number, updates: Partial<InsertInformationalResource>, userId: string): Promise<InformationalResource | undefined>;
  deleteInformationalResource(id: number, userId: string): Promise<boolean>;
  markResourceAsFavorite(id: number, userId: string, isFavorite: boolean): Promise<boolean>;
  incrementResourceViews(id: number): Promise<boolean>;

  // Farm product review methods
  getFarmProductReviews(productId: number): Promise<FarmProductReview[]>;
  getUserFarmProductReviews(userId: string): Promise<FarmProductReview[]>;
  getFarmProductReview(id: number): Promise<FarmProductReview | undefined>;
  createFarmProductReview(review: InsertFarmProductReview): Promise<FarmProductReview>;
  updateFarmProductReview(id: number, updates: Partial<InsertFarmProductReview>, userId: string): Promise<FarmProductReview | undefined>;
  deleteFarmProductReview(id: number, userId: string): Promise<boolean>;
  voteReviewHelpful(reviewId: number): Promise<boolean>;
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
    return (result.rowCount ?? 0) > 0;
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
    return (result.rowCount ?? 0) > 0;
  }

  // Animal tag operations
  async getAnimalTags(filters?: { type?: string; parentId?: number }): Promise<AnimalTag[]> {
    const conditions = [eq(animalTags.isActive, true)];
    
    if (filters?.type) {
      conditions.push(eq(animalTags.type, filters.type));
    }
    
    if (filters?.parentId !== undefined) {
      if (filters.parentId === null) {
        conditions.push(sql`${animalTags.parentId} IS NULL`);
      } else {
        conditions.push(eq(animalTags.parentId, filters.parentId));
      }
    }
    
    return await db.select().from(animalTags).where(and(...conditions)).orderBy(animalTags.name);
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
    const [
      totalProducts,
      totalUsers,
      cursedProducts,
      blessedProducts,
      activeRecalls,
      blacklistedIngredients,
      veterinaryOfficeCount,
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
      veterinaryOffices: Number(veterinaryOfficeCount[0].count),
    };
  }

  // Livestock operation methods
  async getLivestockOperations(userId: string): Promise<LivestockOperation[]> {
    return await db
      .select()
      .from(livestockOperations)
      .where(and(eq(livestockOperations.userId, userId), eq(livestockOperations.isActive, true)))
      .orderBy(desc(livestockOperations.createdAt));
  }

  async getLivestockOperation(id: number, userId: string): Promise<LivestockOperation | undefined> {
    const [operation] = await db
      .select()
      .from(livestockOperations)
      .where(and(eq(livestockOperations.id, id), eq(livestockOperations.userId, userId), eq(livestockOperations.isActive, true)));
    return operation;
  }

  async createLivestockOperation(operation: InsertLivestockOperation): Promise<LivestockOperation> {
    const [newOperation] = await db.insert(livestockOperations).values(operation).returning();
    return newOperation;
  }

  async updateLivestockOperation(id: number, updates: Partial<InsertLivestockOperation>, userId: string): Promise<LivestockOperation | undefined> {
    const [operation] = await db
      .update(livestockOperations)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(livestockOperations.id, id), eq(livestockOperations.userId, userId)))
      .returning();
    return operation;
  }

  async deleteLivestockOperation(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(livestockOperations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(livestockOperations.id, id), eq(livestockOperations.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Livestock herd methods
  async getLivestockHerds(operationId: number, userId: string): Promise<LivestockHerd[]> {
    return await db
      .select()
      .from(livestockHerds)
      .where(and(eq(livestockHerds.operationId, operationId), eq(livestockHerds.userId, userId), eq(livestockHerds.isActive, true)))
      .orderBy(desc(livestockHerds.createdAt));
  }

  async getLivestockHerd(id: number, userId: string): Promise<LivestockHerd | undefined> {
    const [herd] = await db
      .select()
      .from(livestockHerds)
      .where(and(eq(livestockHerds.id, id), eq(livestockHerds.userId, userId), eq(livestockHerds.isActive, true)));
    return herd;
  }

  async createLivestockHerd(herd: InsertLivestockHerd): Promise<LivestockHerd> {
    const [newHerd] = await db.insert(livestockHerds).values(herd).returning();
    return newHerd;
  }

  async updateLivestockHerd(id: number, updates: Partial<InsertLivestockHerd>, userId: string): Promise<LivestockHerd | undefined> {
    const [herd] = await db
      .update(livestockHerds)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(livestockHerds.id, id), eq(livestockHerds.userId, userId)))
      .returning();
    return herd;
  }

  async deleteLivestockHerd(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(livestockHerds)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(livestockHerds.id, id), eq(livestockHerds.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Feed management methods
  async getFeedManagement(herdId: number, userId: string): Promise<FeedManagement[]> {
    return await db
      .select()
      .from(feedManagement)
      .where(and(eq(feedManagement.herdId, herdId), eq(feedManagement.userId, userId), eq(feedManagement.isActive, true)))
      .orderBy(desc(feedManagement.createdAt));
  }

  async getFeedRecord(id: number, userId: string): Promise<FeedManagement | undefined> {
    const [feed] = await db
      .select()
      .from(feedManagement)
      .where(and(eq(feedManagement.id, id), eq(feedManagement.userId, userId), eq(feedManagement.isActive, true)));
    return feed;
  }

  async createFeedRecord(feed: InsertFeedManagement): Promise<FeedManagement> {
    const [newFeed] = await db.insert(feedManagement).values(feed).returning();
    return newFeed;
  }

  async updateFeedRecord(id: number, updates: Partial<InsertFeedManagement>, userId: string): Promise<FeedManagement | undefined> {
    const [feed] = await db
      .update(feedManagement)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(feedManagement.id, id), eq(feedManagement.userId, userId)))
      .returning();
    return feed;
  }

  async deleteFeedRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(feedManagement)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(feedManagement.id, id), eq(feedManagement.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Livestock health record methods
  async getLivestockHealthRecords(herdId: number, userId: string): Promise<LivestockHealthRecord[]> {
    return await db
      .select()
      .from(livestockHealthRecords)
      .where(and(eq(livestockHealthRecords.herdId, herdId), eq(livestockHealthRecords.userId, userId)))
      .orderBy(desc(livestockHealthRecords.recordDate));
  }

  async getLivestockHealthRecord(id: number, userId: string): Promise<LivestockHealthRecord | undefined> {
    const [record] = await db
      .select()
      .from(livestockHealthRecords)
      .where(and(eq(livestockHealthRecords.id, id), eq(livestockHealthRecords.userId, userId)));
    return record;
  }

  async createLivestockHealthRecord(record: InsertLivestockHealthRecord): Promise<LivestockHealthRecord> {
    const [newRecord] = await db.insert(livestockHealthRecords).values(record).returning();
    return newRecord;
  }

  async updateLivestockHealthRecord(id: number, updates: Partial<InsertLivestockHealthRecord>, userId: string): Promise<LivestockHealthRecord | undefined> {
    const [record] = await db
      .update(livestockHealthRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(livestockHealthRecords.id, id), eq(livestockHealthRecords.userId, userId)))
      .returning();
    return record;
  }

  async deleteLivestockHealthRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(livestockHealthRecords)
      .where(and(eq(livestockHealthRecords.id, id), eq(livestockHealthRecords.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Pet feed management methods
  async getPetFeedManagement(petId: number, userId: string): Promise<FeedManagement[]> {
    return await db
      .select()
      .from(feedManagement)
      .where(and(eq(feedManagement.petId, petId), eq(feedManagement.userId, userId), eq(feedManagement.isActive, true)))
      .orderBy(desc(feedManagement.createdAt));
  }

  async createPetFeedRecord(feed: InsertFeedManagement): Promise<FeedManagement> {
    const [newFeed] = await db.insert(feedManagement).values(feed).returning();
    return newFeed;
  }

  async updatePetFeedRecord(id: number, updates: Partial<InsertFeedManagement>, userId: string): Promise<FeedManagement | undefined> {
    const [feed] = await db
      .update(feedManagement)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(feedManagement.id, id), eq(feedManagement.userId, userId), eq(feedManagement.petId, updates.petId ?? -1)))
      .returning();
    return feed;
  }

  async deletePetFeedRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(feedManagement)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(feedManagement.id, id), eq(feedManagement.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== FARM ANIMAL METHODS ===============================

  async getFarmAnimals(herdId: number, userId: string): Promise<FarmAnimal[]> {
    return await db
      .select()
      .from(farmAnimals)
      .where(and(eq(farmAnimals.herdId, herdId), eq(farmAnimals.userId, userId)))
      .orderBy(desc(farmAnimals.createdAt));
  }

  async getAllFarmAnimals(userId: string): Promise<FarmAnimal[]> {
    return await db
      .select()
      .from(farmAnimals)
      .where(eq(farmAnimals.userId, userId))
      .orderBy(desc(farmAnimals.createdAt));
  }

  async getFarmAnimal(id: number, userId: string): Promise<FarmAnimal | undefined> {
    const [animal] = await db
      .select()
      .from(farmAnimals)
      .where(and(eq(farmAnimals.id, id), eq(farmAnimals.userId, userId)));
    return animal;
  }

  async createFarmAnimal(animal: InsertFarmAnimal): Promise<FarmAnimal> {
    const [newAnimal] = await db.insert(farmAnimals).values(animal).returning();
    return newAnimal;
  }

  async updateFarmAnimal(id: number, updates: Partial<InsertFarmAnimal>, userId: string): Promise<FarmAnimal | undefined> {
    const [animal] = await db
      .update(farmAnimals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(farmAnimals.id, id), eq(farmAnimals.userId, userId)))
      .returning();
    return animal;
  }

  async deleteFarmAnimal(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(farmAnimals)
      .where(and(eq(farmAnimals.id, id), eq(farmAnimals.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== BREEDING RECORD METHODS ===============================

  async getBreedingRecords(userId: string, animalId?: number): Promise<BreedingRecord[]> {
    const conditions = [eq(breedingRecords.userId, userId)];
    if (animalId) {
      conditions.push(or(eq(breedingRecords.damId, animalId), eq(breedingRecords.sireId, animalId))!);
    }
    
    return await db
      .select()
      .from(breedingRecords)
      .where(and(...conditions))
      .orderBy(desc(breedingRecords.breedingDate));
  }

  async getBreedingRecord(id: number, userId: string): Promise<BreedingRecord | undefined> {
    const [record] = await db
      .select()
      .from(breedingRecords)
      .where(and(eq(breedingRecords.id, id), eq(breedingRecords.userId, userId)));
    return record;
  }

  async createBreedingRecord(record: InsertBreedingRecord): Promise<BreedingRecord> {
    const [newRecord] = await db.insert(breedingRecords).values(record).returning();
    return newRecord;
  }

  async updateBreedingRecord(id: number, updates: Partial<InsertBreedingRecord>, userId: string): Promise<BreedingRecord | undefined> {
    const [record] = await db
      .update(breedingRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(breedingRecords.id, id), eq(breedingRecords.userId, userId)))
      .returning();
    return record;
  }

  async deleteBreedingRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(breedingRecords)
      .where(and(eq(breedingRecords.id, id), eq(breedingRecords.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== PRODUCTION RECORD METHODS ===============================

  async getProductionRecords(animalId: number, userId: string): Promise<ProductionRecord[]> {
    return await db
      .select()
      .from(productionRecords)
      .where(and(eq(productionRecords.animalId, animalId), eq(productionRecords.userId, userId)))
      .orderBy(desc(productionRecords.recordDate));
  }

  async getProductionRecord(id: number, userId: string): Promise<ProductionRecord | undefined> {
    const [record] = await db
      .select()
      .from(productionRecords)
      .where(and(eq(productionRecords.id, id), eq(productionRecords.userId, userId)));
    return record;
  }

  async createProductionRecord(record: InsertProductionRecord): Promise<ProductionRecord> {
    const [newRecord] = await db.insert(productionRecords).values(record).returning();
    return newRecord;
  }

  async updateProductionRecord(id: number, updates: Partial<InsertProductionRecord>, userId: string): Promise<ProductionRecord | undefined> {
    const [record] = await db
      .update(productionRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(productionRecords.id, id), eq(productionRecords.userId, userId)))
      .returning();
    return record;
  }

  async deleteProductionRecord(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(productionRecords)
      .where(and(eq(productionRecords.id, id), eq(productionRecords.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== ANIMAL MOVEMENT METHODS ===============================

  async getAnimalMovements(animalId: number, userId: string): Promise<AnimalMovement[]> {
    return await db
      .select()
      .from(animalMovements)
      .where(and(eq(animalMovements.animalId, animalId), eq(animalMovements.userId, userId)))
      .orderBy(desc(animalMovements.movementDate));
  }

  async getAnimalMovement(id: number, userId: string): Promise<AnimalMovement | undefined> {
    const [movement] = await db
      .select()
      .from(animalMovements)
      .where(and(eq(animalMovements.id, id), eq(animalMovements.userId, userId)));
    return movement;
  }

  async createAnimalMovement(movement: InsertAnimalMovement): Promise<AnimalMovement> {
    const [newMovement] = await db.insert(animalMovements).values(movement).returning();
    return newMovement;
  }

  async updateAnimalMovement(id: number, updates: Partial<InsertAnimalMovement>, userId: string): Promise<AnimalMovement | undefined> {
    const [movement] = await db
      .update(animalMovements)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(animalMovements.id, id), eq(animalMovements.userId, userId)))
      .returning();
    return movement;
  }

  async deleteAnimalMovement(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(animalMovements)
      .where(and(eq(animalMovements.id, id), eq(animalMovements.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== FARM ANIMAL PRODUCT METHODS ===============================

  async getFarmAnimalProducts(userId: string, filters?: { productType?: string; targetSpecies?: string; category?: string }): Promise<FarmAnimalProduct[]> {
    const conditions = [eq(farmAnimalProducts.userId, userId), eq(farmAnimalProducts.isActive, true)];
    
    if (filters?.productType) {
      conditions.push(eq(farmAnimalProducts.productType, filters.productType));
    }
    if (filters?.category) {
      conditions.push(eq(farmAnimalProducts.category, filters.category));
    }
    
    return await db
      .select()
      .from(farmAnimalProducts)
      .where(and(...conditions))
      .orderBy(desc(farmAnimalProducts.createdAt));
  }

  async getFarmAnimalProduct(id: number, userId: string): Promise<FarmAnimalProduct | undefined> {
    const [product] = await db
      .select()
      .from(farmAnimalProducts)
      .where(and(eq(farmAnimalProducts.id, id), eq(farmAnimalProducts.userId, userId)));
    return product;
  }

  async createFarmAnimalProduct(product: InsertFarmAnimalProduct): Promise<FarmAnimalProduct> {
    const [newProduct] = await db.insert(farmAnimalProducts).values(product).returning();
    return newProduct;
  }

  async updateFarmAnimalProduct(id: number, updates: Partial<InsertFarmAnimalProduct>, userId: string): Promise<FarmAnimalProduct | undefined> {
    const [product] = await db
      .update(farmAnimalProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(farmAnimalProducts.id, id), eq(farmAnimalProducts.userId, userId)))
      .returning();
    return product;
  }

  async deleteFarmAnimalProduct(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(farmAnimalProducts)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(farmAnimalProducts.id, id), eq(farmAnimalProducts.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== INFORMATION SOURCE METHODS ===============================

  async getInformationSources(filters?: { sourceType?: string; category?: string; specialties?: string[] }): Promise<InformationSource[]> {
    const conditions = [eq(informationSources.isActive, true)];
    
    if (filters?.sourceType) {
      conditions.push(eq(informationSources.sourceType, filters.sourceType));
    }
    if (filters?.category) {
      conditions.push(eq(informationSources.category, filters.category));
    }
    
    return await db
      .select()
      .from(informationSources)
      .where(and(...conditions))
      .orderBy(desc(informationSources.reputation), informationSources.sourceName);
  }

  async getInformationSource(id: number): Promise<InformationSource | undefined> {
    const [source] = await db
      .select()
      .from(informationSources)
      .where(eq(informationSources.id, id));
    return source;
  }

  async createInformationSource(source: InsertInformationSource): Promise<InformationSource> {
    const [newSource] = await db.insert(informationSources).values(source).returning();
    return newSource;
  }

  async updateInformationSource(id: number, updates: Partial<InsertInformationSource>): Promise<InformationSource | undefined> {
    const [source] = await db
      .update(informationSources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(informationSources.id, id))
      .returning();
    return source;
  }

  async deleteInformationSource(id: number): Promise<boolean> {
    const result = await db
      .update(informationSources)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(informationSources.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== INFORMATIONAL RESOURCE METHODS ===============================

  async getInformationalResources(userId: string, filters?: { resourceType?: string; category?: string; targetSpecies?: string; isFavorite?: boolean }): Promise<InformationalResource[]> {
    const conditions = [eq(informationalResources.userId, userId)];
    
    if (filters?.resourceType) {
      conditions.push(eq(informationalResources.resourceType, filters.resourceType));
    }
    if (filters?.category) {
      conditions.push(eq(informationalResources.category, filters.category));
    }
    if (filters?.isFavorite !== undefined) {
      conditions.push(eq(informationalResources.isFavorite, filters.isFavorite));
    }
    
    return await db
      .select()
      .from(informationalResources)
      .where(and(...conditions))
      .orderBy(desc(informationalResources.createdAt));
  }

  async getInformationalResource(id: number, userId: string): Promise<InformationalResource | undefined> {
    const [resource] = await db
      .select()
      .from(informationalResources)
      .where(and(eq(informationalResources.id, id), eq(informationalResources.userId, userId)));
    return resource;
  }

  async createInformationalResource(resource: InsertInformationalResource): Promise<InformationalResource> {
    const [newResource] = await db.insert(informationalResources).values(resource).returning();
    return newResource;
  }

  async updateInformationalResource(id: number, updates: Partial<InsertInformationalResource>, userId: string): Promise<InformationalResource | undefined> {
    const [resource] = await db
      .update(informationalResources)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(informationalResources.id, id), eq(informationalResources.userId, userId)))
      .returning();
    return resource;
  }

  async deleteInformationalResource(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(informationalResources)
      .where(and(eq(informationalResources.id, id), eq(informationalResources.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async markResourceAsFavorite(id: number, userId: string, isFavorite: boolean): Promise<boolean> {
    const result = await db
      .update(informationalResources)
      .set({ isFavorite, updatedAt: new Date() })
      .where(and(eq(informationalResources.id, id), eq(informationalResources.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementResourceViews(id: number): Promise<boolean> {
    const result = await db
      .update(informationalResources)
      .set({ 
        viewCount: sql`${informationalResources.viewCount} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(informationalResources.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // =============================== FARM PRODUCT REVIEW METHODS ===============================

  async getFarmProductReviews(productId: number): Promise<FarmProductReview[]> {
    return await db
      .select()
      .from(farmProductReviews)
      .where(eq(farmProductReviews.productId, productId))
      .orderBy(desc(farmProductReviews.createdAt));
  }

  async getUserFarmProductReviews(userId: string): Promise<FarmProductReview[]> {
    return await db
      .select()
      .from(farmProductReviews)
      .where(eq(farmProductReviews.userId, userId))
      .orderBy(desc(farmProductReviews.createdAt));
  }

  async getFarmProductReview(id: number): Promise<FarmProductReview | undefined> {
    const [review] = await db
      .select()
      .from(farmProductReviews)
      .where(eq(farmProductReviews.id, id));
    return review;
  }

  async createFarmProductReview(review: InsertFarmProductReview): Promise<FarmProductReview> {
    const [newReview] = await db.insert(farmProductReviews).values(review).returning();
    return newReview;
  }

  async updateFarmProductReview(id: number, updates: Partial<InsertFarmProductReview>, userId: string): Promise<FarmProductReview | undefined> {
    const [review] = await db
      .update(farmProductReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(farmProductReviews.id, id), eq(farmProductReviews.userId, userId)))
      .returning();
    return review;
  }

  async deleteFarmProductReview(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(farmProductReviews)
      .where(and(eq(farmProductReviews.id, id), eq(farmProductReviews.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async voteReviewHelpful(reviewId: number): Promise<boolean> {
    const result = await db
      .update(farmProductReviews)
      .set({ 
        helpfulVotes: sql`${farmProductReviews.helpfulVotes} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(farmProductReviews.id, reviewId));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
