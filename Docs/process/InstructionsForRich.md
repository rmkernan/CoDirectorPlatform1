# Co-Director Platform: AI-Assisted Development Guide

## Overview

This document provides guidance for effectively managing AI-assisted development sessions for the Co-Director Platform. We use a structured approach with five interconnected documents:

1. **DevProgress.md** - Main progress tracker with task status
2. **SessionHandoff.md** - Detailed handoff context between sessions
3. **TDD-Index.md** - Navigation aid for the Technical Design Document
4. **TechnicalPatterns.md** - Implementation patterns and code examples
5. **BestPractices.md** - Development guidelines and standards

## Session Management Instructions

### Session Start Instructions

```
Let's continue development on the Co-Director Platform. Please:

1. Review DevProgress.md to understand our current status and next tasks
2. Check the latest entry in SessionHandoff.md for detailed context
3. Use TDD-Index.md to locate relevant technical specifications
4. Reference TechnicalPatterns.md for implementation examples
5. Follow BestPractices.md for development standards

Today, let's focus on [Phase X] tasks [Task IDs], specifically [brief description].
```

### Referencing Documentation

```
Please check TDD-Index.md to find the relevant sections for [component/feature]. Also reference TechnicalPatterns.md section [X] for implementation patterns. According to our Implementation Plan, we need to [brief description of requirement].
```

### Checking Task Status

```
Which tasks have we completed so far in the current phase, and what should we focus on next?
```

### Mid-Session Progress Check

```
We've completed tasks [list completed tasks]. Let's update DevProgress.md to reflect our progress. Should we continue with the next tasks or wrap up this session?
```

### Documentation Reference Requests

```
I need to understand the technical specifications for [component/feature]. Please check TDD-Index.md and retrieve the relevant sections from TDD.md lines [X-Y].
```

### Technical Pattern Request

```
I need implementation patterns for [specific feature/component]. Please check TechnicalPatterns.md section [X] for relevant code examples and approaches.
```

### Best Practice Reference

```
What are our guidelines for [specific development concern]? Please check BestPractices.md section [X] for our standards.
```

### Token Limit Management

Watch for these signs that you're approaching context limits:

- Responses become less specific or coherent
- Previous context seems to be forgotten
- Long pauses before responses
- Repetition of information

If you notice these signs, initiate a session wrap-up:

```
I notice we might be approaching context limits. Let's wrap up this session and create a handoff, ensuring we document which technical patterns and best practices we've applied.
```

### Session End Instructions

```
Let's wrap up this development session. Please:

1. Update DevProgress.md with our completed tasks and current status
2. Create a new entry in SessionHandoff.md with today's context
3. Document which implementation patterns from TechnicalPatterns.md were applied
4. Note which guidelines from BestPractices.md were followed
5. Recommend specific tasks for our next session based on dependencies and priority
```

### Recovery After Context Reset

```
It appears we've had a context reset. Please:

1. Review DevProgress.md for our overall progress
2. Check the latest entry in SessionHandoff.md for detailed context
3. Reference TechnicalPatterns.md for implementation approaches
4. Follow BestPractices.md for development standards
5. Resume from task [last completed task + 1] focusing on [specific component/feature]
```

## Best Practices for AI-Assisted Development

### Document Updates

- Always update DevProgress.md when tasks are completed, including the current timestamp in Eastern Time (ET)
- Always include a "Last Updated" timestamp in ET format (YYYY-MM-DD, HH:MM AM/PM ET) at the top of DevProgress.md
- Create detailed SessionHandoff entries at the end of each development session with precise timestamps
- Include session duration with start and end times (in ET) in all SessionHandoff entries
- Reference specific line numbers in TDD.md using TDD-Index.md
- Cite specific sections of TechnicalPatterns.md when implementing features
- Reference relevant sections of BestPractices.md when making implementation decisions
- Include a "Technical Patterns & Practices Reference" section in each SessionHandoff entry
- Log all technical decisions with their exact date and time (in ET)

### Task Management

- Complete tasks in dependency order as shown in DevProgress.md
- Update task status with appropriate emoji indicators:
  - ✅ Completed
  - 🔄 In Progress
  - ⏱️ Pending
  - ⚠️ Blocked

### Code Development

- Always reference Implementation.md and TDD.md for specifications before coding
- Consult TechnicalPatterns.md for implementation patterns and code examples
- Follow the development guidelines in BestPractices.md
- Apply the TypeScript patterns in TechnicalPatterns.md Section 1
- Utilize Material UI patterns from TechnicalPatterns.md Section 3
- Implement Zustand state management following TechnicalPatterns.md Section 6
- Maintain the project folder structure defined in TechnicalPatterns.md Section 4
- Optimize performance using techniques in TechnicalPatterns.md Section 5
- Adhere to file and function size limits from BestPractices.md Section 2

### Technical Decision Documentation

When making important technical decisions, document them in both DevProgress.md and SessionHandoff.md with:

- The decision made
- Rationale and alternatives considered
- Impact on architecture or other components
- Related tasks or components

## Development Conversation Flow

For optimal development flow:

1. **Start**: Review current status and context
2. **Plan**: Identify specific tasks for this session
3. **Reference**: Consult technical patterns and best practices documentation
4. **Execute**: Complete tasks with continuous reference to documentation
5. **Document**: Update progress trackers as tasks complete
6. **Handoff**: Create detailed context for the next session

Following this structured approach ensures consistent progress and smooth transitions between development sessions, even with AI context limitations.