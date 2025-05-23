# Co-Director Platform: Development Checklist

**Created:** 2025-05-22 16:29 ET  
**Last Updated:** 2025-05-22 21:59 ET  
**Version:** 3.0

## 🚨 START OF CONVERSATION CHECKLIST

### 1. First Steps (ALWAYS DO THESE IN ORDER)

1. **Model Verification**
   ```
   [LLM]: I'm starting this conversation. Which model are you using for this task?
   ```
   - Respond with exact model name (e.g., "I'm using SWE-1 for this task")

2. **Document Review**
   - Check DevProgress.md for current task status and priorities
   - Review latest SessionHandoff.md entry for context

3. **Branch Recommendation**
   - Recommend a branch name: `feature/{task-id}-{description}-{model}`
   - Example: `feature/0-14-configure-zustand-store-swe-1`

4. **Environment Setup**
   - Verify project is set up and ready to run

## 📝 DEVELOPMENT WORKFLOW

### Task Prioritization
- Select tasks from DevProgress.md based on:
  - Priority tasks highlighted in latest SessionHandoff.md entry
  - Tasks marked as "In Progress" first
  - Dependencies between tasks (follow the order in DevProgress.md)

### Context7 MCP Usage (ALWAYS USE)
- Before implementing new features/libraries
- When encountering errors or warnings
- To verify best practices

### How to Use Context7 MCP
1. **Before Searching**:
   - [ ] Identify the specific library/technology
   - [ ] Formulate clear, specific questions
   - [ ] Note the current version being used

2. **Documentation Lookup**:
   - [ ] Use `mcp1_resolve-library-id` to find the correct library
   - [ ] Use `mcp1_get-library-docs` to retrieve documentation
   - [ ] Always check version compatibility

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
  - [ ] @created - Creation date in format YYYY-MM-DD HH:MM ET (e.g., 2025-05-22 21:55 ET)
  - [ ] @lastUpdated - Current date in format YYYY-MM-DD HH:MM ET (e.g., 2025-05-22 21:55 ET)
  - [ ] @module - Module path
- [ ] Run ESLint to verify documentation standards compliance: `npm run lint`
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

## 📑 END OF CONVERSATION CHECKLIST

1. **Document Updates**
   - Update DevProgress.md with:
     - Current status of tasks (✅ Completed, 🔄 In Progress)
     - Updated timestamp
     - Any new technical decisions

2. **Create SessionHandoff.md Entry**
   - Session summary (accomplishments and duration)
   - Current development state
   - Key files modified
   - Git branch and commit information
   - **Recommended next tasks with specific branch name**

3. **Git Tasks**
   - Commit all changes
   - Push to GitHub

For details on git commands and additional workflows, see [GitWorkflow.md](./GitWorkflow.md).
