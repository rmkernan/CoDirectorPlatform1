# Co-Director Platform: Code Standards Reference

**Created:** 2025-05-23 09:13 ET  
**Last Updated:** 2025-05-23 10:25 ET

This document provides a quick reference for code organization, documentation, and quality standards for the Co-Director Platform project.

## Code Organization

- **Feature-based folder structure** (see TechnicalPatterns.md Section 4)
  - Shared components: `src/components/` with subdirectories:
    - `auth/` - Authentication-related components
    - `common/` - Generic reusable components
    - `layout/` - Layout components (AppLayout, TabPanel, etc.)
    - `ui/` - UI element components
  - Feature components: `src/features/[feature]/components/`
  - Feature hooks: `src/features/[feature]/hooks/`
  - Feature utils: `src/features/[feature]/utils/`
  - Feature types: `src/features/[feature]/types/`
  - Pages (combining features): `src/pages/`
  - Routing: `src/routes/`
  - Global types: organized in `src/types/` with subdirectories:
    - `api/` - API-related types
    - `components/` - Component prop types
    - `store/` - Store state and action types

- **File naming conventions**:
  - Components: PascalCase with component type included (e.g., `MessageList.tsx`, not `List.tsx`)
  - Hooks: camelCase with "use" prefix (e.g., `useAuth.ts`)
  - Utils: camelCase (e.g., `formatDate.ts`)
  - Types: camelCase for files (e.g., `types.ts`), PascalCase for interfaces and types
  - Context: Suffix with "Context" (e.g., `ThemeContext.tsx`)
  - Directories: camelCase for all folders

## Documentation Standards

- **File Headers**:
  ```typescript
  /**
   * @file [filename.ext]
   * @description [Brief description]
   * @created YYYY-MM-DD HH:MM ET
   * @lastUpdated YYYY-MM-DD HH:MM ET
   * @module [path/from/src]
   */
  ```

- **Component Documentation**:
  ```typescript
  /**
   * @description A detailed description of the component
   * @param {ComponentProps} props - Component props
   * @returns {JSX.Element} Component JSX
   */
  export const Component = (props: ComponentProps): JSX.Element => {
    // ...
  }
  ```

- **Interface Documentation**:
  ```typescript
  /**
   * Props for the Component
   */
  interface ComponentProps {
    /** Description of prop1 */
    prop1: string;
    /** Description of prop2 */
    prop2: number;
  }
  ```

- **Function Documentation**:
  ```typescript
  /**
   * A description of what the function does
   * @param param1 - Description of param1
   * @param param2 - Description of param2
   * @returns Description of return value
   */
  function myFunction(param1: string, param2: number): boolean {
    // ...
  }
  ```

## Code Quality Standards

- **Size limits**:
  - File length < 400 lines
  - Function/component length < 40 lines

- **Testing**:
  - Unit tests for all utility functions
  - Component tests for complex components
  - Run tests with `npm test`

- **Linting**:
  - Run linter with `npm run lint`
  - Fix all linting issues before committing

## External Research

- **Use Context7 MCP** for library documentation:
  ```
  mcp1_resolve-library-id [LIBRARY]
  mcp1_get-library-docs [LIBRARY_ID]
  ```

- Document any Context7 MCP references in code comments:
  ```typescript
  // Context7: Using pattern from React Router v6.4 documentation
  ```
