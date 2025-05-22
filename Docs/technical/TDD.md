# Co-Director Platform: Technical Design Document

**Version:** 1.0  
**Last Updated:** May 22, 2025, 10:53 AM EDT

## Table of Contents

1. [Introduction](#1-introduction)
2. [Data Models and Type Definitions](#2-data-models-and-type-definitions)
3. [Component Architecture](#3-component-architecture)
4. [State Management](#4-state-management)
5. [API Integration](#5-api-integration)
6. [Technical Guidelines](#6-technical-guidelines)

## 1. Introduction

### 1.1 Purpose

This Technical Design Document (TDD) serves as a detailed technical specification for the Co-Director Platform. It complements the existing documentation suite by providing specific implementation details, type definitions, component interfaces, and code patterns that should be followed during development.

### 1.2 Document Relationships

This TDD works in conjunction with:

- **Product Requirements Document (PRDv3)**: Defines what the system should do
- **Architectural Design Document (ADDv3)**: Provides the high-level architecture
- **Implementation Plan**: Outlines the sequential development tasks

The TDD fills the gap between these documents by specifying exactly *how* the technical implementation should be structured.

### 1.3 How to Use This Document

When implementing the Co-Director Platform using the Implementation Plan:

1. Begin with the Implementation Plan to understand the task sequence
2. Reference this TDD for specific technical details about:
   - Type definitions and interfaces
   - Component props and behaviors
   - State management patterns
   - API integration specifics

This document should be treated as the source of truth for technical implementation details, while the Implementation Plan guides the development sequence.

## 2. Data Models and Type Definitions

### 2.1 Core Domain Interfaces

```typescript
/**
 * Represents a testing session with the Co-Director AI
 */
export interface Session {
  /** Unique identifier for the session (format: "session-[timestamp]-[uuid]") */
  sessionId: string;
  /** ID of the Google Doc containing principles */
  principlesDocId: string;
  /** Array of Google Doc IDs containing scenarios */
  scenarioDocIds: string[];
  /** Brief description of the session topic */
  sessionTopic: string;
  /** ID of the tester conducting the session */
  testerId: string;
  /** Number of history turns to include in context */
  historyTurnsSetting: number;
  /** Timestamp when the session was started */
  startTime: string;
  /** Timestamp when the session was ended (undefined if active) */
  endTime?: string;
  /** Whether the session is currently active */
  isActive: boolean;
  /** Total number of turns (message pairs) in the session */
  totalTurns: number;
  /** ID of the cached context in Gemini API */
  geminiCacheId?: string;
  /** Timestamp when the cache was created */
  cacheCreationTime?: string;
  /** Timestamp when the cache expires */
  cacheExpiryTime?: string;
  /** Average response time in milliseconds */
  avgResponseLatency?: number;
  /** Number of errors encountered during the session */
  errorCount?: number;
}

/**
 * Represents a message within a session
 */
export interface Message {
  /** Unique identifier for the message */
  messageId: string;
  /** Reference to the parent session */
  sessionId: string;
  /** Timestamp when the message was created/received */
  timestamp: string;
  /** Type of message */
  type: MessageType;
  /** Content of the message */
  content: string;
  /** Sender of the message (user or AI) */
  sender: MessageSender;
}

/**
 * Types of messages in the system
 */
export enum MessageType {
  UserMessage = 'user_message',
  AIResponse = 'ai_response',
  SystemMessage = 'system_message',
  FeedbackMessage = 'feedback_message',
  ErrorMessage = 'error_message'
}

/**
 * Possible message senders
 */
export enum MessageSender {
  User = 'user',
  AI = 'ai',
  System = 'system'
}

/**
 * Feedback provided for a session
 */
export interface SessionFeedback {
  /** Reference to the session */
  sessionId: string;
  /** Numeric rating (1-5) */
  rating: number;
  /** Array of predefined tags */
  tags: string[];
  /** Free-form notes/comments */
  notes: string;
  /** Timestamp when feedback was submitted */
  submittedAt: string;
}
```

### 2.2 State Slice Interfaces

```typescript
/**
 * Session lifecycle state for tracking active sessions
 */
export interface SessionLifecycleState {
  /** ID of the currently active session (null if no active session) */
  activeSessionId: string | null;
  /** Whether a session is currently active */
  isSessionActive: boolean;
  /** Whether a session is currently being loaded/created */
  isLoadingSession: boolean;
  /** Any error related to session lifecycle */
  sessionError: string | null;
  /** ID of a just-ended session (used for auto-selection in history) */
  justEndedSessionId: string | null;
}

/**
 * Setup form state for session configuration
 */
export interface SetupState {
  /** Form field values */
  formData: {
    principlesDocId: string;
    scenarioDocIds: string[];
    sessionTopic: string;
    testerId: string;
    historyTurnsSetting: number;
  };
  /** Whether the form is being submitted */
  isSubmitting: boolean;
  /** Any error related to form submission */
  formError: string | null;
  /** Validation errors for specific form fields */
  validationErrors: {
    principlesDocId?: string;
    scenarioDocIds?: string;
    sessionTopic?: string;
    testerId?: string;
    historyTurnsSetting?: string;
  };
}

/**
 * Chat state for managing messages
 */
export interface ChatState {
  /** All messages in the current session */
  messages: Message[];
  /** Whether the AI is currently responding */
  isAiResponding: boolean;
  /** The current user message being composed */
  currentUserMessage: string;
  /** Any error related to message sending */
  messageError: string | null;
}

/**
 * History state for viewing past sessions
 */
export interface HistoryState {
  /** List of all available sessions */
  sessions: Session[];
  /** Currently selected session ID */
  selectedSessionId: string | null;
  /** Full details of the selected session */
  selectedSessionDetails: SessionDetails | null;
  /** Whether sessions are being loaded */
  isLoadingSessions: boolean;
  /** Whether session details are being loaded */
  isLoadingSessionDetails: boolean;
  /** Any error related to history loading */
  historyError: string | null;
}

/**
 * Feedback state for session evaluation
 */
export interface FeedbackState {
  /** Current feedback draft */
  feedback: {
    rating: number;
    tags: string[];
    notes: string;
  };
  /** Whether feedback is being submitted */
  isSubmittingFeedback: boolean;
  /** Any error related to feedback submission */
  feedbackError: string | null;
}

/**
 * Developer settings state
 */
export interface DevSettingsState {
  /** Which webhook environment to use */
  webhookEnvironment: 'test' | 'production';
  /** Whether mock mode is enabled */
  mockModeEnabled: boolean;
}

/**
 * System log state for developer messages
 */
export interface SystemLogState {
  /** List of system log messages */
  logs: SystemLogMessage[];
  /** Whether logs are expanded/visible */
  areLogsVisible: boolean;
}

/**
 * System log message
 */
export interface SystemLogMessage {
  /** Unique ID for the log message */
  id: string;
  /** Timestamp when the log was created */
  timestamp: string;
  /** Severity level of the log */
  level: 'info' | 'warning' | 'error';
  /** Content of the log message */
  message: string;
  /** Additional contextual data */
  context?: Record<string, any>;
}
```

### 2.3 API Request/Response Types

```typescript
/**
 * Request to start a new session
 */
export interface StartSessionRequest {
  sessionId: string;
  principlesDocId: string;
  scenarioDocIds: string[];
  sessionTopic: string;
  testerId: string;
  historyTurnsSetting: number;
  userQuery: null; // Initially null for session creation
}

/**
 * Response from starting a new session
 */
export interface StartSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    sessionId: string;
    cacheId?: string;
    expiryTime?: string;
  };
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}

/**
 * Request to send a message
 */
export interface SendMessageRequest {
  sessionId: string;
  userQuery: string;
}

/**
 * Response from sending a message
 */
export interface SendMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    aiResponse: string;
    responseTime?: number;
  };
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}

/**
 * Request to end a session
 */
export interface EndSessionRequest {
  sessionId: string;
}

/**
 * Response from ending a session
 */
export interface EndSessionResponse {
  success: boolean;
  message?: string;
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}

/**
 * Request to submit session feedback
 */
export interface SubmitFeedbackRequest {
  sessionId: string;
  rating: number;
  tags: string[];
  notes: string;
}

/**
 * Response from submitting feedback
 */
export interface SubmitFeedbackResponse {
  success: boolean;
  message?: string;
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}

/**
 * Response for session list
 */
export interface GetSessionsResponse {
  success: boolean;
  data?: {
    sessions: Session[];
  };
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}

/**
 * Details of a specific session
 */
export interface SessionDetails {
  session: Session;
  messages: Message[];
  feedback?: SessionFeedback;
}

/**
 * Response for session details
 */
export interface GetSessionDetailsResponse {
  success: boolean;
  data?: SessionDetails;
  error?: {
    userMessage: string;
    technicalMessage: string;
  };
  statusCode: number;
}
```

### 2.4 Utility Types

```typescript
/**
 * Type for API error information
 */
export interface ApiError {
  userMessage: string;
  technicalMessage: string;
  statusCode?: number;
}

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  statusCode: number;
}

/**
 * Async operation status
 */
export interface AsyncOperationStatus {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

## 3. Component Architecture

> Note: This section provides detailed specifications for all components in the application. Component interfaces define the props each component accepts, while the behavior descriptions explain component responsibilities and interactions.

### 3.1 Application Layout

```typescript
/**
 * Props for the AppLayout component
 */
export interface AppLayoutProps {
  /** Whether a session is currently active */
  isSessionActive: boolean;
  /** Currently active tab */
  activeTab: TabName;
  /** Function to change the active tab */
  setActiveTab: (tab: TabName) => void;
  /** Whether tabs other than the active one should be disabled */
  disableInactiveTabs: boolean;
}

/**
 * Available application tabs
 */
export enum TabName {
  Setup = 'setup',
  Chat = 'chat',
  History = 'history'
}
```

**Component Behavior:**

- `AppLayout` renders a Material UI `<Tabs>` component with three tabs: Setup, Chat, and History
- When a session becomes active, it automatically switches to the Chat tab
- When a session ends, it automatically switches to the History tab if `justEndedSessionId` is set
- Tabs should be conditionally disabled based on session state:
  - Setup tab is disabled when a session is active
  - Chat tab is disabled when no session is active
  - History tab is never disabled

### 3.2 Setup Tab Components

#### 3.2.1 SetupView

```typescript
/**
 * Props for the SetupView component
 */
export interface SetupViewProps {}

/**
 * Behavior and Composition:
 * - Container for all setup-related components
 * - Manages layout of SessionControls and developer tools
 * - Conditionally renders SystemMessagesDisplay based on dev feature flag
 * - Handles rendering of error messages from setupSlice and sessionLifecycleSlice
 */
```

#### 3.2.2 SessionControls

```typescript
/**
 * Props for the SessionControls component
 */
export interface SessionControlsProps {}

/**
 * Behavior and Composition:
 * - Form for session configuration
 * - Renders Material UI form components for each input field
 * - Handles field validation and form submission
 * - Shows loading state during session creation
 * - Connects to setupSlice and sessionLifecycleSlice
 */
```

#### 3.2.3 N8nWebhookUrlToggle

```typescript
/**
 * Props for the N8nWebhookUrlToggle component
 */
export interface N8nWebhookUrlToggleProps {}

/**
 * Behavior and Composition:
 * - Toggle switch for webhook environment selection
 * - Only visible when ENABLE_DEV_FEATURES is true
 * - Updates devSettingsSlice.webhookEnvironment
 * - Persists selection to localStorage
 */
```

#### 3.2.4 MockModeToggle

```typescript
/**
 * Props for the MockModeToggle component
 */
export interface MockModeToggleProps {}

/**
 * Behavior and Composition:
 * - Toggle switch for enabling/disabling mock mode
 * - Only visible when ENABLE_DEV_FEATURES is true
 * - Updates devSettingsSlice.mockModeEnabled
 * - Persists selection to localStorage
 */
```

#### 3.2.5 SystemMessagesDisplay

```typescript
/**
 * Props for the SystemMessagesDisplay component
 */
export interface SystemMessagesDisplayProps {}

/**
 * Behavior and Composition:
 * - Collapsible panel for showing system messages
 * - Only visible when ENABLE_DEV_FEATURES is true
 * - Displays messages from systemLogSlice
 * - Allows clearing logs and controlling visibility
 */
```

### 3.3 Chat Tab Components

#### 3.3.1 ChatView

```typescript
/**
 * Props for the ChatView component
 */
export interface ChatViewProps {}

/**
 * Behavior and Composition:
 * - Container for all chat-related components
 * - Manages layout of ChatMessageList, MessageInput, and EndSessionButton
 * - Handles errors from chatSlice
 * - Connects to sessionLifecycleSlice and chatSlice
 */
```

#### 3.3.2 ChatMessageList

```typescript
/**
 * Props for the ChatMessageList component
 */
export interface ChatMessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** Whether AI is currently generating a response */
  isAiResponding: boolean;
}

/**
 * Behavior and Composition:
 * - Scrollable container for chat messages
 * - Renders different message types with appropriate styling
 * - Shows typing indicator when isAiResponding is true
 * - Auto-scrolls to bottom when new messages arrive
 * - Displays turn indicators every historyTurnsSetting messages
 */
```

#### 3.3.3 MessageInput

```typescript
/**
 * Props for the MessageInput component
 */
export interface MessageInputProps {
  /** Current message being composed */
  message: string;
  /** Function to update the message */
  setMessage: (message: string) => void;
  /** Function to send the message */
  onSendMessage: () => void;
  /** Whether message sending is disabled */
  disabled: boolean;
  /** Whether a message is currently being sent */
  isSending: boolean;
}

/**
 * Behavior and Composition:
 * - Text input field with send button
 * - Handles Enter key for sending messages
 * - Shows loading state during message sending
 * - Disables input when appropriate
 */
```

#### 3.3.4 EndSessionButton

```typescript
/**
 * Props for the EndSessionButton component
 */
export interface EndSessionButtonProps {
  /** Function to end the session */
  onEndSession: () => void;
  /** Whether the button is disabled */
  disabled: boolean;
}

/**
 * Behavior and Composition:
 * - Button to end the current session
 * - Shows confirmation dialog before ending
 * - Displays loading state during session ending
 */
```

### 3.4 History Tab Components

#### 3.4.1 HistoryView

```typescript
/**
 * Props for the HistoryView component
 */
export interface HistoryViewProps {}

/**
 * Behavior and Composition:
 * - Container for all history-related components
 * - Manages layout of SessionList and SessionDetailView
 * - Handles loading states and errors from historySlice
 */
```

#### 3.4.2 SessionList

```typescript
/**
 * Props for the SessionList component
 */
export interface SessionListProps {
  /** Array of sessions to display */
  sessions: Session[];
  /** ID of the currently selected session */
  selectedSessionId: string | null;
  /** Function to select a session */
  onSelectSession: (sessionId: string) => void;
  /** Whether sessions are being loaded */
  isLoading: boolean;
}

/**
 * Behavior and Composition:
 * - Data table/list of past sessions
 * - Allows sorting and filtering of sessions
 * - Highlights the selected session
 * - Shows loading state while fetching sessions
 */
```

#### 3.4.3 SessionDetailView

```typescript
/**
 * Props for the SessionDetailView component
 */
export interface SessionDetailViewProps {
  /** Details of the selected session */
  sessionDetails: SessionDetails | null;
  /** Whether session details are being loaded */
  isLoading: boolean;
}

/**
 * Behavior and Composition:
 * - Displays details about the selected session
 * - Shows metadata, chat history, and feedback form
 * - Provides option to export session data
 * - Shows loading state while fetching details
 */
```

#### 3.4.4 FeedbackForm

```typescript
/**
 * Props for the FeedbackForm component
 */
export interface FeedbackFormProps {
  /** Session ID to provide feedback for */
  sessionId: string;
  /** Existing feedback (if any) */
  existingFeedback?: SessionFeedback;
}

/**
 * Behavior and Composition:
 * - Form for submitting session feedback
 * - Includes rating, tags, and notes fields
 * - Shows loading state during submission
 * - Validates input before submission
 * - Connects to feedbackSlice
 */
```

### 3.5 Common Components

#### 3.5.1 ErrorDisplay

```typescript
/**
 * Props for the ErrorDisplay component
 */
export interface ErrorDisplayProps {
  /** Error message to display */
  error: string | null;
  /** Severity of the error */
  severity?: 'error' | 'warning' | 'info';
  /** Function to clear the error */
  onClear?: () => void;
}

/**
 * Behavior and Composition:
 * - Renders a Material UI Alert component
 * - Shows a close button if onClear is provided
 * - Only renders when error is not null
 */
```

#### 3.5.2 LoadingIndicator

```typescript
/**
 * Props for the LoadingIndicator component
 */
export interface LoadingIndicatorProps {
  /** Whether loading is in progress */
  isLoading: boolean;
  /** Text to display alongside the spinner */
  loadingText?: string;
  /** Size of the loading indicator */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Behavior and Composition:
 * - Renders a Material UI CircularProgress
 * - Optionally displays loading text
 * - Only renders when isLoading is true
 */
```

#### 3.5.3 ConfirmationDialog

```typescript
/**
 * Props for the ConfirmationDialog component
 */
export interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Title of the dialog */
  title: string;
  /** Content/message of the dialog */
  content: string;
  /** Text for the confirm button */
  confirmText: string;
  /** Text for the cancel button */
  cancelText: string;
  /** Function to call when confirmed */
  onConfirm: () => void;
  /** Function to call when canceled */
  onCancel: () => void;
}

/**
 * Behavior and Composition:
 * - Renders a Material UI Dialog component
 * - Has confirm and cancel buttons
 * - Can be customized with different text
 */
```

## 4. State Management

> Note: This section specifies the Zustand store structure, state slices, and state management patterns that should be implemented in the application.

### 4.1 Store Configuration

```typescript
/**
 * Root store type combining all state slices
 */
export type RootState = 
  & SessionLifecycleState
  & SetupState
  & ChatState
  & HistoryState
  & FeedbackState
  & DevSettingsState
  & SystemLogState;

/**
 * Initialize the Zustand store with all slices
 */
export const useStore = create<RootState>(
  persist(
    (...a) => ({
      ...createSessionLifecycleSlice(...a),
      ...createSetupSlice(...a),
      ...createChatSlice(...a),
      ...createHistorySlice(...a),
      ...createFeedbackSlice(...a),
      ...createDevSettingsSlice(...a),
      ...createSystemLogSlice(...a),
    }),
    {
      name: 'co-director-store',
      partialize: (state) => ({
        // Only persist select portions of the store
        devSettings: state.devSettings,
        activeTab: state.activeTab
      }),
    }
  )
);
```

### 4.2 State Slice Implementations

#### 4.2.1 Session Lifecycle Slice

```typescript
/**
 * Session lifecycle slice creator function
 */
export const createSessionLifecycleSlice: StateCreator<
  SessionLifecycleState,
  [],
  [],
  SessionLifecycleState
> = (set) => ({
  // Initial state
  activeSessionId: null,
  isSessionActive: false,
  isLoadingSession: false,
  sessionError: null,
  justEndedSessionId: null,
  
  // Actions
  startSessionPending: () => set({
    isLoadingSession: true,
    sessionError: null
  }),
  
  startSessionSuccess: (sessionId: string) => set({
    activeSessionId: sessionId,
    isSessionActive: true,
    isLoadingSession: false,
    sessionError: null
  }),
  
  startSessionFailure: (errorMessage: string) => set({
    isLoadingSession: false,
    sessionError: errorMessage
  }),
  
  endSessionPending: () => set({
    isLoadingSession: true,
    sessionError: null
  }),
  
  endSessionSuccess: (sessionId: string) => set({
    activeSessionId: null,
    isSessionActive: false,
    isLoadingSession: false,
    justEndedSessionId: sessionId
  }),
  
  endSessionFailure: (errorMessage: string) => set({
    isLoadingSession: false,
    sessionError: errorMessage
  }),
  
  clearJustEndedSessionId: () => set({
    justEndedSessionId: null
  }),
  
  clearSessionError: () => set({
    sessionError: null
  })
});
```

#### 4.2.2 Setup Slice

```typescript
/**
 * Setup form slice creator function
 */
export const createSetupSlice: StateCreator<
  SetupState,
  [],
  [],
  SetupState
> = (set, get) => ({
  // Initial state
  formData: {
    principlesDocId: '',
    scenarioDocIds: [''],
    sessionTopic: '',
    testerId: '',
    historyTurnsSetting: 10,
  },
  isSubmitting: false,
  formError: null,
  validationErrors: {},
  
  // Actions
  updateFormField: (field, value) => set(state => ({
    formData: {
      ...state.formData,
      [field]: value
    }
  })),
  
  addScenarioField: () => set(state => ({
    formData: {
      ...state.formData,
      scenarioDocIds: [...state.formData.scenarioDocIds, '']
    }
  })),
  
  removeScenarioField: (index) => set(state => ({
    formData: {
      ...state.formData,
      scenarioDocIds: state.formData.scenarioDocIds.filter((_, i) => i !== index)
    }
  })),
  
  updateScenarioField: (index, value) => set(state => ({
    formData: {
      ...state.formData,
      scenarioDocIds: state.formData.scenarioDocIds.map((doc, i) => 
        i === index ? value : doc
      )
    }
  })),
  
  setFormError: (error) => set({
    formError: error
  }),
  
  clearFormError: () => set({
    formError: null
  }),
  
  setValidationErrors: (errors) => set({
    validationErrors: errors
  }),
  
  clearValidationErrors: () => set({
    validationErrors: {}
  }),
  
  resetForm: () => set({
    formData: {
      principlesDocId: '',
      scenarioDocIds: [''],
      sessionTopic: '',
      testerId: '',
      historyTurnsSetting: 10,
    },
    formError: null,
    validationErrors: {}
  })
});
```

#### 4.2.3 Chat Slice

```typescript
/**
 * Chat slice creator function
 */
export const createChatSlice: StateCreator<
  ChatState,
  [],
  [],
  ChatState
> = (set) => ({
  // Initial state
  messages: [],
  isAiResponding: false,
  currentUserMessage: '',
  messageError: null,
  
  // Actions
  setCurrentUserMessage: (message: string) => set({
    currentUserMessage: message
  }),
  
  sendMessagePending: () => set(state => ({
    isAiResponding: true,
    messageError: null,
    currentUserMessage: ''
  })),
  
  addUserMessage: (message: Message) => set(state => ({
    messages: [...state.messages, message]
  })),
  
  addAiMessage: (message: Message) => set(state => ({
    messages: [...state.messages, message],
    isAiResponding: false
  })),
  
  sendMessageFailure: (errorMessage: string) => set({
    isAiResponding: false,
    messageError: errorMessage
  }),
  
  addSystemMessage: (message: Message) => set(state => ({
    messages: [...state.messages, message]
  })),
  
  clearMessages: () => set({
    messages: [],
    isAiResponding: false,
    currentUserMessage: '',
    messageError: null
  }),
  
  clearMessageError: () => set({
    messageError: null
  })
});
```

#### 4.2.4 History Slice

```typescript
/**
 * History slice creator function
 */
export const createHistorySlice: StateCreator<
  HistoryState,
  [],
  [],
  HistoryState
> = (set) => ({
  // Initial state
  sessions: [],
  selectedSessionId: null,
  selectedSessionDetails: null,
  isLoadingSessions: false,
  isLoadingSessionDetails: false,
  historyError: null,
  
  // Actions
  fetchSessionsPending: () => set({
    isLoadingSessions: true,
    historyError: null
  }),
  
  fetchSessionsSuccess: (sessions: Session[]) => set({
    sessions,
    isLoadingSessions: false
  }),
  
  fetchSessionsFailure: (errorMessage: string) => set({
    isLoadingSessions: false,
    historyError: errorMessage
  }),
  
  selectSession: (sessionId: string) => set({
    selectedSessionId: sessionId,
    selectedSessionDetails: null
  }),
  
  fetchSessionDetailsPending: () => set({
    isLoadingSessionDetails: true,
    historyError: null
  }),
  
  fetchSessionDetailsSuccess: (details: SessionDetails) => set({
    selectedSessionDetails: details,
    isLoadingSessionDetails: false
  }),
  
  fetchSessionDetailsFailure: (errorMessage: string) => set({
    isLoadingSessionDetails: false,
    historyError: errorMessage
  }),
  
  clearHistoryError: () => set({
    historyError: null
  })
});
```

#### 4.2.5 Feedback Slice

```typescript
/**
 * Feedback slice creator function
 */
export const createFeedbackSlice: StateCreator<
  FeedbackState,
  [],
  [],
  FeedbackState
> = (set) => ({
  // Initial state
  feedback: {
    rating: 0,
    tags: [],
    notes: ''
  },
  isSubmittingFeedback: false,
  feedbackError: null,
  
  // Actions
  updateFeedback: (field, value) => set(state => ({
    feedback: {
      ...state.feedback,
      [field]: value
    }
  })),
  
  submitFeedbackPending: () => set({
    isSubmittingFeedback: true,
    feedbackError: null
  }),
  
  submitFeedbackSuccess: () => set({
    isSubmittingFeedback: false,
    feedback: {
      rating: 0,
      tags: [],
      notes: ''
    }
  }),
  
  submitFeedbackFailure: (errorMessage: string) => set({
    isSubmittingFeedback: false,
    feedbackError: errorMessage
  }),
  
  setFeedback: (feedback: SessionFeedback) => set({
    feedback: {
      rating: feedback.rating,
      tags: feedback.tags,
      notes: feedback.notes
    }
  }),
  
  clearFeedbackError: () => set({
    feedbackError: null
  }),
  
  resetFeedback: () => set({
    feedback: {
      rating: 0,
      tags: [],
      notes: ''
    },
    feedbackError: null
  })
});
```

#### 4.2.6 Developer Settings Slice

```typescript
/**
 * Developer settings slice creator function with local storage persistence
 */
export const createDevSettingsSlice: StateCreator<
  DevSettingsState,
  [],
  [],
  DevSettingsState
> = (set) => ({
  // Initial state
  webhookEnvironment: 'test',
  mockModeEnabled: false,
  
  // Actions
  setWebhookEnvironment: (environment: 'test' | 'production') => set({
    webhookEnvironment: environment
  }),
  
  toggleMockMode: () => set(state => ({
    mockModeEnabled: !state.mockModeEnabled
  }))
});
```

#### 4.2.7 System Log Slice

```typescript
/**
 * System log slice creator function
 */
export const createSystemLogSlice: StateCreator<
  SystemLogState,
  [],
  [],
  SystemLogState
> = (set) => ({
  // Initial state
  logs: [],
  areLogsVisible: false,
  
  // Actions
  addLog: (log: SystemLogMessage) => set(state => ({
    logs: [log, ...state.logs].slice(0, 100) // Keep only most recent 100 logs
  })),
  
  clearLogs: () => set({
    logs: []
  }),
  
  toggleLogsVisibility: () => set(state => ({
    areLogsVisible: !state.areLogsVisible
  }))
});
```

### 4.3 State Access Patterns

#### 4.3.1 Selecting State

```typescript
// Component using multiple state slices
const MyComponent = () => {
  // Select only the specific state properties needed by this component
  const isSessionActive = useStore(state => state.isSessionActive);
  const currentUserMessage = useStore(state => state.currentUserMessage);
  const setCurrentUserMessage = useStore(state => state.setCurrentUserMessage);
  
  // Rest of component...
};
```

#### 4.3.2 Custom Selectors

```typescript
// Define reusable selectors for derived state
const useIsFormValid = () => useStore(state => {
  const { formData, validationErrors } = state;
  return (
    formData.principlesDocId.trim() !== '' &&
    formData.scenarioDocIds.every(id => id.trim() !== '') &&
    formData.sessionTopic.trim() !== '' &&
    formData.testerId.trim() !== '' &&
    Object.keys(validationErrors).length === 0
  );
});

// Use the custom selector in a component
const SubmitButton = () => {
  const isFormValid = useIsFormValid();
  const isSubmitting = useStore(state => state.isSubmitting);
  
  // Rest of component...
};
```

### 4.4 State Persistence

The application uses selective state persistence to maintain user preferences across browser sessions:

```typescript
/**
 * State persistence configuration
 */
const persistOptions = {
  name: 'co-director-store',
  partialize: (state) => ({
    // Only persist these parts of the state
    devSettings: {
      webhookEnvironment: state.webhookEnvironment,
      mockModeEnabled: state.mockModeEnabled
    },
    activeTab: state.activeTab
  }),
  storage: {
    getItem: (name) => {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    }
  }
};
```

### 4.5 State Management Guidelines

1. **Principle of Least Privilege**: Components should only access the state they need.

2. **Normalized State**: Keep state normalized to avoid duplication and inconsistency.

3. **Action Patterns**:
   - Pending/Success/Failure pattern for async operations
   - Atomic updates to maintain state consistency
   - Clear error states after they've been handled or displayed

4. **Performance Considerations**:
   - Use memoization techniques (useMemo, useCallback) when working with derived state
   - Implement equality functions for complex objects in selectors
   - Limit state updates in rapid-fire events (e.g., text input) with debouncing

## 5. API Integration

> Note: This section specifies how the frontend application should interact with backend services, including the API client implementation, error handling patterns, and both mock and real implementations.

### 5.1 API Client Structure

```typescript
/**
 * Base URL configuration for API endpoints
 */
export const getApiBaseUrl = () => {
  const devSettings = JSON.parse(localStorage.getItem('co-director-store') || '{}');
  const webhookEnvironment = devSettings?.devSettings?.webhookEnvironment || 'test';
  
  return webhookEnvironment === 'test'
    ? import.meta.env.VITE_API_TEST_WEBHOOK_URL
    : import.meta.env.VITE_API_PROD_WEBHOOK_URL;
};

/**
 * Central API client for all backend interactions
 */
export const apiClient = {
  /**
   * Start a new session
   */
  startSession: async (params: {
    principlesDocId: string;
    scenarioDocIds: string[];
    sessionTopic: string;
    testerId: string;
    historyTurnsSetting: number;
  }): Promise<StartSessionResponse> => {
    try {
      // Generate a unique session ID
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Prepare request payload
      const payload: StartSessionRequest = {
        sessionId,
        ...params,
        userQuery: null
      };
      
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Starting session',
        context: { payload }
      });
      
      // Make the API call
      const response = await axios.post(`${getApiBaseUrl()}`, payload);
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Session started successfully',
        context: { sessionId, response: response.data }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to start session',
        context: { error: processedError }
      });
      
      return processedError;
    }
  },
  
  /**
   * Send a message in an active session
   */
  sendMessage: async (params: {
    sessionId: string;
    userQuery: string;
  }): Promise<SendMessageResponse> => {
    try {
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Sending message',
        context: { payload: params }
      });
      
      // Make the API call
      const response = await axios.post(`${getApiBaseUrl()}`, params);
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Message sent successfully',
        context: { sessionId: params.sessionId, response: response.data }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to send message',
        context: { error: processedError }
      });
      
      return processedError;
    }
  },
  
  /**
   * End an active session
   */
  endSession: async (params: {
    sessionId: string;
  }): Promise<EndSessionResponse> => {
    try {
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Ending session',
        context: { payload: params }
      });
      
      // Make the API call
      const response = await axios.post(`${getApiBaseUrl()}/end-session`, params);
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Session ended successfully',
        context: { sessionId: params.sessionId, response: response.data }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to end session',
        context: { error: processedError }
      });
      
      return processedError;
    }
  },
  
  /**
   * Get list of sessions
   */
  getSessions: async (): Promise<GetSessionsResponse> => {
    try {
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Fetching sessions'
      });
      
      // Make the API call
      const response = await axios.get(`${getApiBaseUrl()}/api/sessions`);
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Sessions fetched successfully',
        context: { sessionCount: response.data.data?.sessions.length }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to fetch sessions',
        context: { error: processedError }
      });
      
      return processedError;
    }
  },
  
  /**
   * Get session details
   */
  getSessionDetails: async (params: {
    sessionId: string;
  }): Promise<GetSessionDetailsResponse> => {
    try {
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Fetching session details',
        context: { sessionId: params.sessionId }
      });
      
      // Make the API call
      const response = await axios.get(`${getApiBaseUrl()}/api/sessions/${params.sessionId}/details`);
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Session details fetched successfully',
        context: { sessionId: params.sessionId }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to fetch session details',
        context: { error: processedError }
      });
      
      return processedError;
    }
  },
  
  /**
   * Submit feedback for a session
   */
  submitFeedback: async (params: {
    sessionId: string;
    rating: number;
    tags: string[];
    notes: string;
  }): Promise<SubmitFeedbackResponse> => {
    try {
      // Log the outgoing request
      logSystemMessage({
        level: 'info',
        message: 'Submitting feedback',
        context: { payload: params }
      });
      
      // Make the API call
      const response = await axios.post(
        `${getApiBaseUrl()}/api/sessions/${params.sessionId}/feedback`,
        params
      );
      
      // Log the success response
      logSystemMessage({
        level: 'info',
        message: 'Feedback submitted successfully',
        context: { sessionId: params.sessionId }
      });
      
      return response.data;
    } catch (error) {
      // Handle and log errors
      const processedError = handleApiError(error);
      
      logSystemMessage({
        level: 'error',
        message: 'Failed to submit feedback',
        context: { error: processedError }
      });
      
      return processedError;
    }
  }
};
```

### 5.2 Error Handling

```typescript
/**
 * Standardized API error handler
 */
export const handleApiError = (error: any): any => {
  // Network or request errors
  if (error.isAxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // If the backend already returned a structured error response, use it
    if (data && data.error) {
      return {
        success: false,
        error: data.error,
        statusCode: status || 500
      };
    }
    
    // Handle specific HTTP status codes
    if (status === 401) {
      // Unauthorized
      return {
        success: false,
        error: {
          userMessage: "Your session has expired. Please refresh the page.",
          technicalMessage: `Authentication error: ${error.message}`
        },
        statusCode: 401
      };
    }
    
    if (status === 429) {
      // Rate limited
      return {
        success: false,
        error: {
          userMessage: "The system is currently busy. Please try again in a moment.",
          technicalMessage: `Rate limited: ${error.message}`
        },
        statusCode: 429
      };
    }
    
    // Generic network error
    return {
      success: false,
      error: {
        userMessage: "Unable to connect to the server. Please check your internet connection.",
        technicalMessage: `Network error: ${error.message}`
      },
      statusCode: status || 500
    };
  }
  
  // Unexpected errors
  return {
    success: false,
    error: {
      userMessage: "An unexpected error occurred. The development team has been notified.",
      technicalMessage: error.message || "Unknown error"
    },
    statusCode: 500
  };
};

/**
 * System message logger
 */
export const logSystemMessage = (params: {
  level: 'info' | 'warning' | 'error';
  message: string;
  context?: Record<string, any>;
}) => {
  // Only log in development or if dev features are enabled
  const isDev = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_FEATURES === 'true';
  
  // Always log to console in development
  if (isDev) {
    const method = params.level === 'error' ? console.error : 
                 params.level === 'warning' ? console.warn : 
                 console.log;
    
    method(`[${params.level.toUpperCase()}] ${params.message}`, params.context || '');
  }
  
  // Add to system log store
  const systemLogSlice = useStore.getState();
  if (systemLogSlice.addLog) {
    systemLogSlice.addLog({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      level: params.level,
      message: params.message,
      context: params.context
    });
  }
};
```

### 5.3 Mock Implementation

```typescript
/**
 * Mock data for testing
 */
const mockSessions: Session[] = [
  {
    sessionId: 'session-1683024000000-abc123',
    principlesDocId: 'principles-doc-123',
    scenarioDocIds: ['scenario-doc-456'],
    sessionTopic: 'Test Session 1',
    testerId: 'tester-001',
    historyTurnsSetting: 10,
    startTime: '2025-05-02T10:00:00Z',
    endTime: '2025-05-02T10:30:00Z',
    isActive: false,
    totalTurns: 5
  },
  {
    sessionId: 'session-1683110400000-def456',
    principlesDocId: 'principles-doc-123',
    scenarioDocIds: ['scenario-doc-789'],
    sessionTopic: 'Test Session 2',
    testerId: 'tester-002',
    historyTurnsSetting: 10,
    startTime: '2025-05-03T10:00:00Z',
    isActive: true,
    totalTurns: 3
  }
];

const mockMessages: Record<string, Message[]> = {
  'session-1683024000000-abc123': [
    {
      messageId: 'msg-1683024000000-1',
      sessionId: 'session-1683024000000-abc123',
      timestamp: '2025-05-02T10:00:10Z',
      type: MessageType.UserMessage,
      content: 'Hello, this is a test message',
      sender: MessageSender.User
    },
    {
      messageId: 'msg-1683024000000-2',
      sessionId: 'session-1683024000000-abc123',
      timestamp: '2025-05-02T10:00:15Z',
      type: MessageType.AIResponse,
      content: 'Hi there! I am the Co-Director AI. How can I help you today?',
      sender: MessageSender.AI
    }
    // Additional messages would be here
  ],
  'session-1683110400000-def456': [
    {
      messageId: 'msg-1683110400000-1',
      sessionId: 'session-1683110400000-def456',
      timestamp: '2025-05-03T10:00:10Z',
      type: MessageType.UserMessage,
      content: 'Can you help me understand the principles?',
      sender: MessageSender.User
    },
    {
      messageId: 'msg-1683110400000-2',
      sessionId: 'session-1683110400000-def456',
      timestamp: '2025-05-03T10:00:15Z',
      type: MessageType.AIResponse,
      content: 'Of course! I\'d be happy to help you understand the principles. The principles document provides guidance on...',
      sender: MessageSender.AI
    }
    // Additional messages would be here
  ]
};

/**
 * Mock API implementation
 */
export const mockApiClient = {
  startSession: async (params: {
    principlesDocId: string;
    scenarioDocIds: string[];
    sessionTopic: string;
    testerId: string;
    historyTurnsSetting: number;
  }): Promise<StartSessionResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a new mock session
    const newSession: Session = {
      sessionId,
      ...params,
      startTime: new Date().toISOString(),
      isActive: true,
      totalTurns: 0
    };
    
    // Add to mock sessions
    mockSessions.push(newSession);
    mockMessages[sessionId] = [];
    
    // Return success response
    return {
      success: true,
      message: 'Session created successfully',
      data: {
        sessionId,
        cacheId: 'mock-cache-id',
        expiryTime: new Date(Date.now() + 7200000).toISOString()
      },
      statusCode: 200
    };
  },
  
  sendMessage: async (params: {
    sessionId: string;
    userQuery: string;
  }): Promise<SendMessageResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find the session
    const session = mockSessions.find(s => s.sessionId === params.sessionId);
    if (!session || !session.isActive) {
      return {
        success: false,
        error: {
          userMessage: 'Session not found or not active',
          technicalMessage: 'Invalid sessionId or session is not active'
        },
        statusCode: 404
      };
    }
    
    // Create user message
    const userMessage: Message = {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sessionId: params.sessionId,
      timestamp: new Date().toISOString(),
      type: MessageType.UserMessage,
      content: params.userQuery,
      sender: MessageSender.User
    };
    
    // Add user message to session
    mockMessages[params.sessionId].push(userMessage);
    
    // Generate AI response
    const aiResponse: Message = {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sessionId: params.sessionId,
      timestamp: new Date().toISOString(),
      type: MessageType.AIResponse,
      content: `This is a mock AI response to your message: "${params.userQuery}". In a real implementation, this would be a response from the AI model.`,
      sender: MessageSender.AI
    };
    
    // Add AI message to session
    mockMessages[params.sessionId].push(aiResponse);
    
    // Update session turn count
    session.totalTurns += 1;
    
    // Return success response
    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        aiResponse: aiResponse.content,
        responseTime: 1200
      },
      statusCode: 200
    };
  },
  
  // Implement other methods with similar mock logic
};
```

### 5.4 API Integration Guidelines

1. **Centralized API Access**: All backend API calls must go through the `apiClient` module to ensure consistent error handling, logging, and mocking capability.

2. **Error Handling Strategy**:
   - Every API call should be wrapped in try/catch blocks
   - All errors should be transformed into a consistent format
   - User-friendly error messages should be separated from technical details

3. **Mock Mode Implementation**:
   - The application should detect when mock mode is enabled and use the mock implementation
   - Mock data should be realistic enough for UI testing
   - Consider adding random delays to simulate network latency

4. **Logging**:
   - All API requests and responses should be logged when in development mode
   - Sensitive information should be redacted from logs
   - Log entries should include timestamps and contextual information

5. **Retry Mechanism**:
   - Implement exponential backoff for retrying failed requests
   - Only retry idempotent operations (GET, PUT) automatically
   - Provide user-initiated retry for non-idempotent operations (POST)

## 6. Technical Guidelines

> Note: This section provides general technical guidelines and best practices for implementing the Co-Director Platform.

### 6.1 TypeScript Best Practices

#### 6.1.1 Type Definitions

```typescript
// Prefer interfaces for public API definitions
export interface UserConfig {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  notifications: boolean;
}

// Use type aliases for unions, intersections, and utility types
export type Theme = 'light' | 'dark' | 'system';
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Use enums for related constants
export enum ErrorCode {
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  ServerError = 'SERVER_ERROR'
}
```

#### 6.1.2 Typing Patterns

1. **Use Type Guards for Runtime Type Checking**:

```typescript
// Type guard function
function isApiError(response: any): response is ApiError {
  return (
    response &&
    typeof response === 'object' &&
    'userMessage' in response &&
    'technicalMessage' in response
  );
}

// Usage
if (isApiError(result)) {
  // TypeScript knows result is ApiError here
  console.error(result.technicalMessage);
  showErrorToUser(result.userMessage);
}
```

2. **Use Generics for Reusable Components**:

```typescript
// Generic async data hook
function useAsyncData<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Implementation...
  
  return { data, isLoading, error, refetch };
}

// Usage
const { data: sessions, isLoading } = useAsyncData<Session[]>(apiClient.getSessions);
```

3. **Define Function Parameter and Return Types**:

```typescript
// Clear parameter and return types
function formatSessionDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

### 6.2 Component Styling Approaches

#### 6.2.1 Using MUI's `sx` Prop

```tsx
// Preferred approach for component-specific styling
function MessageBubble({ message, isUser }: MessageBubbleProps) {
  return (
    <Box
      sx={{
        backgroundColor: isUser ? 'primary.light' : 'grey.100',
        borderRadius: 2,
        padding: 2,
        maxWidth: '70%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        boxShadow: 1,
        mb: 2
      }}
    >
      {message.content}
    </Box>
  );
}
```

#### 6.2.2 Using MUI's `styled` Utility

```tsx
// Preferred approach for reusable styled components
const StyledMessageInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`
    }
  }
}));

// Usage
function MessageInput(props: MessageInputProps) {
  return (
    <StyledMessageInput
      fullWidth
      placeholder="Type a message..."
      variant="outlined"
      {...props}
    />
  );
}
```

#### 6.2.3 Responsive Design

```tsx
// Use MUI's responsive breakpoints
function ChatLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
        padding: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box 
        sx={{
          width: { xs: '100%', md: '300px' },
          flexShrink: 0
        }}
      >
        {/* Sidebar content */}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {/* Main content */}
      </Box>
    </Box>
  );
}
```

### 6.3 Testing Patterns

#### 6.3.1 Component Testing

```tsx
// Basic component test with React Testing Library
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  it('calls onSendMessage when send button is clicked', async () => {
    // Arrange
    const mockSendMessage = jest.fn();
    const mockSetMessage = jest.fn();
    const message = 'Hello world';
    
    // Act
    render(
      <MessageInput
        message={message}
        setMessage={mockSetMessage}
        onSendMessage={mockSendMessage}
        disabled={false}
        isSending={false}
      />
    );
    
    // Find the send button (using accessible role)
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Click the button
    await userEvent.click(sendButton);
    
    // Assert
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
  });
});
```

#### 6.3.2 Store Testing

```typescript
// Testing Zustand store slices
import { createSetupSlice } from './setupSlice';
import { act } from 'react-dom/test-utils';

describe('setupSlice', () => {
  // Mock state and set function
  const mockSet = jest.fn();
  const mockGet = jest.fn();
  let slice: ReturnType<typeof createSetupSlice>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    slice = createSetupSlice(mockSet, mockGet, {});
  });
  
  it('updates form field correctly', () => {
    // Act
    act(() => {
      slice.updateFormField('sessionTopic', 'Test Topic');
    });
    
    // Assert
    expect(mockSet).toHaveBeenCalledWith(expect.any(Function));
    
    // Call the function passed to set() to get the state update
    const updateFn = mockSet.mock.calls[0][0];
    const result = updateFn({ formData: { sessionTopic: '' } });
    
    // Check the result
    expect(result).toEqual({
      formData: { sessionTopic: 'Test Topic' }
    });
  });
});
```

#### 6.3.3 API Integration Testing

```typescript
// Testing API client with mocked axios
import axios from 'axios';
import { apiClient } from './apiClient';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('startSession', () => {
    it('successfully starts a session', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            sessionId: 'test-session-id',
            cacheId: 'test-cache-id'
          },
          statusCode: 200
        }
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.startSession({
        principlesDocId: 'test-doc',
        scenarioDocIds: ['test-scenario'],
        sessionTopic: 'Test Topic',
        testerId: 'test-user',
        historyTurnsSetting: 10
      });
      
      // Assert
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

### 6.4 Performance Considerations

#### 6.4.1 React Rendering Optimization

1. **Memoization**:

```tsx
// Memoize expensive components
const MemoizedSessionList = React.memo(SessionList);

// Memoize callback functions
const handleSelectSession = useCallback((sessionId: string) => {
  // Implementation...
}, [/* dependencies */]);

// Memoize derived data
const activeSessions = useMemo(() => {
  return sessions.filter(session => session.isActive);
}, [sessions]);
```

2. **Virtualization for Long Lists**:

```tsx
// Use react-window for virtualized lists
import { FixedSizeList } from 'react-window';

function ChatMessageList({ messages }: { messages: Message[] }) {
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={messages.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <div style={style}>
          <MessageItem message={messages[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

#### 6.4.2 Data Fetching Optimization

```typescript
// Implement caching for frequently accessed data
const sessionCache = new Map<string, SessionDetails>();

async function getSessionDetails(sessionId: string) {
  // Check cache first
  if (sessionCache.has(sessionId)) {
    return sessionCache.get(sessionId);
  }
  
  // Fetch if not in cache
  const result = await apiClient.getSessionDetails({ sessionId });
  
  // Cache the result if successful
  if (result.success && result.data) {
    sessionCache.set(sessionId, result.data);
  }
  
  return result;
}
```

#### 6.4.3 Debouncing User Input

```typescript
// Debounce rapid user input
import { debounce } from 'lodash';

function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  
  // Create debounced function
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <TextField
      value={query}
      onChange={handleChange}
      placeholder="Search sessions..."
    />
  );
}
```

### 6.5 Accessibility Guidelines

1. **Semantic HTML**:

```tsx
// Use appropriate semantic elements
function ChatMessage({ message }: { message: Message }) {
  return (
    <article aria-label={`Message from ${message.sender}`}>
      <header>
        <h3>{message.sender}</h3>
        <time dateTime={message.timestamp}>
          {formatDate(message.timestamp)}
        </time>
      </header>
      <div>{message.content}</div>
    </article>
  );
}
```

2. **Keyboard Navigation**:

```tsx
// Ensure keyboard accessibility
function MessageInput({ onSendMessage }: { onSendMessage: () => void }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Ctrl+Enter or Command+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onSendMessage();
      e.preventDefault();
    }
  };
  
  return (
    <TextField
      multiline
      onKeyDown={handleKeyDown}
      aria-label="Message input"
    />
  );
}
```

3. **Focus Management**:

```tsx
// Manage focus for modal dialogs
function ConfirmationDialog({ open, onClose }: ConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus cancel button when dialog opens
  useEffect(() => {
    if (open) {
      // Short timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  return (
    <Dialog 
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-title"
    >
      <DialogTitle id="confirmation-title">Confirm Action</DialogTitle>
      {/* Dialog content */}
      <DialogActions>
        <Button ref={cancelButtonRef}>Cancel</Button>
        <Button>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
```

### 6.6 Implementation Checklist

Before considering any feature complete, ensure it meets these criteria:

1. **Functionality**:
   - Feature works as specified in the PRD/ADD
   - Edge cases are handled
   - Error states are managed and presented to the user

2. **Code Quality**:
   - TypeScript types are properly defined
   - Code follows project patterns and guidelines
   - ESLint passes without warnings

3. **State Management**:
   - State is properly encapsulated in Zustand slices
   - Components only access the state they need
   - Actions follow the async pattern (pending/success/failure)

4. **Testing**:
   - Component tests cover main functionality
   - Edge cases and error states are tested
   - Integration tests verify component interactions

5. **Performance**:
   - Unnecessary re-renders are minimized
   - Large lists use virtualization
   - Expensive operations are memoized

6. **Accessibility**:
   - Semantic HTML is used appropriately
   - Keyboard navigation is supported
   - ARIA attributes are applied where needed

7. **Developer Experience**:
   - Developer tools work as expected
   - System logging provides useful information
   - Feature flags function correctly
