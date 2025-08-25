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
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default('free'), // free, premium, pro
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default('active'), // active, cancelled, expired
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripePriceId: varchar("stripe_price_id").notNull(),
  tier: varchar("tier", { length: 20 }).notNull(), // premium, pro
  status: varchar("status", { length: 20 }).notNull(), // active, cancelled, past_due, unpaid
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorEmail: varchar("donor_email"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false),
  stripePaymentId: varchar("stripe_payment_id").unique(),
  status: varchar("status", { length: 20 }).default('completed'), // completed, failed, refunded
  createdAt: timestamp("created_at").defaultNow(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(productReviews),
  scans: many(scanHistory),
  blacklistedIngredients: many(ingredientBlacklist),
  petProfiles: many(petProfiles),
  savedProducts: many(savedProducts),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(productReviews),
  recalls: many(productRecalls),
  scans: many(scanHistory),
  savedProducts: many(savedProducts),
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
export type SavedProduct = typeof savedProducts.$inferSelect;
export type InsertSavedProduct = z.infer<typeof insertSavedProductSchema>;
