# PawsitiveCheck - Pet Product Safety Analysis Platform

## Overview

PawsitiveCheck is a full-stack web application designed to help pet owners evaluate the safety of pet products through mystical-themed product analysis. The platform combines product scanning, safety scoring, community reviews, and recall tracking to provide comprehensive pet product transparency. Built with a cosmic/mystical theme, it features product analysis with "cosmic scores," community engagement through reviews, and administrative oversight for product recalls and blacklisted ingredients.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with authentication-based route protection
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom cosmic/mystical theme variables and animations
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints organized by feature domains (products, reviews, recalls, admin)
- **Authentication**: Replit's OpenID Connect (OIDC) integration with Passport.js strategy
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

### Database Layer
- **Primary Database**: PostgreSQL via Neon serverless with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Normalized relational design with tables for users, products, reviews, recalls, ingredient blacklists, and scan history
- **Database Features**: Generated UUIDs, timestamps, indexes for performance optimization

### Authentication & Authorization
- **Identity Provider**: Replit OIDC for user authentication
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access control with admin privileges for certain operations
- **Security**: HTTP-only cookies, CSRF protection, secure session configuration

### File Structure Organization
- **Monorepo Structure**: Shared TypeScript code between client and server
- **Client Code**: React application in `/client` directory with component-based architecture
- **Server Code**: Express API server in `/server` directory with modular route organization  
- **Shared Code**: Common TypeScript interfaces and schemas in `/shared` directory
- **Configuration**: Centralized config files for build tools, TypeScript, and database

### Development Workflow
- **Development Server**: Concurrent client and server development with hot module replacement
- **Build Process**: Vite for client bundling, esbuild for server compilation
- **Type Safety**: Comprehensive TypeScript coverage across frontend, backend, and shared code
- **Database Migrations**: Drizzle Kit for schema versioning and database updates

## External Dependencies

### Core Infrastructure
- **Database Hosting**: Neon PostgreSQL serverless database with WebSocket support
- **Authentication Service**: Replit's OpenID Connect identity provider
- **Session Storage**: PostgreSQL-based session management with automatic cleanup

### Frontend Libraries
- **UI Framework**: React 18 with TypeScript support
- **Component Library**: Comprehensive Radix UI primitive collection for accessible components
- **Styling System**: Tailwind CSS with PostCSS processing and custom design tokens
- **Data Fetching**: TanStack React Query for server state management and optimistic updates
- **Routing**: Wouter for lightweight client-side routing
- **Form Management**: React Hook Form with Hookform resolvers for validation integration

### Backend Services
- **Web Framework**: Express.js with TypeScript support and middleware ecosystem
- **Database Client**: Neon serverless PostgreSQL driver with WebSocket connection pooling
- **ORM**: Drizzle ORM with PostgreSQL dialect and Zod schema validation
- **Authentication**: Passport.js with OpenID Connect strategy for Replit integration
- **Session Management**: Express-session with PostgreSQL store backend

### Development Tools  
- **Build System**: Vite for frontend bundling with React plugin support
- **Compilation**: esbuild for fast TypeScript compilation and bundling
- **Development Environment**: Replit-specific plugins for runtime error handling and cartographer integration
- **Database Tooling**: Drizzle Kit for migrations and schema management

## Recent Changes

### September 3, 2025 - Sam's Club Product Integration
- **Multi-Retailer Expansion**: Added comprehensive Sam's Club product scraping alongside existing Walmart functionality
- **SamsClubScraper Service**: Built dedicated scraper for warehouse club pet products including:
  - Member's Mark private label products with bulk sizing (40lb dog food, 22lb cat food, etc.)
  - Premium brands (Purina Pro Plan twin packs, Blue Buffalo wilderness, Nutro Ultra)
  - Specialty items (Greenies dental treats bulk packs, KONG puppy bundles, Tidy Cats litter systems)
- **Warehouse Club Categories**: Expanded database with 12 new categories optimized for bulk pet product purchases
- **Admin API Endpoint**: Added `/api/admin/sync/samsclub-products` for bulk importing Sam's Club inventory
- **Database Integration**: Successfully integrated 9 new warehouse-sized pet products (IDs 229-237) with proper categorization and ingredient mapping
- **Testing Verification**: Confirmed complete scraping pipeline from product collection through database storage

### September 3, 2025 - Production Readiness Improvements
- **Security Enhancements**: Added CORS configuration with domain allowlisting and express-rate-limit middleware to prevent API abuse
- **Health Monitoring**: Implemented comprehensive health check endpoints (`/health`, `/health/ready`) with database connectivity verification
- **Code Splitting**: Added React.lazy() code splitting for admin components reducing initial bundle size
- **Structured Logging**: Replaced console.log with production-grade logging system featuring:
  - Log levels (error, warn, info, debug) with contextual categorization
  - User tracking and metadata support for debugging
  - Security event logging for rate limits and CORS violations
  - Health monitoring logs for system status tracking
- **Testing Infrastructure**: Set up Vitest testing framework with React Testing Library including:
  - Browser API mocking (matchMedia, IntersectionObserver, ResizeObserver)
  - Component smoke tests and health endpoint verification
  - Test configuration with proper JSX transformation and module resolution

### September 1, 2025 - Automated CI/CD Pipeline for Android Builds
- **GitHub Actions Integration**: Set up automated Android APK builds eliminating need for local Android SDK
- **Dual Workflow System**: 
  - `android-build.yml`: Automatic debug builds on every push to main/master with 30-day artifact retention
  - `android-release.yml`: Signed release builds triggered by version tags with automatic GitHub releases
- **Capacitor Configuration**: Enhanced config with androidScheme and allowMixedContent for better compatibility
- **Build Pipeline**: Complete web app → Android APK pipeline using Node.js 20, Java 17, and Android SDK
- **Documentation**: Comprehensive setup guide in `.github/ANDROID_BUILD_SETUP.md` with usage instructions
- **React Application Fixes**: Resolved critical "Invalid hook call" errors that were preventing app loading
- **Production Build Verification**: Confirmed successful build process (1,261.90 kB bundle, 13.57s build time)

## Recent Changes

### August 30, 2025 - Database Curation & Geographic Filtering
- **Product Database Cleanup**: Removed 16 non-animal care products including human food items (hot dogs) and unverified "Unknown Brand" entries
- **Geographic Market Focus**: Updated product sync logic to prioritize products sold in U.S. & Canada markets only
- **Enhanced Product Filtering**: Implemented strict filtering functions to ensure only animal care products are added:
  - `isAnimalCareProduct()`: Filters out human food and non-animal products using keyword analysis
  - `checkNorthAmericanAvailability()`: Verifies products are available in North American markets
  - `determineAnimalCareCategory()`: Automatically categorizes products into specific animal care categories
- **Improved API Integration**: Updated Open Pet Food Facts sync to target animal care categories specifically
- **Database Quality**: Reduced product count from 57 to 45 high-quality, verified animal care products
- **Category Standardization**: Updated generic categories (habitat→reptile-habitat, aquarium→aquarium-supplies) for better organization

### August 25, 2025 - Real API Integration & Comprehensive Animal Care Management
- **Real API Integration**: Connected platform to live USDA NASS Quick Stats API and FDA Animal & Veterinary API with proper authentication using real API keys
- **Livestock Database**: Expanded to include 46 products with 8 livestock-specific feeds and ingredients including beef cattle, dairy cow, swine, sheep/goat, and poultry feeds  
- **Animal Health Management**: Added comprehensive health management tab to herd profiles featuring:
  - Vaccination scheduling and tracking with color-coded status indicators
  - Health monitoring dashboard with body condition scoring and alerts
  - Veterinary care tracking including appointments, treatments, and follow-ups
  - Medical record management with integrated health and medical event tracking
- **Enhanced Herd Profiles**: Expanded navigation from 5 to 6 tabs including dedicated health management section for complete animal care oversight
- **API Integration**: Real-time data fetching from USDA NASS for livestock statistics and FDA FoodData Central for feed nutrition information

### August 24, 2025 - Legal Compliance & Privacy Framework
- **Legal Pages**: Added comprehensive Privacy Policy and Terms of Service pages with detailed user agreements
- **Cookie Management**: Implemented advanced cookie consent system with granular controls for four categories:
  - Necessary cookies (always required for basic functionality)
  - Functional cookies (user preferences and settings)
  - Analytics cookies (usage tracking and improvements)
  - Marketing cookies (personalized content and recommendations)
- **User Controls**: Cookie preferences can be managed through popup, footer links, or account settings
- **Compliance**: Enhanced data protection compliance with GDPR/CCPA-style privacy controls

### August 24, 2025 - Modern Typography & Enhanced UX
- **Typography Upgrade**: Replaced decorative fonts with modern Plus Jakarta Sans for headers
- **Font Stack**: Improved system font fallbacks for better cross-platform consistency
- **Navigation Enhancement**: User-friendly navigation with clear labels and mobile hamburger menu
- **Accessibility**: Better mobile experience with touch-friendly controls and responsive design

### August 24, 2025 - Advanced Product Scanning System
- **Multi-Modal Scanner**: Three scanning modes integrated into unified interface:
  - Real barcode scanning using device camera with html5-qrcode library
  - Image recognition for product photos with react-webcam integration
  - Internet product search with mock external API integration
- **Database Integration**: Automatic product discovery and storage from internet searches
- **Enhanced Branding**: Custom mystical pawprint logo with checkmark for brand consistency