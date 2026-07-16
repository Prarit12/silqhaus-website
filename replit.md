# Silqhaus - Luxury Vacation Rental Platform

## Overview

Silqhaus is a luxury vacation rental platform built with a modern full-stack architecture. The application provides a premium experience for users searching and booking luxury vacation properties, featuring a clean, spacious aesthetic similar to high-end vacation rental platforms.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for search state, TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless adapter
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Hot reload with Vite middleware integration

### Data Storage
- **Database**: PostgreSQL configured for production use
- **Schema**: Drizzle schema with strongly typed models
- **Migration Strategy**: Drizzle Kit for schema migrations
- **In-Memory Fallback**: Development storage layer for rapid prototyping

## Key Components

### Database Schema
The application uses a relational database with two main entities:
- **Properties**: Complete property information including location, pricing, amenities, and features
- **Agents**: Property agent/manager information with contact details

### API Endpoints
- `GET /api/properties` - Fetch properties with optional filtering
- `GET /api/properties/featured` - Get featured/premium properties
- `GET /api/properties/:id` - Get single property details
- `GET /api/agents` - Fetch all agents

### UI Components
- **Navigation**: Sticky navigation with scroll-based styling
- **Hero Section**: Full-viewport hero with integrated search
- **Search Bar**: Context-driven search with location, dates, and guest inputs
- **Property Cards**: Rich property display with images, pricing, and features
- **Filters Sidebar**: Advanced filtering for property search

## Data Flow

1. **User Search**: User inputs search criteria in hero or compact search bar
2. **Context Update**: Search context stores filters across components
3. **API Request**: TanStack Query fetches filtered properties from backend
4. **Database Query**: Drizzle ORM queries PostgreSQL with applied filters
5. **Response Rendering**: Properties displayed in responsive grid layout

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless adapter
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI component primitives
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **wouter**: Lightweight routing for React
- **zod**: Runtime type validation

### Booking System Integration
- **Hostaway Widgets**: Third-party booking system integration
  - Search Widget: `https://d2q3n06xhbi0am.cloudfront.net/widget.js`
  - Calendar Widget: `https://d2q3n06xhbi0am.cloudfront.net/calendar.js`
  - Features: Direct booking, availability checking, property management backend

### Development Tools
- **Vite**: Build tool with HMR and plugin ecosystem
- **TypeScript**: Static type checking
- **ESBuild**: Fast bundling for production builds
- **PostCSS & Autoprefixer**: CSS processing pipeline

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Node.js server to `dist/index.js`
- **Assets**: Static assets served through Express middleware

### Environment Configuration
- **Development**: Uses Vite dev server with Express API integration
- **Production**: Single Express server serves both API and static files
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon recommended)
- Environment variables for database connection

## Changelog
- July 07, 2025. Initial setup
- July 08, 2025. Enhanced Our Story page with comprehensive brand positioning, Tech + People section, and refined content flow
- August 09, 2025. Updated all pages to match landing page luxury theme with bronze/tan/cream/ivory color palette. Redesigned services section to match user template with dark background and icon-based cards.
- August 13, 2025. Integrated Hostaway booking system with search widget and calendar component. Replaced custom search forms with Hostaway widgets for direct booking functionality.
- August 28, 2025. Added authentic property data from Google Sheet. Updated with real listings: BS Villa (₿98,000/night, 5 bedrooms, Patong) and ZcapeX2 (₿2,500/night, 1 bedroom, Choeng Thale). Replaced placeholder content with actual property descriptions, images, and amenities. Removed decorative icon from SILQHAUS Facilities section header.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Clean, spacious layouts with good visual hierarchy and balanced typography.