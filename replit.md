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