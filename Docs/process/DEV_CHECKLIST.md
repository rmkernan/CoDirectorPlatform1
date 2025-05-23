# Co-Director Platform: Development Checklist

**Created:** 2025-05-22, 04:29 PM ET  
**Last Updated:** 2025-05-22, 08:45 PM ET  
**Version:** 2.0

## 🚨 MANDATORY PRE-EXECUTION CHECKS

### 1. Model Verification (MUST COMPLETE FIRST)
```
[LLM]: Please confirm which model you're using for this task.
Example: "I'm using [MODEL_NAME] for this task"
```
- [ ] **LLM MUST** explicitly ask for model confirmation if not provided
- [ ] **USER MUST** respond with exact model name (e.g., "I'm using SWE-1 for this task")
- [ ] **BOTH** must verify model capabilities match task requirements

### 2. Development Environment Setup
- [ ] Verify Node.js version: `node --version`
- [ ] Install dependencies: `npm install`
- [ ] Start development server: `npm run dev`
- [ ] Open project in browser: http://localhost:5173

### 3. Git Pre-Flight Checks
- [ ] Check current branch: `git branch --show-current`
- [ ] Pull latest changes: `git pull origin main`
- [ ] Verify no uncommitted changes: `git status`
- [ ] Check DevProgress.md for current task status

## 📝 DEVELOPMENT WORKFLOW

This checklist serves as a quick reference to ensure consistent development practices across the Co-Director Platform project.

## Context7 MCP Usage Guidelines

### When to Use Context7 MCP
- [ ] **ALWAYS** use Context7 MCP when:
  - Checking package/documentation compatibility
  - Researching best practices for libraries/frameworks
  - Investigating error messages or warnings
  - Needing up-to-date API references
  - Working with new or unfamiliar technologies
  - Verifying implementation patterns

### How to Use Context7 MCP
1. **Before Searching**:
   - [ ] Identify the specific library/technology
   - [ ] Formulate clear, specific questions
   - [ ] Note the current version being used

2. **Documentation Lookup**:
   - [ ] Use `mcp1_resolve-library-id` to find the correct library
   - [ ] Use `mcp1_get-library-docs` to retrieve documentation
   - [ ] Always check version compatibility

3. **After Retrieval**:
   - [ ] Review the documentation thoroughly
   - [ ] Apply only the relevant parts
   - [ ] Document any important findings in code comments
   - [ ] Update relevant documentation if needed

## 🔄 GIT WORKFLOW REQUIREMENTS

### 1. Branch Naming (CRITICAL)
- [ ] **ALWAYS** use this exact format:
  ```
  feature/{task-id}-{kebab-case-description}-{model}
  ```
- [ ] **REQUIRED** components:
  - `feature/` - Prefix for all feature branches
  - `{task-id}` - Task number from DevProgress.md (e.g., 0-1, 1-2)
  - `{kebab-case-description}` - Short description in kebab-case
  - `{model}` - Model identifier in lowercase (e.g., swe-1, gpt-4)

### 2. Valid Examples
```
✅ feature/0-1-initialize-vite-swe-1
✅ feature/1-2-add-auth-gpt-4
✅ feature/2-3-update-docs-claude-3
```

### 3. Invalid Examples (DO NOT USE)
```
❌ docs-audit                 # Missing prefix, task ID, and model
❌ feature/docs-audit         # Missing task ID and model
❌ feature/0-1-docs-audit     # Missing model
❌ feature/docs_audit-swe1    # Underscore not allowed, use kebab-case
```

### 4. Branch Creation Process
1. **Verify Current Branch**
   ```bash
   git branch --show-current
   ```

2. **Create New Branch**
   ```bash
   # Format:
   git checkout -b feature/{task-id}-{description}-{model}
   
   # Example:
   git checkout -b feature/0-2-documentation-audit-swe-1
   ```

3. **Push to Remote**
   ```bash
   git push -u origin feature/0-2-documentation-audit-swe-1
   ```

### 5. Commit Message Format
```
{type}({scope}): {description} [{model}]

- Use present tense ("add" not "added")
- Keep first line under 72 characters
- Include model identifier in square brackets
- Reference issue/ticket numbers if applicable

Examples:
✅ feat(auth): add login form [swe-1]
✅ fix(api): resolve 500 error on user create [gpt-4]
✅ docs(readme): update setup instructions [claude-3]
```

### Git Workflow Requirements

#### Branch Naming (CRITICAL)
- [ ] **ALWAYS** include model identifier in branch names for model-specific work
- [ ] Follow this exact pattern:
  ```
  # For model-specific work (REQUIRED when using a specific model):
  feature/{task-id}-{description}-{model}
  
  # Example for SWE-1 model:
  feature/0-1-initialize-vite-swe1
  
  # For model-agnostic work (RARE - only for infrastructure/configuration):
  feature/{task-id}-{description}
  ```

#### Commit Messages (REQUIRED)
- [ ] **ALWAYS** include model identifier in commit messages when applicable:
  ```
  # For model-specific work:
  git commit -m "feat(scope): description [MODEL]"
  
  # Example:
  git commit -m "feat(setup): initialize Vite project [SWE-1]"
  ```

## 🛠 DEVELOPMENT PRACTICES

### 1. Code Organization
- [ ] Follow folder structure from TechnicalPatterns.md Section 4
- [ ] Place shared components in `src/components`
- [ ] Feature-specific components in `src/features/[feature]/components`
- [ ] Use PascalCase for component files (e.g., `UserProfile.tsx`)

### 2. Code Quality
- [ ] File length < 400 lines (BestPractices.md Section 2)
- [ ] Function/component length < 40 lines
- [ ] Add JSDoc comments for all exports
- [ ] Document complex logic with inline comments
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`

### 3. Documentation Standards
- [ ] Add file header to every source file:
  ```typescript
  /**
   * @file [filename.ext]
   * @description [Brief description]
   * @created YYYY-MM-DD
   * @lastUpdated YYYY-MM-DD
   * @module [path/from/src]
   */
  ```
- [ ] Document all props with PropTypes or TypeScript
- [ ] Include examples for complex components
- [ ] Update relevant documentation when making changes

## ✅ PRE-COMMIT CHECKS

### 1. Code Review
- [ ] Verify no console.log statements in production code
- [ ] Check for unused imports/variables
- [ ] Ensure consistent code formatting
- [ ] Verify all tests pass

### 2. Documentation Review
- [ ] All new components have proper JSDoc comments
- [ ] All props are documented
- [ ] Complex logic is explained
- [ ] Examples are provided where helpful

### 3. Git Status
- [ ] `git status` shows expected changes
- [ ] No sensitive data in commits
- [ ] Commit message follows conventions
- [ ] Branch name follows naming standard

## 🚀 DEPLOYMENT CHECKLIST

### 1. Pre-Deployment
- [ ] Update version number in package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Verify all documentation is up-to-date

### 2. Deployment Steps
1. Create release branch: `release/v1.0.0`
2. Run build: `npm run build`
3. Deploy to staging
4. Verify functionality
5. Deploy to production

### 3. Post-Deployment
- [ ] Verify production deployment
- [ ] Monitor error logs
- [ ] Update documentation if needed
- [ ] Close related issues

## During Development

### Context7 MCP Integration
- [ ] **BEFORE** implementing a new feature, check for existing patterns using Context7 MCP
- [ ] **WHEN** encountering an error, search for solutions using Context7 MCP
- [ ] **AFTER** finding a solution, document the resolution in code comments
- [ ] **FOR** any third-party libraries, verify the correct usage with Context7 MCP

### Development Practices
- [ ] Follow folder structure defined in TechnicalPatterns.md Section 4
- [ ] Keep file length under 400 lines (BestPractices.md Section 2)
- [ ] Keep function/component length under 40 lines (BestPractices.md Section 2)
- [ ] Add JSDoc comments for all functions, components, and types (see [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md))
- [ ] Include clear, descriptive comments explaining complex logic
- [ ] Place TypeScript interfaces at the top of files
- [ ] Name prop interfaces with "Props" suffix (e.g., MessageItemProps)
- [ ] Verify code follows ESLint documentation rules (run `npm run lint`)
- [ ] Make regular, atomic commits with conventional commit messages

## Before Committing Code

#### Documentation Verification
- [ ] Verify all new or modified files have proper JSDoc headers with:
  - [ ] @file - File name
  - [ ] @description - Clear description of purpose
  - [ ] @created - Creation date (YYYY-MM-DD)
  - [ ] @lastUpdated - Current date (YYYY-MM-DD)
  - [ ] @module - Module path
- [ ] Ensure all functions/components have complete JSDoc comments:
  - [ ] @description - What and why
  - [ ] @param - All parameters with types and descriptions
  - [ ] @returns - Return value description and type
  - [ ] @throws - Any potential errors
  - [ ] @example - Usage examples for complex functions
- [ ] Check that complex logic has inline comments explaining the "why"
- [ ] Verify all TypeScript types/interfaces are documented

#### Context7 MCP Checks
- [ ] Verify all library usages match Context7 MCP documentation
- [ ] Ensure any code patterns follow the latest best practices
- [ ] Document any Context7 MCP references in code comments

#### Code Quality
- [ ] Run `npm run lint` and fix all documentation warnings/errors
- [ ] Ensure code follows project patterns from TechnicalPatterns.md
- [ ] Verify all new components follow the documentation standards in DOCUMENTATION_STANDARDS.md
- [ ] Verify no sensitive data is being committed
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`

## Before Ending Development Session

- [ ] Commit all changes with appropriate conventional commit message
- [ ] Push changes to GitHub: `git push origin feature/{task-id}-{description}`
- [ ] Update DevProgress.md with completed tasks
- [ ] Create detailed SessionHandoff.md entry
- [ ] Recommend specific tasks for the next session

## Git Aliases for Faster Workflow

Add these to your `.gitconfig`:
```
[alias]
  start-task = "!f() { git checkout -b \"feature/$1\" && git push -u origin \"feature/$1\"; }; f"
  task-done = "!f() { git add . && git commit -m \"$1\" && git push; }; f"
```

Usage:
```bash
# Start a new task
git start-task 0-1-initialize-vite

# Commit and push changes
git task-done "feat(setup): initialize vite project"
```

For full details, see [GitWorkflow.md](./GitWorkflow.md).
