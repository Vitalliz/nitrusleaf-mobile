---
description: Repository Information Overview
alwaysApply: true
---

# NitrusLeaf Mobile Application Information

## Summary
NitrusLeaf Mobile is a React Native mobile application built with Expo, providing cross-platform support for Android, iOS, and Web. The application features tab-based navigation with Expo Router implementing a professional authentication flow with login, registration, and five-tab dashboard (Home, Explore, Maps, History, Profile) with a custom footer navigation component.

## Structure
The project follows a modular, scalable directory structure with clear separation of concerns:

### Core Directories
- **app/** - Expo Router file-based routing structure
  - **app/_layout.tsx** - Root Stack navigator with public/authenticated route separation
  - **app/index.tsx** - Splash screen with auto-redirect to login (2 seconds, no footer)
  - **app/login.tsx** - Authentication form (public route)
  - **app/register.tsx** - Registration form (public route)
  - **app/(tabs)/** - Authenticated dashboard with 5 tabs + custom footer
    - **_layout.tsx** - Stack navigator for dashboard screens
    - **index.tsx** - Professional home dashboard with stats, quick actions, and activity feed
    - **explore.tsx** - Plant catalog with search functionality
    - **maps.tsx** - Plantation map visualization
    - **history.tsx** - Activity timeline view
    - **profile.tsx** - User profile and account management

### Professional Structure
- **contexts/** - React Context providers
  - **AuthContext.tsx** - Authentication state management with login/register/logout
- **services/** - API and external services
  - **api.ts** - Centralized API client with typed endpoints
- **types/** - TypeScript type definitions
  - **auth.ts** - Authentication types (User, LoginRequest, RegisterRequest, etc)
  - **common.ts** - Common types (Plantation, Plant, Activity, WeatherData, etc)
- **utils/** - Utility functions
  - **validation.ts** - Form validation and password strength functions
- **components/** - Reusable UI components
  - **footer.tsx** - Professional navigation footer (5 tabs + centered camera button)
  - Header, Card, Menu, Graphics, Themed components
  - **ui/** - Atomic UI components (Button, Input, Label, Background)
- **constants/** - Configuration and constants
  - **theme.ts** - Color and styling constants
  - **config.ts** - API config, validation rules, activity types, colors
- **hooks/** - Custom React hooks
  - use-theme-color, use-color-scheme
- **assets/images/** - Application images, icons, splash screens

## Language & Runtime
**Language**: TypeScript and JavaScript
**TypeScript Version**: ~5.9.2
**React Version**: 19.1.0
**React Native Version**: 0.81.5
**Node.js Runtime**: Required for development
**Build System**: Expo (v54.0.19)
**Package Manager**: npm
**Router**: Expo Router v6.0.13

## Dependencies
**Core Framework**: expo@^54.0.19, react@^19.1.0, react-native@^0.81.5, expo-router@~6.0.13
**Navigation**: @react-navigation/native@^7.1.8, @react-navigation/bottom-tabs@^7.4.0
**UI/Graphics**: @expo/vector-icons@^15.0.3, expo-linear-gradient@~15.0.7, react-native-svg@^15.12.1
**Platform Support**: react-native-web@~0.21.0, expo-constants@~18.0.10, expo-font@~14.0.9
**Dev**: typescript@~5.9.2, eslint@^9.25.0, eslint-config-expo@~10.0.0

## Build & Installation
\\\ash
npm install
npm start                # Start development server
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run web              # Run in web browser
npm run lint             # Check code with ESLint (✓ 0 errors)
\\\

## Authentication System
**Type**: Context-based authentication with mock support
**Flow**: Splash (2s) → Login → (Register) → Dashboard with Footer
**Location**: \contexts/AuthContext.tsx\ with \useAuth()\ hook
**Features**:
- Login and registration functions
- User state management
- Loading states
- Token management (ready for AsyncStorage integration)
- Mock authentication (ready for API integration)

## Footer Navigation
**Location**: \components/footer.tsx\
**Visibility**: Appears ONLY on dashboard screens (home, explore, maps, history, profile)
**Design**: Professional orange/yellow (#F9AA33) bar with 5 navigation buttons + centered green camera button
**Features**:
- Home button → app/(tabs)/home
- Explore button → app/(tabs)/explore
- Camera button (centered) → for photo capture functionality
- Maps/Analytics button → app/(tabs)/maps
- Profile button → app/(tabs)/profile
- NOT visible on: splash screen, login, register

## Main Files & Resources
**Entry Points**: app/index.tsx (splash - 2s), app/login.tsx (public), app/(tabs)/index.tsx (authenticated)
**Authentication**: contexts/AuthContext.tsx with useAuth() hook
**API**: services/api.ts with centralized endpoints
**Navigation**: components/footer.tsx for dashboard navigation
**Validation**: utils/validation.ts for form validation

## Code Quality
**Linting**: ESLint with expo config
**Status**: ✓ 0 errors, 2 warnings (in .example files only)
**TypeScript**: Strict mode enabled with absolute path aliases (@/*)
**Encoding**: UTF-8 without BOM

## Configuration Files
**tsconfig.json**: Strict TypeScript with @/* path alias for absolute imports
**app.json**: Expo configuration with iOS/Android/Web support, new architecture enabled
**package.json**: npm scripts for development, Android, iOS, Web, and linting
**.env.example**: Template for environment variables (copy to .env and configure)

## Known Fixes
✅ Removed old App.js file (was causing footer to appear on splash screen)
✅ Footer now appears ONLY on dashboard screens
✅ Splash screen shows clean for 2 seconds without footer
✅ Professional home dashboard with stats, quick actions, and activity feed
