import { logger } from './logger';
import { storage } from './storage';

// Import all the scraper classes
import { WalmartScraper } from './services/walmart-scraper';
import { SamsClubScraper } from './services/samsclub-scraper';
import { PetSmartScraper } from './services/petsmart-scraper';
import { PetcoScraper } from './services/petco-scraper';
import { TractorSupplyScraper } from './services/tractorsupply-scraper';
import { FamilyFarmAndHomeScraper } from './services/familyfarmandhome-scraper';
import { KrogerScraper } from './services/kroger-scraper';
import { MeijerScraper } from './services/meijer-scraper';
import { TargetScraper } from './services/target-scraper';
import { CostcoScraper } from './services/costco-scraper';
import { AmazonScraper } from './services/amazon-scraper';
import { FeedersPetSupplyScraper } from './services/feederspetsupply-scraper';
import { BjsScraper } from './services/bjs-scraper';
import { RuralKingScraper } from './services/ruralking-scraper';

// Scraper instances and method mapping
const SCRAPERS: Record<string, () => Promise<any>> = {
  'walmart': () => new WalmartScraper().scrapePetProducts(),
  'samsclub': () => new SamsClubScraper().scrapePetProducts(),
  'petsmart': () => new PetSmartScraper().scrapePetProducts(),
  'petco': () => new PetcoScraper().scrapePetProducts(),
  'tractorsupply': () => new TractorSupplyScraper().scrapeAnimalCareProducts(),
  'familyfarm': () => new FamilyFarmAndHomeScraper().scrapeAnimalCareProducts(),
  'kroger': () => new KrogerScraper().scrapePetProducts(),
  'meijer': () => new MeijerScraper().scrapePetProducts(),
  'target': () => new TargetScraper().scrapePetProducts(),
  'costco': () => new CostcoScraper().scrapePetProducts(),
  'amazon': () => new AmazonScraper().scrapeAnimalCareProducts(),
  'feederspetsupply': () => new FeedersPetSupplyScraper().scrapeAnimalCareProducts(),
  'bjs': () => new BjsScraper().scrapeAnimalCareProducts(),
  'ruralking': () => new RuralKingScraper().scrapeAnimalCareProducts()
};

async function runSync(syncType: string): Promise<void> {
  try {
    logger.info('general', `Starting ${syncType} sync`);
    
    const scraper = SCRAPERS[syncType];
    if (!scraper) {
      throw new Error(`Unknown sync type: ${syncType}`);
    }
    
    // Run the scraper
    const result = await scraper();
    const products = result.products || [];
    
    logger.info('general', `${syncType} sync completed: ${products.length} products processed`);
    
  } catch (error) {
    logger.error('general', `${syncType} sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const syncType = process.argv[2];
  
  if (!syncType) {
    console.error('Usage: npx tsx server/run-sync.ts <sync-type>');
    console.error('Available sync types:', Object.keys(SCRAPERS).join(', '));
    process.exit(1);
  }
  
  runSync(syncType)
    .then(() => {
      logger.info('general', `${syncType} sync completed successfully`);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('general', `${syncType} sync failed: ${error.message}`);
      process.exit(1);
    });
}