# Co-Director Platform: Development Checklist

**Created:** 2025-05-22, 04:29 PM ET  
**Last Updated:** 2025-05-22, 04:35 PM ET

This checklist serves as a quick reference to ensure consistent development practices across the Co-Director Platform project.

## Before Starting Each Development Session

### 1. Model Verification (CRITICAL)
**LLM MUST ALWAYS ASK FIRST THING:**
```
[LLM]: Please confirm which model you're using for this task.
Example: "I'm using [MODEL_NAME] for this task"
```

**User Responsibilities:**
- [ ] Explicitly state the model being used at session start
- [ ] Clearly announce any model changes mid-session
- [ ] Verify the model's capabilities match the task requirements

**LLM Responsibilities:**
- [ ] ALWAYS ask for model confirmation if not explicitly stated
- [ ] Record the model being used in session notes
- [ ] Verify model capabilities match the task requirements
- [ ] Confirm model understanding before proceeding

### Example Model Declaration
```
[LLM]: Please confirm which model you're using for this task.
Example: "I'm using [MODEL_NAME] for this task"

USER: I'm using SWE-1 for this task

[LLM]: Confirmed using SWE-1. I'll proceed with this model.
```

### Git Workflow Requirements

#### Branch Naming (CRITICAL)
- [ ] **ALWAYS** include model identifier in branch names for model-specific work
- [ ] Follow this exact pattern:
  ```
  # For model-specific work (REQUIRED when using a specific model):
  feature/{task-id}-{description}-{model}
  
  # Example for SWE-1 model:
  feature/0-1-initialize-vite-swe1
  
  # For model-agnostic work (RARE - only for infrastructure/configuration):
  feature/{task-id}-{description}
  ```

#### Commit Messages (REQUIRED)
- [ ] **ALWAYS** include model identifier in commit messages when applicable:
  ```
  # For model-specific work:
  git commit -m "feat(scope): description [MODEL]"
  
  # Example:
  git commit -m "feat(setup): initialize Vite project [SWE-1]"
  ```

#### Branch Management
- [ ] Verify current Git branch: `git branch --show-current`
- [ ] If not on a feature branch, create one following the naming pattern above
- [ ] Push branch to remote immediately after creation:
      ```bash
      git push -u origin <branch-name>
      ```
- [ ] When switching models, create a new branch with the new model identifier
- [ ] Never commit model-specific changes to the main branch
- [ ] Pull latest changes from main (if needed): `git pull origin main`
- [ ] Review DevProgress.md for current task status
- [ ] Check latest SessionHandoff.md entry for context

## During Development

- [ ] Follow folder structure defined in TechnicalPatterns.md Section 4
- [ ] Keep file length under 400 lines (BestPractices.md Section 2)
- [ ] Keep function/component length under 40 lines (BestPractices.md Section 2)
- [ ] Add JSDoc comments for all functions, components, and types
- [ ] Include clear, descriptive comments explaining complex logic
- [ ] Place TypeScript interfaces at the top of files
- [ ] Name prop interfaces with "Props" suffix (e.g., MessageItemProps)
- [ ] Make regular, atomic commits with conventional commit messages

## Before Committing Code

- [ ] Check that all files include creation/update timestamps
- [ ] Ensure code follows project patterns from TechnicalPatterns.md
- [ ] Verify no sensitive data is being committed
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`

## Before Ending Development Session

- [ ] Commit all changes with appropriate conventional commit message
- [ ] Push changes to GitHub: `git push origin feature/{task-id}-{description}`
- [ ] Update DevProgress.md with completed tasks
- [ ] Create detailed SessionHandoff.md entry
- [ ] Recommend specific tasks for the next session

## Git Aliases for Faster Workflow

Add these to your `.gitconfig`:
```
[alias]
  start-task = "!f() { git checkout -b \"feature/$1\" && git push -u origin \"feature/$1\"; }; f"
  task-done = "!f() { git add . && git commit -m \"$1\" && git push; }; f"
```

Usage:
```bash
# Start a new task
git start-task 0-1-initialize-vite

# Commit and push changes
git task-done "feat(setup): initialize vite project"
```

For full details, see [GitWorkflow.md](./GitWorkflow.md).
