# Overview

Bharat Krishi Guru is an AI-powered agricultural assistance platform designed to empower Indian farmers with modern technology. The application provides crop disease detection through image analysis, multilingual AI chatbot assistance, weather-based farming recommendations, real-time market price insights, and a comprehensive knowledge hub featuring government schemes and best practices. Built as a full-stack web application, it combines a React frontend with an Express backend and PostgreSQL database to deliver location-aware farming guidance in both English and Hindi.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built using React with TypeScript and follows a modern component-based architecture. The UI leverages shadcn/ui components built on Radix UI primitives for consistent design patterns. The application uses React Router for navigation and TanStack Query for efficient data fetching and caching. State management is handled through React Context API for global concerns like language preferences and location data.

The styling system is powered by Tailwind CSS with a custom agricultural color palette featuring earth tones, forest greens, and crop gold colors optimized for the farming domain. The design system supports both light themes with HSL color variables for consistent theming.

## Backend Architecture
The server follows a clean REST API architecture built with Express.js and TypeScript. The application uses a modular structure separating concerns into distinct layers:
- Route handlers manage HTTP requests and responses
- Storage layer abstracts database operations through a service interface
- Database connections are managed through Drizzle ORM with connection pooling

Authentication is implemented using JWT tokens with bcrypt for password hashing. The server includes comprehensive error handling and request logging middleware for debugging and monitoring.

## Database Design
The data layer uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes:
- Users table for authentication and basic profile information
- Profiles table for detailed farmer information including farm details, location, and crop preferences
- Schema validation is enforced using Zod schemas for runtime type checking

The database configuration supports both development and production environments with connection pooling through Neon serverless PostgreSQL.

## Development and Build System
The project uses Vite for fast development builds and hot module replacement. The build system is configured for a monorepo structure with separate client and server directories sharing common types through a shared schema directory. TypeScript provides end-to-end type safety from database to frontend components.

The application supports both development and production deployments with different configurations for local development versus cloud hosting. Environment variables manage sensitive configuration like database URLs and API keys.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling for scalable database operations
- **Drizzle ORM**: Type-safe database toolkit providing schema management and query building

## AI and ML Services
- **Google Gemini API**: Powers the multilingual agricultural chatbot for answering farming questions in Hindi and English
- **Hugging Face Models**: Planned integration for crop disease detection from uploaded images

## Weather and Market Data
- **OpenWeather API**: Provides weather data for location-based farming recommendations and irrigation guidance
- **Government of India Data API**: Fetches real-time agricultural market prices from official government sources

## UI and Design System
- **Radix UI**: Headless component primitives for accessible and customizable UI components
- **Tailwind CSS**: Utility-first CSS framework for responsive design and theming
- **Lucide Icons**: Comprehensive icon library for consistent visual elements

## Authentication and Security
- **bcryptjs**: Password hashing for secure user authentication
- **jsonwebtoken**: JWT token generation and validation for session management

## Development Tools
- **Replit Integration**: Development environment integration with runtime error handling and cartographer tooling
- **TypeScript**: Static type checking across the entire application stack
- **ESBuild**: Fast bundling for production builds