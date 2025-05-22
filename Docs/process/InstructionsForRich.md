# Co-Director Platform: AI-Assisted Development Guide

<!--
Created: 2025-05-22, 02:57 PM ET
Last Updated: 2025-05-22, 04:39 PM ET
-->

> **Instructions for Rich, Human Project Manager**
> This document is your operational guide for managing AI-assisted development sessions. It contains:
> - **📋 PROMPT TEMPLATES** - Text blocks to copy/paste when interacting with the AI
> - **🔍 REFERENCE INFORMATION** - Guidelines and best practices for your reference only
> 
> All text in ```code blocks``` represents exact prompts to copy/paste to the AI assistant.

## 🔍 Pre-Session Checklist

**Note:** The AI will now automatically complete this checklist at the beginning of each conversation when provided with the Session Start prompt below.

Before starting any development conversation, ensure these steps are completed (for details see [DEV_CHECKLIST.md](./DEV_CHECKLIST.md)):

- [ ] Verify current Git branch (`git branch --show-current`)
- [ ] Create feature branch if needed with model identifier if relevant (`git checkout -b feature/X-Y-description[-model]`)
- [ ] Push branch to remote (`git push -u origin feature/X-Y-description[-model]`)
- [ ] Check DevProgress.md for current task status
- [ ] Review latest SessionHandoff.md entry

## 🔍 Overview

This document provides guidance for effectively managing AI-assisted development sessions for the Co-Director Platform. We use a structured approach with these interconnected documents:

1. **DevProgress.md** - Main progress tracker with task status
2. **SessionHandoff.md** - Detailed handoff context between sessions
3. **TDD-Index.md** - Navigation aid for the Technical Design Document
4. **TechnicalPatterns.md** - Implementation patterns and code examples
5. **BestPractices.md** - Development guidelines and standards
6. **DEV_CHECKLIST.md** - Quick reference for day-to-day development activities

## 🔍 Git & Version Control Reference (For Your Information)

- **Branching:** Always start new work on a feature branch named `feature/{task-id}-{description}` (e.g., `feature/0-1-initialize-vite`), as described in `GitWorkflow.md`.
- **Commit Messages:** Use Conventional Commits format (`{type}({scope}): {description}`), referencing the task/feature when possible. Types: feat, fix, docs, style, refactor, test, chore.
- **.windsurf/rules:** All project-specific rules, code quality, and structure conventions are in `.windsurf/rules/*.md`. These are now tracked in Git.
- **GitHub Templates:** Use `.github/PULL_REQUEST_TEMPLATE.md` and `.github/ISSUE_TEMPLATE/*` for all PRs and issues.
- **Session Handoff:** Always include Git context (branch, commit, PR, CI status) in `SessionHandoff.md`.
- **See:** `GitWorkflow.md` for full details and rationale.

## 📋 PROMPT TEMPLATES FOR AI INTERACTION

_The sections below contain ready-to-use prompts. Copy and paste the text inside the code blocks, replacing placeholders in [brackets] with your specific information._

### Session Start Instructions

```
Let's continue development on the Co-Director Platform. Please complete the development checklist and provide a status overview:

Current branch: [output of 'git branch --show-current']

Based on our current progress, please recommend which tasks we should focus on in this session and why. I'd like your expert guidance on prioritization.
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

🔍 **FOR YOUR REFERENCE:** Watch for these signs that you're approaching context limits:

- Responses become less specific or coherent
- Previous context seems to be forgotten
- Long pauses before responses
- Repetition of information

📋 **PROMPT TO USE** when you notice these signs:

```
I notice we might be approaching context limits. Let's wrap up this session and create a handoff, ensuring we document which technical patterns and best practices we've applied.
```

### Session End Instructions

```
Let's wrap up this development session. Please complete the session handoff checklist and prepare for the next session.
```

**What the AI will do with this prompt:**

1. ✅ Complete a pre-handoff checklist:
   - Verify all code changes are committed and pushed
   - Check that code follows project patterns and best practices
   - Confirm all tasks are properly marked in DevProgress.md

2. ✅ Update DevProgress.md with:
   - Completed tasks marked with ✅
   - In-progress tasks marked with 🔄
   - Updated timestamps
   - Any new technical decisions logged

3. ✅ Create a comprehensive SessionHandoff.md entry including:
   - Session summary with duration and accomplishments
   - Current development state with task status
   - Implementation context with key files modified
   - Git context with branch and commit information
   - Technical patterns and practices applied
   - Specific tasks recommended for the next session

4. ✅ Provide a session summary with:
   - Key accomplishments
   - Current status
   - Next steps

### Recovery After Context Reset

```
It appears we've had a context reset. Please:

1. Review DevProgress.md for our overall progress
2. Check the latest entry in SessionHandoff.md for detailed context
3. Reference TechnicalPatterns.md for implementation approaches
4. Follow BestPractices.md for development standards
5. Resume from task [last completed task + 1] focusing on [specific component/feature]
```

## 🔍 REFERENCE INFORMATION (Not Prompts)

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

## 🔍 Development Conversation Flow (For Your Reference)

For optimal development flow:

1. **Start**: Review current status and context using the Session Start prompt
2. **Plan**: Identify specific tasks for this session 
3. **Reference**: Consult technical patterns and best practices documentation using the Reference prompts
4. **Execute**: Complete tasks with continuous reference to documentation
5. **Document**: Update progress trackers as tasks complete using the Mid-Session Check prompt
6. **Handoff**: Create detailed context for the next session using the Session End prompt

Following this structured approach ensures consistent progress and smooth transitions between development sessions, even with AI context limitations.