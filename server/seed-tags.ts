import { db } from "./db";
import { animalTags, productTags } from "@shared/schema";

async function seedAnimalTags() {
  console.log("🏷️  Seeding animal tags...");

  // Species tags (top level)
  const speciesData = [
    { name: "Dog", type: "species", description: "Domestic dog species" },
    { name: "Cat", type: "species", description: "Domestic cat species" },
    { name: "Bird", type: "species", description: "Avian species" },
    { name: "Rabbit", type: "species", description: "Domestic rabbit species" },
    { name: "Ferret", type: "species", description: "Domestic ferret species" },
    { name: "Guinea Pig", type: "species", description: "Guinea pig species" },
    { name: "Hamster", type: "species", description: "Hamster species" },
    { name: "Fish", type: "species", description: "Aquatic fish species" },
    { name: "Reptile", type: "species", description: "Reptilian species" },
    { name: "Horse", type: "species", description: "Equine species" },
    { name: "Cow", type: "species", description: "Bovine species" },
    { name: "Pig", type: "species", description: "Swine species" },
    { name: "Chicken", type: "species", description: "Poultry species" },
    { name: "Goat", type: "species", description: "Caprine species" },
    { name: "Sheep", type: "species", description: "Ovine species" },
  ];

  const species = await db.insert(animalTags).values(speciesData).returning();
  console.log(`✅ Created ${species.length} species tags`);

  // Create a map for quick species lookup
  const speciesMap = new Map(species.map(s => [s.name, s.id]));

  // Dog breeds
  const dogBreeds = [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Bulldog", "Poodle",
    "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Siberian Husky",
    "Boxer", "Great Dane", "Chihuahua", "Shih Tzu", "Boston Terrier"
  ];

  const dogBreedData = dogBreeds.map(breed => ({
    name: breed,
    type: "breed" as const,
    parentId: speciesMap.get("Dog")!,
    description: `${breed} dog breed`
  }));

  // Cat breeds
  const catBreeds = [
    "Persian", "Maine Coon", "British Shorthair", "Ragdoll", "Abyssinian",
    "Russian Blue", "Siamese", "American Shorthair", "Scottish Fold", "Sphynx",
    "Bengal", "Norwegian Forest Cat", "Birman", "Oriental Shorthair", "Devon Rex"
  ];

  const catBreedData = catBreeds.map(breed => ({
    name: breed,
    type: "breed" as const,
    parentId: speciesMap.get("Cat")!,
    description: `${breed} cat breed`
  }));

  // Bird types
  const birdTypes = [
    "Parakeet", "Cockatiel", "Canary", "Finch", "Parrot",
    "Cockatoo", "Lovebird", "Conure", "Macaw", "African Grey"
  ];

  const birdTypeData = birdTypes.map(type => ({
    name: type,
    type: "breed" as const,
    parentId: speciesMap.get("Bird")!,
    description: `${type} bird type`
  }));

  // Insert all breeds
  const allBreeds = [...dogBreedData, ...catBreedData, ...birdTypeData];
  const breeds = await db.insert(animalTags).values(allBreeds).returning();
  console.log(`✅ Created ${breeds.length} breed tags`);

  // Size categories
  const sizeData = [
    { name: "Toy", type: "size", description: "Very small pets (under 10 lbs)" },
    { name: "Small", type: "size", description: "Small pets (10-25 lbs)" },
    { name: "Medium", type: "size", description: "Medium pets (25-60 lbs)" },
    { name: "Large", type: "size", description: "Large pets (60-100 lbs)" },
    { name: "Giant", type: "size", description: "Giant pets (over 100 lbs)" },
  ];

  const sizes = await db.insert(animalTags).values(sizeData).returning();
  console.log(`✅ Created ${sizes.length} size tags`);

  // Age groups
  const ageData = [
    { name: "Puppy/Kitten", type: "age_group", description: "Young animals under 1 year" },
    { name: "Adult", type: "age_group", description: "Adult animals 1-7 years" },
    { name: "Senior", type: "age_group", description: "Senior animals over 7 years" },
    { name: "All Life Stages", type: "age_group", description: "Suitable for all ages" },
  ];

  const ageGroups = await db.insert(animalTags).values(ageData).returning();
  console.log(`✅ Created ${ageGroups.length} age group tags`);

  // Add some product tags for existing products
  console.log("🔗 Adding sample product tags...");
  
  // Just add tags for the first few product IDs that likely exist
  const sampleProductTags = [
    { productId: 1, tagId: speciesMap.get("Dog")!, relevanceScore: 95 },
    { productId: 1, tagId: breeds.find(b => b.name === "Golden Retriever")?.id!, relevanceScore: 90 },
    { productId: 1, tagId: sizes.find(s => s.name === "Large")?.id!, relevanceScore: 85 },
    { productId: 2, tagId: speciesMap.get("Cat")!, relevanceScore: 95 },
    { productId: 2, tagId: breeds.find(b => b.name === "Persian")?.id!, relevanceScore: 88 },
    { productId: 3, tagId: speciesMap.get("Dog")!, relevanceScore: 92 },
    { productId: 3, tagId: ageGroups.find(a => a.name === "Puppy/Kitten")?.id!, relevanceScore: 95 },
    { productId: 4, tagId: speciesMap.get("Bird")!, relevanceScore: 90 },
    { productId: 4, tagId: breeds.find(b => b.name === "Parakeet")?.id!, relevanceScore: 85 },
    { productId: 5, tagId: speciesMap.get("Cat")!, relevanceScore: 93 },
    { productId: 5, tagId: ageGroups.find(a => a.name === "All Life Stages")?.id!, relevanceScore: 100 },
  ].filter(tag => tag.tagId); // Remove any undefined tagIds

  if (sampleProductTags.length > 0) {
    try {
      await db.insert(productTags).values(sampleProductTags);
      console.log(`✅ Created ${sampleProductTags.length} sample product tags`);
    } catch (error) {
      console.log(`⚠️  Skipped adding product tags (products may not exist yet): ${error.message}`);
    }
  }

  console.log("🎉 Animal tags seeding completed!");
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAnimalTags()
    .then(() => {
      console.log("✨ Seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedAnimalTags };