<!--
 * @file README.md
 * @description Source code documentation for the Co-Director Platform
 * @created 2025-05-22 21:46 ET
 * @lastUpdated 2025-05-23 10:32 ET
 * @module src
 -->

# Co-Director Platform - Source Code

This directory contains the source code for the Co-Director Platform frontend application. For comprehensive implementation details, refer to the `/Docs/technical/` directory, particularly `Implementation.md`, `Implementation-Updates.md`, and `TechnicalPatterns.md`.

## Project Structure

```
src/
├── components/           # Shared UI components
│   ├── common/          # Common components used across the app
│   ├── layout/          # Layout components (AppBar, Sidebar, etc.)
│   └── ui/              # Base UI components (buttons, inputs, etc.)
│
├── features/            # Feature-based modules
│   ├── auth/            # Authentication feature
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth-specific hooks
│   │   ├── types/       # Auth-specific types
│   │   └── utils/       # Auth-specific utilities
│   │
│   ├── chat/           # Chat feature
│   │   └── ...         # Similar structure as auth
│   │
│   └── settings/       # User settings feature
│       └── ...         # Similar structure as auth
│
├── hooks/              # Shared custom React hooks
├── services/            # API and service layer
├── store/               # State management
│   └── slices/          # Redux-style state slices
├── styles/              # Global styles and theme
│   └── theme/           # Theme configuration
├── types/               # Global TypeScript type definitions
│   ├── api/             # API-related types
│   ├── components/      # Component prop types
│   └── store/           # State management types
└── utils/               # Utility functions
    ├── common/          # General utilities
    ├── formatters/      # Data formatting utilities
    └── validators/      # Validation utilities
```

## Development Guidelines

### Component Organization
- Place feature-specific components in their respective feature directory
- Shared components used across features go in `components/`
- Keep components small and focused on a single responsibility
- Follow file length guidelines: under 400 lines per file
- Follow function/component length guidelines: under 40 lines

### State Management
- Use Zustand for global state management
- Organize state by feature in the `store/slices/` directory
- Use selectors to access state in components

### Styling
- Use Material-UI's `sx` prop for component-specific styles
- Define theme overrides in `theme/theme.ts`
- Additional theme customizations in `styles/theme/`
- Use CSS modules for complex component styles

### TypeScript
- Define types in the appropriate feature or shared type directory
- Use TypeScript interfaces with descriptive names ending with "Props" for component props
- Place interfaces at the top of files
- Use type aliases for complex types with JSDoc comments
- Export types from feature modules using `index.ts`

### Testing
- Place test files next to the code they test with `.test.tsx` extension
- Use React Testing Library for component tests
- Mock external dependencies in tests

### Documentation
- Include JSDoc comments for all functions, components, and types
- Follow the file header format with `@file`, `@description`, `@created`, and `@lastUpdated` tags
- All files must include a creation and last updated timestamp in the format `YYYY-MM-DD HH:MM ET`
- Document the 'why' behind complex logic
- For detailed standards, refer to `/Docs/technical/CodeStandards.md` and `/Docs/process/DOCUMENTATION_STANDARDS.md`
