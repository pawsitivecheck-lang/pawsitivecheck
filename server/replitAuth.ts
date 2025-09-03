import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Validate and set session secret
  const sessionSecret = process.env.SESSION_SECRET || 
    `fallback-secret-${process.env.REPL_ID || 'dev'}-${Date.now()}`;
  
  if (!process.env.SESSION_SECRET) {
    console.log('SESSION_SECRET not provided, using generated fallback secret for session security');
  } else {
    console.log('SESSION_SECRET found, using provided secret for session security');
  }
  
  // Create session store with proper fallback handling
  let sessionStore;
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    try {
      console.log('Attempting to use PostgreSQL session store...');
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: databaseUrl,
        createTableIfMissing: true, // Allow table creation for deployment
        ttl: sessionTtl,
        tableName: "sessions"
      });
      console.log('PostgreSQL session store initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL session store:', error);
      console.log('Falling back to memory store for sessions');
      sessionStore = undefined; // This will use the default memory store
    }
  } else {
    console.warn('DATABASE_URL not available, using memory store for sessions (not suitable for production)');
    sessionStore = undefined; // Use default memory store
  }
  
  const sessionConfig = {
    secret: sessionSecret,
    store: sessionStore, // undefined means use default memory store
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  };
  
  // Remove store property if undefined to use default memory store
  if (!sessionStore) {
    delete sessionConfig.store;
  }
  
  console.log(`Session configuration: ${sessionStore ? 'PostgreSQL' : 'Memory'} store, ${process.env.NODE_ENV === 'production' ? 'secure' : 'non-secure'} cookies`);
  
  return session(sessionConfig);
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.id = user.claims?.sub; // Set the user ID from claims for API routes
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  try {
    console.log('Setting up authentication and session middleware...');
    
    app.set("trust proxy", 1);
    
    // Initialize session middleware with error handling
    const sessionMiddleware = getSession();
    app.use(sessionMiddleware);
    console.log('Session middleware initialized successfully');
    
    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('Passport middleware initialized successfully');

    // Initialize OIDC configuration
    const config = await getOidcConfig();
    console.log('OIDC configuration loaded successfully');

    const verify: VerifyFunction = async (
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      verified(null, user);
    };

    // Set up authentication strategies for each domain
    for (const domain of process.env
      .REPLIT_DOMAINS!.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      console.log(`Authentication strategy registered for domain: ${domain}`);
    }

    // Google OAuth Strategy (if credentials are available)
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (!user) {
            // Check if user exists with this email
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await storage.getUserByEmail(email);
              
              if (user) {
                // Link Google account to existing user
                await storage.upsertUser({
                  ...user,
                  googleId: profile.id,
                  authProvider: 'google',
                });
              } else {
                // Create new user
                user = await storage.upsertUser({
                  email: email,
                  firstName: profile.name?.givenName,
                  lastName: profile.name?.familyName,
                  profileImageUrl: profile.photos?.[0]?.value,
                  googleId: profile.id,
                  authProvider: 'google',
                });
              }
            }
          }
          
          if (user) {
            const sessionUser = {
              id: user.id,
              claims: {
                sub: user.id,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                profile_image_url: user.profileImageUrl,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
              },
              expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
            };
            return done(null, sessionUser);
          }
          
          return done(new Error('Failed to create or find user'), undefined);
        } catch (error) {
          return done(error, undefined);
        }
      }));
      console.log('Google OAuth strategy registered');
    }

    // Local Strategy (email/password)
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        
        if (!user || !user.passwordHash) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        const sessionUser = {
          id: user.id,
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
          },
          expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
        };
        
        return done(null, sessionUser);
      } catch (error) {
        return done(error, undefined);
      }
    }));
    console.log('Local authentication strategy registered');

    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    // Set up authentication routes
    
    // Replit OAuth routes
    app.get("/api/login", (req, res, next) => {
      // Store redirect URL in session if provided
      if (req.query.redirect) {
        (req.session as any).redirectAfterLogin = req.query.redirect;
      }
      
      passport.authenticate(`replitauth:${req.hostname}`, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    });

    app.get("/api/callback", (req, res, next) => {
      passport.authenticate(`replitauth:${req.hostname}`, {
        failureRedirect: "/api/login",
      })(req, res, (err: any) => {
        if (err) {
          return next(err);
        }
        
        // Check for stored redirect URL
        const redirectUrl = (req.session as any).redirectAfterLogin || "/";
        delete (req.session as any).redirectAfterLogin; // Clear it after use
        
        res.redirect(redirectUrl);
      });
    });

    // Google OAuth routes
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      app.get("/api/auth/google", 
        passport.authenticate("google", { scope: ["profile", "email"] })
      );

      app.get("/api/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/login" }),
        (req, res) => {
          res.redirect("/");
        }
      );
    }

    // Local authentication routes (email/password)
    app.post("/api/auth/login", (req, res, next) => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ message: "Authentication error" });
        }
        if (!user) {
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: "Login error" });
          }
          return res.json({ success: true, user: { id: user.id, email: user.claims.email } });
        });
      })(req, res, next);
    });

    app.post("/api/auth/register", async (req, res) => {
      try {
        const { email, password, firstName, lastName } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({ message: "User already exists with this email" });
        }
        
        // Create new user
        const user = await storage.createUserWithPassword({
          email,
          firstName,
          lastName,
        }, password);
        
        // Log in the new user
        const sessionUser = {
          id: user.id,
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
          },
          expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
        };
        
        req.logIn(sessionUser, (err) => {
          if (err) {
            return res.status(500).json({ message: "Registration successful but login failed" });
          }
          return res.json({ success: true, user: { id: user.id, email: user.email } });
        });
        
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
      }
    });

    // Universal logout (works for all auth methods)
    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
    
    console.log('Authentication setup completed successfully');
  } catch (error) {
    console.error('Failed to set up authentication:', error);
    
    // Add basic session middleware even if auth setup fails
    if (!app._router || !app._router.stack.some((layer: any) => layer.name === 'session')) {
      console.log('Adding fallback session middleware...');
      try {
        app.use(getSession());
        console.log('Fallback session middleware added successfully');
      } catch (sessionError) {
        console.error('Failed to add fallback session middleware:', sessionError);
        const errorMessage = sessionError instanceof Error ? sessionError.message : 'Unknown session error';
        throw new Error(`Express session setup failed: ${errorMessage}`);
      }
    }
    
    // Re-throw the error if it's critical
    if (error instanceof Error && error.message.includes('REPLIT_DOMAINS')) {
      throw error;
    }
    
    console.warn('Authentication setup failed, but server will continue with limited functionality');
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  
  console.log("Authentication check - isAuthenticated():", req.isAuthenticated());
  console.log("User object:", user);
  console.log("User ID:", user?.id);

  if (!req.isAuthenticated() || !user || !user.expires_at) {
    console.log("Authentication failed: not authenticated or no expires_at");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Ensure user.id is set if it's missing but claims.sub exists
  if (!user.id && user.claims?.sub) {
    user.id = user.claims.sub;
    console.log("Fixed missing user.id:", user.id);
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > user.expires_at) {
    const refreshToken = user.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const config = await getOidcConfig();
      const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
      updateUserSession(user, tokenResponse);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Check if user is admin in the database
  try {
    const userId = user.claims.sub;
    const dbUser = await storage.getUser(userId);
    
    if (!dbUser || !dbUser.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error('Admin check failed:', error);
    return res.status(500).json({ message: "Server error" });
  }
};

