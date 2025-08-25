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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(productReviews),
  scans: many(scanHistory),
  blacklistedIngredients: many(ingredientBlacklist),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(productReviews),
  recalls: many(productRecalls),
  scans: many(scanHistory),
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
