# Product Requirements Document: Co-Director Platform
**Version:** 3.0
**Last Updated:** May 22, 2025, 10:30 AM EDT

## Table of Contents
1. Executive Summary
2. User Personas
3. User Workflows
4. Functional Requirements
   - 4.1 Frontend Requirements
     - 4.1.1 Session Setup Tab
     - 4.1.2 Chat Tab
     - 4.1.3 History Tab
     - 4.1.4 General Application Requirements
   - 4.2 Backend Requirements
     - 4.2.1 Session Management
     - 4.2.2 Chat Processing
     - 4.2.3 Data Storage
     - 4.2.4 Context Caching
   - 4.3 Data Management
   - 4.4 Authentication & Authorization
5. Non-Functional Requirements
   - 5.1 Performance
   - 5.2 Security
   - 5.3 Reliability and Error Handling
   - 5.4 Maintainability and Modularity
   - 5.5 Testability
   - 5.6 Technology Stack
   - 5.7 Scalability
   - 5.8 Data Retention and Management
6. System Architecture
   - 6.1 Component Overview
   - 6.2 Data Flow
   - 6.3 Integration Points
7. Data Model
   - 7.1 Core Entities
   - 7.2 Database Schema
   - 7.3 Entity Relationships
8. API Specifications
   - 8.1 Endpoints
   - 8.2 Request/Response Formats
   - 8.3 Error Handling
9. UI/UX Guidelines
10. Success Metrics
11. Implementation Strategy

## 1. Executive Summary

The Co-Director Platform is a comprehensive system designed to iteratively develop and fine-tune the core Co-Director AI's knowledge assets (Principles, Scenarios), their formatting and retrieval mechanisms, and the AI's interaction models to achieve the product vision of a "Sage-like Co-Director."

This platform includes both frontend and backend components working in tandem to facilitate:
1. Human-led testing and validation (approximately 20% of efforts)
2. LLM-mediated automated testing (approximately 80% of efforts)

The system allows users to configure and conduct interactive sessions with the AI, review past sessions, provide feedback, and export data for further analysis. The architecture emphasizes modularity, maintainability, and testability to support this iterative refinement process and the future evolution of the broader Co-Director product.

## 2. User Personas

The primary user persona for this platform is:

* **The Lead Developer / Knowledge Engineer (Primary User):**
  * **Goals:**
    * To efficiently set up and run test sessions using various combinations of "Principles" and "Scenario" documents
    * To interact with the AI to evaluate the effectiveness of knowledge assets and system prompts
    * To review chat histories and provide detailed feedback on AI performance
    * To oversee, interpret, and verify the results from automated testing processes
    * To debug and iterate on both knowledge assets and the platform itself
    * To export session data for external analysis by LLM-based evaluation tools
  * **Needs:** A reliable and functional interface that prioritizes ease of testing, data review, and data export
  * **Technical Proficiency:** High

## 3. User Workflows

### 3.1 Human-Led Full Testing Cycle
1. User navigates to the **Setup Tab**
2. User configures session parameters (Doc IDs, Session Topic, Tester ID, History Turns)
3. User initiates a "Start New Session"
4. User interacts with the AI via chat, performing qualitative assessment
5. User may submit in-session "feedback:" messages
6. User ends the session
7. User reviews the session details and chat history
8. User provides feedback (rating, tags, notes)
9. User exports session history for external review

### 3.2 Reviewing Past Session (Manual or Automated Run)
1. User navigates to the **History Tab**
2. User selects a session from the list
3. User reviews session details and chat history
4. User provides or updates feedback
5. User exports session history for analysis

### 3.3 Automated Testing Workflow
1. External testing script interacts with backend APIs
2. Script initializes sessions with various configurations
3. Script sends a series of predefined messages
4. Results are stored in the database
5. Human reviewers examine results via the History Tab
6. Data is exported for LLM-based analysis

## 4. Functional Requirements

### 4.1 Frontend Requirements

#### 4.1.1 Session Setup Tab
* Pre-populated fields for document IDs, session topic, tester ID, and history turns
* Validation of required fields
* Generation of unique session IDs
* Interface for starting a new session
* Developer features (system messages log, environment toggles)

#### 4.1.2 Chat Tab
* Display of conversation history with clear timestamps
* Text input for composing messages
* Visual indicators for current system status
* Support for in-session feedback submission
* Controls for ending a session

#### 4.1.3 History Tab
* List display of previous sessions
* Detailed view of selected session
* Controls for submitting/editing session feedback
* Data export functionality
* Auto-selection of just-ended sessions

#### 4.1.4 General Application Requirements
* Clear navigation between main sections
* Clean and uncluttered layout
* State persistence for developer settings
* Global error indication
* Keyboard navigation support

### 4.2 Backend Requirements

#### 4.2.1 Session Management
* Creation of new sessions with unique IDs
* Storage of session configuration parameters
* Fetching of document content from Google Docs
* Creation and management of Gemini API context caches
* Storage of session data in Supabase

#### 4.2.2 Chat Processing
* Processing of user messages within active sessions
* Retrieval and formatting of chat history
* Integration with Gemini API for response generation
* Handling of feedback messages
* Logging of all messages to the database
* Error handling for cache expiration, session not found, and API errors

#### 4.2.3 Data Storage
* Schema design for sessions, messages, and feedback
* Implementation of database tables in Supabase
* Data integrity and relationships between entities
* Query optimization for chat history retrieval

#### 4.2.4 Context Caching
* Creation of context caches using Gemini API
* Tracking of cache expiration times
* Error handling for expired caches
* Efficient formatting of document content for caching with clear separation markers
* Proper use of snake_case parameter names for Gemini API:
  ```json
  {
    "model": "models/gemini-2.5-pro-latest",
    "contents": [...],
    "system_instruction": {...},
    "ttl": "7200s",
    "display_name": "Session Topic Name"
  }
  ```
* Handling of cache expiration with appropriate error responses

### 4.3 Data Management
* Storage of session configurations, chat messages, and feedback
* Export of session data in machine-readable formats
* Retention policies for session data
* Manual deletion capabilities for test data management

### 4.4 Authentication & Authorization
* Basic authentication for accessing the platform
* Role-based access control for different user types
* Secure API access for automated testing scripts
* Secure storage of API credentials

## 5. Non-Functional Requirements

### 5.1 Performance
* Responsive UI without noticeable lag
* Efficient data loading with visual feedback
* Reasonable API response times
* Optimized database queries

### 5.2 Security
* Secure transmission of data
* Protection of API keys
* Appropriate authentication mechanisms
* Data privacy considerations

### 5.3 Reliability and Error Handling
* Graceful error handling throughout the application
* Clear error messages for different scenarios
* Input validation on both client and server sides
* Session state integrity maintenance

### 5.4 Maintainability and Modularity
* Component-oriented architecture
* Clear separation of concerns
* Well-organized and documented code
* Configurable developer features

### 5.5 Testability
* Support for unit, integration, and end-to-end testing
* Accessible APIs for automated testing
* Exportable data for evaluation
* Support for iterative refinement cycles

### 5.6 Technology Stack
* **Frontend**: 
  * React with Vite for build system
  * Material UI (MUI) for component library
  * Zustand for state management
  * TypeScript for type safety
* **Backend**: 
  * n8n workflows for orchestration
  * Supabase for database and authentication
  * Google Docs API for document retrieval
  * Gemini API for AI responses and context caching
* **Database**: 
  * PostgreSQL (via Supabase)
  * Vector extensions for RAG functionality
* **APIs**: 
  * REST APIs for internal and external communication
  * Webhook-based integration between frontend and n8n

### 5.7 Scalability
* Architecture that supports future feature expansion
* Efficient data handling for increasing volumes
* Adaptability to evolving requirements

### 5.8 Data Retention and Management
* Definition of data retention policies
* Support for manual data purging
* Mechanisms for data archiving

## 6. System Architecture

### 6.1 Component Overview
* **Frontend Application:** React-based SPA with tabbed interface
* **Backend Services:**
  * n8n Workflow Engine: Orchestrates API calls and data processing
  * Supabase: Provides database and authentication services
  * Google Docs Integration: Fetches document content
  * Gemini API Integration: Generates AI responses with context caching

### 6.2 Data Flow

#### 1. Session Setup Flow
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

* Frontend sends session parameters to n8n webhook
* n8n fetches document content from Google Docs
* Documents are combined with clear separation markers:
  ```
  ######## SCENARIO DOCUMENT START ########
  [scenario content]
  ######## SCENARIO DOCUMENT END ########

  ######## UNIVERSAL PRINCIPLES START ########
  [principles content]
  ######## UNIVERSAL PRINCIPLES END ########
  ```
* n8n creates Gemini context cache
* Session data is stored in Supabase
* Success/error response is sent back to frontend

#### 2. Chat Interaction Flow
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

* Frontend sends user message to n8n webhook
* n8n retrieves session data from Supabase
* n8n checks cache validity
* n8n retrieves chat history from Supabase using SQL query:
  ```sql
  SELECT * FROM "codirectorChats"
  WHERE "sessionId" = '{{ $json.sessionId }}'
  ORDER BY timestamp DESC
  LIMIT {{ $json.historyTurnsSetting * 2 }}
  ```
* n8n calls Gemini API with history and cache reference
* User message and AI response are logged in Supabase
* Response is sent back to frontend

#### 3. History Review Flow
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

* Frontend requests session list from Supabase
* Frontend requests specific session details from Supabase
* Frontend sends feedback updates to Supabase via n8n
* Frontend exports session data as needed

### 6.3 Integration Points
* **Google Docs API:** For fetching Principles and Scenarios content
* **Gemini API:** For AI response generation and context caching
* **Supabase API:** For data storage and retrieval
* **n8n Webhooks:** Entry points for frontend-to-backend communication

## 7. Data Model

### 7.1 Core Entities
* **Session:** Represents a testing session with configuration parameters
* **Message:** Represents an individual message in a conversation
* **Feedback:** Contains evaluative information about a session

### 7.2 Database Schema

> **Important Note on Naming Convention**: The database uses camelCase for all identifiers, which requires double quotes in PostgreSQL to preserve case. However, the Gemini API requires snake_case for all parameter names. This contrast requires careful handling in the n8n workflow.

#### Sessions Table
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

-- Add index for faster queries by startTime (descending for newest first)
CREATE INDEX "sessions_startTime_idx" ON public."sessions"("startTime" DESC);

-- Create a trigger to automatically update the updatedAt column
CREATE TRIGGER "setUpdatedAt"
BEFORE UPDATE ON public."sessions"
FOR EACH ROW
EXECUTE FUNCTION public."handleUpdatedAt"();
```

#### Messages Table
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

-- Add index for faster queries by sessionId
CREATE INDEX "codirectorChats_sessionId_idx" ON public."codirectorChats"("sessionId");

-- Add index for timestamp-based queries
CREATE INDEX "codirectorChats_timestamp_idx" ON public."codirectorChats"("timestamp");
```

#### Handbook Embeddings Table
```sql
CREATE TABLE public."handbookEmbeddings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "embedding" VECTOR(1536) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create vector index for similarity search
CREATE INDEX "handbookEmbeddings_embedding_idx" ON public."handbookEmbeddings" USING ivfflat ("embedding" vector_cosine_ops);
```

#### SQL Query Considerations

When querying tables with camelCase column names, remember these important rules:

1. **Column Name Case Sensitivity**: Always use double quotes around column names to preserve case
   ```sql
   SELECT * FROM "codirectorChats" WHERE "sessionId" = 'value'
   ```

2. **String Values**: String values must be enclosed in single quotes
   ```sql
   WHERE "sessionId" = 'test-session-123'  -- Correct
   WHERE "sessionId" = test-session-123    -- Incorrect (treated as column name)
   ```

3. **Dynamic Values in n8n**: When using expressions in n8n Postgres node:
   ```sql
   WHERE "sessionId" = '{{ $json.sessionId }}'  -- Note the single quotes around the expression
   ```

### 7.3 Entity Relationships
* One **Session** can have many **Messages**
* One **Session** can have one **Feedback** record
* **Messages** and **Feedback** belong to exactly one **Session**

## 8. API Specifications

### 8.1 Endpoints

#### Webhook A Endpoints

* **Start Session**
  * **URL**: `{WEBHOOK_A_URL}`
  * **Method**: POST
  * **Purpose**: Initializes a new testing session
  * **Process**: Fetches scenario and principles documents, combines them with clear separation markers, creates Gemini context cache, and stores session data in Supabase

* **Send Message**
  * **URL**: `{WEBHOOK_A_URL}`
  * **Method**: POST
  * **Purpose**: Sends a user message to the AI and receives a response
  * **Process**: Retrieves session data, checks cache expiry, retrieves chat history, performs RAG against handbook embeddings, calls Gemini API with context, and logs the interaction

* **End Session**
  * **URL**: `{WEBHOOK_A_URL}/end-session`
  * **Method**: POST
  * **Purpose**: Terminates an active session

#### Webhook B Endpoints

* **Get Session History**
  * **URL**: `{WEBHOOK_B_URL}/api/sessions`
  * **Method**: GET
  * **Purpose**: Retrieves a list of past sessions

* **Get Session Details**
  * **URL**: `{WEBHOOK_B_URL}/api/sessions/{sessionId}/details`
  * **Method**: GET
  * **Purpose**: Retrieves detailed information about a specific session

* **Save Session Feedback**
  * **URL**: `{WEBHOOK_B_URL}/api/sessions/{sessionId}/feedback`
  * **Method**: POST
  * **Purpose**: Saves user feedback for a session

### 8.2 Request/Response Formats

#### Session Setup Request
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

#### Chat Message Request
```json
{
  "sessionId": "session-[timestamp]-[uuid]",
  "userQuery": "User message text"
}
```

#### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Operation-specific data
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### 8.3 Error Handling

#### Standard Response Format
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

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "userMessage": "Human-readable error message",
    "technicalMessage": "Detailed technical information (optional)"
  },
  "statusCode": 400
}
```

#### Special Error Cases

**Cache Expired Error**
```json
{
  "success": false,
  "error": "CACHE_EXPIRED",
  "message": "Cache has expired. Please start a new session.",
  "data": {
    "sessionId": "string",
    "expiryTime": "ISO-string"
  }
}
```

* Standardized error codes and messages
* Appropriate HTTP status codes
* Detailed error information for debugging
* Webhook response display component in the Setup tab for debugging API interactions

## 9. UI/UX Guidelines

### 9.1 Visual Design Principles
* Clean, modern interface with focus on functionality
* Clear visual hierarchy and content organization
* Consistent use of color, typography, and spacing

### 9.2 Layout and Navigation
* Tabbed interface for main sections
* Logical grouping of related controls
* Clear visual indication of active section

### 9.3 Component Styling
* Form controls with clear labels and validation
* Card-based layouts for content organization
* Consistent button styling and placement

### 9.4 Developer-Specific UI
* Clearly delineated developer tools
* Easy removal/hiding of developer features

## 10. Success Metrics

### 10.1 Functional Completeness
* Implementation of all required features
* Successful end-to-end workflow completion
* Data integrity and accuracy

### 10.2 Usability for Tester/Developer
* Efficiency in core tasks
* Clarity of information presentation
* Effectiveness of developer tools

### 10.3 Effectiveness as Testing Tool
* Support for knowledge asset evaluation
* Reliable feedback capture
* Support for the 80/20 testing strategy

### 10.4 Stability and Reliability
* Minimal critical bugs
* Robust API interaction
* Graceful error handling

## 11. Implementation Strategy

### 11.1 Project Structure
```
CoDirectorPlatform/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   └── ...
│   └── ...
├── backend/              # Backend configuration
│   ├── n8n/              # n8n workflow definitions
│   ├── supabase/         # Database migrations and config
│   └── ...
├── docs/                 # Documentation
└── ...
```

### 11.2 Development Approach
* Component-based iterative development
* Continuous integration with automated testing
* Regular review cycles with knowledge engineers

### 11.3 Deployment Strategy
* Frontend hosted on Netlify/Vercel
* Supabase for database and authentication
* n8n for workflow orchestration
