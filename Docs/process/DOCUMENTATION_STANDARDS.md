# Documentation Standards

## Table of Contents
1. [File Headers](#file-headers)
2. [Component Documentation](#component-documentation)
3. [Function Documentation](#function-documentation)
4. [Type/Interface Documentation](#type-interface-documentation)
5. [Inline Comments](#inline-comments)
6. [ESLint Enforcement](#eslint-enforcement)

## File Headers

Every source file must start with a JSDoc header containing:

```typescript
/**
 * @file [filename.ext]
 * @description [Brief description of the file's purpose and functionality]
 * @created YYYY-MM-DD
 * @lastUpdated YYYY-MM-DD
 * @module [path/from/src]
 */
```

## Component Documentation

### Functional Components

```typescript
/**
 * [ComponentName] component
 * 
 * @component
 * @description [Detailed description of the component's purpose and functionality]
 * 
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of the prop
 * @param {() => void} [props.onClick] - Optional callback description
 * 
 * @returns {JSX.Element} Rendered component
 * 
 * @example
 * ```tsx
 * <ComponentName 
 *   propName="value"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
```

## Function Documentation

### Regular Functions

```typescript
/**
 * [functionName] - Brief description
 * 
 * @description Detailed description of what the function does, why it's needed,
 * and any important implementation details.
 * 
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Optional parameter
 * @returns {ReturnType} Description of the return value
 * @throws {ErrorType} When and why this error might be thrown
 * 
 * @example
 * const result = functionName('value');
 * // Returns: expected output
 */
```

## Type/Interface Documentation

```typescript
/**
 * [TypeName] - Brief description
 * 
 * @description Detailed description of when and how to use this type
 */
type TypeName = {
  /** Description of the property */
  property: string;
  
  /** 
   * Description of the optional property 
   * @default 'default value'
   */
  optionalProperty?: number;
};
```

## Inline Comments

Use inline comments to explain "why" something is done, not "what" is done.

```typescript
// Good: Explain the reason behind the code
// We need to debounce this function to prevent excessive API calls
const handleSearch = debounce(fetchResults, 300);

// Bad: Just describes what the code does
// Call debounce with fetchResults and 300ms
const handleSearch = debounce(fetchResults, 300);
```

## ESLint Enforcement

The project uses ESLint with the following documentation-related rules:

- `jsdoc/require-jsdoc`: Requires JSDoc comments for functions, classes, and methods
- `jsdoc/require-param`: Requires `@param` tags for function parameters
- `jsdoc/require-returns`: Requires `@returns` for functions that return values
- `notice/notice`: Enforces file header documentation

### Running Linter

```bash
# Check for documentation issues
npm run lint

# Auto-fix documentation issues (when possible)
npm run lint -- --fix
```

### Pre-commit Hook

A pre-commit hook is configured to ensure all committed code meets documentation standards before being pushed to the repository.

## Version History

| Date       | Version | Description                |
|------------|---------|----------------------------|
| 2025-05-22 | 1.0.0   | Initial documentation guide |
