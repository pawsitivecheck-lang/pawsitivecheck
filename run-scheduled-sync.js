#!/usr/bin/env node

/**
 * PawsitiveCheck Scheduled Sync Runner
 * 
 * This script runs automated product scraping for Replit Scheduled Deployments.
 * It handles all major retailer syncs and provides comprehensive logging.
 */

const { execSync } = require('child_process');

// Configuration - matches available scrapers
const SYNC_TYPES = [
  'walmart',
  'samsclub', 
  'petsmart',
  'petco',
  'tractorsupply',
  'familyfarm',
  'kroger',
  'meijer',
  'target',
  'costco',
  'amazon',
  'feederspetsupply',
  'bjs',
  'ruralking'
];

function logMessage(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function runCommand(command, description) {
  try {
    logMessage(`Starting: ${description}`);
    const output = execSync(command, { 
      encoding: 'utf8', 
      timeout: 600000, // 10 minute timeout per command
      stdio: ['ignore', 'pipe', 'pipe']
    });
    logMessage(`✅ Completed: ${description}`);
    if (output.trim()) {
      logMessage(`Output: ${output.trim()}`);
    }
    return true;
  } catch (error) {
    logMessage(`❌ Failed: ${description}`);
    logMessage(`Error: ${error.message}`);
    return false;
  }
}

async function main() {
  logMessage('🚀 Starting PawsitiveCheck Scheduled Sync');
  logMessage(`Environment: ${process.env.NODE_ENV || 'production'}`);
  
  let successCount = 0;
  let failureCount = 0;
  
  // Check if we have the required environment variables
  if (!process.env.DATABASE_URL) {
    logMessage('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }
  
  if (!process.env.ANTHROPIC_API_KEY) {
    logMessage('⚠️  ANTHROPIC_API_KEY not found - AI analysis may not work');
  }
  
  // Run each sync type
  for (const syncType of SYNC_TYPES) {
    const success = runCommand(
      `npx tsx server/run-sync.ts ${syncType}`,
      `${syncType.toUpperCase()} product sync`
    );
    
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay between syncs to be gentle on APIs
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  logMessage('📊 Sync Summary:');
  logMessage(`✅ Successful: ${successCount}/${SYNC_TYPES.length}`);
  logMessage(`❌ Failed: ${failureCount}/${SYNC_TYPES.length}`);
  
  if (failureCount > 0) {
    logMessage('⚠️  Some syncs failed - check logs above');
    process.exit(1);
  } else {
    logMessage('🎉 All syncs completed successfully!');
    process.exit(0);
  }
}

// Handle process signals gracefully
process.on('SIGTERM', () => {
  logMessage('📛 Received SIGTERM - shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logMessage('📛 Received SIGINT - shutting down gracefully'); 
  process.exit(0);
});

main().catch(error => {
  logMessage(`💥 Unexpected error: ${error.message}`);
  process.exit(1);
});