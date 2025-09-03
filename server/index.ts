import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { sql } from "drizzle-orm";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { logger } from "./logger";

const app = express();

// Security headers
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self'; child-src 'self'");
  } else {
    // Development mode - disable CSP to prevent conflicts with Vite/Replit tools
    res.removeHeader('Content-Security-Policy');
  }
  next();
});

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://059083a2-a2a5-4ec8-a102-d74ccfb64f20.replit.app',
      'https://059083a2-a2a5-4ec8-a102-d74ccfb64f20.replit.dev', 
      'https://pawsitivecheck.com',
      /\.replit\.app$/,
      /\.replit\.dev$/
    ];
    
    // Development mode - allow localhost
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push(/^http:\/\/localhost:\d+$/);
      allowedOrigins.push(/^http:\/\/127\.0\.0\.1:\d+$/);
    }
    
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return origin === pattern;
      if (pattern instanceof RegExp) return pattern.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.securityEvent('CORS policy violation', 'medium', { origin });
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting configuration
const createRateLimiter = (windowMs: number, max: number, message: string) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.securityEvent('Rate limit exceeded', 'high', { ip: req.ip, path: req.path });
    res.status(429).json({ error: message });
  }
});

// Apply different rate limits to different endpoints
app.use('/api/auth', createRateLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts'));
app.use('/api/reviews', createRateLimiter(15 * 60 * 1000, 30, 'Too many review submissions'));
app.use('/api/products', createRateLimiter(60 * 1000, 100, 'Too many product requests'));
app.use('/api/admin', createRateLimiter(5 * 60 * 1000, 50, 'Too many admin requests'));
app.use('/api', createRateLimiter(15 * 60 * 1000, 200, 'Too many API requests'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Cache control middleware
app.use((req, res, next) => {
  const path = req.path;
  
  // Static assets get aggressive caching with content-based headers
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    // If file has hash in name, cache for 1 year
    if (path.match(/-[a-f0-9]{8,}\./)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      // Regular static assets cache for 1 hour with must-revalidate
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    res.setHeader('ETag', `"${Date.now()}"`);
  }
  // HTML files should not be cached aggressively
  else if (path.match(/\.html$/) || path === '/') {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.setHeader('ETag', `"${Date.now()}"`);
  }
  // API endpoints get short cache with validation
  else if (path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  // Service worker and manifest should never be cached
  else if (path.match(/\/(sw\.js|manifest\.json)$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Redirect specific .replit.app domain to custom domain
app.use((req, res, next) => {
  const host = req.get('host');
  if (host === 'pawsitive-check-leirsteinv.replit.app') {
    const redirectUrl = `https://pawsitivecheck.com${req.originalUrl}`;
    return res.redirect(301, redirectUrl);
  }
  next();
});

// DNT (Do Not Track) detection middleware
app.use((req, res, next) => {
  const dntHeader = req.get('DNT') || req.get('dnt');
  const isDNT = dntHeader === '1';
  
  // Inject DNT status into HTML for frontend access
  res.locals.isDNT = isDNT;
  
  // Add DNT response header
  if (isDNT) {
    res.set('Tk', 'N'); // Tracking Status: Not tracking
  } else {
    res.set('Tk', 'T'); // Tracking Status: Tracking with consent
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoints
app.get('/health', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/health/ready', async (req, res) => {
  try {
    // Check database connectivity
    const { db } = await import('./db');
    await db.execute(sql`SELECT 1`);
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.healthCheck('unhealthy', 'database', { error: error instanceof Error ? error.message : 'Unknown error' });
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
