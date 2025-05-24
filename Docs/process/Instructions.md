# Co-Director Platform: AI-Assisted Development Guide

**Created:** 2025-05-22, 02:57 PM ET  
**Last Updated:** 2025-05-24, 10:35 ET

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
| **Docs/process/LatestSessionHandoff.md** | Current session state | Before starting each session |
| **Docs/process/SessionHandoff.md** | Archive of historical handoffs | For historical context, if needed |
| **Docs/process/DevProgress.md** | Task status and tracking | When planning work or updating progress |
| **Docs/process/GitWorkflow.md** | Git branching strategy | When creating branches or merging changes |
| **Docs/technical/TechnicalPatterns.md** | Implementation patterns | Before implementing new features |
| **Docs/process/DEV_CHECKLIST.md** | Development process | Throughout development |

## AI Development Prompts

### PROMPT 1: Start New Development Session

**When to use:** At the beginning of each new development session/conversation

**Purpose:** Orients the AI to the current project state, ensures proper Git workflow, and plans the session's work


# Co-Director Platform: New Development Session

I'm starting a new development session. First, here's my current Git status:


PS C:\PythonProjects\CoDirectorPlatform1> git status
On branch c8-feature/0.18-.22-localStorage-utils
Your branch is up to date with 'origin/c8-feature/0.18-.22-localStorage-utils'.

nothing to commit, working tree clean
PS C:\PythonProjects\CoDirectorPlatform1> git branch
  c1-feature/0.1to08.-initialize-vite-swe1
  c2-fix/comment-code-swe-1
  c3-feature/0.9-complete-folder-structure-swe-1
  c4-feature/0.10-theme-configuration-swe-1
  c5-docs/implementation-sync-Son3.7
  c6-feature/0.13-0.15-mockAPI-jest-gemini2.5pro
  c7-feature/0.17-0.18-logging-utils-cascade
* c8-feature/0.18-.22-localStorage-utils
  develop
  main

## 1. Project Orientation

### 1.1 Document Navigation Process
Follow this exact process to navigate project documentation:

#### Step 1: Get Latest Context
- Review **Docs/process/LatestSessionHandoff.md** - Read this file to understand the most recent handoff.
  - Understand what was accomplished in the previous session.
  - Note any specific instructions for this session.
- (Optional) Review **Docs/process/SessionHandoff.md** - Consult this archive if historical context from older sessions is needed.

#### Step 2: Identify Task Status (High-Level Overview)
- Review **Docs/process/DevProgress.md** 
  - Identify completed tasks (✅) and in-progress tasks (🔄)
  - Note which numbered tasks should logically come next
  - Understand high-level task categories and priorities

#### Step 3: Get Detailed Implementation Plan
- For the specific tasks identified in Step 2:
  - **FIRST** check **Docs/technical/Implementation-Index.md** to locate the exact task references
  - **THEN** open **Docs/technical/Implementation.md** using the section references from the index
  - Study the detailed implementation steps for those tasks
  - Refer to **Docs/technical/Implementation-Updates.md** for recently completed tasks not yet merged into the main document
  - Note any dependencies or special requirements
  - Understand how these tasks connect to the overall architecture

#### Step 4: Understand Technical Patterns
- Review **Docs/technical/TechnicalPatterns.md** for implementation patterns relevant to the identified tasks
  - Focus on patterns that directly apply to the upcoming work

### 1.2 Document Awareness
The project contains the following important documents that you should be aware of:

| Document | Location | Purpose | When to Reference |
|----------|----------|---------|----------------|
| **Docs/technical/TDD-Index.md** | Docs/technical/ | Navigation guide for the TDD | **1st**: Always check this BEFORE accessing Docs/technical/TDD.md |
| **Docs/technical/Implementation-Index.md** | Docs/technical/ | **Task navigator** for Docs/technical/Implementation.md | **1st**: Always check this BEFORE accessing Docs/technical/Implementation.md |
| **Docs/technical/CodeStandards.md** | Docs/technical/ | **Primary reference** for code organization & basic documentation | Start here for all implementation tasks |
| **Docs/process/DOCUMENTATION_STANDARDS.md** | Docs/process/ | Comprehensive JSDoc reference | When Docs/technical/CodeStandards.md doesn't have enough detail |
| **Docs/process/LLM_FILE_CREATION_GUIDELINES.md** | Docs/process/ | Specific file header templates | **Always reference when creating new files** |
| **Docs/process/BestPractices.md** | Docs/process/ | General development guidelines, code quality, file/function length limits, and review processes. For specific Git commands and branching strategy, see `Docs/process/GitWorkflow.md`. | For process-related questions |
| **Docs/technical/TechnicalPatterns.md** | Docs/technical/ | Implementation patterns | For consistent code structure and patterns |
| **Docs/technical/TDD.md** | Docs/technical/ | Technical Design Document | **AFTER** consulting Docs/technical/TDD-Index.md for relevant sections |
| **Docs/technical/ADD.md** | Docs/technical/ | Architectural Design Document | For high-level architectural patterns |
| **Docs/technical/Implementation.md** | Docs/technical/ | **Critical implementation plan** with detailed task breakdown | **AFTER** consulting Docs/technical/Implementation-Index.md for specific tasks |

**IMPORTANT**: Never attempt to read the entire Docs/technical/TDD.md directly - it's too large. Instead, ALWAYS check Docs/technical/TDD-Index.md first to locate specific sections you need, then access only those sections of Docs/technical/TDD.md.

## 2. Summarize Project State

   ### Based on your review provide a CONCISE summary of:
      - The project's current state
      - Key decisions from previous conversations that impact today's work
      - Technical patterns we're following for this phase

## 3. Task Planning
After completing the document navigation process, provide a concise task plan:

1. **Propose Next Tasks:**
   - Based on **Docs/process/DevProgress.md** status and **Docs/technical/Implementation.md** details, identify the next 2-3 sequential tasks that:
     - Follow the established task numbering and ordering in Docs/technical/Implementation.md
     - Build logically on previously completed work
     - Can be accomplished in a single conversation without approaching token limits

**Guideline on Task Proposal Granularity:** When identifying tasks, aim to propose 1-2 primary tasks from `Docs/technical/Implementation.md` at a time. This defines a manageable chunk of work for review and iteration. The USER will confirm the final scope. This approach also supports prioritizing frequent commits within a feature branch after each distinct task is completed and approved.

2. **Technical Implementation Details:**
   - For each proposed task, summarize the specific implementation steps from Docs/technical/Implementation.md
   - Reference any relevant architecture details from Docs/technical/ADD.md or Docs/technical/TDD.md (using Docs/technical/TDD-Index.md first)
   - Explain any dependencies between these tasks

3. **Preparation & Resources:**
   - Identify potential challenges and testing that should be done
   - Explain what external information you will seek (from Context7 MCP, Brave Search MCP, or Perplexity MCP)
   - Cite specific sections of our technical documentation that will guide implementation

4. **Tracking & Documentation:**
   - Suggest how to document progress in Docs/process/DevProgress.md when these tasks are completed
   - Note any potential updates needed for Docs/technical/Implementation.md based on your understanding

5. Ask user to review and approve

## 4. Branch Management

Please review ONLY the "Quick Reference: Branching Strategy" section at the top of Docs/process/GitWorkflow.md, then:

1. Our last conversation was C8. Based on the tasks we'll work on, propose a new branch name following our convention:
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




### PROMPT 2: Begin Implementation

**When to use:** Immediately after PROMPT 1 when tasks have been approved and the new branch has been created

**Purpose:** Starts the actual implementation work, gathering necessary information using available tools

**Workflow Position:** Second prompt in a conversation, after task approval and branch creation

```
# Co-Director Platform: Let's Start Implementing

Let's proceed. For the first task:

1. Please use the available tools to gather all necessary information following this exact process:

   a) **Task-Specific Implementation Details:**
      - **FIRST** check **Docs/technical/Implementation-Index.md** to locate the exact task references
      - **THEN** open **Docs/technical/Implementation.md** using the section references from the index
      - For recently completed tasks, check **Docs/technical/Implementation-Updates.md** for more current details
      - Study the detailed steps, dependencies, and requirements for this specific task
      - Note any architectural connections mentioned

   b) **Codebase Context:**
      - Search the codebase for related implementations
      - Study existing patterns and approaches for similar functionality
      - Note folder structure and organization of related components

   c) **Technical Standards:**
      - Review **Docs/technical/CodeStandards.md** for folder structure and basic documentation requirements
      - Check **Docs/process/DOCUMENTATION_STANDARDS.md** for JSDoc format and timestamp requirements (YYYY-MM-DD HH:MM ET)
      - Review **Docs/process/LLM_FILE_CREATION_GUIDELINES.md** when creating new files
      - Reference **Docs/process/BestPractices.md** for code quality guidelines

   d) **Architecture & Patterns:**
      - Review **Docs/technical/TechnicalPatterns.md** for implementation patterns specific to this task
      - For deeper architectural guidance:
        1. FIRST check **Docs/technical/TDD-Index.md** to locate relevant sections
        2. THEN reference only those specific sections in **Docs/technical/TDD.md**
        3. If needed, consult specific sections of **Docs/technical/ADD.md** for higher-level architecture

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

1. **Docs/process/DevProgress.md:**
   - Update the status of tasks we worked on
   - Mark completed tasks with ✅ and in-progress with 🔄

2. **Implementation Documentation Synchronization:**
   a. **Update `Docs/technical/Implementation-Updates.md` (Record of Actuals & Deviations for Current/Completed Work):**
      - Review and update this file to accurately reflect all tasks worked on during the session.
      - For each task, detail the *actual implementation approach* taken.
      - If this actual implementation deviated from what was originally planned (e.g., in `Docs/technical/Implementation.md` or `Docs/technical/TDD.md`), clearly document these deviations and the rationale within `Docs/technical/Implementation-Updates.md`.
      - If new sub-tasks, dependencies, or unforeseen issues arose during the session's work, document them here. Ensure these are also cross-referenced in `Docs/process/DevProgress.md` if they create new trackable items or alter task statuses.
      - Mark new or significantly updated sections in `Docs/technical/Implementation-Updates.md` with the current timestamp (e.g., "Updated: YYYY-MM-DD HH:MM ET").

   b. **Review and Potentially Update `Docs/technical/Implementation.md` (The Overall Plan - If Future Plans Change):**
      - Based on the work completed, decisions made, or new insights gained during the session, consider if the *planned approach, scope, or steps for future, unstarted tasks* as outlined in `Docs/technical/Implementation.md` need revision.
      - If significant changes to the *plan for future work* are necessary, update the relevant sections in `Docs/technical/Implementation.md` itself.
      - Clearly indicate any such updates within `Docs/technical/Implementation.md` (e.g., with a timestamp or a note explaining the revision to the plan for those future tasks).

3. **Session Handoff Documentation:**
   a. **Archive Previous Handoff to `Docs/process/SessionHandoff.md`:**
      - **Action:** Copy the *entire current content* of `Docs/process/LatestSessionHandoff.md` (this is the handoff from the *previous* session).
      - **Update Archive:** Prepend this copied content to `Docs/process/SessionHandoff.md`. It should be placed under the "Historical Handoffs" section, typically after a horizontal rule (`---`) or similar separator, making it the newest entry in the archive.
      - **Timestamp Archive:** Update the `Last Updated:` timestamp at the top of `Docs/process/SessionHandoff.md`.
   b. **Update `Docs/process/LatestSessionHandoff.md` for the Current Session:**
      - **Overwrite Content:** This file should *only* contain the handoff for the session that is *just concluding*. Replace its entire content.
      - **File Header:** Update `@created` and `@lastUpdated` timestamps in the file header comment.
      - **Handoff Details:**
        - **Timestamp:** Current date and time (e.g., `[YYYY-MM-DD HH:MM ET]`) in the handoff title.
        - **Session Summary:** Detail what was focused on and accomplished during *this* session.
        - **Development State:** Current project phase, active branch name, and its status (e.g., up-to-date, any uncommitted changes *before* these doc updates).
        - **Implementation Context:** List key files that were modified or created *during the actual development work* of this session.
        - **Technical Decisions:** Note any significant decisions made.
        - **Git Context:** Specify the current branch and the commit hash *before* committing these handoff documentation changes.
        - **Next Steps:** Clearly outline what should be done at the start of the next session.

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

1. Check the "Latest Handoff" section in Docs/process/LatestSessionHandoff.md ONLY

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