import { storage } from './storage';
import { analyzeProductSafety } from './ai-service';
import { logger } from './logger';

async function analyzeRemainingProducts() {
  logger.info('general', 'Starting analysis of remaining unanalyzed products');
  
  try {
    // Get all unanalyzed products
    const allProducts = await storage.getProducts(500, 0);
    const unanalyzedProducts = allProducts.filter(p => 
      p.cosmicScore === 0 || p.cosmicClarity === 'unknown' || !p.lastAnalyzed
    );
    
    logger.info('general', `Found ${unanalyzedProducts.length} products needing analysis`);
    
    if (unanalyzedProducts.length === 0) {
      logger.info('general', 'All products already analyzed!');
      return;
    }
    
    let analyzedCount = 0;
    let errorCount = 0;
    
    // Process in smaller batches to avoid API rate limits
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < unanalyzedProducts.length; i += batchSize) {
      batches.push(unanalyzedProducts.slice(i, i + batchSize));
    }
    
    logger.info('general', `Processing ${batches.length} batches of ${batchSize} products each`);
    
    for (const [batchIndex, batch] of batches.entries()) {
      logger.info('general', `Processing batch ${batchIndex + 1}/${batches.length}`);
      
      // Process batch products sequentially to be gentle on API
      for (const product of batch) {
        try {
          logger.info('general', `Analyzing: ${product.name} (${product.brand})`);
          
          const analysis = await analyzeProductSafety({
            name: product.name,
            brand: product.brand || 'Unknown',
            category: product.category,
            description: product.description || '',
            ingredients: product.ingredients || ''
          });
          
          // Update product with analysis results
          await storage.updateProduct(product.id, {
            cosmicScore: analysis.cosmicScore,
            cosmicClarity: analysis.cosmicClarity,
            transparencyLevel: analysis.transparencyLevel,
            suspiciousIngredients: analysis.suspiciousIngredients,
            disposalInstructions: analysis.disposalInstructions,
            lastAnalyzed: new Date()
          } as any);
          
          analyzedCount++;
          logger.info('general', `✓ ${product.name}: ${analysis.cosmicScore}/100 (${analysis.cosmicClarity})`);
          
          // Small delay to be gentle on API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          errorCount++;
          logger.error('general', `Failed to analyze ${product.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Delay between batches
      if (batchIndex < batches.length - 1) {
        logger.info('general', `Batch ${batchIndex + 1} completed. Waiting before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    logger.info('general', `Analysis completed: ${analyzedCount} products analyzed, ${errorCount} errors`);
    
    // Get final statistics
    const finalProducts = await storage.getProducts(500, 0);
    const analyzedProductsCount = finalProducts.filter(p => p.cosmicScore > 0).length;
    const analysisPercentage = ((analyzedProductsCount / finalProducts.length) * 100).toFixed(1);
    
    logger.info('general', `Final stats: ${analyzedProductsCount}/${finalProducts.length} products analyzed (${analysisPercentage}%)`);
    
    // Show breakdown by cosmic clarity
    const blessed = finalProducts.filter(p => p.cosmicClarity === 'blessed').length;
    const questionable = finalProducts.filter(p => p.cosmicClarity === 'questionable').length;
    const cursed = finalProducts.filter(p => p.cosmicClarity === 'cursed').length;
    
    logger.info('general', `Analysis breakdown: ${blessed} blessed, ${questionable} questionable, ${cursed} cursed products`);
    
  } catch (error) {
    logger.error('general', `Bulk analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  process.exit(0);
}

analyzeRemainingProducts();