# Co-Director Flow Diagrams
<!-- Last updated: May 15, 2023, 5:45 PM ET -->

This document provides visual representations of the key processes and data flows in the Co-Director application. For detailed explanations of the system architecture, components, and their relationships, see the [Architecture Documentation](ARCHITECTURE.md).

## Session Lifecycle

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Session Setup  │────▶│  Chat Session   │────▶│ Session Feedback│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                        │
                                │                        │
                                ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  Session History│◀────│ History Details │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## Session Creation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Enter Setup │────▶│ Fill Form   │────▶│ Validate    │────▶│ API Request │
│ Parameters  │     │ Fields      │     │ Inputs      │     │             │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Switch to   │◀────│ Update      │◀────│ Store       │◀────│ Process     │
│ Chat Tab    │     │ State       │     │ Session ID  │     │ Response    │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Message Exchange Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ User Types  │────▶│ Send Message│────▶│ Add to Chat │────▶│ API Request │
│ Message     │     │             │     │ History     │     │             │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ Display     │◀────│ Add AI      │◀────│ Process     │
│ Response    │     │ Response    │     │ Response    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Session Termination Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Click End   │────▶│ Confirmation│────▶│ API Request │────▶│ Update      │
│ Session     │     │ Dialog      │     │             │     │ State       │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Switch to   │◀────│ Save        │◀────│ Collect     │◀────│ Open        │
│ History Tab │     │ Feedback    │     │ Feedback    │     │ Feedback    │
│             │     │             │     │             │     │ Dialog      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Document Processing Flow

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

## Chat History Retrieval Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Get Session     │────▶│ Check Cache     │────▶│ Postgres Node   │
│ Data            │     │ Expiry          │     │ Query           │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Format History  │◀────│ Process Query   │◀────│ SQL with Quoted │
│ for Context     │     │ Results         │     │ Identifiers     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Data Persistence

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Session Storage                      │
│                                                         │
├─────────────────────────┬───────────────────────────────┤
│                         │                               │
│   currentSessionId      │        chatHistory            │
│                         │                               │
└─────────────────────────┴───────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Local Storage                        │
│                                                         │
├─────────────────────────┬───────────────────────────────┤
│                         │                               │
│   CODIRECTOR_DEV_MODE   │      lastEndedSession         │
│                         │                               │
└─────────────────────────┴───────────────────────────────┘
```