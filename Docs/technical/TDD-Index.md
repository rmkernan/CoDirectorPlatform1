# Co-Director Platform: TDD Index & Quick Reference

This document serves as a navigation aid for the Technical Design Document (TDD), which is approximately 2,500 lines long. Use this index to quickly locate relevant sections during development conversations.

## Table of Contents with Line Numbers

| Section | Title | Line Range |
|---------|-------|------------|
| 1 | Introduction | 1-60 |
| 1.1 | Purpose | 15-20 |
| 1.2 | Document Relationships | 22-28 |
| 1.3 | How to Use This Document | 30-42 |
| 2 | Data Models and Type Definitions | 44-438 |
| 2.1 | Core Domain Interfaces | 46-140 |
| 2.2 | State Slice Interfaces | 142-320 |
| 2.3 | API Request/Response Types | 322-410 |
| 2.4 | Utility Types | 412-438 |
| 3 | Component Architecture | 440-820 |
| 3.1 | Application Layout | 443-480 |
| 3.2 | Setup Tab Components | 482-560 |
| 3.3 | Chat Tab Components | 562-650 |
| 3.4 | History Tab Components | 652-740 |
| 3.5 | Common Components | 742-820 |
| 4 | State Management | 822-1362 |
| 4.1 | Store Configuration | 824-860 |
| 4.2 | State Slice Implementations | 862-1280 |
| 4.3 | State Access Patterns | 1282-1320 |
| 4.4 | State Persistence | 1322-1340 |
| 4.5 | State Management Guidelines | 1342-1362 |
| 5 | API Integration | 1364-1946 |
| 5.1 | API Client Structure | 1366-1680 |
| 5.2 | Error Handling | 1682-1780 |
| 5.3 | Mock Implementation | 1782-1920 |
| 5.4 | API Integration Guidelines | 1922-1946 |
| 6 | Technical Guidelines | 1948-2464 |
| 6.1 | TypeScript Best Practices | 1950-2020 |
| 6.2 | Component Styling Approaches | 2022-2120 |
| 6.3 | Testing Patterns | 2122-2240 |
| 6.4 | Performance Considerations | 2242-2340 |
| 6.5 | Accessibility Guidelines | 2342-2410 |
| 6.6 | Implementation Checklist | 2412-2464 |

## Quick Reference

### Core Type Definitions

```typescript
// Session interface (line ~50)
interface Session {
  sessionId: string;
  principlesDocId: string;
  scenarioDocIds: string[];
  sessionTopic: string;
  testerId: string;
  historyTurnsSetting: number;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  totalTurns: number;
  // Additional properties...
}

// Message interface (line ~80)
interface Message {
  messageId: string;
  sessionId: string;
  timestamp: string;
  type: MessageType;
  content: string;
  sender: MessageSender;
}

// Message enums (line ~100)
enum MessageType {
  UserMessage = 'user_message',
  AIResponse = 'ai_response',
  SystemMessage = 'system_message',
  FeedbackMessage = 'feedback_message',
  ErrorMessage = 'error_message'
}

enum MessageSender {
  User = 'user',
  AI = 'ai',
  System = 'system'
}
```

### State Management Pattern

```typescript
// Zustand slice pattern (line ~870)
export const createSomeSlice: StateCreator<
  SomeState,
  [],
  [],
  SomeState
> = (set) => ({
  // Initial state
  someData: initialValue,
  isLoading: false,
  error: null,
  
  // Actions
  doSomethingPending: () => set({
    isLoading: true,
    error: null
  }),
  
  doSomethingSuccess: (data) => set({
    someData: data,
    isLoading: false
  }),
  
  doSomethingFailure: (errorMessage) => set({
    isLoading: false,
    error: errorMessage
  })
});
```

### API Client Pattern

```typescript
// API method pattern (line ~1380)
someApiMethod: async (params: SomeParams): Promise<SomeResponse> => {
  try {
    // Log the outgoing request
    logSystemMessage({
      level: 'info',
      message: 'Doing something',
      context: { payload: params }
    });
    
    // Make the API call
    const response = await axios.post(`${getApiBaseUrl()}/endpoint`, params);
    
    // Log the success response
    logSystemMessage({
      level: 'info',
      message: 'Operation successful',
      context: { response: response.data }
    });
    
    return response.data;
  } catch (error) {
    // Handle and log errors
    const processedError = handleApiError(error);
    
    logSystemMessage({
      level: 'error',
      message: 'Operation failed',
      context: { error: processedError }
    });
    
    return processedError;
  }
}
```

## Implementation Plan Task to TDD Section Mapping

| Implementation Phase/Task | Relevant TDD Sections |
|---------------------------|------------------------|
| **Phase 0: Project Setup** | 6.1 TypeScript Best Practices |
| Task 0.1-0.22: Project initialization | N/A - Basic setup |
| **Phase 1: Core UI Layout & Setup Tab** | |
| Task 1.1-1.5: AppLayout Component | 3.1 Application Layout |
| Task 1.6-1.11: Session Lifecycle & Setup Slices | 2.2 State Slice Interfaces, 4.2.1-4.2.2 Slice Implementations |
| Task 1.12-1.17: SetupView Component | 3.2 Setup Tab Components |
| Task 1.18-1.29: UI-State Connection & Testing | 4.3 State Access Patterns, 6.3 Testing Patterns |
| **Phase 2: Chat Tab Implementation** | |
| Task 2.1-2.13: ChatView Component | 3.3 Chat Tab Components |
| Task 2.14-2.16: Chat State Management | 2.2 State Slice Interfaces, 4.2.3 Chat Slice |
| Task 2.17-2.23: API Integration | 5.1 API Client Structure, 5.3 Mock Implementation |
| Task 2.24-2.33: End Session & Testing | 3.3.4 EndSessionButton, 6.3 Testing Patterns |
| **Phase 3: History Tab Implementation** | |
| Task 3.1-3.17: HistoryView & SessionList | 3.4 History Tab Components |
| Task 3.18-3.27: Session Details & Feedback | 3.4.3-3.4.4 Components, 4.2.5 Feedback Slice |
| Task 3.28-3.34: Testing & Iteration | 6.3 Testing Patterns |
| **Phase 4: Developer Tools & API Integration** | |
| Task 4.1-4.4: System Messages Log | 3.2.5 SystemMessagesDisplay, 4.2.7 System Log Slice |
| Task 4.5-4.9: Environment Configuration | 3.2.3-3.2.4 Components, 4.2.6 Dev Settings Slice |
| Task 4.10-4.11: Client-Side Persistence | 4.4 State Persistence |
| Task 4.12-4.18: Full API Integration | 5.1-5.2 API Client & Error Handling |
| Task 4.19-4.24: Error Handling & Testing | 3.5.1 ErrorDisplay, 6.3 Testing Patterns |

## Usage Guidelines

1. **At the start of each development conversation**:
   - Reference this index document to identify relevant TDD sections
   - Request only the specific TDD sections needed for current tasks

2. **When implementing a specific feature**:
   - Find the corresponding Implementation Plan tasks
   - Use the mapping table to locate relevant TDD sections
   - Request those specific sections by line number

3. **For common patterns**:
   - Refer to the Quick Reference section in this document
   - Only request full TDD sections when additional details are needed

This approach will minimize token usage while ensuring you have access to the technical specifications needed for each development task.
