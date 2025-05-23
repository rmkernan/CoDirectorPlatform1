# Co-Director Platform - Application

This is the main application directory for the Co-Director Platform, a React-based application built with Vite and TypeScript.

## Getting Started

To get the application running locally, follow these steps:

1.  **Install Dependencies:**
    If you haven't already, navigate to the main project directory (`c:\PythonProjects\CoDirectorPlatform1`) in your terminal and run:
    ```bash
    npm install
    ```
    This will install all necessary dependencies for both the root project and the `app` workspace.

2.  **Run the Development Server:**
    To start the Vite development server for the application, navigate to the project root (`c:\PythonProjects\CoDirectorPlatform1`) and run:
    ```bash
    npm run dev
    ```
    This command typically launches the application, and you should see output in your terminal indicating the local URL (usually `http://localhost:5173` or similar).

## Running Tests

This project uses Jest for unit and integration testing.

1.  **Configuration:**
    *   The main Jest configuration is located in `app/jest.config.cjs`.
    *   TypeScript transformations for Jest are handled by `ts-jest`, using the configuration specified in `app/tsconfig.jest.json`.

2.  **Run All Tests:**
    To run all tests within the `app` directory, navigate to the project root (`c:\PythonProjects\CoDirectorPlatform1`) and execute:
    ```bash
    npx jest --config=app/jest.config.cjs --rootDir=app --verbose
    ```
    Alternatively, to run tests for a specific file (e.g., `mockApiClient.test.ts`):
    ```bash
    npx jest --config=app/jest.config.cjs --rootDir=app src/services/api/mockApiClient.test.ts --verbose
    ```
    Adding `--no-cache` can be useful if you suspect caching issues.

3.  **Note on `punycode` Deprecation Warning:**
    You may see a `DeprecationWarning: The \`punycode\` module is deprecated.` when running tests. This is a known warning originating from dependencies and does not currently affect test execution or application functionality.

## Project Structure

The application follows a feature-based directory structure. Key directories include:

*   `src/components/`: Shared UI components.
*   `src/features/`: Feature-specific modules (components, hooks, types, utils).
*   `src/services/`: API clients and service integrations.
*   `src/store/`: Zustand state management setup.
*   `src/types/`: Global TypeScript type definitions.

Refer to `Docs/technical/TechnicalPatterns.md` for more details on the architectural patterns and project structure.