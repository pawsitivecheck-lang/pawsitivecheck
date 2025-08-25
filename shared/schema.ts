import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(),
  imageUrl: varchar("image_url"),
  barcode: varchar("barcode", { length: 50 }),
  sourceUrl: varchar("source_url", { length: 500 }),
  cosmicScore: integer("cosmic_score").default(0), // 0-100
  cosmicClarity: varchar("cosmic_clarity", { length: 20 }).default('unknown'), // blessed, questionable, cursed, unknown
  transparencyLevel: varchar("transparency_level", { length: 20 }).default('unknown'),
  isBlacklisted: boolean("is_blacklisted").default(false),
  suspiciousIngredients: text("suspicious_ingredients").array(),
  disposalInstructions: text("disposal_instructions"),
  lastAnalyzed: timestamp("last_analyzed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 paws
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productRecalls = pgTable("product_recalls", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  recallNumber: varchar("recall_number", { length: 100 }).notNull().unique(),
  reason: text("reason").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // urgent, moderate, low
  recallDate: timestamp("recall_date").notNull(),
  affectedBatches: text("affected_batches").array(),
  source: varchar("source", { length: 255 }),
  sourceUrl: varchar("source_url", { length: 500 }),
  disposalInstructions: text("disposal_instructions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ingredientBlacklist = pgTable("ingredient_blacklist", {
  id: serial("id").primaryKey(),
  ingredientName: varchar("ingredient_name", { length: 255 }).notNull().unique(),
  reason: text("reason").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // high, medium, low
  addedByUserId: varchar("added_by_user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scanHistory = pgTable("scan_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id),
  scannedData: text("scanned_data"), // raw scan data
  analysisResult: jsonb("analysis_result"), // mystical analysis results
  scannedAt: timestamp("scanned_at").defaultNow(),
});

export const petProfiles = pgTable("pet_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  species: varchar("species", { length: 50 }).notNull(), // dog, cat, bird, etc.
  breed: varchar("breed", { length: 100 }),
  age: integer("age"), // in years
  weight: decimal("weight", { precision: 5, scale: 2 }), // in pounds
  weightUnit: varchar("weight_unit", { length: 10 }).default("lbs"), // lbs, kg
  gender: varchar("gender", { length: 10 }), // male, female, unknown
  isSpayedNeutered: boolean("is_spayed_neutered"),
  allergies: text("allergies").array(), // array of known allergies
  medicalConditions: text("medical_conditions").array(), // array of medical conditions
  dietaryRestrictions: text("dietary_restrictions").array(), // array of dietary restrictions
  profileImageUrl: varchar("profile_image_url"),
  notes: text("notes"), // additional notes about the pet
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health tracking records for long-term monitoring
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => petProfiles.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  recordDate: timestamp("record_date").defaultNow().notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in pounds/kg
  bodyConditionScore: integer("body_condition_score"), // 1-9 scale
  energyLevel: integer("energy_level"), // 1-5 scale (1=very low, 5=very high)
  appetiteLevel: integer("appetite_level"), // 1-5 scale
  coatCondition: varchar("coat_condition", { length: 20 }), // excellent, good, fair, poor
  symptomsSeen: text("symptoms_seen").array(), // array of observed symptoms
  behaviorChanges: text("behavior_changes"), // free text description
  productUsed: varchar("product_used"), // product being used at time of record
  productDuration: integer("product_duration"), // days using the product
  vetVisit: boolean("vet_visit").default(false), // was this a vet visit record
  vetNotes: text("vet_notes"), // veterinarian notes if applicable
  photos: text("photos").array(), // array of photo URLs
  notes: text("notes"), // general notes about pet's condition
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vaccination and medical event tracking
export const medicalEvents = pgTable("medical_events", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => petProfiles.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // vaccination, checkup, surgery, illness, etc.
  eventDate: timestamp("event_date").notNull(),
  veterinarian: varchar("veterinarian", { length: 200 }),
  clinic: varchar("clinic", { length: 200 }),
  description: text("description").notNull(),
  medications: text("medications").array(), // prescribed medications
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  documents: text("documents").array(), // array of document URLs
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedProducts = pgTable("saved_products", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => petProfiles.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  notes: text("notes"), // user notes about this product for this pet
  status: varchar("status", { length: 20 }).default("saved"), // saved, favorite, avoid, tried
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const veterinaryOffices = pgTable("veterinary_offices", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  website: varchar("website"),
  email: varchar("email"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // 0.00 - 5.00
  reviewCount: integer("review_count").default(0),
  services: text("services").array(), // array of services offered
  specialties: text("specialties").array(), // array of specialties
  hours: jsonb("hours"), // store hours as JSON object
  emergencyServices: boolean("emergency_services").default(false),
  acceptsWalkIns: boolean("accepts_walk_ins").default(false),
  languages: text("languages").array(), // languages spoken
  description: text("description"),
  isActive: boolean("is_active").default(true),
  addedByUserId: varchar("added_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productUpdateSubmissions = pgTable("product_update_submissions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id), // null for new product suggestions
  submittedByUserId: varchar("submitted_by_user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'update', 'new_product', 'image_update', 'info_correction'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  proposedChanges: jsonb("proposed_changes").notNull(), // JSON object with proposed changes
  currentImageUrl: varchar("current_image_url"), // current product image for reference
  submittedImageUrl: varchar("submitted_image_url"), // new/updated image submitted by user
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, in_review
  adminNotes: text("admin_notes"), // internal admin notes
  reviewedByUserId: varchar("reviewed_by_user_id").references(() => users.id), // admin who reviewed
  reviewedAt: timestamp("reviewed_at"),
  appliedAt: timestamp("applied_at"), // when changes were applied to product
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(productReviews),
  scans: many(scanHistory),
  blacklistedIngredients: many(ingredientBlacklist),
  petProfiles: many(petProfiles),
  savedProducts: many(savedProducts),
  veterinaryOffices: many(veterinaryOffices),
  productUpdateSubmissions: many(productUpdateSubmissions),
  reviewedProductUpdates: many(productUpdateSubmissions, { relationName: "reviewedBy" }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(productReviews),
  recalls: many(productRecalls),
  scans: many(scanHistory),
  savedProducts: many(savedProducts),
  updateSubmissions: many(productUpdateSubmissions),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

export const productRecallsRelations = relations(productRecalls, ({ one }) => ({
  product: one(products, {
    fields: [productRecalls.productId],
    references: [products.id],
  }),
}));

export const ingredientBlacklistRelations = relations(ingredientBlacklist, ({ one }) => ({
  addedBy: one(users, {
    fields: [ingredientBlacklist.addedByUserId],
    references: [users.id],
  }),
}));

export const scanHistoryRelations = relations(scanHistory, ({ one }) => ({
  user: one(users, {
    fields: [scanHistory.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [scanHistory.productId],
    references: [products.id],
  }),
}));

export const petProfilesRelations = relations(petProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [petProfiles.userId],
    references: [users.id],
  }),
  savedProducts: many(savedProducts),
}));

export const savedProductsRelations = relations(savedProducts, ({ one }) => ({
  user: one(users, {
    fields: [savedProducts.userId],
    references: [users.id],
  }),
  pet: one(petProfiles, {
    fields: [savedProducts.petId],
    references: [petProfiles.id],
  }),
  product: one(products, {
    fields: [savedProducts.productId],
    references: [products.id],
  }),
}));

export const veterinaryOfficesRelations = relations(veterinaryOffices, ({ one }) => ({
  addedBy: one(users, {
    fields: [veterinaryOffices.addedByUserId],
    references: [users.id],
  }),
}));

export const productUpdateSubmissionsRelations = relations(productUpdateSubmissions, ({ one }) => ({
  product: one(products, {
    fields: [productUpdateSubmissions.productId],
    references: [products.id],
  }),
  submittedBy: one(users, {
    fields: [productUpdateSubmissions.submittedByUserId],
    references: [users.id],
  }),
  reviewedBy: one(users, {
    fields: [productUpdateSubmissions.reviewedByUserId],
    references: [users.id],
    relationName: "reviewedBy",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertProductRecallSchema = createInsertSchema(productRecalls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIngredientBlacklistSchema = createInsertSchema(ingredientBlacklist).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScanHistorySchema = createInsertSchema(scanHistory).omit({
  id: true,
  scannedAt: true,
});

export const insertPetProfileSchema = createInsertSchema(petProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  age: z.number().min(0).max(50).optional(),
  weight: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(), // decimal validation
});

export const insertSavedProductSchema = createInsertSchema(savedProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVeterinaryOfficeSchema = createInsertSchema(veterinaryOffices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductUpdateSubmissionSchema = createInsertSchema(productUpdateSubmissions).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
  reviewedAt: true,
  appliedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
export type ProductRecall = typeof productRecalls.$inferSelect;
export type InsertProductRecall = z.infer<typeof insertProductRecallSchema>;
export type IngredientBlacklist = typeof ingredientBlacklist.$inferSelect;
export type InsertIngredientBlacklist = z.infer<typeof insertIngredientBlacklistSchema>;
export type ScanHistory = typeof scanHistory.$inferSelect;
export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;
export type PetProfile = typeof petProfiles.$inferSelect;
export type InsertPetProfile = z.infer<typeof insertPetProfileSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = typeof healthRecords.$inferInsert;
export type MedicalEvent = typeof medicalEvents.$inferSelect;
export type InsertMedicalEvent = typeof medicalEvents.$inferInsert;
export type SavedProduct = typeof savedProducts.$inferSelect;
export type InsertSavedProduct = z.infer<typeof insertSavedProductSchema>;
export type VeterinaryOffice = typeof veterinaryOffices.$inferSelect;
export type InsertVeterinaryOffice = z.infer<typeof insertVeterinaryOfficeSchema>;
export type ProductUpdateSubmission = typeof productUpdateSubmissions.$inferSelect;
export type InsertProductUpdateSubmission = z.infer<typeof insertProductUpdateSubmissionSchema>;
