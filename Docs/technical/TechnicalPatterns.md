# Co-Director Platform: Technical Patterns Reference

This document provides implementation patterns and best practices for the Co-Director Platform, serving as a companion to the Technical Design Document (TDD). Reference these patterns during implementation to ensure consistency and follow modern best practices.

**Last Updated:** 2025-05-22, 02:41 PM ET

## Table of Contents

1. [TypeScript Configuration & Advanced Patterns](#1-typescript-configuration--advanced-patterns)
2. [Vite Configuration and Optimization](#2-vite-configuration-and-optimization)
3. [Material UI Theming and Component Patterns](#3-material-ui-theming-and-component-patterns)
4. [Project Folder Structure](#4-project-folder-structure)
5. [React Performance Optimization](#5-react-performance-optimization)
6. [Zustand State Management Patterns](#6-zustand-state-management-patterns)

---

## 1. TypeScript Configuration & Advanced Patterns

### 1.1 tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.2 TypeScript Utility Types

Use TypeScript utility types to create more flexible and maintainable type definitions:

```typescript
// Use Partial for optional props
type OptionalConfig = Partial<UserConfig>;

// Use Pick to select specific properties
type SessionIdOnly = Pick<Session, 'sessionId'>;

// Use Omit to exclude properties
type SessionWithoutHistory = Omit<Session, 'messages'>;

// Use Record for dictionaries
type SessionsById = Record<string, Session>;

// Use ReturnType to extract function return types
type ApiResponse = ReturnType<typeof apiClient.fetchSession>;
```

### 1.3 Discriminated Unions for API Responses

Implement type-safe API responses using discriminated unions:

```typescript
// Match our TDD API response patterns
type ApiResponse<T> = 
  | { success: true; data: T; statusCode: number }
  | { success: false; error: ApiError; statusCode: number };

// Type guard for response handling
function isSuccessResponse<T>(response: ApiResponse<T>): response is { success: true; data: T; statusCode: number } {
  return response.success === true;
}

// Usage example
const handleResponse = (response: ApiResponse<Session>) => {
  if (isSuccessResponse(response)) {
    // TypeScript knows response.data is Session here
    return response.data;
  } else {
    // TypeScript knows response.error is ApiError here
    throw new Error(response.error.message);
  }
};
```

### 1.4 Component Prop Types

Define prop types for components using interfaces:

```typescript
// Define prop interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Use in component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  icon
}) => {
  // Implementation
};
```

---

## 2. Vite Configuration and Optimization

### 2.1 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'material-ui': ['@mui/material'],
          'zustand': ['zustand'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:8080')
  }
});
```

### 2.2 Environment Variables

Create `.env` files for different environments:

```
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
VITE_MOCK_API=true

# .env.production
VITE_API_BASE_URL=https://api.codirector.com
VITE_APP_ENV=production
VITE_MOCK_API=false
```

### 2.3 TypeScript Environment Types

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_MOCK_API: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 2.4 Environment Configuration Utility

```typescript
// src/utils/environment.ts
export const environment = {
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  useMockApi: import.meta.env.VITE_MOCK_API === 'true'
};
```

---

## 3. Material UI Theming and Component Patterns

### 3.1 Theme Configuration

```typescript
// src/theme/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

// Extend palette types
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

export const lightTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: blue[700],
    },
    secondary: {
      main: '#f50057',
    },
    neutral: {
      main: grey[300],
      light: grey[100],
      dark: grey[400],
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
}));

export const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[300],
    },
    secondary: {
      main: '#ff5983',
    },
    neutral: {
      main: grey[700],
      light: grey[600],
      dark: grey[800],
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  // Rest of the configuration similar to light theme...
}));
```

### 3.2 Theme Provider Setup

```typescript
// src/theme/ThemeProvider.tsx
import { useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);
  
  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
```

### 3.3 Styling Components

Three approaches for styling components, each with specific use cases:

#### 3.3.1 Using the `sx` Prop (for one-off styling)

```tsx
// Direct styling with the sx prop
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  }}
>
  <Typography variant="h5" component="h2">
    Session Setup
  </Typography>
  <TextField label="Session Topic" fullWidth />
</Box>
```

#### 3.3.2 Using the `styled` Utility (for reusable styled components)

```tsx
// Creating a styled component
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

// Usage
<StyledCard>
  <CardContent>
    <Typography variant="h6">Session Card</Typography>
  </CardContent>
</StyledCard>
```

#### 3.3.3 Combining with Responsive Properties

```tsx
// Responsive styling
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, md: 4 },
    p: { xs: 2, sm: 3, md: 4 }
  }}
>
  <Box 
    sx={{
      width: { xs: '100%', md: '300px' },
      flexShrink: 0
    }}
  >
    {/* Sidebar content */}
  </Box>
  <Box sx={{ flexGrow: 1 }}>
    {/* Main content */}
  </Box>
</Box>
```

---

## 4. Project Folder Structure

Optimal folder structure for the Co-Director Platform:

```
src/
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Shared/common components
│   ├── common/           # Very generic components (Button, Card, etc.)
│   ├── layout/           # Layout components (AppLayout, TabPanel, etc.)
│   └── feedback/         # Feedback-related components
├── features/             # Feature-based modules
│   ├── setup/            # Setup tab feature
│   │   ├── components/   # Setup-specific components
│   │   ├── hooks/        # Setup-specific hooks
│   │   └── utils/        # Setup-specific utilities
│   ├── chat/             # Chat tab feature
│   │   ├── components/   # Chat-specific components
│   │   ├── hooks/        # Chat-specific hooks
│   │   └── utils/        # Chat-specific utilities
│   └── history/          # History tab feature
│       ├── components/   # History-specific components
│       ├── hooks/        # History-specific hooks
│       └── utils/        # History-specific utilities
├── hooks/                # Shared hooks
├── services/             # API services
│   ├── api/              # API client and endpoints
│   ├── mock/             # Mock API implementation
│   └── localStorage/     # Local storage service
├── store/                # Zustand store
│   ├── slices/           # Store slices as defined in TDD
│   └── index.ts          # Main store configuration
├── theme/                # MUI theme configuration
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.tsx               # Main App component with routing
└── main.tsx              # Entry point
```

### 4.1 Key Principles

1. **Feature-based organization**: Group related components, hooks, and utilities by feature
2. **Separation of concerns**: Isolate UI components from business logic and state management
3. **Reusability**: Share common components, hooks, and utilities across features
4. **Discoverability**: Clear naming conventions and predictable file locations
5. **Scalability**: Structure allows for easy addition of new features without refactoring

### 4.2 Naming Conventions

- Files: Use PascalCase for components, camelCase for non-components
- Folders: Use camelCase for all folders
- Components: Use PascalCase and include the component type (e.g., `MessageList.tsx`, not `List.tsx`)
- Hooks: Prefix with `use` (e.g., `useMessages.ts`)
- Context: Suffix with `Context` (e.g., `ThemeContext.tsx`)
- Types: Use meaningful names that describe the purpose (e.g., `SessionConfig.ts`)

---

## 5. React Performance Optimization

### 5.1 Component Memoization

```typescript
// Memoize expensive components
import { memo, useMemo, useCallback } from 'react';

// Memoize a component
const MessageList = memo(({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
});

// Use in parent component
function ChatView() {
  // Memoize expensive calculations
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);
  
  // Memoize callbacks
  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content);
  }, [sendMessage]);
  
  return (
    <div>
      <MessageList messages={sortedMessages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
```

### 5.2 Virtualization for Long Lists

```typescript
import { FixedSizeList } from 'react-window';

function VirtualizedMessageList({ messages }: { messages: Message[] }) {
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={messages.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <div style={style}>
          <MessageItem message={messages[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 5.3 Code Splitting

```typescript
import { lazy, Suspense } from 'react';
import { CircularProgress } from '@mui/material';

// Lazy load components
const ChatView = lazy(() => import('./features/chat/components/ChatView'));
const HistoryView = lazy(() => import('./features/history/components/HistoryView'));

function App() {
  return (
    <Router>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/chat" element={<ChatView />} />
          <Route path="/history" element={<HistoryView />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 5.4 Debouncing User Input

```typescript
import { useState, useMemo } from 'react';
import { debounce } from 'lodash-es';
import { TextField } from '@mui/material';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = 'Search...' 
}) => {
  const [value, setValue] = useState('');
  
  // Create debounced search function
  const debouncedSearch = useMemo(() => 
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };
  
  return (
    <TextField
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      size="small"
    />
  );
};
```

---

## 6. Zustand State Management Patterns

### 6.1 Basic Store Creation

```typescript
import { create } from 'zustand';

// Define store state and actions
interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

// Create store
const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}));

// Usage in component
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  
  return (
    <div>
      <h1>{bears} Bears</h1>
      <button onClick={increasePopulation}>Add Bear</button>
    </div>
  );
}
```

### 6.2 Store Slices Pattern

```typescript
import { create, StateCreator } from 'zustand';

// Define slice interfaces
interface BearSlice {
  bears: number;
  addBear: () => void;
}

interface FishSlice {
  fishes: number;
  addFish: () => void;
}

// Combined store type
type StoreWithSlices = BearSlice & FishSlice;

// Create bear slice
const createBearSlice: StateCreator<
  StoreWithSlices,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
});

// Create fish slice
const createFishSlice: StateCreator<
  StoreWithSlices,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

// Combine slices into store
const useStore = create<StoreWithSlices>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}));
```

### 6.3 Async Actions Pattern

```typescript
import { create } from 'zustand';

interface SessionState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  fetchSession: (id: string) => Promise<void>;
}

const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isLoading: false,
  error: null,
  
  fetchSession: async (id: string) => {
    try {
      // Set loading state
      set({ isLoading: true, error: null });
      
      // Fetch data
      const response = await apiClient.getSession(id);
      
      // Update state with result
      set({ 
        session: response.data,
        isLoading: false 
      });
    } catch (err) {
      // Handle error
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false 
      });
    }
  }
}));
```

### 6.4 Persistence with Middleware

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontSize: 16,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 6.5 DevTools Middleware

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
      decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement'),
    }),
    { name: 'Counter Store' }
  )
);
```

### 6.6 Combining Multiple Middleware

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Combine multiple middleware
const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }),
      }),
      { name: 'settings-storage' }
    ),
    { name: 'Settings Store' }
  )
);
```
