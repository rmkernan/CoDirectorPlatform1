<!--
 * @file LLM_FILE_CREATION_GUIDELINES.md
 * @description Guidelines for LLMs creating files in the Co-Director Platform
 * @created 2025-05-22 21:53 ET
 * @lastUpdated 2025-05-22 22:00 ET
 * @module Docs/process
 -->

# LLM File Creation Guidelines

## IMPORTANT: ALL FILES MUST INCLUDE TIMESTAMP HEADERS

Every file created by an LLM **MUST** include a proper documentation header with timestamps. This is a strict requirement and files without proper headers will fail linting.

## Required Header Format

### TypeScript/JavaScript Files

```typescript
/**
 * @file filename.ext
 * @description Brief description of the file's purpose
 * @created YYYY-MM-DD HH:MM ET
 * @lastUpdated YYYY-MM-DD HH:MM ET
 * @module path/from/src
 */
```

### Markdown Files

```markdown
<!--
 * @file filename.md
 * @description Brief description of the file's purpose
 * @created YYYY-MM-DD HH:MM ET
 * @lastUpdated YYYY-MM-DD HH:MM ET
 * @module path/from/src
 -->
```

### CSS/SCSS Files

```css
/**
 * @file filename.css
 * @description Brief description of the file's purpose
 * @created YYYY-MM-DD HH:MM ET
 * @lastUpdated YYYY-MM-DD HH:MM ET
 * @module path/from/src
 */
```

## Timestamp Format Requirements

The timestamp format must be exactly:
- **Format**: `YYYY-MM-DD HH:MM ET`
- **Examples**: `2025-05-22 21:53 ET`
- **Time Zone**: Eastern Time (ET)
- **Time Format**: 24-hour with leading zeros (09:15, 14:30)

## Code Documentation Requirements

In addition to file headers, all code must be properly documented:

1. **Functions/Methods**: All functions and methods must have JSDoc comments
   ```typescript
   /**
    * Brief description of function purpose
    *
    * @param paramName - Description of parameter
    * @returns Description of return value
    */
   ```

2. **Interfaces/Types**: All interfaces and types must have JSDoc comments
   ```typescript
   /**
    * Description of what this interface/type represents
    */
   interface ExampleInterface {
     /**
      * Description of this property
      */
     propertyName: string;
   }
   ```

3. **React Components**: All components must have JSDoc comments
   ```typescript
   /**
    * Component description
    *
    * @param props - Component props
    * @returns The rendered component
    */
   ```

## File Organization

Follow the feature-based folder structure defined in the project:

- Place shared components in `src/components`
- Feature-specific components go in `src/features/[feature]/components`
- Follow PascalCase naming convention for component files
- Types and interfaces should be in dedicated type files

## Enforcement

These requirements are enforced through:

1. ESLint rules configured to error on missing or incorrect documentation
2. The `notice/notice` rule enforcing the timestamp format
3. All pull requests will be rejected if they contain files without proper documentation

## Example

```typescript
/**
 * @file Button.tsx
 * @description Reusable button component with various styles and states
 * @created 2025-05-22 21:53 ET
 * @lastUpdated 2025-05-22 22:00 ET
 * @module components/ui
 */

import React from 'react';

/**
 * Props for the Button component
 */
interface ButtonProps {
  /**
   * Button text content
   */
  label: string;
  
  /**
   * Called when the button is clicked
   */
  onClick?: () => void;
}

/**
 * A reusable button component with various styles and states
 *
 * @param props - Component props
 * @returns The rendered button
 */
const Button = ({ label, onClick }: ButtonProps): React.ReactElement => {
  return (
    <button onClick={onClick}>{label}</button>
  );
};

export default Button;
```
