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

## ESLint Documentation Enforcement Strategy

### Rationale

To ensure consistent high-quality documentation throughout the codebase, we've implemented automated enforcement using ESLint. This approach was chosen because:

1. **Consistency**: Ensures all developers follow the same documentation standards
2. **Automation**: Catches documentation issues early in the development process
3. **Integration**: Works with IDEs to provide real-time feedback during coding
4. **Education**: Helps developers learn proper documentation patterns through feedback

### Implementation

Our ESLint configuration in `app/.eslintrc.js` includes comprehensive rules for documentation validation:

```javascript
// Documentation rules - excerpt from .eslintrc.js
'jsdoc/require-jsdoc': ['warn', {
  require: {
    FunctionDeclaration: true,
    MethodDefinition: true,
    ClassDeclaration: true,
    ArrowFunctionExpression: true,
    FunctionExpression: true,
  },
  contexts: [
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'TSEnumDeclaration',
  ],
}],
'jsdoc/require-description': ['warn', { descriptionStyle: 'tag' }],
'jsdoc/require-param': 'warn',
// ... additional rules
```

### Key Rules

The project uses ESLint with the following documentation-related rules:

- **Function Documentation**:
  - `jsdoc/require-jsdoc`: Requires JSDoc comments for functions, classes, and methods
  - `jsdoc/require-description`: Ensures functions have descriptions
  
- **Parameter Documentation**:
  - `jsdoc/require-param`: Requires `@param` tags for function parameters
  - `jsdoc/require-param-description`: Requires descriptions for parameters
  - `jsdoc/require-param-type`: Enforces type annotations for parameters

- **Return Value Documentation**:
  - `jsdoc/require-returns`: Requires `@returns` for functions that return values
  - `jsdoc/require-returns-description`: Requires descriptions for return values
  - `jsdoc/require-returns-type`: Enforces type annotations for return values

- **File Documentation**:
  - `notice/notice`: Enforces file header documentation with required metadata
  
- **Type Documentation**:
  - Rules applied to TypeScript interfaces, types, and enums

### Workflow Integration

#### Running Linter

```bash
# Check for documentation issues
npm run lint

# Auto-fix documentation issues (when possible)
npm run lint -- --fix
```

#### IDE Integration

VSCode and other IDEs will highlight documentation issues in real-time with the ESLint extension.

#### Pre-commit Hook

A pre-commit hook is configured to ensure all committed code meets documentation standards before being pushed to the repository.

### Error Resolution

When encountering documentation errors:

1. Review the error message to understand what's missing
2. Use the templates in this document as a reference
3. Add the missing documentation with appropriate detail
4. Run `npm run lint --fix` to verify the issue is resolved

### Context7 MCP Integration

When documenting code that uses third-party libraries:

1. Check Context7 MCP for the latest library documentation
2. Include relevant MCP references in documentation comments
3. Document any deviations from recommended patterns

## Version History

| Date       | Version | Description                |
|------------|---------|----------------------------|
| 2025-05-22 | 1.0.0   | Initial documentation guide |
