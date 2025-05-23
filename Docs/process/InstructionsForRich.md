# Co-Director Platform: AI-Assisted Development Guide

**Created:** 2025-05-22, 02:57 PM ET  
**Last Updated:** 2025-05-23, 11:43 ET

## Introduction

This document contains ready-to-use prompts for different AI interactions during the development of the Co-Director Platform. Each prompt is clearly labeled, numbered, and includes context for when to use it.

## How To Use This Guide

1. Identify the appropriate prompt for your current development situation
2. Copy the entire text within the code block (```...```) for that prompt
3. Paste it to the AI assistant
4. Add any specific information requested in [BRACKETED PLACEHOLDERS]

## Key Project Documents

| Document | Purpose | When To Reference |
|----------|---------|-------------------|
| **SessionHandoff.md** | Current state and history | Before starting each session |
| **DevProgress.md** | Task status and tracking | When planning work or updating progress |
| **GitWorkflow.md** | Git branching strategy | When creating branches or merging changes |
| **TechnicalPatterns.md** | Implementation patterns | Before implementing new features |
| **DEV_CHECKLIST.md** | Development process | Throughout development |

## AI Development Prompts

### PROMPT 1: Start New Development Session

**When to use:** At the beginning of each new development session/conversation

**Purpose:** Orients the AI to the current project state, ensures proper Git workflow, and plans the session's work

```
# Co-Director Platform: New Development Session

I'm starting a new development session. First, here's my current Git status:

```bash
# Output from these commands:
git branch --show-current
git status
```
[PASTE OUTPUT HERE]

## 1. Project Orientation

### 1.1 Document Navigation Process
Follow this exact process to navigate project documentation:

#### Step 1: Get Latest Context
- Review **SessionHandoff.md** - ONLY read the "Latest Handoff" section at the top
  - Understand what was accomplished in the previous session
  - Note any specific instructions for this session

#### Step 2: Identify Task Status (High-Level Overview)
- Review **DevProgress.md** 
  - Identify completed tasks (✅) and in-progress tasks (🔄)
  - Note which numbered tasks should logically come next
  - Understand high-level task categories and priorities

#### Step 3: Get Detailed Implementation Plan
- For the specific tasks identified in Step 2:
  - **FIRST** check **Implementation-Index.md** to locate the exact task references
  - **THEN** open **Implementation.md** using the section references from the index
  - Study the detailed implementation steps for those tasks
  - Refer to **Implementation-Updates.md** for recently completed tasks not yet merged into the main document
  - Note any dependencies or special requirements
  - Understand how these tasks connect to the overall architecture

#### Step 4: Understand Technical Patterns
- Review **TechnicalPatterns.md** for implementation patterns relevant to the identified tasks
  - Focus on patterns that directly apply to the upcoming work

### 1.2 Document Awareness
The project contains the following important documents that you should be aware of:

| Document | Location | Purpose | When to Reference |
|----------|----------|---------|----------------|
| **TDD-Index.md** | Docs/technical/ | Navigation guide for the TDD | **1st**: Always check this BEFORE accessing TDD.md |
| **Implementation-Index.md** | Docs/technical/ | **Task navigator** for Implementation.md | **1st**: Always check this BEFORE accessing Implementation.md |
| **CodeStandards.md** | Docs/technical/ | **Primary reference** for code organization & basic documentation | Start here for all implementation tasks |
| **DOCUMENTATION_STANDARDS.md** | Docs/process/ | Comprehensive JSDoc reference | When CodeStandards.md doesn't have enough detail |
| **LLM_FILE_CREATION_GUIDELINES.md** | Docs/process/ | Specific file header templates | **Always reference when creating new files** |
| **BestPractices.md** | Docs/process/ | General development guidelines, code quality, file/function length limits, and review processes. For specific Git commands and branching strategy, see `GitWorkflow.md`. | For process-related questions |
| **TechnicalPatterns.md** | Docs/technical/ | Implementation patterns | For consistent code structure and patterns |
| **TDD.md** | Docs/technical/ | Technical Design Document | **AFTER** consulting TDD-Index.md for relevant sections |
| **ADD.md** | Docs/technical/ | Architectural Design Document | For high-level architectural patterns |
| **Implementation.md** | Docs/technical/ | **Critical implementation plan** with detailed task breakdown | **AFTER** consulting Implementation-Index.md for specific tasks |

**IMPORTANT**: Never attempt to read the entire TDD.md directly - it's too large. Instead, ALWAYS check TDD-Index.md first to locate specific sections you need, then access only those sections of TDD.md.

## 2. Summarize Project State

   ### Based on your review provide a CONCISE summary of:
      - The project's current state
      - Key decisions from previous conversations that impact today's work
      - Technical patterns we're following for this phase

## 3. Task Planning
After completing the document navigation process, provide a concise task plan:

1. **Propose Next Tasks:**
   - Based on **DevProgress.md** status and **Implementation.md** details, identify the next 2-3 sequential tasks that:
     - Follow the established task numbering and ordering in Implementation.md
     - Build logically on previously completed work
     - Can be accomplished in a single conversation without approaching token limits

**Guideline on Task Proposal Granularity:** When identifying tasks, aim to propose 1-2 primary tasks from `Implementation.md` at a time. This defines a manageable chunk of work for review and iteration. The USER will confirm the final scope. This approach also supports prioritizing frequent commits within a feature branch after each distinct task is completed and approved.

2. **Technical Implementation Details:**
   - For each proposed task, summarize the specific implementation steps from Implementation.md
   - Reference any relevant architecture details from ADD.md or TDD.md (using TDD-Index.md first)
   - Explain any dependencies between these tasks

3. **Preparation & Resources:**
   - Identify potential challenges and testing that should be done
   - Explain what external information you will seek (from Context7 MCP, Brave Search MCP, or Perplexity MCP)
   - Cite specific sections of our technical documentation that will guide implementation

4. **Tracking & Documentation:**
   - Suggest how to document progress in DevProgress.md when these tasks are completed
   - Note any potential updates needed for Implementation.md based on your understanding

5. Ask user to review and approve

## 4. Branch Management

Please review ONLY the "Quick Reference: Branching Strategy" section at the top of GitWorkflow.md, then:

1. Our last conversation was C4. Based on the tasks we'll work on, propose a new branch name following our convention:
   - For feature development: `c5-feature/[task#]-[description]-[model]`
   - For bug fixes: `c5-fix/[issue#]-[brief-description]-[model]`
   - For documentation: `c5-docs/[description]-[model]`
   - For refactoring: `c5-refactor/[task#]-[description]-[model]`
   - For releases: `c5-release/v[version]-[model]`

2. Provide the exact Git commands for:
   - Checking out develop
   - Pulling latest changes
   - Creating the new branch
   - Pushing it to origin

```


### PROMPT 2: Begin Implementation

**When to use:** Immediately after PROMPT 1 when tasks have been approved and the new branch has been created

**Purpose:** Starts the actual implementation work, gathering necessary information using available tools

**Workflow Position:** Second prompt in a conversation, after task approval and branch creation

```
# Co-Director Platform: Let's Start Implementing

Let's proceed. For the first task:

1. Please use the available tools to gather all necessary information following this exact process:

   a) **Task-Specific Implementation Details:**
      - **FIRST** check **Implementation-Index.md** to locate the exact task references
      - **THEN** open **Implementation.md** using the section references from the index
      - For recently completed tasks, check **Implementation-Updates.md** for more current details
      - Study the detailed steps, dependencies, and requirements for this specific task
      - Note any architectural connections mentioned

   b) **Codebase Context:**
      - Search the codebase for related implementations
      - Study existing patterns and approaches for similar functionality
      - Note folder structure and organization of related components

   c) **Technical Standards:**
      - Review **CodeStandards.md** for folder structure and basic documentation requirements
      - Check **DOCUMENTATION_STANDARDS.md** for JSDoc format and timestamp requirements (YYYY-MM-DD HH:MM ET)
      - Review **LLM_FILE_CREATION_GUIDELINES.md** when creating new files
      - Reference **BestPractices.md** for code quality guidelines

   d) **Architecture & Patterns:**
      - Review **TechnicalPatterns.md** for implementation patterns specific to this task
      - For deeper architectural guidance:
        1. FIRST check **TDD-Index.md** to locate relevant sections
        2. THEN reference only those specific sections in **TDD.md**
        3. If needed, consult specific sections of **ADD.md** for higher-level architecture

   e) **External Research:**
      - Use Context7 MCP to research best practices for [RELEVANT_LIBRARY/TECHNOLOGY]
      - Document any Context7 MCP references in your code comments
      - Use Brave/Perplexity MCP if additional external information is needed

2. **Proactive MCP Check:**
   - After reviewing the project documentation and patterns in step 1, consider if an additional MCP call (Context7 for specific libraries/frameworks, Brave/Perplexity for general best practices, alternative solutions, or external validation) would significantly enhance your understanding, improve the quality of the proposed solution, or mitigate risks for the current task.
   - If you identify a benefit, clearly state your intention to use a specific MCP and your reasoning for it. This will be part of your summary in the next step.

3. Before coding, concisely inform me of:
   - Any project documents you think would be helpful to reference
   - Any questions or clarifications needed from me
   - Your understanding of how this implementation fits into the overall architecture
   - Your proposed plan for implementing the task (briefly)

4. Implement the task:
   - Create or edit files as needed
   - Write unit/component tests where applicable
   - Adhere to all documented standards and patterns
   - Explain your code clearly

Let's start with a high-level overview, then proceed step by step with the implementation.
```

### PROMPT 3: End Session and Create Handoff

**When to use:** At the end of each development session

**Purpose:** Creates a proper handoff for the next session and ensures all changes are documented

```
# Co-Director Platform: Session Wrap-Up

We're wrapping up this session. Lets follow our Git workflow and create a proper handoff:

## 1. Documentation Updates

Prepare updates for:

1. **DevProgress.md:**
   - Update the status of tasks we worked on
   - Mark completed tasks with ✅ and in-progress with 🔄

2. **Implementation.md Synchronization:**
   - Review any changes made to task implementation details
   - If we deviated from the planned implementation:
     - Update relevant task details with actual implementation approach
     - Mark updated sections with "Updated: YYYY-MM-DD HH:MM ET"
     - Add rationale for significant changes
   - If we discovered new tasks or dependencies:
     - Add them to the appropriate section with proper task numbering
     - Cross-reference in DevProgress.md

3. **SessionHandoff.md:**
   - Update ONLY the "Latest Handoff" section at the top with:
     - Current timestamp: [CURRENT DATE AND TIME IN FORMAT: YYYY-MM-DD HH:MM ET]
     - Session summary with key accomplishments
     - Current development state and task status
     - Implementation context with files modified
     - Technical decisions with rationale
     - Git context (branch, commit hash)
     - Clear next steps

## 2. Git Operations

1. **Prepare Commit:**
   - Summarize changes for a detailed commit message
   - Format as: `type(scope): brief description` with bullet points

2. **Git Commands:**
   ```bash
   git add .
   git commit -m "[COMMIT MESSAGE]"
   git push origin [BRANCH-NAME]
   ```

3. **Next Steps:**
   - If feature complete: recommend creating PR to develop
   - Suggest branch for next session
   - List specific tasks for next session
```

### PROMPT 4: Mid-Session Progress Check

**When to use:** When you want to check progress and potentially adjust scope mid-session

**Purpose:** Quickly assess progress, identify blockers, and plan remainder of session

```
# Co-Director Platform: Progress Check

Let's quickly assess where we are:

1. **Accomplished:**
   - [KEY ITEMS COMPLETED]

2. **Current Status:**
   - Branch: [CURRENT BRANCH]
   - Files modified: [KEY FILES]
   - Current focus: [CURRENT TASK]

3. **Remaining Scope:**
   - [ITEMS STILL TO DO]
   - Estimated completion time: [ESTIMATE]

4. **Blockers/Concerns:**
   - [ANY BLOCKERS OR TECHNICAL ISSUES]
   - [ANY DESIGN DECISIONS NEEDED]

Please provide a concise assessment: Can we complete the planned tasks in this session? If not, what should we prioritize?
```

### PROMPT 5: Recovery After Context Reset

**When to use:** When the AI loses context due to a reset, or when resuming work without using PROMPT 1

**Purpose:** Quickly reestablish context and resume work without starting over

```
# Co-Director Platform: Quick Context Recovery

We need to quickly recover context. Here's the current Git state:

```bash
git branch --show-current
git status
```
[PASTE OUTPUT HERE]

Please:

1. Check the "Latest Handoff" section in SessionHandoff.md ONLY

2. Identify:
   - The task(s) we were implementing
   - Current branch and its purpose
   - Files already modified
   - Where we left off specifically

3. Resume implementation by:
   - Summarizing what's been done so far (1-2 sentences)
   - Stating the immediate next step
   - Continuing from exactly where we left off

Don't start over or repeat work that's already been done.
```

### PROMPT 6: Create Git Backup

**When to use:** When you need to create a backup of your current work

**Purpose:** Creates a proper Git commit and pushes changes to remote repository

```
# Co-Director Platform: Create Git Backup

I need to create a Git backup of my current work:

1. **Files modified:**
   - [LIST KEY FILES MODIFIED]

2. **Current status:**
   ```bash
   git status
   ```
   [PASTE OUTPUT HERE]

3. Please help me create a proper commit with:
   - Conventional commit format
   - Descriptive message capturing changes
   - Proper references to tasks/issues

4. Provide the exact Git commands to:
   - Add changes
   - Commit with message
   - Push to remote
```

## Quick Reference Guide

| Prompt # | Purpose | When to Use |
|----------|---------|-------------|
| 1 | Start New Development Session | Beginning of each conversation |
| 2 | Implementation Guidance | When implementing specific features |
| 3 | End Session and Create Handoff | End of each conversation |
| 4 | Mid-Session Progress Check | Halfway through complex sessions |
| 5 | Recovery After Context Reset | After AI context has been reset |
| 6 | Create Git Backup | When needing to backup work-in-progress |