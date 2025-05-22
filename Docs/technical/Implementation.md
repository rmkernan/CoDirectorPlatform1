# Co-Director Front-End Rebuild: Implementation Plan
**Version:** 0.1
**Last Updated:** May 19, 2025, 8:15 PM EDT

## 1. Introduction

This document outlines the detailed implementation plan for the Minimum Viable Product (MVP) of the Co-Director front-end application. It translates the requirements from the `PRD.md` (v0.1) and the design from `ADD.md` (v0.1) into actionable phases and tasks.

**This plan is specifically structured to serve as a sequential list of tasks for an LLM coding assistant, guided by the user. Each task within the "Detailed Task Breakdown" sections is designed to be a clear, actionable prompt for the LLM. The intention is for the user to assign these tasks—either individually or in small, logical batches—to the LLM, verify the output, and then proceed, creating natural checkpoints and Human-in-the-Loop (HITL) review and iteration cycles.**

The primary goals of this implementation plan are:
* To break down the development work into manageable phases and tasks suitable for LLM-assisted coding.
* To define clear deliverables and explicit HITL review points for each phase.
* To identify dependencies and potential risks.
* To outline how testing will be integrated throughout the development lifecycle.
* To provide a clear roadmap for building the MVP efficiently and effectively.

## 2. Phased Approach / Sprints / Milestones

The MVP development will be broken down into the following logical phases. Each phase has specific objectives, key deliverables, and a detailed task breakdown. This approach allows for iterative development and continuous feedback, especially when working with an LLM. The "Detailed Task Breakdown" under each phase lists tasks that can be assigned to the LLM individually or in small, logical groups. It is recommended to complete and verify the output of one task or a small group of tasks before proceeding to the next. Each phase will conclude with an explicit Human-in-the-Loop review and iteration step.

### Phase 0: Project Setup & Foundation
* **Objective:** Establish the foundational structure and configuration for the project, ensuring all development tools, libraries, code quality tools (linters, formatters), pre-commit hooks, basic CI, and basic architectural patterns are in place. 
* **Key Deliverables:** * Initialized Vite + React + TypeScript project.
    * Core dependencies (Material UI, Zustand, testing libraries) installed and configured.
    * ESLint, Prettier, Husky, and lint-staged configured.
    * Basic CI workflow file created (e.g., for GitHub Actions).
    * Project folder structure created according to `ADD.md`.
    * Basic `App.tsx` and `AppLayout.tsx` (skeleton) components.
    * Initial MUI theme setup.
    * Initial testing configurations (Jest, RTL, Cypress).
    * Version control (Git) repository initialized with a `.gitignore` and basic `README.md`.
* **Detailed Task Breakdown:**
    * Task 0.1: Initialize a new Vite project using the command `npm create vite@latest co-director-frontend -- --template react-ts`.
    * Task 0.2: Navigate into the project directory (`cd co-director-frontend`), install dependencies (`npm install`), and verify successful project creation by running the default development server (`npm run dev`).
    * Task 0.3: Install Material UI core and icon packages: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`.
    * Task 0.4: Install Zustand for state management: `npm install zustand`.
    * Task 0.5: Install Jest, React Testing Library, and related dependencies for unit/component testing: `npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`.
    * Task 0.6: Configure Jest:
        * Create `jest.config.js` at the project root. Configure it for TypeScript, React, and to use `jest-environment-jsdom`. Include setup for `moduleNameMapper` for CSS/asset mocks and `setupFilesAfterEnv` for RTL setup.
        * Create a `setupTests.ts` file (e.g., in `src/`) to import `@testing-library/jest-dom`.
    * Task 0.7: Install Cypress for E2E testing: `npm install --save-dev cypress`.
    * Task 0.8: Initialize Cypress configuration: Run `npx cypress open`. This will generate default configuration files and folders (e.g., `cypress.config.ts`, `cypress/` directory). Review and close Cypress.
    * Task 0.9: Initialize a Git repository in the project root: Run `git init`.
    * Task 0.10: Install ESLint and Prettier along with necessary plugins and configurations:
        * `npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-plugin-import`
        * (Consider `eslint-plugin-mui-unused-classes` if MUI styling conventions become a focus).
    * Task 0.11: Configure ESLint:
        * Create an `.eslintrc.js` (or `.json`, `.yaml`) file in the project root.
        * Configure it with recommended settings for TypeScript, React (including hooks, JSX a11y), Prettier integration (to avoid conflicts), and import sorting/ordering. Example base:
          ```javascript
          // .eslintrc.js
          module.exports = {
            parser: '@typescript-eslint/parser',
            extends: [
              'eslint:recommended',
              'plugin:react/recommended',
              'plugin:react/jsx-runtime', // For new JSX transform
              'plugin:react-hooks/recommended',
              'plugin:@typescript-eslint/recommended',
              'plugin:jsx-a11y/recommended',
              'plugin:import/recommended',
              'plugin:import/typescript',
              'prettier', // Make sure this is last to override other formatting rules
              'plugin:prettier/recommended',
            ],
            plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y', 'import', 'prettier'],
            settings: {
              react: { version: 'detect' },
              'import/resolver': { typescript: {} },
            },
            env: { browser: true, jest: true, es2021: true, node: true },
            rules: {
              'prettier/prettier': 'error',
              'react/react-in-jsx-scope': 'off', // Not needed with React 17+ new JSX transform
              'import/order': [
                'error',
                {
                  groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                  pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
                  pathGroupsExcludedImportTypes: ['react'],
                  'newlines-between': 'always',
                  alphabetize: { order: 'asc', caseInsensitive: true },
                },
              ],
            },
          };
          ```
    * Task 0.12: Configure Prettier:
        * Create a `.prettierrc.js` (or `.json`) file in the project root with desired formatting options (e.g., `semi: true, singleQuote: true, jsxSingleQuote: false, trailingComma: 'es5', printWidth: 100`). Example:
          ```javascript
          // .prettierrc.js
          module.exports = {
            semi: true,
            singleQuote: true,
            jsxSingleQuote: false,
            trailingComma: 'es5',
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
          };
          ```
        * Create a `.prettierignore` file listing files/directories Prettier should ignore (e.g., `node_modules/`, `dist/`, `coverage/`).
    * Task 0.13: Add linting and formatting scripts to `package.json`:
        * `"lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\" --fix"`
        * `"format": "prettier \"src/**/*.{js,jsx,ts,tsx,css,md}\" --write"`
        * `"check-format": "prettier \"src/**/*.{js,jsx,ts,tsx,css,md}\" --check"`
    * Task 0.14: Install and configure Husky and lint-staged for pre-commit hooks:
        * `npm install --save-dev husky lint-staged`
        * Initialize Husky: `npx husky init` (this creates `.husky/`)
        * Create/edit `.husky/pre-commit` hook to run lint-staged:
          ```sh
          #!/usr/bin/env sh
          . "$(dirname -- "$0")/_/husky.sh"

          npx lint-staged
          ```
        * Configure `lint-staged` in `package.json` (or a separate config file like `.lintstagedrc.js`):
          ```json
          // package.json (partial)
          "lint-staged": {
            "src/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
            "src/**/*.{css,md}": ["prettier --write"]
          }
          ```
    * Task 0.15: Create a `.gitignore` file at the project root (e.g., add `node_modules/`, `.env*`, `dist/`, `coverage/`, `.DS_Store`, `cypress/videos/`, `cypress/screenshots/`, `*.local`).
    * Task 0.16: Create a basic Continuous Integration (CI) workflow file. For GitHub Actions, create `.github/workflows/ci.yml`:
        ```yaml
        # .github/workflows/ci.yml
        name: Co-Director CI

        on: [push, pull_request]

        jobs:
          build_and_test:
            # Replace 'runs-on: ubuntu-latest' with a container that has Node and Chrome
            # Example: Use a specific Node version and Cypress-provided browser image
            # Check [https://github.com/cypress-io/cypress-docker-images/tree/master/browsers](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers) for available tags
            runs-on: ubuntu-latest
            container: cypress/browsers:node18.17.0-chrome114 # Adjust Node/Chrome versions as needed

            steps:
              - uses: actions/checkout@v3
              # Node is already in the container, but setup-node can manage versions/cache if needed for other steps
              # If using a Node version from the container directly, this step might be simplified or adjusted
              - name: Use Node.js (from container or setup)
                uses: actions/setup-node@v3
                with:
                  node-version: '18.x' # Ensure this matches or is compatible with the container's Node
                  cache: 'npm'
              - name: Install dependencies
                run: npm ci
              - name: Run linters
                run: npm run lint
              - name: Run Prettier check
                run: npm run check-format
              - name: Run unit and component tests
                run: npm test -- --coverage --watchAll=false
              - name: Run E2E tests (Cypress)
                run: npx cypress run --browser chrome # Chrome is available in the container
        ```
    * Task 0.17: Create the initial folder structure within `src/` as defined in `ADD.md`:
        * `src/assets/`
        * `src/components/common/`
        * `src/components/layout/`
        * `src/components/features/setup/`
        * `src/components/features/chat/`
        * `src/components/features/history/`
        * `src/hooks/`
        * `src/services/`
        * `src/store/`
        * `src/store/slices/`
        * `src/styles/`
        * `src/types/`
        * `src/utils/`
    * Task 0.18: Create a basic `App.tsx` component in `src/`. For now, it can render `AppLayout`. Import `CssBaseline` from MUI and include it.
    * Task 0.19: Create a skeleton `AppLayout.tsx` component in `src/components/layout/`. This component will eventually hold the main navigation (Tabs). For now, a simple placeholder div is sufficient.
    * Task 0.20: Set up Material UI theme provider:
        * Create `src/styles/theme.ts`. Define a basic custom MUI theme (e.g., primary/secondary colors, typography settings if desired, refer to `PRD.md` 6.1 for simplicity).
            * *Styling Note:* This `theme.ts` is the primary place for global theme overrides.
        * Wrap the `App` component in `src/main.tsx` with MUI's `ThemeProvider` and `CssBaseline` and provide the custom theme.
    * Task 0.21: Create a basic `README.md` file at the project root with the project title ("Co-Director Front-End Rebuild") and brief setup/run instructions.
    * Task 0.21a: Define Global Developer Features Flag:
        * Create a global constant or utility (e.g., in `src/utils/featureFlags.ts` or directly derived from an environment variable like `import.meta.env.VITE_ENABLE_DEV_FEATURES`).
        * This flag (e.g., `ENABLE_DEV_FEATURES`) will control the visibility of all developer-specific UI elements.
        * Ensure it defaults to `false` if the environment variable is not explicitly set to true.
    * Task 0.22: Make the initial Git commit: Add all project files (including linter configs, husky setup, CI workflow) and commit with a message like "Initial project setup with linting, formatting, CI, and foundation."


### Phase 1: Core UI Layout & Setup Tab
* **Objective:** Implement the main application layout, the complete functionality and UI for the Session Setup Tab, and establish centralized session lifecycle management, including an initial Human-in-the-Loop review and iteration cycle.
* **Key Deliverables:**
    * Functional `AppLayout` component with tab-based navigation (MUI Tabs).
    * Fully functional `SetupView` component (UI and mocked interactions) as per `PRD.md` (4.1).
    * New `sessionLifecycleSlice.ts` for managing `activeSessionId`, `isSessionActive`, and related session states.
    * Refactored `setupSlice.ts` to manage only setup form data.
    * "Start New Session" functionality integrated with `sessionLifecycleSlice`.
    * Display of `sessionId` (mocked).
    * Initial UI for developer features like System Messages Log and Environment Toggles.
    * Unit and component tests for `SetupView` components, `sessionLifecycleSlice`, and updated `setupSlice`.
    * **User review and approval of the Setup Tab UI/UX with mocked data and new session lifecycle logic.**
* **Detailed Task Breakdown:**
    * **AppLayout Component (`src/components/layout/AppLayout.tsx`):**
        * Task 1.1: Implement the `AppLayout` component. It should contain an MUI `AppBar` (optional, for a title like "Co-Director MVP") and MUI `Tabs` for navigation.
        * Task 1.2: Define three `Tab` components within the `Tabs` for "Setup," "Chat," and "History" (PRD 4.4.1.1).
        * Task 1.3: Manage the active tab state (which tab is selected: "Setup," "Chat," or "History"). This state will be managed globally using a new Zustand slice (e.g., `uiSlice.ts` or `navigationSlice.ts`) to facilitate persistence via `localStorage` (as per PRD 4.4.2.2 and ADD.md Section 8.1). `AppLayout` will subscribe to this slice to determine the active tab. `AppLayout` will also need to observe `sessionLifecycleSlice.isSessionActive` to enable/disable Chat/History tabs and `sessionLifecycleSlice.justEndedSessionId` to potentially trigger navigation to the History tab by dispatching an action to the new UI/navigation slice.
        * Task 1.4: Conditionally render `SetupView`, `ChatView` (placeholder for now), and `HistoryView` (placeholder for now) components based on the active tab. `ChatView` and `HistoryView` tabs should initially be disabled and become enabled when `sessionLifecycleSlice.isSessionActive` is true.
        * Task 1.5: Ensure `AppLayout` is rendered by `App.tsx`.
    * **`sessionLifecycleSlice.ts` (`src/store/slices/sessionLifecycleSlice.ts`):** (No direct UI, so styling reminders not primary here)
        * Task 1.6: Define TypeScript interfaces for `SessionLifecycleState` (e.g., `activeSessionId: string | null`, `isSessionActive: boolean`, `isLoadingSession: boolean`, `sessionError: string | null`, `justEndedSessionId: string | null`).
        * Task 1.7: Create `sessionLifecycleSlice.ts` using Zustand. Initialize state: `activeSessionId: null`, `isSessionActive: false`, `isLoadingSession: false`, `sessionError: null`, `justEndedSessionId: null`.
        * Task 1.8: Implement actions in `sessionLifecycleSlice`:
            * `startSessionPending()`: Sets `isLoadingSession` to true, clears `sessionError`.
            * `startSessionSuccess(sessionId: string)`: Sets `activeSessionId` to `sessionId`, `isSessionActive` to true, `isLoadingSession` to false.
            * `startSessionFailure(errorMessage: string)`: Sets `sessionError` to `errorMessage`, `isLoadingSession` to false, `isSessionActive` to false, `activeSessionId` to `null`.
            * `endSessionPending()`: Sets `isLoadingSession` to true, clears `sessionError`.
            * `endSessionSuccess(endedSessionId: string)`: Clears `activeSessionId`, sets `isSessionActive` to false, `isLoadingSession` to false, sets `justEndedSessionId` to `endedSessionId`.
            * `endSessionFailure(errorMessage: string)`: Sets `sessionError`, `isLoadingSession` to false.
            * `clearJustEndedSessionId()`: Sets `justEndedSessionId` to `null`.
            * `clearSessionError()`: Sets `sessionError` to `null`.
    * **`setupSlice.ts` Refactoring (`src/store/slices/setupSlice.ts`):** (No direct UI)
        * Task 1.9: Define/Update TypeScript interface for `SetupState` to *only* include form fields: `principlesDocId: string`, `scenarioDocIds: string[]`, `sessionTopic: string`, `testerId: string`, `historyTurns: number | string`, `formError: string | null`.
        * Task 1.10: Update `setupSlice.ts`. Initialize state with default/pre-populated values from PRD 4.1.1 for form fields.
        * Task 1.11: Ensure actions exist in `setupSlice` to update each form field value. Add action for `setFormError` and `clearFormError`. Remove session lifecycle actions.
    * **SetupView Component (`src/components/features/setup/SetupView.tsx`):**
        * Task 1.12: Create the basic structure for `SetupView.tsx`.
        * Task 1.13: Create a sub-component `SessionControls.tsx` within `src/components/features/setup/` to hold the form elements.
        * Task 1.14: In `SessionControls.tsx`, implement MUI `TextField` components for form fields as per PRD 4.1.1.
        * Task 1.15: Implement the "Start New Session" MUI `Button` within `SetupView.tsx`.
            * *Styling Reminder:* Style this button using the `sx` prop or `styled()` utility as per Section 3.5.
        * Task 1.16: Add a UI element in `SetupView.tsx` to display `sessionLifecycleSlice.activeSessionId` (short-form as per PRD 4.1.3.2) when a session is active.
        * Task 1.17: Add placeholder UI sections in `SetupView.tsx` for "System Messages Log" and "Environment Configuration Toggles" (PRD 4.1.5, 4.1.6). Use MUI `Paper` or `Box` for layout.
            * *Styling Reminder:* Style these layout elements using the `sx` prop or `styled()` utility as per Section 3.5.
    * **Connecting UI to State (SetupView & SessionControls):**
        * Task 1.18: Connect `SessionControls.tsx` inputs to the `setupSlice` state.
        * Task 1.19: Connect "Start New Session" button's `disabled` state to `sessionLifecycleSlice.isLoadingSession` or `sessionLifecycleSlice.isSessionActive`.
        * Task 1.20: Display errors from `sessionLifecycleSlice.sessionError` or `setupSlice.formError` in `SetupView.tsx` (e.g., MUI `Alert`).
            * *Styling Reminder:* Ensure the MUI `Alert` is styled according to Section 3.5.
    * **Frontend Validation (PRD 4.1.2):**
        * Task 1.21: Implement "required field" validation in "Start New Session" click handler.
    * **Mocked API Service for Session Start (`src/services/apiClient.ts`):**
        * Task 1.22: Implement/verify mocked `startSession` async function.
        * Task 1.23: Mock `startSession` to simulate API success/failure.
    * **Integrating "Start New Session" Flow:**
        * Task 1.24: Implement the "Start New Session" button click logic (validation, generate `sessionId`, dispatch actions, call mock API, handle response).
    * **Testing (Jest/RTL):**
        * Task 1.25: Unit tests for `sessionLifecycleSlice`.
        * Task 1.26: Unit tests for refactored `setupSlice`.
        * Task 1.27: Component tests for `SessionControls.tsx`.
        * Task 1.28: Component tests for `SetupView.tsx`.
        * Task 1.29: Tests for mocked `apiClient.startSession`.
    * **Human Review & Iteration (Setup Tab UI/UX & Session Lifecycle):**
        * Task 1.30: **Human Review & Iteration:**
            * User to thoroughly review `AppLayout`, `SetupView`, and the session start flow.
            * *User Note for providing feedback to LLM:* When requesting UI/UX changes, be as specific as possible. For example, instead of "make this look better," try "change the button color to blue," "reduce padding here to 8px," or "use an MUI `<Alert severity='error'>` for this message." Reference specific MUI components or props if known.
            * **Checkpoints:**
                * Correct form data handling and session state management.
                * `SetupView` UI reflects states accurately.
                * Correct tab navigation and enabling/disabling.
                * Key functional components and logic clearly map back to requirements in `PRD.md` and design in `ADD.md` (spot check for traceability).
                * Code adheres to defined Architectural Principles in `ADD.md` (modularity, separation of concerns, services layer usage, etc.).
                * MUI component styling adheres to guidelines in Section 3.5 (preference for `sx` prop and `styled()` utility, minimal global CSS).
                * Adherence to overall PRD requirements.
                * Basic Accessibility Check (MUI Components):** For key interactive MUI components used (e.g., Buttons, TextFields, Tabs, Dialogs, Tables), verify that essential `aria-` attributes (e.g., `aria-label`, `aria-labelledby`, `aria-describedby`, roles) are appropriately set, even if a11y is P3 overall. Ensure interactive elements are keyboard focusable.

        * Task 1.31: **LLM-Assisted Adjustments:** Based on review, user to create specific prompts for the LLM for any needed changes.

### Phase 2: Chat Tab Implementation
* **Objective:** Develop the Chat Tab, enabling users to interact with the AI (initially with mocked responses), ensuring it correctly uses the centralized `sessionLifecycleSlice` for session context and state, and includes basic E2E testing for keyboard accessibility, followed by a Human-in-the-Loop review and iteration cycle. 
* **Key Deliverables:** (As previously defined)
* **Detailed Task Breakdown:**
    * **`ChatView` Component (`src/components/features/chat/ChatView.tsx`):**
        * Task 2.1: Create/Update basic structure for `ChatView.tsx`.
        * Task 2.2: Layout `ChatView` using MUI `Box` or `Grid`.
    * **`ChatMessageList` Component (`src/components/features/chat/ChatMessageList.tsx`):**
        * Task 2.3: Create/Verify `ChatMessageList.tsx`.
        * Task 2.4: Define/Verify `Message` interface.
        * Task 2.5: Implement rendering for message types.
        * Task 2.6: Ensure list is scrollable.
        * Task 2.7: Implement auto-scrolling.
    * **`MessageInput` Component (`src/components/features/chat/MessageInput.tsx`):**
        * Task 2.8: Create/Verify `MessageInput.tsx`.
        * Task 2.9: Implement MUI `TextField` for message composition.
        * Task 2.10: Implement MUI `IconButton` with Send icon.
        * Task 2.11: Add logic for "Enter" to send, "Shift+Enter" for new lines.
        * Task 2.12: Clear input field after send.
        * Task 2.13: Disable input if `disabled` prop is true.
    * **State Management for Chat (`src/store/slices/chatSlice.ts`):** (No direct UI)
        * Tasks 2.14 - 2.16: Define `ChatState`, create `chatSlice`, implement actions.
    * **Mocked API Service for Chat (`src/services/apiClient.ts`):**
        * Tasks 2.17 - 2.18: Implement mocked `sendMessage` and `endSession`.
    * **Connecting UI to State and Mocked Services (`ChatView.tsx`):**
        * Tasks 2.19 - 2.23: Integrate slices, implement `handleSendMessage`, manage `isAiResponding`, and effect hook for clearing state.
    * **"End Session" Functionality (PRD 4.2.5):**
        * Task 2.24: Add "End Session" MUI `Button`.
        * Task 2.25: Implement confirmation dialog (MUI `Dialog`).
        * Task 2.26: Implement logic for confirmed session end.
    * **Visual Turn Indicator (PRD 4.2.1.4):**
        * Task 2.27: Implement visual turn indicator.
    * **Testing (Jest/RTL & Cypress):**
        * Tasks 2.28 - 2.33: Implement unit, component, and E2E tests.
    * **Human Review & Iteration (Chat Tab UI/UX & Session Lifecycle):**
        * Task 2.34: **Human Review & Iteration:**
            * User to thoroughly review `ChatView`.
            * *User Note for providing feedback to LLM:* (Same as Task 1.30)
            * **Checkpoints:**
                * Correct state management and session integration.
                * "End Session" flow works as expected.
                * Functional correctness as per PRD Section 4.2.
                * **Key functional components and logic clearly map back to requirements in `PRD.md` and design in `ADD.md`.**
                * **Code adheres to defined Architectural Principles in `ADD.md`.**
                * **MUI component styling adheres to guidelines in Section 3.5.**
                * Basic keyboard interaction for sending messages.
                * Basic Accessibility Check (MUI Components):** For key interactive MUI components used (e.g., Buttons, TextFields, Tabs, Dialogs, Tables), verify that essential `aria-` attributes (e.g., `aria-label`, `aria-labelledby`, `aria-describedby`, roles) are appropriately set, even if a11y is P3 overall. Ensure interactive elements are keyboard focusable.

        * Task 2.35: **LLM-Assisted Adjustments:** Based on review, user to create specific prompts for the LLM.

### Phase 3: History Tab Implementation
* **Objective:** Build the History Tab, allowing users to review past sessions and submit feedback (initially with mocked data), ensuring it correctly uses `sessionLifecycleSlice.justEndedSessionId` for auto-selection of the last session, followed by a Human-in-the-Loop review and iteration cycle. 
* **Key Deliverables:** (As previously defined)
* **Detailed Task Breakdown:**
    * **`HistoryView` Component (`src/components/features/history/HistoryView.tsx`):**
        * Task 3.1: Create/Update basic structure for `HistoryView.tsx`.
        * Task 3.2: Layout `HistoryView` (MUI `Grid` or `Stack`).
    * **`SessionListTable` Component (`src/components/features/history/SessionListTable.tsx`):**
        * Task 3.3: Create/Verify `SessionListTable.tsx`.
        * Task 3.4: Define/Verify `SessionSummary` type.
        * Task 3.5: Use MUI `Table` components.
        * Task 3.6: Define columns.
        * Task 3.7: Implement row selection.
        * Task 3.8: Display loading indicator.
    * **State Management for History (`src/store/slices/historySlice.ts`):** (No direct UI)
        * Tasks 3.9 - 3.11: Define interfaces, create `historySlice`, implement actions.
    * **Mocked API Service for History (`src/services/apiClient.ts`):**
        * Tasks 3.12 - 3.14: Implement mocked API functions for history.
    * **Connecting UI to State & Mocked Services (`HistoryView.tsx`):**
        * Tasks 3.15 - 3.17: Fetch list, pass data to table, fetch details on selection.
    * **`SessionDetailView` (Part of `HistoryView.tsx` or separate component):**
        * Task 3.18: Display session details (metadata, chat history).
        * Task 3.19: Display loading/error indicators.
    * **`FeedbackForm` Component (`src/components/features/history/FeedbackForm.tsx`):**
        * Task 3.20: Create/Verify `FeedbackForm.tsx`.
        * Task 3.21: Implement MUI inputs for feedback.
        * Task 3.22: Implement "Save Feedback" MUI `Button`.
        * Task 3.23: Display error/success messages.
    * **Integrating Feedback Flow (`HistoryView.tsx`):**
        * Tasks 3.24 - 3.25: Pass data to form, implement submit handler.
    * **Auto-selection of Session (PRD 4.3.4.1):**
        * Task 3.26: In `AppLayout.tsx`, add an effect hook that observes `sessionLifecycleSlice.justEndedSessionId`.
        * Task 3.27: Implement auto-selection logic (navigate, set selected ID, clear `justEndedSessionId`).
    * **Testing (Jest/RTL):**
        * Tasks 3.28 - 3.32: Implement unit and component tests.
    * **Human Review & Iteration (History Tab UI/UX & Session Lifecycle):**
        * Task 3.33: **Human Review & Iteration:**
            * User to thoroughly review `HistoryView`.
            * *User Note for providing feedback to LLM:* (Same as Task 1.30)
            * **Checkpoints:**
                * Correct auto-selection and data display.
                * Feedback submission works.
                * **Key functional components and logic clearly map back to requirements in `PRD.md` and design in `ADD.md`.**
                * **Code adheres to defined Architectural Principles in `ADD.md`.**
                * **MUI component styling adheres to guidelines in Section 3.5.**
                * Functional correctness as per PRD Section 4.3.
                * Basic Accessibility Check (MUI Components):** For key interactive MUI components used (e.g., Buttons, TextFields, Tabs, Dialogs, Tables), verify that essential `aria-` attributes (e.g., `aria-label`, `aria-labelledby`, `aria-describedby`, roles) are appropriately set, even if a11y is P3 overall. Ensure interactive elements are keyboard focusable.

        * Task 3.34: **LLM-Assisted Adjustments:** Based on review, user to create specific prompts for the LLM.

### Phase 4: Developer Tools, API Integration & Refinements
* **Objective:** Implement the full functionality of developer-specific tools, integrate live APIs for all features, and conduct general UI/UX refinements based on holistic review.
* **Key Deliverables:** (As previously defined)
* **Detailed Task Breakdown:**
    * **Developer Tools - System Messages Log (SetupView - PRD 4.1.5):**
        * Tasks 4.1 - 4.3: Create `systemLogSlice`, modify `apiClient` to log, create `SystemMessagesDisplay.tsx`.
        * Task 4.4: `SystemMessagesDisplay.tsx` renders logs. Optionally make `data` expandable. Make it scrollable. **The entire SystemMessagesDisplay component's rendering in SetupView must be conditional based on the global `ENABLE_DEV_FEATURES` flag.**
    * *User Interaction Note:* Consider if basic filtering or search capabilities for this log are needed for MVP usability; if so, instruct LLM to add simple MUI controls (e.g., a `TextField` for search input).

    * **Developer Tools - Environment Configuration Toggles (SetupView - PRD 4.1.6):**
        * Task 4.5: Create `devSettingsSlice`.
        * Task 4.6: Add UI controls (MUI TextField for URLs, Switch for mock mode) in `SetupView` for `devSettingsSlice`. **The visibility of this entire group of controls must be conditional based on the global `ENABLE_DEV_FEATURES` flag.**
        * Tasks 4.7 - 4.9: Implement persistence, modify `apiClient` to use settings, handle mock mode.
        * Task 4.9a: **Implement Warning Modal for Dev Settings Change During Active Session:**
            * Based on `PRD 4.1.6.4` and `ADD.md` guidance.
            * When a developer setting (webhook URL, mock mode) in `SetupView` is changed while `sessionLifecycleSlice.isSessionActive` is true:
                * Display an MUI `Dialog` warning the user that the current session will end.
                * If "Proceed" is clicked:
                    * Trigger the end session workflow (actions from `sessionLifecycleSlice`, `chatSlice.clearChatState`, etc.).
                    * Apply the setting change in `devSettingsSlice`.
                    * Ensure navigation back to Setup Tab if not already there.
                * If "Cancel" is clicked, revert the UI control for the setting to its previous state and do nothing else.    
    * **Client-Side Persistence - Active Tab (PRD 4.4.2.2):**
        * Tasks 4.10 - 4.11: Implement persistence for active tab Zustand slice.
    * **Full API Integration - Replacing Mocks in `apiClient.ts`:**
        * Task (General): General instructions for API integration.
        * Task 4.12: Integrate `startSession`.
        * Task 4.13: Integrate `sendMessage`.
            * *Error Handling Note:* Specifically for the `CACHE_EXPIRED` error: ensure the user is clearly informed in the chat, further chat input for the current session is disabled, and they are guided to start a new session (e.g., by a message suggesting navigation to the Setup Tab or by disabling chat input and showing an 'End Session' button prominently).
        * Task 4.14: Integrate `endSession`.
        * Task 4.15: Integrate `getSessions`.
        * Task 4.16: Integrate `getSessionDetails`.
        * Task 4.17: Integrate `saveSessionFeedback`.
    * **Error Handling Refinements:**
        * Task 4.18: Review API error handling and display.
        * Task 4.19: Implement global error boundary.
    * **Testing Updates:**
        * Task 4.20: Review unit/component tests. **Strongly consider introducing `msw` (Mock Service Worker) at the beginning of Phase 4 (or earlier if complex API interactions are tested in Phases 2/3) for robust API mocking in tests, especially for E2E tests and complex integration scenarios.**
        * Task 4.21: Write tests for developer tools and persistence.
        * Task 4.22: Develop more comprehensive E2E tests.
    * **Holistic Human Review & Iteration (Full Application):**
        * Task 4.23: **Holistic Human Review & Iteration:**
            * User to conduct end-to-end review.
            * *User Note for providing feedback to LLM:* (Same as Task 1.30)
            * **Checkpoints:**
                * Overall application flow, UI/UX consistency, performance, error handling.
                * Developer tools functionality and persistence.
                * Data integrity.
                * Robust handling of `CACHE_EXPIRED` error in ChatView, guiding the user appropriately.
                * Key functional components and logic clearly map back to requirements in `PRD.md` and design in `ADD.md`.
                * Code adheres to defined Architectural Principles in `ADD.md`.
                * MUI component styling adheres to guidelines in Section 3.5 across the application.
                * Basic Accessibility Check (MUI Components):** For key interactive MUI components used (e.g., Buttons, TextFields, Tabs, Dialogs, Tables), verify that essential `aria-` attributes (e.g., `aria-label`, `aria-labelledby`, `aria-describedby`, roles) are appropriately set, even if a11y is P3 overall. Ensure interactive elements are keyboard focusable.

        * Task 4.24: **LLM-Assisted Final Adjustments:** Based on review, user to create specific prompts for the LLM.

### Phase 5: Testing, Documentation & Deployment Preparation
* **Objective:** Conduct comprehensive testing, finalize documentation, and prepare the application for MVP deployment.
* **Key Deliverables:** (As previously defined)
* **Detailed Task Breakdown:**
    * **Final Testing Rounds:**
        * Tasks 5.1 - 5.3: Execute all tests, conduct manual exploratory testing.
    * **Task 5.x: **Create Success Metric Validation Checklist**:
        * Review all Success Metrics defined in `PRD.md` (Section 7).
        * For each metric, define a concrete validation method. This may include:
            * Referencing specific automated test case IDs (from Jest/RTL or Cypress suites).
            * Defining specific manual User Acceptance Testing (UAT) steps or scenarios.
            * Noting where qualitative feedback from the primary user will be formally gathered and assessed against the metric.
        * Compile this into a checklist to be used during the final UAT and sign-off process. This ensures all defined success criteria for the MVP are explicitly verified.  
    * **User Acceptance Testing (UAT):**
        * Tasks 5.4 - 5.5: User performs UAT, address critical issues.
    * **Documentation Finalization:**
        * Tasks 5.6 - 5.8: Create/Update `USER_GUIDE.md`, final review of project docs, update `README.md`.
    * **Build Preparation:**
        * Task 5.9: Create production environment variables.
            * `devSettingsSlice.ts` should be designed to initialize its default webhook URLs from these Vite environment variables (e.g., `import.meta.env.VITE_WEBHOOK_A_URL`). The UI toggles in `SetupView` for webhook URLs and mock mode are primarily for developer overrides during local development and should not affect the URLs used in a production build unless explicitly designed for such an override scenario (which is not typical for production). Ensure `mockModeEnabled` in `devSettingsSlice` defaults to `false` for production builds.
        * Tasks 5.10 - 5.11: Remove dev-only tools, run production build.
    * **Deployment (Example: Netlify/Vercel - adapt as needed):**
        * Tasks 5.12 - 5.16: Setup hosting, connect Git, configure build/env vars, trigger deployment.
    * **Post-Deployment Verification:**
        * Task 5.17: Perform smoke testing on live URL.
    * **Final Project Documentation & Handoff:**
        * Tasks 5.18 - 5.21: Update status docs, log completion, commit and tag code.

## 3. Working with this Plan: LLM Handoff & Session Strategy

This section outlines the recommended strategy for using this Implementation Plan effectively during LLM-assisted development sessions, particularly when work spans multiple conversations. The goal is to ensure continuity and provide the LLM with the necessary context at the start of each new session.

**3.1. Core Principle: Sequential Task Execution & Iteration**
* This `Implementation.md` serves as the primary script for development.
* The "Detailed Task Breakdown" under each phase lists specific, actionable tasks.
* These tasks are designed to be tackled sequentially by the user guiding the LLM.
* **Human-in-the-Loop (HITL) Review:** After significant features or UI sections are developed (even with mocked data), dedicated "Human Review & Iteration" tasks are included. This is where the user critically evaluates the output against the PRD and UI/UX goals, then directs the LLM for necessary adjustments.
* Complete and verify one task (or a small, logical batch of tasks, including HITL review cycles) before moving to the next. This creates natural checkpoints.

**3.2. Key Documents for Context**
The following documents are essential for maintaining context across sessions:
* **`docs/Redesign/Implementation.md` (This Document):** The master list of tasks and HITL review points.
* **`docs/Redesign/CURRENT_STATUS.md`:** Your "You Are Here" marker. It will always point to the last completed task and the next task(s) to be addressed from this Implementation Plan.
* **`docs/Redesign/HANDOFF.md`:** Provides overall project goals, links to all major documents, and high-level status.
* **`docs/Redesign/PRD.md`:** The source of truth for *what* to build (functional requirements, UI details).
* **`docs/Redesign/ADD.md`:** The source of truth for *how* to build it (tech stack, patterns, folder structure).
* **`docs/API.md`:** Details backend API endpoints, crucial for API integration tasks.
* **`docs/Redesign/ConversationLog.md`:** Provides a historical record of discussions and decisions.

**3.3. Standardized Session Start Procedure**

At the beginning of each new development session with the LLM, use the following prompt template to orient the LLM:

```text
"Hello LLM. We are continuing work on the Co-Director Front-End Rebuild project.

Your primary goal for this session is to help me implement specific tasks from our `Implementation.md` document.

To get current, please review the following project documents in this order, paying close attention to the file paths:

1.  **`docs/Redesign/HANDOFF.md`**: For overall project context and links to all key documents.
2.  **`docs/Redesign/CURRENT_STATUS.md`**: This is CRITICAL. It will tell you:
    * The overall project phase.
    * The *exact last completed task ID* from `Implementation.md`.
    * The *next specific task ID(s)* from `Implementation.md` that we will be working on in this session.
    * Any recent key decisions.
3.  **`docs/Redesign/Implementation.md`**: Locate the 'Next specific task ID(s)' identified in `CURRENT_STATUS.md`. This is our primary task list for coding for this session.
4.  **`docs/Redesign/PRD.md`**: Refer to this for *what* we are building (functional requirements, UI details) relevant to the current tasks.
5.  **`docs/Redesign/ADD.md`**: Refer to this for *how* we are building it (tech stack, patterns, folder structure) relevant to the current tasks.
6.  **`docs/API.md`**: Refer to this if the current tasks involve API integration.

Today, we will be focusing on [Clearly state the specific task ID(s) from Implementation.md that are the target for this session, e.g., 'Task 1.1 and Task 1.2 from Phase 1'].

Please confirm you have reviewed these documents and are ready to begin with [first task ID for the session]. Let me know if you have any clarifying questions before we start coding."
```

**3.4. End-of-Session Protocol (Critical for Continuity)**

At the conclusion of each development session:

 1.  **Update `docs/Redesign/CURRENT_STATUS.md`**:
        * Update the **Task ID Checklist** (see `CURRENT_STATUS.md` for structure) to mark newly completed tasks.
        * Briefly summarize the overall progress and specify the *next high-level goal or phase sub-section* from this `Implementation.md` to be worked on.
        * Note any new key decisions made during the session.
        * (Detailed per-task completion is primarily tracked via commit messages).
2.  **Update `docs/Redesign/HANDOFF.md`**: Briefly summarize the overall progress and current status.
3.  **Add a new entry to `docs/Redesign/ConversationLog.md`**: Detail the session's focus, key discussions, decisions, and outcomes.
4.  **Commit all code changes** to your Git repository with clear, descriptive messages referencing the task IDs completed.
5.  Ensure all relevant project documents are saved.

**3.5. LLM Coding Assistant - General Guidelines**

When generating code for this project, please adhere to the following general guidelines. These are in addition to the specific requirements of each task.

* **Adhere to Project Stack:** Strictly use the defined technology stack: React (v18+ with Hooks), TypeScript, Material UI (MUI v5+), and Zustand.
* **Follow Architectural Patterns:** Implement solutions consistent with `ADD.md`, including the proposed folder structure (e.g., `src/components/features/`, `src/services/`, `src/store/slices/`), component design principles, API integration strategy (`apiClient.ts`), and error handling strategies.
* **Code Quality & Clarity:**
    * Generate well-commented code, particularly for non-obvious logic, component props, state management actions, and service functions.
    * Prioritize readability and maintainability. Use clear and descriptive variable, function, and component names.
    * **Avoid "magic strings" or "magic numbers"; use named constants where appropriate for better readability and maintainability.**
    * Follow standard TypeScript and React best practices.
* **Component-Based Development:** Create modular, reusable React functional components with well-defined props (using TypeScript interfaces).
* **State Management:**
    * Utilize Zustand for global application state. Create separate slices for different domains of state as outlined in `ADD.md`.
    * Use local component state (`useState`, `useReducer`) for UI-specific state that doesn't need to be shared globally.
* **API Interaction:**
    * All backend API calls must be routed through the central service layer (`src/services/apiClient.ts`).
    * Refer to `API.md` for endpoint URLs, request/response structures, and expected status codes.
    * Implement robust error handling for API calls within the service layer and ensure errors are propagated appropriately for display in the UI as per `PRD.md`.
* **Testing:**
    * When a task involves creating new logic (e.g., utility functions, Zustand actions) or significant component functionality, and where specified in the phase's "Testing Integration" plan, generate corresponding unit or component tests using Jest and React Testing Library.
    * Ensure tests are meaningful and cover key functionality and edge cases.
* **MUI Usage:**
    * Leverage MUI components effectively according to their documentation.
    * **Styling MUI Components:**
        * **Primary Method (Inline Styles with `sx` prop):** For most component-specific styling, use MUI's `sx` prop. This allows you to write CSS-like rules directly within the component's JSX, providing access to the theme.
            * *LLM Instruction Example:* "When I ask you to style an MUI `<Button>` to have a blue background and white text, please implement it using the `sx` prop like this: `<Button sx={{ backgroundColor: 'blue', color: 'white' }}>Click Me</Button>`."
            * *LLM Instruction Example:* "If I need a component to have a margin of 10 pixels on all sides, use the `sx` prop: `<Box sx={{ margin: 1 }}>` (MUI spacing units) or `<Box sx={{ margin: '10px' }}>`."
        * **Reusable Styled Components (`styled()` utility):** If you find that a specific set of styles is being reused across multiple instances of an MUI component or a custom component, use MUI's `styled()` utility to create a new, pre-styled version of that component.
            * *LLM Instruction Example:* "If we need a special type of `Card` that always has a red border and specific padding, I will ask you to create a `StyledErrorCard` component using `const StyledErrorCard = styled(Card)(({ theme }) => ({ border: '1px solid red', padding: theme.spacing(2) }));`. Then, use `<StyledErrorCard>` where needed."
        * **Avoid Global CSS Files:** Do not create separate `.css` files for component-specific styles. Global styles should be rare and primarily confined to `src/styles/theme.ts` for MUI theme overrides (e.g., defining primary/secondary colors, global typography defaults) or potentially a single global stylesheet for truly application-wide base styles if absolutely necessary.
        * **Consistency with `ADD.md`:** This approach aligns with the architectural goal of using MUI's built-in styling capabilities for maintainability and consistency, as outlined in `ADD.md`.
        * *LLM Instruction:* "Always prioritize using the `sx` prop for one-off styles and the `styled()` utility for reusable styled components. Only use global CSS if explicitly instructed for theme-level changes or base application styles."
* **Error Handling (General):** Implement UI error displays (e.g., MUI Alerts, inline messages) as specified in the `PRD.md` for different error scenarios (API errors, validation errors).
* **Ask for Clarification:** If a task in this `Implementation.md` document is unclear, ambiguous, or seems to conflict with `PRD.md` or `ADD.md`, please state the ambiguity and ask for clarification before generating code.
* **MVP Focus:** For this MVP, prioritize implementing the core functional requirements. Avoid over-engineering or adding features not specified in `PRD.md v0.1`.
* **Iterative Approach:** Be prepared to iterate on generated code. The user will provide feedback during HITL review cycles, and you may be asked to refactor or modify previously generated code.

Adhering to this handoff strategy and these general guidelines will ensure that each new session can start efficiently and that the LLM-generated code aligns with project standards.

## 4. Dependencies and Critical Path

* **Inter-Phase Dependencies:**
    * Phase 0 must be complete before Phase 1 can effectively begin.
    * Initial UI/UX development and HITL review for each tab (Phases 1-3) should ideally occur before full API integration for that tab to allow for early feedback on mocked-up versions.
    * Phase 1 (Setup Tab API integration) provides the `sessionId` necessary for Phase 2 (Chat Tab).
    * Phase 2 (End Session) leads into Phase 3 (History Tab auto-selection).
* **Intra-Phase Dependencies:** Will be identified as tasks are broken down within each phase.
* **Critical Path Items:** (Examples - to be refined as tasks are detailed for all phases)
    * Completion of all tasks in Phase 0.
    * Development of the core API service module (`src/services/apiClient.ts`) with mocked implementations.
    * Implementation and HITL review of `AppLayout` and `SetupView` UI.
    * Implementation and HITL review of `ChatView` UI.
    * Implementation and HITL review of `HistoryView` UI.
    * Full API integration for all tabs.

## 5. Testing Integration

This section outlines how the testing strategies defined in `ADD.md` (Jest/RTL for unit/component tests, Cypress for E2E tests) will be applied during each phase of development.

* **General Approach:**
    * **Test-Driven Development (TDD) Mindset:** While not strictly enforcing TDD for all UI components, a TDD approach will be encouraged for business logic, utility functions, and state management slices.
    * **Continuous Testing:** Tests will be run regularly during development, both locally and potentially in a CI environment.
* **Phase-Specific Testing:**
    * **Phase 0 (Project Setup):** Basic test runner configurations will be validated. Sample tests might be created to ensure the testing environment is operational (e.g., a simple test for `App.tsx` to render without crashing).
    * **Phase 1 (Setup Tab):**
        * Unit tests for form validation logic, any frontend `sessionId` generation logic (if applicable), and state transformations related to the setup process.
        * Component tests for `SetupView` and its sub-components (e.g., `SessionControls`) to verify rendering based on props, user interactions (input changes, button clicks), and conditional display logic against mocked data.
        * Initial API service tests (mocked using Jest mocks) for the `/start-session` endpoint in `apiClient.ts`.
    * **Phase 2 (Chat Tab):**
        * Unit tests for message formatting, state updates related to chat history, feedback prefix detection, and turn indicator logic.
        * Component tests for `ChatView`, `ChatMessageList`, `MessageInput` to verify rendering, message sending, scroll behavior, and display of different message types (user, AI, feedback, error) against mocked data.
        * API service tests (mocked) for `/send-message` and `/end-session` endpoints in `apiClient.ts`.
        * E2E tests (Cypress) for the core workflow (start session, send message, receive mock response, end session) once UI is stable after HITL review.
    * **Phase 3 (History Tab):**
        * Unit tests for data transformation of session history/details if any specific client-side logic is applied.
        * Component tests for `HistoryView`, `SessionListTable`, `FeedbackForm` to verify data display, session selection, form input, and feedback submission against mocked data.
        * API service tests (mocked) for session history, details, and feedback submission endpoints in `apiClient.ts`.
        * E2E tests (Cypress) for viewing session history, details, and submitting feedback once UI is stable after HITL review.
    * **Phase 4 (Developer Tools & Refinements):**
        * Unit/Component tests for any new logic or UI elements related to developer tools (e.g., System Messages Log display, environment toggle functionality, `localStorage` interactions).
        * API service tests updated to reflect live API interactions.
        * Regression testing (manual and automated) to ensure refinements and API integration haven't broken existing functionality.
        * Expanded E2E tests covering live API interactions.
    * **Phase 5 (Testing, Documentation & Deployment):**
        * Full regression testing using all automated tests (unit, component, E2E) against the live or staging backend.
        * Focused manual exploratory testing of all user workflows described in `PRD.md`.
        * User Acceptance Testing (UAT) by the primary user (you) against all MVP requirements.

## 6. Risk Assessment and Mitigation

| Risk ID | Description                                      | Likelihood | Impact | Mitigation Strategy                                                                 |
| :------ | :----------------------------------------------- | :--------- | :----- | :---------------------------------------------------------------------------------- |
| R01     | Underestimation of task complexity for LLM       | Medium     | Medium | Break tasks into smaller, more granular prompts. Iterative refinement with LLM. Provide clear context and expected outcomes for each task.     |
| R02     | API integration issues (unexpected responses, CORS, etc.) | Low-Medium | Medium-High | Thoroughly test API service layer with mocked responses first. Verify against `API.md`. Early integration testing with actual backend (since controlled internally) can be done as planned in Phase 4. Implement robust error handling in API client. |
| R03     | State management complexity with Zustand         | Low        | Medium | Keep state slices focused on specific domains. Refer to Zustand best practices. Incremental implementation and testing of state logic. |
| R04     | MUI component customization and styling challenges | Low        | Medium | Leverage MUI documentation extensively. Start with basic MUI components and styling, iterating on customizations during HITL review cycles. Isolate complex styling. |
| R05     | Delays in receiving feedback or clarifications from user | Low        | Medium | User to maintain clear communication channels. Allocate time for HITL reviews. Regular check-ins and prompt responses to LLM queries. |
| R06     | Scope creep beyond MVP                           | Medium     | High   | Strictly adhere to `PRD.md` (v0.1) for MVP features. Defer non-essential features to a post-MVP backlog. Regularly review tasks against MVP scope. |
| R07     | Difficulties in setting up/running E2E tests with Cypress | Medium     | Medium | Allocate specific time for Cypress setup and test development. Start with simple, critical path tests and expand. Refer to Cypress documentation and examples. |
| R08     | Ensuring consistent code quality and conventions with LLM | Medium     | Medium | Provide clear instructions on coding standards (e.g., commenting, naming conventions) if not implicitly handled by project setup (ESLint, Prettier). User to review LLM-generated code during HITL cycles. Project Lead to proactively run linters/formatters on LLM-generated code. |
| R09     | Managing dependencies and potential conflicts    | Low        | Low    | Regularly update dependencies in a controlled manner. Test thoroughly after updates. |
| R10    | Iteration cycles extend phase timelines          | Medium     | Medium | Acknowledge HITL review and iteration as part of the plan. Factor in time for adjustments. Prioritize critical feedback for MVP. |
| R11    | Inconsistent or suboptimal LLM output quality requiring extensive refactoring** |*Medium | Medium-High | Strict adherence to granular tasks. Project Lead to perform diligent HITL reviews of code structure, not just functionality. Be prepared to discard and re-prompt with more specific instructions if output quality is poor. Use 'LLM Coding Assistant - General Guidelines' as a checklist during reviews. Focus on one small piece of logic/component at a time. |
| R12    | Upstream Dependency Breaking Changes         | Low-Medium | Medium | If development spans several months, major versions of core dependencies (e.g., Vite, React, MUI, Zustand) might be released with breaking changes. Mitigation: Pin minor/patch versions. Evaluate major updates carefully in a separate branch. Allocate time for potential refactoring if an upgrade is necessary. |


*(Note: Risk likelihood and impact are subjective and for planning purposes. R02 Likelihood/Impact adjusted slightly as internal control reduces some uncertainty but integration itself still carries inherent risks.)*

 ## Appendix A: PRD Requirements to Implementation Task Traceability

    This appendix provides a mapping from the Product Requirements Document (PRD.md v0.1) requirements to the corresponding task IDs in this Implementation Plan. This matrix helps ensure all functional requirements are addressed by specific implementation tasks and aids in verifying coverage.

    *Note: This matrix will be populated and maintained as development progresses and task details are finalized. The Task IDs below are illustrative examples.*

    | PRD Requirement ID (Section) | Implementation Task ID(s) | Status      | Notes                                      |
    | :--------------------------- | :------------------------ | :---------- | :----------------------------------------- |
    | **4.1 Session Setup Tab** |                           |             |                                            |
    | 4.1.1 (Field Pre-population) | Task 1.10, Task 1.14      | Planned     | Covers pre-population and editability      |
    | 4.1.2 (Input Validation)     | Task 1.21                 | Planned     | Covers frontend input validation           |
    | 4.1.3 (Session ID Mgmt)      | Task 1.24 (partially)     | Planned     | Frontend generation of `sessionId`         |
    | 4.1.4 (Starting Session)     | Task 1.20, Task 1.22, Task 1.24 | Planned     | Covers button, API call, feedback        |
    | 4.1.5 (System Msgs Log)      | Task 4.1, Task 4.2, Task 4.3, Task 4.4 | Planned     | Covers slice, API client, display        |
    | 4.1.6 (Env. Config Toggles)  | Task 4.5, Task 4.6, Task 4.7, Task 4.8, Task 4.9 | Planned     | Covers slice, UI, persistence, API use   |
    | **4.2 Chat Tab** |                           |             |                                            |
    | 4.2.1 (Chat History Display) | Task 2.3, Task 2.4, Task 2.5, Task 2.6, Task 2.7, Task 2.27 | Planned     | Covers list, message types, scroll, turn |
    | 4.2.2 (Message Input)        | Task 2.8, Task 2.9, Task 2.10, Task 2.11, Task 2.12, Task 2.13 | Planned     | Covers input field, send, behavior       |
    | 4.2.3 (AI/System Msgs)       | Task 2.19 (partially), Task 2.21 (partially) | Planned     | Covers display of AI/system messages     |
    | 4.2.4 (Real-time Feedback)   | Task 2.19 (partially)     | Planned     | Covers "feedback:" prefix handling       |
    | 4.2.5 (Ending Session)       | Task 2.24, Task 2.25, Task 2.26 | Planned     | Covers button, confirmation, API call    |
    | **4.3 History Tab** |                           |             |                                            |
    | 4.3.1 (Session List)         | Task 3.3, Task 3.4, Task 3.5, Task 3.6, Task 3.7, Task 3.8 | Planned     | Covers table, columns, selection, load   |
    | 4.3.2 (Session Detail)       | Task 3.18, Task 3.19      | Planned     | Covers metadata, chat history, download  |
    | 4.3.3 (Feedback Submission)  | Task 3.20, Task 3.21, Task 3.22, Task 3.23, Task 3.24, Task 3.25 | Planned     | Covers form, inputs, save, messages    |
    | 4.3.4 (Navigation/State)     | Task 3.26, Task 3.27      | Planned     | Covers auto-selection after session end  |
    | 4.3.5 (Dev Functionality)    | *(Currently N/A for MVP)* | Deferred    | No specific P1 tools identified          |
    | **4.4 General App Requirements**|                           |             |                                            |
    | 4.4.1 (Navigation/Layout)    | Task 1.1, Task 1.2, Task 1.3, Task 1.4 | Planned     | Covers AppLayout, Tabs, conditional render|
    | 4.4.2 (App State Persistence)| Task 4.10, Task 4.11 (Tab), Task 4.7 (Dev Settings) | Planned     | Covers localStorage for dev tools & tab  |
    | 4.4.3 (Global Error Indic.)  | Task 4.19                 | Planned     | Covers global error boundary             |
    | 4.4.4 (Data Integrity)       | *(Covered by various tasks ensuring UI reflects state)* | N/A Direct Task | General principle for UI updates       |

    **Instructions for Maintenance:**
    * As tasks are completed or refined, update the 'Implementation Task ID(s)' and 'Status' columns.
    * Ensure each functional requirement from PRD Section 4 has at least one corresponding task ID.
    * Use the 'Notes' column for any clarifications, if multiple tasks contribute to a single requirement, or if a task covers multiple requirements.
    ```


