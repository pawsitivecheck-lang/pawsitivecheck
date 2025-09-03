# PawsitiveCheck - Pet Product Safety Analysis Platform

## Overview
PawsitiveCheck is a full-stack web application designed to help pet owners evaluate the safety of pet products through mystical-themed product analysis. The platform combines product scanning, safety scoring, community reviews, and recall tracking to provide comprehensive pet product transparency. It aims to offer cosmic-themed product analysis, community engagement, and administrative oversight for product recalls and blacklisted ingredients, with a vision for broader market potential in pet product safety.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript using Vite.
- **Routing**: Wouter with authentication-based protection.
- **UI Components**: Radix UI primitives with shadcn/ui design system.
- **Styling**: Tailwind CSS with custom cosmic/mystical theme variables.
- **State Management**: TanStack React Query for server state and caching.
- **Form Handling**: React Hook Form with Zod validation.
- **UX Decisions**: Modern Plus Jakarta Sans typography, user-friendly navigation, mobile-friendly design, and a custom mystical pawprint logo.
- **Product Scanning**: Multi-modal scanner including barcode scanning (html5-qrcode), image recognition (react-webcam), and internet product search.
- **Legal & Privacy**: Comprehensive Privacy Policy, Terms of Service, and a granular cookie consent system.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful endpoints organized by feature domains.
- **Authentication**: Replit's OpenID Connect (OIDC) integration with Passport.js.
- **Session Management**: Express sessions with PostgreSQL storage.
- **Security**: HTTP-only cookies, CSRF protection, secure session configuration, CORS with domain allowlisting, and express-rate-limit middleware.
- **Health Monitoring**: Comprehensive health check endpoints (`/health`, `/health/ready`) with database connectivity verification.
- **Logging**: Production-grade logging with log levels, contextual categorization, user tracking, and security event logging.
- **Product Integration**: Services for multi-retailer product scraping and integration (Walmart, Sam's Club, PetSmart, Petco, Pet Supplies Plus, Tractor Supply, Family Farm & Home, Kroger, Meijer, Target, Costco, Amazon, Feeders Pet Supply). Product sync logic prioritizes U.S. & Canada markets and filters for animal care products. Comprehensive coverage includes specialty pet stores, farm supply retailers, general merchandise chains with pet sections, warehouse clubs, online marketplace leaders, and regional livestock specialists.

### Database
- **Primary Database**: PostgreSQL via Neon serverless with connection pooling.
- **ORM**: Drizzle ORM for type-safe operations and schema management.
- **Schema**: Normalized relational design for users, products, reviews, recalls, ingredient blacklists, and scan history. Features generated UUIDs, timestamps, and indexes.

### Authentication & Authorization
- **Identity Provider**: Replit OIDC.
- **Session Storage**: PostgreSQL-backed sessions.
- **Authorization**: Role-based access control with admin privileges.

### File Structure
- **Monorepo Structure**: Shared TypeScript code between client and server.
- **Client Code**: React application in `/client`.
- **Server Code**: Express API server in `/server`.
- **Shared Code**: Common TypeScript interfaces and schemas in `/shared`.

### Development Workflow
- **Development Server**: Concurrent client and server development with HMR.
- **Build Process**: Vite for client, esbuild for server.
- **Type Safety**: Comprehensive TypeScript coverage.
- **Database Migrations**: Drizzle Kit.
- **Testing**: Vitest with React Testing Library, including browser API mocking and component smoke tests.

### Project Ambitions
- **Business Vision**: To become the leading platform for pet product safety evaluation, fostering transparency and trust in the pet product market.
- **Market Potential**: Addressing a growing demand among pet owners for reliable information on product safety and ingredients.
- **Key Capabilities**: Product scanning, safety scoring, community reviews, recall tracking, and comprehensive animal care management (including livestock health management).

## External Dependencies

### Core Infrastructure
- **Database Hosting**: Neon PostgreSQL serverless database.
- **Authentication Service**: Replit's OpenID Connect.
- **Session Storage**: PostgreSQL-based session management.

### Frontend Libraries
- **UI Framework**: React 18.
- **Component Library**: Radix UI.
- **Styling System**: Tailwind CSS.
- **Data Fetching**: TanStack React Query.
- **Routing**: Wouter.
- **Form Management**: React Hook Form.
- **Barcode Scanning**: html5-qrcode.
- **Webcam Integration**: react-webcam.

### Backend Services
- **Web Framework**: Express.js.
- **Database Client**: Neon serverless PostgreSQL driver.
- **ORM**: Drizzle ORM.
- **Authentication**: Passport.js with OpenID Connect strategy.
- **Session Management**: Express-session with PostgreSQL store.
- **External APIs**: USDA NASS Quick Stats API, FDA Animal & Veterinary API.
- **Regional Coverage**: Platform includes employee-owned regional specialists like Feeders Pet Supply (Kentucky, Indiana, Ohio) for comprehensive livestock and small animal nutrition.

### Development Tools
- **Build System**: Vite.
- **Compilation**: esbuild.
- **Database Tooling**: Drizzle Kit.
- **Testing Framework**: Vitest with React Testing Library.
- **CI/CD**: GitHub Actions for automated Android APK builds.