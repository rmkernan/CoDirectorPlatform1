# Co-Director Architecture Documentation
<!-- Last updated: May 9, 2025, 10:36 PM ET -->

> This document combines the high-level architecture overview with detailed implementation specifications from the original prototype design.

## Overview

Co-Director is an AI Childcare Agent testing environment designed to evaluate and improve AI assistants for childcare-related queries. The application allows testers to:

1. Configure testing sessions by specifying Google Documents (Scenarios, Principles) and a session topic
2. Interact with an AI agent grounded in those documents (via Context Caching) and an Employee Handbook (via RAG)
3. Review past chat sessions with rich metadata for quality evaluation

The system uses Google Gemini's Context Caching API and RAG (Retrieval-Augmented Generation) with Supabase for persistent storage of session data, chat logs, and vectorized handbook content.

## Application Structure

```
src/
├── components/       # UI components
│   ├── ui/           # shadcn UI components
│   ├── CoDirectorApp.tsx  # Main application component
│   ├── SetupTab.tsx       # Session configuration
│   ├── ChatTab.tsx        # Chat interface
│   ├── HistoryTab.tsx     # Session history and review
│   ├── EndSessionButton.tsx # Session termination
│   └── N8nWebhookUrlToggle.tsx  # Toggle between test/prod webhook URLs
├── context/
│   ├── session/           # Session context management
│   ├── ui/                # UI state context management
│   ├── status/            # Status messages context management
│   ├── history/           # Session history context management
│   ├── feedback/          # Feedback context management
│   ├── registry/          # Context registry for dependency management
│   └── compatibility/     # Backward compatibility with original AppContext
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   └── environment.ts # Environment configuration
├── App.tsx           # Root component with routing
└── main.tsx          # Application entry point
```

## State Management

The application uses React Context API for global state management, with a modular approach that separates concerns into five distinct contexts:

1. **SessionContext**:
   - Manages current session information (sessionId, isSessionActive)
   - Handles session lifecycle (startNewSession, endSession)
   - Stores chat history (chatHistory)
   - Provides message handling (sendMessage)

2. **UIContext**:
   - Controls UI state (activeTab, loading states)
   - Manages tab navigation (setActiveTab)
   - Handles UI-specific actions and state

3. **StatusContext**:
   - Manages status messages for different parts of the application
   - Provides status tracking for setup, chat, history, and feedback
   - Maintains message history for each status type
   - Offers status reset functionality (resetStatus)

4. **HistoryContext**:
   - Manages session history data (sessionList)
   - Handles history selection (selectedHistorySession)
   - Provides history loading functionality (loadSessionHistory, loadSessionDetails)

5. **FeedbackContext**:
   - Manages feedback state and submission
   - Handles feedback saving (saveSessionFeedback)
   - Tracks feedback submission status

### Context Registry Pattern

To solve circular dependencies between contexts, the application implements a context registry pattern:

1. **Registry Singleton**:
   - A singleton registry that allows contexts to register themselves
   - Provides access to contexts without creating circular dependencies
   - Acts as a fallback when React context API cannot be used

2. **Context Hooks**:
   - Each context provides a custom hook (useSessionContext, useUIContext, etc.)
   - Hooks first try to get the context from React context API
   - Fall back to the registry if needed (for non-React components or circular references)

3. **Unified Hook**:
   - A unified hook (useApp) works with both old and new context systems
   - Uses feature flags to determine which system to use
   - Maintains backward compatibility

### Compatibility Layer

A compatibility layer (CompatibilityProvider) maintains backward compatibility with the original AppContext interface:

1. **Feature Flags**:
   - USE_NEW_CONTEXT_SYSTEM controls whether to use the new context system
   - Individual flags for each context type allow gradual migration

2. **State Mapping**:
   - Maps state and actions from the new contexts to the original AppContext interface
   - Allows components to continue using the original interface during migration

## Key Data Flows

### Session Lifecycle

1. **Creation**:
   - User configures session in SetupTab
   - `startNewSession()` generates a unique session ID (format: "session-[timestamp]-[uuid]") and calls webhook
   - State updates to reflect active session

2. **Interaction**:
   - User sends messages via ChatTab
   - Messages processed through `sendMessage()`
   - AI responses received and added to chat history

3. **Termination**:
   - User triggers session end via EndSessionButton
   - `endSession()` notifies backend and updates state
   - Session moved to history, feedback dialog shown

4. **Feedback**:
   - User provides rating, tags, and notes
   - `saveSessionFeedback()` persists feedback
   - Session history updated with feedback data

## System Architecture

The system consists of three main components:

1. **Front-End**: The React application described in this document
2. **Back-End**: n8n workflows that handle API requests
3. **Storage**: Supabase database for persistent storage

### Back-End Architecture (n8n Workflows)

The back-end consists of two n8n workflows:

#### Workflow A (Setup & Chat)

Handles session initiation and chat messages:

##### Session Setup & Cache Creation

**Goal**: Define source documents and topic, initiate the session, create the Gemini Cache, and record initial session data in Supabase.

**Detailed Implementation Steps**:

1. **Webhook Node**: Serves as the primary entry point for external HTTP POST requests. Configured with `responseMode: "responseNode"` to delay response until processing is complete.

2. **ProcessWebhookData (Code node)**: Processes the initial data received from the Webhook. Extracts and validates required session parameters (sessionId, principlesDocId, scenarioDocIds, sessionTopic, historyTurnsSetting, testerId), formats timestamps in Eastern Time, and sets default values for AI model configuration.

3. **ChatEmpty? (If node)**: Checks if the `userQuery` field is empty or null. If true, routes to the Session Setup Path; if false, routes to the Chat Interaction Path.

4. **GetPrinciples (Google Docs node)**: Fetches the content of the principles document using the `principlesDocId` from the webhook data.

5. **ProcessScenarioDocIds (Code node)**: Normalizes scenario document IDs and names from various formats into a clean array of objects, where each object contains a scenario `id` and its corresponding `name`.

6. **Split Out Scenarios (SplitOut node)**: Takes the `scenariosToProcess` array and splits it into multiple individual items for iterative processing.

7. **Get Scenarios (Google Docs node)**: Fetches the content of each individual scenario document. Executes for each scenario item output by the Split Out Scenarios node.

8. **Build API Payload (Code node)**: Aggregates all fetched documents and combines them with clear separation markers:
   ```
   ######## SCENARIO DOCUMENT START ########
   [scenario content]
   ######## SCENARIO DOCUMENT END ########

   ######## UNIVERSAL PRINCIPLES START ########
   [principles content]
   ######## UNIVERSAL PRINCIPLES END ########
   ```
   Creates the Gemini API payload using snake_case parameter names (system_instruction, display_name) as required by the API.

9. **CreateGeminiCache (HTTP Request node)**: Sends the JSON payload to the Google Generative Language API's `cachedContents` endpoint to create a new context cache.

10. **ExtractCacheIDAndExpiry (Code node)**: Extracts the `geminiCacheId` from the response's "name" field and uses the `expireTime` directly from the API response. Also captures `totalTokenCount` and other metadata.

11. **StoreSessionData (Supabase node)**: Inserts the prepared session data into the `sessions` table in Supabase. Configured with `onError: continueRegularOutput` to ensure workflow completion even if storage fails.

12. **Code (Response Formatter) (Code node)**: Formats a final response message based on the success or failure of the Supabase operation. Returns a simple message format: `{"message": "Session data stored successfully in Supabase"}`.

13. **Respond to Webhook (Respond To Webhook node)**: Sends the HTTP response back to the original caller of the Webhook node.

For detailed implementation, see [Gemini Cache Documentation](n8nWorkflow/CacheGuide.md)

##### Chat Processing & RAG

**Goal**: Enable conversational interaction using cached docs, RAG for handbook, history context, and feedback mechanism.

**Detailed Implementation Steps**:

1. **Webhook Node**: Receives chat payload (sessionId, userQuery).

2. **Set Node (Detect Feedback)**: Determine if the message is feedback.

3. **Supabase Node (Read Session Data)**: Retrieve cache ID and settings.

4. **IF Node (Cache Expired?)**: Check if the cache has expired.

5. **HTTP Request Node (Vectorize Query)**: Vectorize the user query for RAG.

6. **Supabase Node (Query Vector DB)**: Perform similarity search against handbook embeddings.

7. **Function Node (Format RAG Context)**: Combine retrieved chunks into context.

8. **Postgres Node (Read Chat History)**:
   ```sql
   SELECT * FROM "codirectorChats"
   WHERE "sessionId" = '{{ $json.sessionId }}'
   ORDER BY timestamp DESC
   LIMIT {{ $json.historyTurnsSetting * 2 }}
   ```

9. **Function Node (Format History)**: Prepare chat history for the API.

10. **HTTP Request Node (Generate Content)**: Call Gemini API with context, history, and query.

11. **Set Node (Extract Response)**: Extract the AI response and prepare the payload.

12. **Webhook Response Node**: Send response to front-end.

##### Interaction Logging

**Goal**: Persistently record turn-by-turn messages to Supabase.

**Implementation Steps**:

1. **Determine Role**: Set role based on message type (user, AI, or feedback).

2. **Supabase Node (Insert User/Feedback Log)**: Record user message or feedback.

3. **Supabase Node (Insert AI Log)**: Record AI response with metadata.

4. **Update Session Metadata**: Update session statistics as needed.

#### Workflow B (History Service)

**Goal**: Review past sessions using rich metadata from Supabase and add feedback.

**API Endpoints**:
- `GET /api/sessions`: List all sessions
- `GET /api/sessions/{sessionId}/details`: Get session details
- `POST /api/sessions/{sessionId}/feedback`: Save session feedback

**Detailed Implementation**:

##### Session Listing
- **Trigger**: Webhook GET request to `/api/sessions`
- **Supabase Node**: Select relevant columns from the sessions table
- **Ordering**: Order by startTime descending
- **Response**: JSON array of session metadata

##### Session Details
- **Trigger**: Webhook GET request to `/api/sessions/{sessionId}/details`
- **Supabase Node**: Select from codirectorChats table, filter by sessionId
- **Ordering**: Order by timestamp ascending
- **Response**: JSON with session details and message history

##### Feedback Saving
- **Trigger**: Webhook POST request to `/api/sessions/{sessionId}/feedback`
- **Request Body**: Contains userNotes, rating, tags
- **Supabase Node**: Update the sessions table with feedback data
- **Response**: Success/error status

### Storage Architecture (Supabase)

Supabase is used for persistent storage with three main tables:

- **sessions**: Stores session-level metadata, configuration, and feedback
- **codirectorChats**: Stores turn-by-turn messages with timestamps and roles
- **handbookEmbeddings**: Stores vectorized chunks of the employee handbook for RAG

For detailed schema information, including column definitions, data types, and SQL considerations, see the [Database Schema](DATABASE.md) documentation.

## API Integration

The application communicates with two external webhooks that trigger n8n workflows:

- **WEBHOOK_A_URL**: Handles session management and chat interactions
  - `POST /`: Start a new session or send a message
  - `POST /end-session`: End an active session
  - Has separate test and production URLs that can be toggled in the UI

- **WEBHOOK_B_URL**: Manages session history and feedback
  - `GET /api/sessions`: List all sessions
  - `GET /api/sessions/{sessionId}/details`: Get session details
  - `POST /api/sessions/{sessionId}/feedback`: Save session feedback

## Environment Configuration

The application supports two types of environment configurations:

### Development Mode
- Uses mock data instead of real API calls
- Controlled by environment variable: `VITE_DEV_MODE`
- UI toggle: The DevModeToggle component in the Setup tab
- Local storage override: `CODIRECTOR_DEV_MODE`

### Webhook Environment
- Toggles between test and production webhook URLs
- Test webhook URL: Used for development and testing
- Production webhook URL: Used for production environment
- Controlled by the N8nWebhookUrlToggle component in the UI
- Local storage override: `CODIRECTOR_USE_TEST_WEBHOOK`

## Component Relationships

```
AppProviders (Context Providers)
├── SessionContextProvider
├── UIContextProvider
├── StatusContextProvider
├── HistoryContextProvider
├── FeedbackContextProvider
└── CompatibilityProvider (Backward compatibility)
    └── AppContent
        ├── SetupTab
        │   ├── N8nWebhookUrlToggle
        │   ├── DevModeToggle
        │   └── WebhookResponseDisplay
        ├── ChatTab
        │   └── EndSessionButton
        ├── HistoryTab
        └── ContextTestComponent (Development only)
```

## Process Flows

For detailed visual representations of the key processes and data flows in the application, see the [Flow Diagrams](FLOW_DIAGRAMS.md) documentation, which includes:

- Session Lifecycle
- Session Creation Flow
- Message Exchange Flow
- Session Termination Flow
- Document Processing Flow
- Chat History Retrieval Flow
- Data Persistence

## Data Persistence

### Front-End Storage
- **Session Storage**: Current session ID and chat history
- **Local Storage**: Development mode settings and last ended session

### Back-End Storage
- **Supabase Database**: Persistent storage for sessions, chat logs, and handbook embeddings

## Error Handling

The application implements a centralized error handling system:

1. **API Client**: Centralizes all API requests with consistent error handling
   - Supports multiple webhook response formats
   - Extracts error messages from various response structures
   - Stores complete webhook responses for debugging

2. **Error Utilities**: Provides error logging and user feedback
   - Displays user-friendly error messages
   - Logs technical details for debugging

3. **Error Boundaries**: Catches UI errors at the component level
   - Prevents component failures from crashing the entire application

4. **Webhook Response Display**: Shows detailed API response information
   - Displays success/error status with visual indicators
   - Shows relevant message or error information
   - Provides collapsible raw response data for debugging

## Future Considerations

### Performance and Functionality Enhancements
- **Streaming Responses**: Implement streaming for AI responses
- **Session Reset**: Allow resetting a session without creating a new one
- **Performance Optimization**: Improve RAG performance with better chunking and ranking
- **Enhanced Analytics**: More detailed session metrics and analysis

### Database and Workflow Optimizations
- **Summary Stat Calculation Strategy**: Define how/when endTime, totalTurns, avgResponseLatency, errorCount in the sessions table are updated (e.g., via Workflow B query, database triggers, explicit "End Session" action)
- **SQL Query Optimization**: Further optimize Postgres node queries with proper indexing and query planning
- **Token Management**: Implement logic to truncate history/RAG context if needed

### Error Handling and Logging
- **Error Logging**: Implement robust logging of errors within workflows to accurately populate errorCount
- **Database Error Handling**: Enhance error handling for SQL syntax and database connection issues

### Configuration and Customization
- **Feedback Tag Configuration**: Make "feedback:" prefix configurable
- **RAG Tuning**: Experiment with K value, embedding models, re-ranking