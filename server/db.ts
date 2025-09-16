import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { logger } from "./logger";

// Configure Neon for optimal performance
neonConfig.webSocketConstructor = ws;
// Disable poolQueryViaFetch to avoid connection issues
neonConfig.poolQueryViaFetch = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Production-optimized pool settings
  max: process.env.NODE_ENV === 'production' ? 20 : 10, // Maximum connections in pool
  min: process.env.NODE_ENV === 'production' ? 5 : 2,   // Minimum connections to maintain
  idleTimeoutMillis: 30000,    // 30 seconds idle timeout
  connectionTimeoutMillis: 5000, // 5 seconds connection timeout
  maxUses: 7500,               // Maximum uses per connection before cycling
  allowExitOnIdle: true,       // Allow process to exit when all connections idle
};

export const pool = new Pool(poolConfig);

// Add pool event listeners for monitoring
pool.on('connect', (client) => {
  logger.info('db', 'New database connection established', { 
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

pool.on('error', (err) => {
  logger.error('db', 'Database pool error', { error: err.message });
});

pool.on('remove', () => {
  logger.info('db', 'Database connection removed from pool', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

// Enhanced Drizzle configuration with query logging
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: process.env.NODE_ENV === 'development' ? {
    logQuery: (query: string, params: unknown[]) => {
      logger.info('db', 'Query executed', { 
        query: query.substring(0, 150) + (query.length > 150 ? '...' : ''),
        paramCount: params.length
      });
    }
  } : false
});

// Database health check function
export async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const responseTime = Date.now() - start;
    
    return {
      healthy: true,
      responseTime,
      poolStats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    logger.error('db', 'Database health check failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      poolStats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  }
}

// Graceful pool shutdown
export async function closePool() {
  try {
    await pool.end();
    logger.info('db', 'Database pool closed gracefully');
  } catch (error) {
    logger.error('db', 'Error closing database pool', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
}