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
  animalType: varchar("animal_type", { length: 20 }).default('pet'), // pet, livestock, mixed
  targetSpecies: text("target_species").array(), // array of species this product is designed for
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
  species: varchar("species", { length: 50 }).notNull(), // dog, cat, bird, chicken, pig, cattle, sheep, goat, duck, turkey, horse, etc.
  breed: varchar("breed", { length: 100 }),
  age: integer("age"), // in years
  weight: decimal("weight", { precision: 8, scale: 2 }), // in pounds, supports up to 999,999.99 for large farm animals
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
  weight: decimal("weight", { precision: 8, scale: 2 }), // in pounds/kg, supports large farm animals
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

// Animal taxonomy tags for breed, species, and subspecies classification
// Livestock management table for farm operations
export const livestockOperations = pgTable("livestock_operations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  operationName: varchar("operation_name", { length: 255 }).notNull(),
  operationType: varchar("operation_type", { length: 50 }).notNull(), // dairy, beef, poultry, swine, sheep, goat, mixed
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),
  totalHeadCount: integer("total_head_count").default(0),
  primarySpecies: text("primary_species").array(), // cattle, pigs, chickens, sheep, goats, etc.
  certifications: text("certifications").array(), // organic, pasture-raised, etc.
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactEmail: varchar("contact_email"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const livestockHerds = pgTable("livestock_herds", {
  id: serial("id").primaryKey(),
  operationId: integer("operation_id").references(() => livestockOperations.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  herdName: varchar("herd_name", { length: 255 }).notNull(),
  species: varchar("species", { length: 50 }).notNull(), // cattle, swine, sheep, goat, poultry
  breed: varchar("breed", { length: 100 }),
  headCount: integer("head_count").default(0),
  averageWeight: decimal("average_weight", { precision: 8, scale: 2 }),
  weightUnit: varchar("weight_unit", { length: 10 }).default("lbs"),
  ageRange: varchar("age_range", { length: 50 }), // e.g., "6-12 months", "adult", "breeding age"
  purpose: varchar("purpose", { length: 50 }), // dairy, meat, breeding, egg_production
  housingType: varchar("housing_type", { length: 100 }), // pasture, barn, free_range, cage_free
  feedingSchedule: jsonb("feeding_schedule"), // structured feeding plan
  healthProtocol: text("health_protocol"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedManagement = pgTable("feed_management", {
  id: serial("id").primaryKey(),
  herdId: integer("herd_id").references(() => livestockHerds.id), // for livestock herds
  petId: integer("pet_id").references(() => petProfiles.id), // for individual pets/animals
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id), // reference to feed product
  feedType: varchar("feed_type", { length: 100 }).notNull(), // grain, hay, silage, supplement, kibble, treats
  feedName: varchar("feed_name", { length: 255 }).notNull(),
  supplier: varchar("supplier", { length: 255 }),
  quantityPerFeeding: decimal("quantity_per_feeding", { precision: 10, scale: 2 }),
  quantityUnit: varchar("quantity_unit", { length: 20 }).default("lbs"), // lbs, kg, bushels, cups, oz
  feedingsPerDay: integer("feedings_per_day").default(2),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  lastPurchaseDate: timestamp("last_purchase_date"),
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).default("0"),
  stockUnit: varchar("stock_unit", { length: 20 }).default("lbs"),
  nutritionAnalysis: jsonb("nutrition_analysis"), // protein, fat, fiber content
  medications: text("medications").array(), // any medications in the feed
  withdrawalPeriod: integer("withdrawal_period"), // days before slaughter/milk consumption
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const livestockHealthRecords = pgTable("livestock_health_records", {
  id: serial("id").primaryKey(),
  herdId: integer("herd_id").references(() => livestockHerds.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  recordDate: timestamp("record_date").defaultNow().notNull(),
  animalCount: integer("animal_count").notNull(), // number of animals examined
  healthIssue: varchar("health_issue", { length: 255 }),
  treatment: text("treatment"),
  medicationUsed: varchar("medication_used", { length: 255 }),
  withdrawalPeriod: integer("withdrawal_period"), // days before products can be used for human consumption
  veterinarian: varchar("veterinarian", { length: 200 }),
  treatmentCost: decimal("treatment_cost", { precision: 10, scale: 2 }),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  attachments: text("attachments").array(), // photos, documents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual farm animals - distinct from pet profiles for livestock tracking  
export const farmAnimals: any = pgTable("farm_animals", {
  id: serial("id").primaryKey(),
  herdId: integer("herd_id").references(() => livestockHerds.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 100 }), // optional name for individual animals
  earTag: varchar("ear_tag", { length: 50 }), // unique ear tag identifier
  microchipId: varchar("microchip_id", { length: 50 }), // microchip identifier
  species: varchar("species", { length: 50 }).notNull(), // cattle, swine, sheep, goat, poultry
  breed: varchar("breed", { length: 100 }),
  gender: varchar("gender", { length: 10 }).notNull(), // male, female, castrated, spayed
  birthDate: timestamp("birth_date"),
  birthWeight: decimal("birth_weight", { precision: 8, scale: 2 }),
  currentWeight: decimal("current_weight", { precision: 8, scale: 2 }),
  weightUnit: varchar("weight_unit", { length: 10 }).default("lbs"),
  damId: integer("dam_id").references(() => farmAnimals.id), // mother reference
  sireId: integer("sire_id").references(() => farmAnimals.id), // father reference
  generation: integer("generation").default(1), // breeding generation
  purpose: varchar("purpose", { length: 50 }), // breeding, dairy, meat, show, working
  acquisitionDate: timestamp("acquisition_date"),
  acquisitionType: varchar("acquisition_type", { length: 50 }), // born_on_farm, purchased, gift, trade
  acquisitionCost: decimal("acquisition_cost", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("active"), // active, sold, deceased, transferred
  statusDate: timestamp("status_date"),
  statusNotes: text("status_notes"),
  isBreeder: boolean("is_breeder").default(false),
  expectedCalvingDate: timestamp("expected_calving_date"), // for pregnant animals
  lastBreedingDate: timestamp("last_breeding_date"),
  profileImageUrl: varchar("profile_image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Breeding records for farm animals
export const breedingRecords = pgTable("breeding_records", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  damId: integer("dam_id").references(() => farmAnimals.id).notNull(), // mother
  sireId: integer("sire_id").references(() => farmAnimals.id), // father (can be external)
  externalSireInfo: text("external_sire_info"), // if sire is not in our system
  breedingDate: timestamp("breeding_date").notNull(),
  breedingMethod: varchar("breeding_method", { length: 50 }).default("natural"), // natural, ai, et
  expectedBirthDate: timestamp("expected_birth_date"),
  actualBirthDate: timestamp("actual_birth_date"),
  gestationDays: integer("gestation_days"),
  offspringCount: integer("offspring_count").default(1),
  offspringIds: integer("offspring_ids").array(), // references to farm_animals
  birthWeight: decimal("birth_weight", { precision: 8, scale: 2 }),
  birthComplications: text("birth_complications"),
  veterinarianAssisted: boolean("veterinarian_assisted").default(false),
  birthCost: decimal("birth_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production records (milk, eggs, wool, etc.)
export const productionRecords = pgTable("production_records", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").references(() => farmAnimals.id).notNull(),
  herdId: integer("herd_id").references(() => livestockHerds.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  recordDate: timestamp("record_date").notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(), // milk, eggs, wool, meat
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // gallons, liters, dozen, lbs, kg
  quality: varchar("quality", { length: 20 }), // grade_a, premium, standard, organic
  butterfatPercentage: decimal("butterfat_percentage", { precision: 4, scale: 2 }), // for milk
  proteinPercentage: decimal("protein_percentage", { precision: 4, scale: 2 }), // for milk
  somaticCellCount: integer("somatic_cell_count"), // for milk quality
  testResults: jsonb("test_results"), // comprehensive test data
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }),
  buyerInfo: varchar("buyer_info", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Animal movement/transfer records
export const animalMovements = pgTable("animal_movements", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").references(() => farmAnimals.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  movementDate: timestamp("movement_date").notNull(),
  movementType: varchar("movement_type", { length: 50 }).notNull(), // transfer, sale, purchase, death, slaughter
  fromLocationId: integer("from_location_id").references(() => livestockHerds.id),
  toLocationId: integer("to_location_id").references(() => livestockHerds.id),
  externalLocation: varchar("external_location", { length: 255 }), // if moving to/from external location
  reason: varchar("reason", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  transportMethod: varchar("transport_method", { length: 100 }),
  healthCertificate: varchar("health_certificate", { length: 255 }),
  documents: text("documents").array(), // bill of sale, health certs, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Farm animal specific products (different from pet products)
export const farmAnimalProducts = pgTable("farm_animal_products", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productType: varchar("product_type", { length: 100 }).notNull(), // feed, medicine, equipment, tool, supplement
  category: varchar("category", { length: 100 }), // dairy_equipment, poultry_feed, cattle_medicine, etc.
  targetSpecies: text("target_species").array(), // cattle, swine, poultry, sheep, goat
  brand: varchar("brand", { length: 100 }),
  manufacturer: varchar("manufacturer", { length: 200 }),
  supplierInfo: varchar("supplier_info", { length: 255 }),
  modelNumber: varchar("model_number", { length: 100 }),
  specifications: jsonb("specifications"), // technical specifications
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 20 }), // bag, gallon, piece, dose
  packageSize: varchar("package_size", { length: 50 }), // 50lb bag, 5gal bucket
  activeIngredients: text("active_ingredients").array(),
  withdrawalPeriod: integer("withdrawal_period"), // days for medications
  approvalStatus: varchar("approval_status", { length: 50 }), // fda_approved, organic_certified, etc.
  safetyWarnings: text("safety_warnings").array(),
  storageRequirements: text("storage_requirements"),
  applicationInstructions: text("application_instructions"),
  dosageInformation: text("dosage_information"),
  productImageUrl: varchar("product_image_url"),
  documentationUrls: text("documentation_urls").array(), // links to manuals, safety sheets
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Information sources and suppliers
export const informationSources = pgTable("information_sources", {
  id: serial("id").primaryKey(),
  sourceName: varchar("source_name", { length: 255 }).notNull(),
  sourceType: varchar("source_type", { length: 50 }).notNull(), // supplier, university, government, research_org, manufacturer
  category: varchar("category", { length: 100 }), // equipment, feed, medicine, education, research
  contactPerson: varchar("contact_person", { length: 200 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("United States"),
  specialties: text("specialties").array(), // dairy, poultry, beef, organic, etc.
  certifications: text("certifications").array(), // organic, iso, fda, etc.
  serviceAreas: text("service_areas").array(), // regions they serve
  businessHours: varchar("business_hours", { length: 255 }),
  establishedYear: integer("established_year"),
  reputation: integer("reputation").default(5), // 1-5 star rating
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Educational and informational resources
export const informationalResources = pgTable("informational_resources", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // article, guide, video, research_paper, webinar, course
  category: varchar("category", { length: 100 }), // health, nutrition, breeding, housing, regulations, economics
  targetSpecies: text("target_species").array(), // cattle, swine, poultry, sheep, goat, general
  topicTags: text("topic_tags").array(), // vaccination, feed_efficiency, biosecurity, etc.
  author: varchar("author", { length: 200 }),
  sourceId: integer("source_id").references(() => informationSources.id), // reference to the source
  publicationDate: timestamp("publication_date"),
  lastUpdated: timestamp("last_updated"),
  contentUrl: varchar("content_url", { length: 500 }),
  downloadUrl: varchar("download_url", { length: 500 }),
  description: text("description"),
  keyPoints: text("key_points").array(), // bullet points of main takeaways
  difficulty: varchar("difficulty", { length: 20 }).default("intermediate"), // beginner, intermediate, advanced
  estimatedReadTime: integer("estimated_read_time"), // minutes
  language: varchar("language", { length: 20 }).default("english"),
  accessType: varchar("access_type", { length: 20 }).default("free"), // free, paid, subscription
  rating: integer("rating"), // user rating 1-5
  viewCount: integer("view_count").default(0),
  isVerified: boolean("is_verified").default(false), // verified by experts
  isFavorite: boolean("is_favorite").default(false), // user bookmarked
  notes: text("notes"), // user's personal notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product reviews and ratings for farm animal products
export const farmProductReviews = pgTable("farm_product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => farmAnimalProducts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 200 }),
  reviewText: text("review_text"),
  useCase: varchar("use_case", { length: 200 }), // what they used it for
  animalSpecies: varchar("animal_species", { length: 50 }), // what animals it was used on
  effectivenessRating: integer("effectiveness_rating"), // 1-5 scale
  valueForMoney: integer("value_for_money"), // 1-5 scale
  wouldRecommend: boolean("would_recommend"),
  purchaseDate: timestamp("purchase_date"),
  usageDuration: integer("usage_duration"), // days used
  sideEffects: text("side_effects").array(),
  pros: text("pros").array(),
  cons: text("cons").array(),
  photos: text("photos").array(),
  isVerified: boolean("is_verified").default(false), // verified purchase
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const animalTags: any = pgTable("animal_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'species', 'breed', 'subspecies', 'size', 'age_group'
  animalCategory: varchar("animal_category", { length: 20 }).default('pet'), // pet, livestock, mixed
  parentId: integer("parent_id").references(() => animalTags.id), // for hierarchical relationships (breed -> species)
  description: text("description"),
  aliases: text("aliases").array(), // alternative names for the same tag
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table linking products to animal tags
export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  tagId: integer("tag_id").references(() => animalTags.id).notNull(),
  relevanceScore: integer("relevance_score").default(100), // 1-100, how relevant this tag is to the product
  addedByUserId: varchar("added_by_user_id").references(() => users.id),
  isVerified: boolean("is_verified").default(false), // admin verified tags
  createdAt: timestamp("created_at").defaultNow(),
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
  productTags: many(productTags),
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

export const animalTagsRelations = relations(animalTags, ({ one, many }) => ({
  parent: one(animalTags, {
    fields: [animalTags.parentId],
    references: [animalTags.id],
    relationName: "parent",
  }),
  children: many(animalTags, { relationName: "parent" }),
  productTags: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(animalTags, {
    fields: [productTags.tagId],
    references: [animalTags.id],
  }),
  addedBy: one(users, {
    fields: [productTags.addedByUserId],
    references: [users.id],
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

export const insertAnimalTagSchema = createInsertSchema(animalTags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductTagSchema = createInsertSchema(productTags).omit({
  id: true,
  createdAt: true,
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
export type AnimalTag = typeof animalTags.$inferSelect;
export type InsertAnimalTag = z.infer<typeof insertAnimalTagSchema>;
export type ProductTag = typeof productTags.$inferSelect;
export type InsertProductTag = z.infer<typeof insertProductTagSchema>;

// Livestock schemas
export const insertLivestockOperationSchema = createInsertSchema(livestockOperations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLivestockHerdSchema = createInsertSchema(livestockHerds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedManagementSchema = createInsertSchema(feedManagement).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLivestockHealthRecordSchema = createInsertSchema(livestockHealthRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFarmAnimalSchema = createInsertSchema(farmAnimals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBreedingRecordSchema = createInsertSchema(breedingRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductionRecordSchema = createInsertSchema(productionRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnimalMovementSchema = createInsertSchema(animalMovements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFarmAnimalProductSchema = createInsertSchema(farmAnimalProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInformationSourceSchema = createInsertSchema(informationSources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInformationalResourceSchema = createInsertSchema(informationalResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFarmProductReviewSchema = createInsertSchema(farmProductReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Livestock types
export type LivestockOperation = typeof livestockOperations.$inferSelect;
export type InsertLivestockOperation = z.infer<typeof insertLivestockOperationSchema>;
export type LivestockHerd = typeof livestockHerds.$inferSelect;
export type InsertLivestockHerd = z.infer<typeof insertLivestockHerdSchema>;
export type FeedManagement = typeof feedManagement.$inferSelect;
export type InsertFeedManagement = z.infer<typeof insertFeedManagementSchema>;
export type LivestockHealthRecord = typeof livestockHealthRecords.$inferSelect;
export type InsertLivestockHealthRecord = z.infer<typeof insertLivestockHealthRecordSchema>;
export type FarmAnimal = typeof farmAnimals.$inferSelect;
export type InsertFarmAnimal = z.infer<typeof insertFarmAnimalSchema>;
export type BreedingRecord = typeof breedingRecords.$inferSelect;
export type InsertBreedingRecord = z.infer<typeof insertBreedingRecordSchema>;
export type ProductionRecord = typeof productionRecords.$inferSelect;
export type InsertProductionRecord = z.infer<typeof insertProductionRecordSchema>;
export type AnimalMovement = typeof animalMovements.$inferSelect;
export type InsertAnimalMovement = z.infer<typeof insertAnimalMovementSchema>;
export type FarmAnimalProduct = typeof farmAnimalProducts.$inferSelect;
export type InsertFarmAnimalProduct = z.infer<typeof insertFarmAnimalProductSchema>;
export type InformationSource = typeof informationSources.$inferSelect;
export type InsertInformationSource = z.infer<typeof insertInformationSourceSchema>;
export type InformationalResource = typeof informationalResources.$inferSelect;
export type InsertInformationalResource = z.infer<typeof insertInformationalResourceSchema>;
export type FarmProductReview = typeof farmProductReviews.$inferSelect;
export type InsertFarmProductReview = z.infer<typeof insertFarmProductReviewSchema>;
