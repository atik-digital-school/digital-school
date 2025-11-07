# School Navigation Kiosk - SPŠ stavebná a geodetická

## Overview

This is an interactive touch-screen navigation kiosk application designed for SPŠ stavebná a geodetická (Technical School of Civil Engineering and Geodesy). The application provides wayfinding functionality to help students, staff, and visitors locate classrooms, offices, and facilities throughout the school building. It features an idle-mode screensaver, search functionality, floor selection, interactive floor maps, and location details - all optimized for public touch-screen displays with auto-reset timeout functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite for development and production builds.

**Routing**: Wouter for client-side routing - a lightweight alternative to React Router suitable for simple single-page applications.

**UI Component Library**: Radix UI primitives with shadcn/ui styling system, configured with the "new-york" style preset. This provides accessible, unstyled components that are customized with Tailwind CSS.

**Design System**: Material Design principles adapted for kiosk use, with emphasis on:
- Touch-first interactions (minimum 48px tap targets)
- High contrast for visibility from various distances
- Generous spacing using Tailwind's spacing scale
- Typography using Roboto font family loaded from Google Fonts CDN
- Custom CSS variables for theming in both light and dark modes

**State Management**: 
- React Query (@tanstack/react-query) for server state management and data fetching
- Local React state (useState, useEffect) for UI state like idle mode, search queries, and floor selection
- Auto-reset idle timeout (60 seconds) to return kiosk to welcome screen

**Styling**: Tailwind CSS with extensive custom configuration including:
- Custom color system using HSL CSS variables
- Custom border radius values
- Custom elevation system with hover/active states
- Shadow utilities for depth perception

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Pattern**: RESTful HTTP endpoints returning JSON

**Request/Response Flow**:
- Express middleware for JSON parsing with raw body preservation
- Custom logging middleware for API request tracking
- Route registration pattern separating concerns

**Key Endpoints**:
- `GET /api/locations` - Retrieve all school locations
- `GET /api/locations/:id` - Retrieve specific location by ID
- `GET /api/floors` - Retrieve unique floor list
- `POST /api/locations` - Create new location (admin functionality)

**Development Server**: Vite middleware integration for hot module replacement in development, with conditional loading of Replit-specific plugins (cartographer, dev-banner) only in Replit environment.

**Production Build**: 
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js` as ESM module

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL dialect

**Database Provider**: Neon serverless PostgreSQL with WebSocket support for edge-compatible connections

**Schema Design**: Single `locations` table with fields:
- `id` (VARCHAR, primary key, auto-generated UUID)
- `name` (TEXT, not null) - Display name of location
- `roomNumber` (TEXT, not null) - Room identifier
- `floor` (TEXT, not null) - Floor location (e.g., "Prízemie", "1. poschodie")
- `type` (TEXT, not null) - Location category (classroom, office, facility, department)
- `description` (TEXT, nullable) - Additional details

**Data Access Layer**: Storage abstraction (`IStorage` interface implemented by `DbStorage` class) to allow potential future storage backend changes without modifying route handlers.

**Schema Validation**: Zod schemas generated from Drizzle table definitions using `drizzle-zod` for runtime validation of API inputs.

**Database Migrations**: Drizzle Kit manages schema migrations stored in `./migrations` directory.

**Seed Data**: Initial dataset includes 30+ locations across multiple floors (ground floor through 4th floor) with Slovak language content.

### External Dependencies

**Database**: 
- Neon Serverless PostgreSQL (accessed via `DATABASE_URL` environment variable)
- WebSocket connection support via `ws` package for serverless environments

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) - 20+ component primitives for accessibility
- shadcn/ui configuration and components
- Lucide React icons for consistent iconography

**Utilities**:
- class-variance-authority (cva) - Type-safe component variant management
- clsx & tailwind-merge - Conditional CSS class composition
- date-fns - Date formatting and manipulation
- cmdk - Command palette component

**Development Tools**:
- TypeScript for type safety across client and server
- tsx for running TypeScript directly in development
- esbuild for production server bundling
- Replit-specific plugins for development environment integration

**Asset Management**: Static assets stored in `attached_assets/generated_images/` including school logo and building images referenced in the idle screen component.