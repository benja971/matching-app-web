# Matching App - Vue.js TypeScript Project

A modern, professional Vue.js 3 application built with TypeScript, featuring a clean architecture for a dating/matching app.

## 🏗️ Architecture Overview

This project follows a professional Vue.js architecture with clear separation of concerns:

### 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Generic UI components
│   └── features/       # Feature-specific components
├── views/              # Page components (routes)
├── layouts/            # Layout components
├── router/             # Vue Router configuration
├── stores/             # Pinia state management
├── composables/        # Vue composables (reusable logic)
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🚀 Tech Stack

### Core

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server

### UI & Styling

- **PrimeVue** - Comprehensive UI component library
- **PrimeIcons** - Icon library

### State Management & Routing

- **Pinia** - Modern state management for Vue
- **Vue Router** - Official router for Vue.js

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

### Utilities

- **VueUse** - Collection of essential Vue composition utilities

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd matching-app-web

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript type checking
```

## 📋 Features

### 🔐 Authentication

- Login/Register functionality
- Protected routes
- User session management

### 👤 User Profile

- Profile editing
- Photo upload
- Interest management
- Preference settings

### 💕 Matching System

- Swipe cards interface
- Like/dislike functionality
- Match discovery
- Geolocation-based matching

### 💬 Messaging

- Real-time chat interface
- Match conversations
- Message history

### ⚙️ Settings

- Discovery preferences
- Notification settings
- Privacy controls
- Account management

## 🏛️ Architecture Patterns

### State Management

- **Pinia stores** for centralized state management
- Composition API with `storeToRefs` for reactive state
- Modular store structure (auth, matches, etc.)

### Component Architecture

- **Composition API** with `<script setup>` syntax
- **TypeScript interfaces** for type safety
- **Props/Emits** with proper typing
- **Composables** for reusable logic

### Routing

- **Route-based code splitting** for better performance
- **Navigation guards** for authentication
- **Meta fields** for route configuration

### API Layer

- **Service layer** abstraction for API calls
- **Type-safe** API responses
- **Error handling** with proper user feedback

## 🎨 UI/UX Principles

### Responsive Design

- **Mobile-first** approach
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interactions

### Design System

- **Consistent spacing** and typography
- **Color theming** with CSS custom properties
- **Component-based** design approach

### User Experience

- **Loading states** and error handling
- **Smooth animations** and transitions
- **Accessibility** considerations

## 🧪 Development Guidelines

### Code Style

- **ESLint + Prettier** for consistent formatting
- **TypeScript strict mode** for type safety
- **Composition API** preferred over Options API

### Component Guidelines

- **Single Responsibility Principle** for components
- **Props validation** with TypeScript interfaces
- **Emit events** for parent-child communication

### State Management

- **Pinia stores** for complex state
- **Local state** for component-specific data
- **Composables** for shared reactive logic

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Environment Variables

Configure the following variables in your `.env` file:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new files
3. Write composables for reusable logic
4. Add proper error handling
5. Update types when adding new features
6. Run linting and type checking before committing

## 📄 License

This project is licensed under the MIT License.
