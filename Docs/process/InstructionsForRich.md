# Co-Director Platform: AI-Assisted Development Guide

<!--
Created: 2025-05-22, 02:57 PM ET
Last Updated: 2025-05-22, 21:05 ET
-->

> **Instructions for Rich, Human Project Manager**
> This document contains ready-to-use prompts for AI interactions:
> - **Start Conversation** - To begin a new development session
> - **Reference Documentation** - To get implementation guidance
> - **End Conversation** - To create proper handoff for the next session
> 
> Copy and paste the text in ```code blocks``` to the AI assistant.

## 📋 Key Documents

- **DevProgress.md** - Tasks and current status
- **SessionHandoff.md** - Context between sessions
- **DEV_CHECKLIST.md** - Development workflow
- **DOCUMENTATION_STANDARDS.md** - Code documentation rules

## 📋 ESSENTIAL PROMPTS

### 1. Start Conversation

```
Let's continue development on the Co-Director Platform. I'm on branch: [paste output of 'git branch --show-current']

Please review DEV_CHECKLIST.md, DevProgress.md, and the latest SessionHandoff.md entry, then recommend which tasks we should prioritize in this session. Which model are you using for this task?
```

### 2. Implementation Guidance

```
Please check TechnicalPatterns.md section [X] for implementation patterns for [component/feature]. According to our current priorities in DevProgress.md, we need to [brief description].
```

### 3. End Conversation/Handoff

```
We're wrapping up this development session. Please:

1. Update DevProgress.md with our current task status
2. Create a detailed SessionHandoff.md entry that includes:
   - Summary of what we accomplished
   - Current status of in-progress tasks
   - Specific recommendations for the next session with a suggested branch name
   - Any technical decisions or important context

This handoff is critical for the next conversation to continue our work efficiently.
```

### Mid-Session Progress Check

```

### 4. Recovery After Context Reset

```
It appears we've had a context reset. Please review DevProgress.md and the latest SessionHandoff.md entry to continue from where we left off.
```

## REMINDERS (For Your Reference Only)

- **Branch Naming**: Always use `feature/{task-id}-{description}-{model}`
- **Task Status**: Use emojis in DevProgress.md (✅ Completed, 🔄 In Progress, ⏱️ Pending)
- **Documentation**: All code needs proper JSDoc headers and comments
- **Current Priority**: Encoding Phase (Zustand store and API client)
- **Folder Structure**: Follow feature-based organization in src/features/

For full details on development practices, see DEV_CHECKLIST.md