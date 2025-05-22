# Co-Director Platform: Architectural Design Document

**Version:** 3.0  
**Last Updated:** May 22, 2025, 10:38 AM EDT

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Architectural Principles](#3-architectural-principles)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
   - 5.1 [Component Architecture](#51-component-architecture)
   - 5.2 [Data Flow Architecture](#52-data-flow-architecture)
   - 5.3 [Integration Architecture](#53-integration-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
   - 6.1 [Frontend Structure](#61-frontend-structure)
   - 6.2 [State Management](#62-state-management)
   - 6.3 [Component Design](#63-component-design)
   - 6.4 [UI/UX Patterns](#64-uiux-patterns)
7. [Backend Architecture](#7-backend-architecture)
   - 7.1 [n8n Workflow Architecture](#71-n8n-workflow-architecture)
   - 7.2 [Database Architecture](#72-database-architecture)
   - 7.3 [API Architecture](#73-api-architecture)
   - 7.4 [Context Caching Strategy](#74-context-caching-strategy)
8. [Error Handling Architecture](#8-error-handling-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Testing Architecture](#10-testing-architecture)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Appendix](#12-appendix)

## 1. Introduction

This document outlines the architectural design for the Co-Director Platform, a comprehensive system designed for iterative development and fine-tuning of the Co-Director AI's knowledge assets. The architecture supports both human-led testing and validation (20% of efforts) and LLM-mediated automated testing (80% of efforts).

### 1.1 Purpose

The Co-Director Platform serves as a testing and refinement environment for developing a "Sage-like Co-Director" AI system. This architecture document provides a blueprint for building a robust, maintainable, and extensible system that supports this purpose.

### 1.2 Scope

This document covers the complete system architecture, including:
- Frontend React application architecture
- Backend n8n workflow architecture
- Database design and implementation
- External integrations with Google Docs and Gemini API
- Error handling, security, and deployment considerations

### 1.3 Document Relationship

This document aligns with and extends the Product Requirements Document (PRDv3), providing the architectural specifications to fulfill the requirements outlined in that document.

## 2. System Overview

The Co-Director Platform is structured as a multi-tier application with:

1. **Presentation Tier**: React-based SPA with a tabbed interface for session setup, chat interaction, and history review.
2. **Processing Tier**: n8n workflows for orchestrating document processing, context caching, AI interaction, and data management.
3. **Data Tier**: Supabase (PostgreSQL) for storing session data, chat logs, and vector embeddings.
4. **Integration Tier**: Connections to external services, including Google Docs API and Gemini API.

### 2.1 Key Capabilities

- Session configuration with Google Doc IDs for principles and scenarios
- Context caching using the Gemini API for efficient AI conversations
- RAG-enhanced AI interaction using handbook embeddings
- Comprehensive session history and feedback collection
- Export of session data for LLM-based analysis
- Developer tools for debugging and system configuration

## 3. Architectural Principles

The architecture is guided by the following principles:

### 3.1 Modularity

- Clear separation of concerns between frontend, backend, and data layers
- Component-based design for maintainability and reusability
- Context-based state management with isolated domains

### 3.2 Scalability

- Stateless design for horizontal scaling
- Efficient context caching to reduce AI API costs
- Optimized database queries with proper indexing

### 3.3 Extensibility

- Plugin-based architecture for adding new features
- Standardized API interfaces for integration
- Configuration-driven behavior where possible

### 3.4 Maintainability

- Consistent coding patterns and practices
- Comprehensive documentation
- Automated testing and CI/CD pipelines

### 3.5 Observability

- Structured logging across all system components
- Performance monitoring and metrics collection
- Debug tools for developer productivity

## 4. Technology Stack

### 4.1 Frontend Technologies

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Material UI (MUI)
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier

### 4.2 Backend Technologies

- **Workflow Orchestration**: n8n
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Vector Store**: pgvector extension
- **APIs**: 
  - Google Docs API
  - Google Gemini API
  - Supabase REST API

### 4.3 Development Tools

- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Containerization**: Docker (for local development)
- **Documentation**: Markdown, JSDoc

## 5. System Architecture

### 5.1 Component Architecture

The system consists of three primary components:

1. **Frontend Application**:
   - React-based Single Page Application (SPA)
   - Responsible for user interaction and data presentation
   - Communicates with backend via webhooks and Supabase APIs

2. **Backend Workflows**:
   - n8n workflow instances for processing requests
   - Handles document retrieval, context caching, and AI interactions
   - Maintains session state in Supabase

3. **Data Storage**:
   - Supabase PostgreSQL database
   - Stores session data, chat history, and vector embeddings
   - Provides real-time updates via Supabase Realtime

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│  Frontend           │     │  Backend            │     │  External Services  │
│  Application        │     │  Workflows          │     │                     │
│  (React)            │     │  (n8n)              │     │  - Google Docs API  │
│                     │◄───▶│                     │◄───▶│  - Gemini API       │
│  - Setup Tab        │     │  - Session Setup    │     │                     │
│  - Chat Tab         │     │  - Chat Processing  │     │                     │
│  - History Tab      │     │  - History Service  │     │                     │
│                     │     │                     │     │                     │
└─────────┬───────────┘     └─────────┬───────────┘     └─────────────────────┘
          │                           │                             
          │                           │                             
          ▼                           ▼                             
    ┌─────────────────────────────────────────────┐                
    │                                             │                
    │  Supabase                                   │                
    │  (PostgreSQL)                               │                
    │                                             │                
    │  - Sessions Table                           │                
    │  - Chat Logs Table                          │                
    │  - Handbook Embeddings Table                │                
    │                                             │                
    └─────────────────────────────────────────────┘                
```

### 5.2 Data Flow Architecture

The system implements three primary data flows:

#### 5.2.1 Session Setup Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Fetch Scenario  │────▶│ Fetch Principles│────▶│ Combine with    │
│ Document        │     │ Document        │     │ Separators      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Store Session   │◀────│ Extract Cache   │◀────│ Create Gemini   │
│ Data            │     │ ID              │     │ Cache           │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Sequence:
1. Frontend sends session parameters to n8n webhook
2. n8n fetches Google Doc content for scenarios and principles
3. Documents are combined with clear separation markers
4. Gemini context cache is created with the combined content
5. Session data (including cache ID) is stored in Supabase
6. Success/error response is returned to frontend

#### 5.2.2 Chat Interaction Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Get Session     │────▶│ Check Cache     │────▶│ Retrieve Chat   │
│ Data            │     │ Expiry          │     │ History         │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Log Messages    │◀────│ Process         │◀────│ Call Gemini API │
│ to Database     │     │ Response        │     │ with Context    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Sequence:
1. Frontend sends user message to n8n webhook
2. n8n retrieves session data and checks cache validity
3. If cache is valid, chat history is retrieved from database
4. Gemini API is called with history and cache reference
5. AI response is processed and messages are logged to database
6. Response is returned to frontend

#### 5.2.3 History Review Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Request Session │────▶│ Select Session  │────▶│ View Session    │
│ List            │     │ from List       │     │ Details         │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Export Session  │◀────│ Save Session    │◀────│ Provide         │
│ Data            │     │ Feedback        │     │ Feedback        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Sequence:
1. Frontend requests session list from Supabase
2. User selects a session to view details
3. Frontend requests specific session details from Supabase
4. User provides or updates feedback
5. Frontend sends feedback updates to Supabase via n8n
6. User exports session data for external analysis

### 5.3 Integration Architecture

The system integrates with external services through standardized interfaces:

#### 5.3.1 Google Docs Integration

- Uses Google Docs API for document retrieval
- Requires authentication with Google service account
- Documents are retrieved and processed in the n8n workflow

#### 5.3.2 Gemini API Integration

- Uses Gemini API for context caching and response generation
- Implements proper parameter naming (snake_case)
- Handles cache expiration and error conditions

#### 5.3.3 Supabase Integration

- Direct integration from frontend for session listing and history
- Integration via n8n for session creation and feedback storage
- Real-time updates for chat messages using Supabase Realtime

## 6. Frontend Architecture

### 6.1 Frontend Structure

The frontend application follows a modular, component-based architecture with the following structure:

```
src/
├── components/       # UI components
│   ├── common/       # Shared UI components
│   │   ├── Button.tsx
│   │   ├── TextField.tsx
│   │   └── ...
│   ├── features/     # Feature-specific components
│   │   ├── setup/    # Setup tab components
│   │   ├── chat/     # Chat tab components
│   │   └── history/  # History tab components
│   └── layout/       # Layout components
│       ├── Header.tsx
│       ├── Tabs.tsx
│       └── ...
├── services/         # API and service integrations
│   ├── api/          # API client
│   │   ├── apiClient.ts
│   │   ├── sessionApi.ts
│   │   └── ...
│   └── supabase/     # Supabase client
│       ├── supabaseClient.ts
│       └── ...
├── store/            # State management
│   ├── slices/       # State slices
│   │   ├── sessionSlice.ts
│   │   ├── chatSlice.ts
│   │   └── ...
│   └── index.ts      # Store configuration
├── hooks/            # Custom React hooks
│   ├── useApi.ts
│   ├── useSession.ts
│   └── ...
├── utils/            # Utility functions
│   ├── formatting.ts
│   ├── validation.ts
│   └── ...
├── types/            # TypeScript type definitions
│   ├── session.ts
│   ├── message.ts
│   └── ...
├── assets/           # Static assets
│   ├── images/
│   └── styles/
├── App.tsx           # Root component
├── main.tsx          # Application entry point
└── index.html        # HTML template
```

### 6.2 State Management

The frontend uses Zustand for state management with a slice-based architecture:

#### 6.2.1 Store Structure

```javascript
// Store with slices
const useStore = create((...args) => ({
  ...createSessionSlice(...args),
  ...createChatSlice(...args),
  ...createHistorySlice(...args),
  ...createUISlice(...args),
  ...createFeedbackSlice(...args),
}));
```

#### 6.2.2 State Slices

- **sessionLifecycleSlice**: Manages active session state, loading states, and session ID
- **setupSlice**: Manages form data for session setup and validation
- **chatSlice**: Manages chat messages, AI response states, and message errors
- **historySlice**: Manages session list, selected session, and history loading
- **feedbackSlice**: Manages feedback data, validation, and submission
- **devSettingsSlice**: Manages developer environment settings
- **systemLogSlice**: Manages system message logs for developers

#### 6.2.3 Persistence Strategy

- Session state is persisted in local storage for recovery
- UI preferences are persisted in local storage
- Chat history is stored in-memory and in Supabase

### 6.3 Component Design

The frontend follows these component design patterns:

#### 6.3.1 Main View Components

- **AppLayout**: Provides overall structure with navigation tabs
- **SetupView**: Configuration interface for starting new sessions
- **ChatView**: Real-time chat interface for AI interaction
- **HistoryView**: Session history browsing and feedback interface

#### 6.3.2 Common Components

- **ChatMessageList**: Displays conversation history with different message types
- **MessageInput**: Text input for composing user messages
- **SessionControls**: Form elements for session configuration
- **FeedbackForm**: Interface for submitting session ratings and comments
- **SystemMessagesDisplay**: Developer-focused system message log

#### 6.3.3 Component Communication

- Parent-child via props
- Cross-component via Zustand store
- Event-based via custom hooks

### 6.4 UI/UX Patterns

#### 6.4.1 Navigation

- Tabbed interface for main application sections
- Clear visual indicators for active tab
- Persistent state across tab navigation

#### 6.4.2 Form Handling

- Consistent validation with inline error messages
- Field-level validation with visual indicators
- Form-level validation for submission

#### 6.4.3 Loading States

- Visual indicators for async operations
- Skeleton loaders for content loading
- Disabled UI elements during operations

#### 6.4.4 Error Presentation

- Toast notifications for transient errors
- Inline errors for form validation
- Modal dialogs for blocking errors
- System message log for detailed error information

## 7. Backend Architecture

### 7.1 n8n Workflow Architecture

The backend uses n8n for workflow orchestration, with two primary workflows:

#### 7.1.1 Session Setup & Chat Workflow

This workflow handles session creation and chat message processing:

**Components:**
- Webhook entry point for receiving HTTP requests
- Conditional branching based on request type
- Google Docs integration for document retrieval
- Gemini API integration for context caching and chat
- Supabase integration for data storage

**Key Nodes:**
1. **Webhook**: Entry point for HTTP requests
2. **ProcessWebhookData**: Extracts and validates request parameters
3. **ChatEmpty?**: Routes to appropriate workflow branch
4. **GetPrinciples**: Fetches principles document from Google Docs
5. **ProcessScenarioDocIds**: Normalizes scenario document IDs
6. **Get Scenarios**: Fetches scenario documents from Google Docs
7. **BuildAPIPayload**: Combines documents with separators
8. **CreateGeminiCache**: Creates context cache in Gemini API
9. **ExtractCacheIDAndExpiry**: Processes API response
10. **StoreSessionData**: Stores session data in Supabase
11. **GetChatHistory**: Retrieves chat history for messages
12. **FormatChatHistory**: Prepares chat history for Gemini API
13. **CallGeminiAPI**: Sends request to Gemini with cached context
14. **LogUserMessage/LogAIResponse**: Records messages in database

#### 7.1.2 History Workflow

This workflow manages session history and feedback:

**Components:**
- Webhook entry points for different history operations
- Supabase integration for data retrieval and storage
- Data transformation for frontend presentation

**Key Endpoints:**
1. **GET /api/sessions**: Lists all sessions
2. **GET /api/sessions/{sessionId}/details**: Gets session details
3. **POST /api/sessions/{sessionId}/feedback**: Saves session feedback

### 7.2 Database Architecture

#### 7.2.1 Database Schema

The database uses PostgreSQL (via Supabase) with the following structure:

**Sessions Table:**
```sql
CREATE TABLE public."sessions" (
  "sessionId" TEXT PRIMARY KEY,
  "geminiCacheId" TEXT,
  "cacheCreationTime" TIMESTAMPTZ,
  "cacheExpiryTime" TIMESTAMPTZ,
  "startTime" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "endTime" TIMESTAMPTZ,
  "principlesDocId" TEXT NOT NULL,
  "scenarioDocIds" TEXT[] NOT NULL,
  "sessionTopic" TEXT NOT NULL,
  "modelUsed" TEXT NOT NULL,
  "historyTurnsSetting" INTEGER NOT NULL,
  "totalTurns" INTEGER DEFAULT 0,
  "avgResponseLatency" FLOAT,
  "errorCount" INTEGER DEFAULT 0,
  "testerId" TEXT,
  "userNotes" TEXT,
  "rating" INTEGER,
  "tags" TEXT[],
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Chat Logs Table:**
```sql
CREATE TABLE public."codirectorChats" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" TEXT NOT NULL REFERENCES public."sessions"("sessionId"),
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "role" TEXT NOT NULL CHECK ("role" IN ('user', 'ai', 'feedback')),
  "textContent" TEXT NOT NULL,
  "geminiCacheIdUsed" TEXT,
  "modelUsed" TEXT,
  "responseLatency" INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Handbook Embeddings Table:**
```sql
CREATE TABLE public."handbookEmbeddings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "embedding" VECTOR(1536) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 7.2.2 Database Indexing

**Sessions Table:**
```sql
CREATE INDEX "sessions_startTime_idx" ON public."sessions"("startTime" DESC);
```

**Chat Logs Table:**
```sql
CREATE INDEX "codirectorChats_sessionId_idx" ON public."codirectorChats"("sessionId");
CREATE INDEX "codirectorChats_timestamp_idx" ON public."codirectorChats"("timestamp");
```

**Handbook Embeddings Table:**
```sql
CREATE INDEX "handbookEmbeddings_embedding_idx" ON public."handbookEmbeddings" USING ivfflat ("embedding" vector_cosine_ops);
```

#### 7.2.3 Data Relationships

- One-to-many relationship between sessions and chat messages
- Each session has many messages, each message belongs to exactly one session
- Handbook embeddings are independent entities used for RAG functionality

### 7.3 API Architecture

#### 7.3.1 API Endpoints

**Webhook A Endpoints:**

- **Start Session**
  - URL: `{WEBHOOK_A_URL}`
  - Method: POST
  - Purpose: Initialize a new testing session
  
- **Send Message**
  - URL: `{WEBHOOK_A_URL}`
  - Method: POST
  - Purpose: Send user message and get AI response

- **End Session**
  - URL: `{WEBHOOK_A_URL}/end-session`
  - Method: POST
  - Purpose: Terminate active session

**Webhook B Endpoints:**

- **Get Session History**
  - URL: `{WEBHOOK_B_URL}/api/sessions`
  - Method: GET
  - Purpose: List all sessions

- **Get Session Details**
  - URL: `{WEBHOOK_B_URL}/api/sessions/{sessionId}/details`
  - Method: GET
  - Purpose: Get specific session details

- **Save Session Feedback**
  - URL: `{WEBHOOK_B_URL}/api/sessions/{sessionId}/feedback`
  - Method: POST
  - Purpose: Save user feedback for session

#### 7.3.2 API Request/Response Formats

**Session Setup Request:**
```json
{
  "sessionId": "session-[timestamp]-[uuid]",
  "principlesDocId": "google-doc-id",
  "scenarioDocIds": ["scenario-doc-id-1", "scenario-doc-id-2"],
  "sessionTopic": "Topic Description",
  "testerId": "tester-id",
  "historyTurnsSetting": 10,
  "userQuery": null
}
```

**Chat Message Request:**
```json
{
  "sessionId": "session-[timestamp]-[uuid]",
  "userQuery": "User message text"
}
```

**Standard Response Format:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Operation-specific data
  },
  "statusCode": 200
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "userMessage": "Human-readable error message",
    "technicalMessage": "Detailed technical information"
  },
  "statusCode": 400
}
```

### 7.4 Context Caching Strategy

#### 7.4.1 Cache Creation

1. **Document Preparation:**
   - Principles and scenario documents are fetched from Google Docs
   - Documents are combined with clear separation markers:
   ```
   ######## SCENARIO DOCUMENT START ########
   [scenario content]
   ######## SCENARIO DOCUMENT END ########

   ######## UNIVERSAL PRINCIPLES START ########
   [principles content]
   ######## UNIVERSAL PRINCIPLES END ########
   ```

2. **Gemini Cache Creation:**
   - Combined document is sent to Gemini API's `cachedContents` endpoint
   - Proper snake_case parameter naming is used:
   ```json
   {
     "model": "models/gemini-2.5-pro-latest",
     "contents": [...],
     "system_instruction": {...},
     "ttl": "7200s",
     "display_name": "Session Topic Name"
   }
   ```

3. **Cache Management:**
   - Cache ID and expiry time are extracted from the response
   - These details are stored in the session record
   - Cache expiry is checked before each message exchange

#### 7.4.2 Using the Cache

1. **Message Exchange:**
   - User message is sent to n8n workflow
   - Workflow retrieves session data with cache ID
   - If cache is valid, Gemini API is called with the cache reference
   - If cache is expired, appropriate error response is returned

## 8. Error Handling Architecture

The Co-Director Platform implements a comprehensive error handling strategy across all system layers to ensure stability, debuggability, and a positive user experience.

### 8.1 Error Classification

Errors are classified into the following categories:

#### 8.1.1 Operational Errors

- **Definition**: Expected errors that occur during normal operation
- **Examples**: Network timeouts, API rate limits, invalid user input
- **Handling Strategy**: Graceful recovery with clear user feedback

#### 8.1.2 Programming Errors

- **Definition**: Bugs, logic errors, or unexpected states
- **Examples**: Null pointer exceptions, type errors, logic flaws
- **Handling Strategy**: Comprehensive logging, safe fallbacks, and developer notification

#### 8.1.3 External Service Errors

- **Definition**: Failures from integrated services
- **Examples**: Google Docs API unavailability, Gemini API errors
- **Handling Strategy**: Graceful degradation with informative messages

### 8.2 Frontend Error Handling

#### 8.2.1 Component-Level Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    // Log to error reporting service
    console.error("Error boundary caught error:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>The application encountered an unexpected error.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

#### 8.2.2 API Error Handling

```typescript
// apiClient.ts
const handleApiError = (error: any) => {
  // Network or request errors
  if (error.isAxiosError) {
    const status = error.response?.status;
    
    // Handle specific HTTP status codes
    if (status === 401) {
      // Unauthorized - redirect to login or refresh token
      return {
        success: false,
        error: {
          userMessage: "Your session has expired. Please refresh the page.",
          technicalMessage: `Authentication error: ${error.message}`
        }
      };
    }
    
    if (status === 429) {
      // Rate limited
      return {
        success: false,
        error: {
          userMessage: "The system is currently busy. Please try again in a moment.",
          technicalMessage: `Rate limited: ${error.message}`
        }
      };
    }
    
    // Generic network error
    return {
      success: false,
      error: {
        userMessage: "Unable to connect to the server. Please check your internet connection.",
        technicalMessage: `Network error: ${error.message}`
      }
    };
  }
  
  // Unexpected errors
  return {
    success: false,
    error: {
      userMessage: "An unexpected error occurred. The development team has been notified.",
      technicalMessage: error.message || "Unknown error"
    }
  };
};
```

### 8.3 Backend Error Handling

#### 8.3.1 n8n Workflow Error Handling

- **Try/Catch Nodes**: Each critical operation is wrapped in error handling logic
- **Error Workflow Branches**: Dedicated paths for handling specific error conditions
- **Default Error Responses**: Standardized error response formats for API failures

#### 8.3.2 Supabase Error Handling

- **Database Constraints**: Proper constraints to prevent data integrity issues
- **Error Codes**: Mapping database error codes to user-friendly messages
- **Transaction Management**: Using transactions for operations requiring atomicity

### 8.4 Centralized Error Logging

- **Frontend Logging**: Errors captured and sent to backend logging service
- **Backend Logging**: Structured logging of all errors with context
- **Error Analytics**: Aggregation and analysis of error patterns

### 8.5 User-Facing Error Messages

- **Principles**:
  - Clear, non-technical language
  - Actionable next steps when possible
  - Appropriate error context without exposing system details
  - Consistent presentation across the application

- **Presentation Methods**:
  - Toast notifications for non-blocking errors
  - Modal dialogs for blocking errors
  - Inline validation messages for form inputs
  - Error states in UI components

## 9. Security Architecture

### 9.1 Authentication and Authorization

#### 9.1.1 User Authentication

- **Basic Authentication**: Initial MVP uses simple authentication
- **Authentication Flow**:
  1. User enters credentials
  2. Credentials verified against Supabase auth system
  3. JWT token issued for authenticated session
  4. Token used for subsequent API requests

#### 9.1.2 Authorization Model

- **Role-Based Access Control**:
  - Tester: Can create sessions and chat
  - Knowledge Engineer: Full access including history review
  - Admin: System configuration and user management

- **Permission Enforcement**:
  - Frontend: UI element visibility based on user role
  - Backend: API endpoint access control via middleware
  - Database: Row-level security policies in Supabase

### 9.2 Data Security

#### 9.2.1 Data in Transit

- HTTPS/TLS encryption for all communications
- Secure WebSocket connections for real-time updates

#### 9.2.2 Data at Rest

- Encrypted database storage via Supabase
- No sensitive data stored in client-side storage

#### 9.2.3 PII Handling

- Minimal collection of personally identifiable information
- Clear data retention and purging policies
- Anonymization of session data for analysis where appropriate

### 9.3 API Security

#### 9.3.1 Input Validation

- Strict schema validation for all API requests
- Sanitization of user inputs to prevent injection attacks
- Rate limiting to prevent abuse

#### 9.3.2 API Authentication

- JWT-based authentication for API requests
- Short-lived tokens with refresh mechanism
- Secure token storage practices

#### 9.3.3 CORS Configuration

- Proper Cross-Origin Resource Sharing headers
- Restricted origin access based on environment

### 9.4 Secrets Management

- Environment variables for sensitive configuration
- No hardcoded secrets in source code
- Proper key rotation procedures
- Separate API keys for development and production

## 10. Testing Architecture

### 10.1 Testing Strategy

The Co-Director Platform implements a comprehensive testing strategy across all system layers:

#### 10.1.1 Frontend Testing

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing component interactions
- **E2E Tests**: Testing complete user flows

#### 10.1.2 Backend Testing

- **Unit Tests**: Testing individual workflow nodes
- **Integration Tests**: Testing complete workflows
- **API Tests**: Testing API endpoints and responses

#### 10.1.3 Database Testing

- **Schema Tests**: Validating database schema
- **Query Tests**: Testing database queries and performance
- **Migration Tests**: Testing database migrations

### 10.2 Test Implementation

#### 10.2.1 Frontend Test Stack

- **Framework**: Jest + React Testing Library
- **Component Tests**: Testing component rendering and behavior
- **Hook Tests**: Testing custom React hooks
- **Store Tests**: Testing Zustand store and slices

```jsx
// Example component test
describe('ChatMessageList', () => {
  it('renders messages correctly', () => {
    const messages = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'ai', content: 'Hi there' }
    ];
    
    const { getByText } = render(<ChatMessageList messages={messages} />);
    
    expect(getByText('Hello')).toBeInTheDocument();
    expect(getByText('Hi there')).toBeInTheDocument();
  });
});
```

#### 10.2.2 Backend Test Strategy

- **n8n Workflow Testing**: Testing individual nodes and workflows
- **API Contract Testing**: Validating API request/response formats
- **Integration Testing**: Testing complete backend flows

#### 10.2.3 E2E Testing

- **Framework**: Playwright
- **Test Scenarios**: Complete user journeys
- **Coverage**: Critical business flows

### 10.3 Automated Testing Pipeline

- **CI Integration**: Automated tests on pull requests
- **Test Environments**: Dedicated test environments for different test types
- **Test Reports**: Comprehensive test reporting and analytics

## 11. Deployment Architecture

### 11.1 Deployment Environments

The system utilizes three primary environments:

#### 11.1.1 Development Environment

- **Purpose**: Local development and testing
- **Components**:
  - Local React application (Vite dev server)
  - Local n8n instance
  - Supabase development project
- **Configuration**: Development-specific environment variables

#### 11.1.2 Test Environment

- **Purpose**: Integration testing and user acceptance testing
- **Components**:
  - Deployed React application on test URL
  - Deployed n8n workflows on test instance
  - Supabase test project
- **Configuration**: Test-specific environment variables and configurations

#### 11.1.3 Production Environment

- **Purpose**: Production usage by internal teams
- **Components**:
  - Deployed React application on production URL
  - Deployed n8n workflows on production instance
  - Supabase production project
- **Configuration**: Production-specific environment variables and configurations

### 11.2 Deployment Process

#### 11.2.1 Frontend Deployment

1. **Build Process**:
   - Code linting and testing
   - Building optimized production assets
   - Asset optimization and bundling

2. **Deployment Targets**:
   - Netlify (recommended for MVP)
   - Vercel (alternative)
   - AWS S3 + CloudFront (for scaling)

3. **Deployment Configuration**:
   - Environment variables for different environments
   - Build-time optimization settings
   - Cache control headers

#### 11.2.2 Backend Deployment

1. **n8n Deployment**:
   - n8n cloud instance setup
   - Workflow export/import between environments
   - Environment-specific variables and settings

2. **Supabase Deployment**:
   - Database schema migrations
   - Function deployments
   - Security policy updates

### 11.3 CI/CD Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Code Push       │────▶│ Automated Tests │────▶│ Build Process   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Production      │◀────│ Approval        │◀────│ Test Environment│
│ Deployment      │     │ Process         │     │ Deployment      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Continuous Integration**:
   - Automated testing on each pull request
   - Code quality checks and linting
   - Security scanning

2. **Continuous Deployment**:
   - Automatic deployment to test environment
   - Manual approval for production deployment
   - Rollback capabilities

### 11.4 Environment Configuration

#### 11.4.1 Frontend Configuration

```
# .env.production
VITE_APP_NAME=Co-Director
VITE_API_WEBHOOK_URL=https://api.example.com/webhook
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENABLE_DEV_FEATURES=false
```

#### 11.4.2 Backend Configuration

- n8n environment variables for API keys and service connections
- Supabase configuration for database access and security policies

## 12. Appendix

### 12.1 Glossary

- **Co-Director**: The AI system being tested and refined through this platform
- **RAG**: Retrieval-Augmented Generation, a technique combining retrieval and generation
- **Context Caching**: Storing document content in Gemini API for efficient processing
- **n8n**: Workflow automation tool used for backend processing
- **Supabase**: Database-as-a-Service platform used for data storage

### 12.2 References

- Product Requirements Document (PRDv3)
- API Documentation
- Database Schema Documentation
- n8n Workflow Documentation

### 12.3 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|--------|
| 1.0 | 2024-03-15 | Initial Team | First draft with frontend focus |
| 2.0 | 2024-04-20 | Development Team | Added backend details |
| 3.0 | 2025-05-22 | Architecture Team | Comprehensive update with full system architecture |

### 12.4 Future Considerations

#### 12.4.1 Scalability Enhancements

- Horizontal scaling of n8n workflows
- Caching layer for frequently accessed data
- Database sharding for high-volume scenarios

#### 12.4.2 Feature Roadmap

- Multi-user collaboration on testing sessions
- Advanced analytics dashboard for test results
- Integration with additional LLM providers
- Automated test generation and execution

#### 12.4.3 Technical Debt Considerations

- Regular dependency updates
- Code refactoring for maintainability
- Performance optimization for scaling
