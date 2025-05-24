# Co-Director Platform: Git Workflow Guide

**Created:** 2025-05-22, 03:45 PM ET  
**Last Updated:** 2025-05-23 15:55 ET

## Quick Reference: Branching Strategy

**IMPORTANT: This section contains the essential information about our Git workflow that you need to understand. The rest of this document contains details that you don't need to read for most tasks.**

### Workflow Diagram
```
┌─────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ develop │────▶│ c5-feature/X.XX-... │────▶│ Pull Request back   │
└─────────┘     └─────────────────────┘     │ to develop          │
                                            └─────────────────────┘
```

### Branch Types & Naming Conventions

| Branch Type | Purpose | Naming Convention | Example |
|-------------|---------|-------------------|----------|
| `develop` | Integration branch | `develop` | `develop` |
| `c*-feature/*` | New features | `c{conversation#}-feature/{task#}-{description}-{model}` | `c5-feature/0.14-zustand-store-swe-1` |
| `c*-fix/*` | Fix issues | `c{conversation#}-fix/{issue-id}-{description}[-{model}]` | `c5-fix/23-message-display-s37` |
| `c*-docs/*` | Documentation | `c{conversation#}-docs/{description}[-{model}]` | `c5-docs/update-readme-s37` |
| `c*-refactor/*` | Code improvements | `c{conversation#}-refactor/{task-id}-{description}[-{model}]` | `c3-refactor/chat-state-swe1` |
| `c*-release/*` | Release preparation | `c{conversation#}-release/v{version}[-{model}]` | `c6-release/v1.0.0-swe1` |

### Key Points

1. **Conversation Numbers**: Each new AI conversation increments the number (C4, C5, etc.)
2. **Always Start from Develop**: All new branches begin from the `develop` branch
3. **Branch Creation Commands**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b c{conversation#}-feature/{task#}-{description}-{model}
   git push -u origin c{conversation#}-feature/{task#}-{description}-{model}
   ```
4. **When Feature Complete**: Create a Pull Request back to `develop`
5. **Use Tags for Milestones**: e.g., `git tag -a phase0-complete -m "Completed Phase 0 tasks"`

## Overview

This document outlines the Git and GitHub workflow for the Co-Director Platform project. Following these guidelines ensures consistent code quality, clear history, and effective collaboration.

## Initial Setup

### First-Time Repository Setup

```bash
# Clone the repository
git clone https://github.com/your-organization/co-director-platform.git
cd co-director-platform

# Configure commit message template
git config --local commit.template .gitmessage

# Configure line endings
git config --local core.autocrlf input
```

### Starting Work on a New Task

```bash
# Ensure you have the latest develop branch
git checkout develop
git pull origin develop

# Create a new branch using our naming convention
git checkout -b c{conversation#}-feature/{task#}-{description}-{model}
# Example
git checkout -b c5-feature/0.14-zustand-store-swe-1
```

## Branching Strategy

We use a feature-branch workflow with an integration branch and semantic naming that includes conversation number and model information:

| Branch Type        | Purpose | Naming Convention                                  | Example                                      |
|--------------------|---------|----------------------------------------------------|----------------------------------------------|
| Feature            | New functionality | `c{conversation#}-feature/{task#}-{description}-{model}`         | `c4-feature/0.11-routing-swe-1`              |
| Bugfix             | Fix issues | `c{conversation#}-fix/{issue#}-{description}-{model}`            | `c5-fix/23-login-error-s37`                  |
| Docs               | Documentation only | `c{conversation#}-docs/{description}-{model}`                    | `c2-docs/readme-update-gpt4`                 |
| Refactor           | Code improvements | `c{conversation#}-refactor/{task#}-{description}-{model}`        | `c3-refactor/state-logic-swe-1`              |
| Release            | Release preparation | `c{conversation#}-release/v{version}-{model}`                    | `c6-release/v1.0.0-swe-1`                    |

### Model Identifiers

When working with different AI models, append these identifiers to branch names:

- `-swe1` - Windsurf SWE-1 model
- `-s37` - Sonnet 3.7 model
- `-gpt4` - GPT-4 model

Example: `c1-feature/0-1-initialize-vite-swe1`

### When to Include Model Information

- **Include model identifier** when the branch contains work specific to a particular AI model's behavior or output
- **Omit model identifier** for model-agnostic work (most frontend components, documentation, etc.)
- **Update model identifier** if switching models during development (create a new branch)

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Scopes:
Use feature names as scopes: `setup`, `chat`, `history`, etc.

### Examples:
```
feat(chat): implement message display component
fix(setup): resolve principles document loading issue
docs: update README with setup instructions
refactor(store): simplify session state management
test(api): add mock response tests for error handling
```

## Development Workflow

1. **Select a task** from the DevProgress.md document
2. **Create a branch from develop** using the appropriate naming convention
3. **Implement the changes** following our code quality guidelines
4. **Commit regularly** with descriptive commit messages
5. **Push your branch** to GitHub
6. **Create a Pull Request** against the `develop` branch using the PR template
7. **Address review feedback** by making additional commits
8. **Merge** into `develop` once approved and CI passes
9. **Add a tag** to mark important milestones (e.g., `phase0-complete`)

## Detailed Feature Development Lifecycle

The development process, especially when working iteratively (e.g., with an AI assistant like Cascade), involves a cycle of creating a dedicated feature branch, implementing changes, committing work regularly, and then integrating those changes back into the main `develop` branch. This ensures that `develop` always represents a stable, integrated version of the project, while new work is isolated on feature branches. Clear communication, often facilitated by updating `SessionHandoff.md`, is key when pausing or completing work on a feature branch.

Here’s a step-by-step guide for the lifecycle of a feature branch:

**1. Starting a New Feature or Task:**

   a. **Switch to `develop`:** Ensure you are on the `develop` branch.
      ```bash
      git checkout develop
      ```
   b. **Update Local `develop`:** Pull the latest changes for `develop` from the remote repository (GitHub) to ensure your local `develop` is synchronized.
      ```bash
      git pull origin develop
      ```
   c. **Create Feature Branch:** Create a new feature branch from the up-to-date `develop` branch. Use the project's naming convention (e.g., `c{X}-feature/{task#}-{description}`).
      ```bash
      git checkout -b cX-feature/task-description
      ```
   d. **Push New Branch to Remote:** Immediately push the newly created feature branch to the remote repository. This establishes tracking and makes the branch visible to others (if applicable).
      ```bash
      git push -u origin cX-feature/task-description
      ```

**2. Working on the Feature Branch:**

   a. **Implement Changes:** Make your code changes, add new files, update documentation, and write tests as required for the feature or task.
   b. **Commit Regularly:** Commit your work frequently with clear, descriptive messages following the Conventional Commits standard.
      ```bash
      git add .
      git commit -m "feat(scope): concise description of change"
      ```
   c. **Push Commits:** Periodically push your local commits on the feature branch to its remote counterpart.
      ```bash
      git push origin cX-feature/task-description
      ```
   d. **(Optional) Keep Branch Updated:** If your feature branch work spans a long time, or if `develop` is very active, periodically update your feature branch with the latest changes from `develop`. This can be done using `git rebase origin/develop` (as mentioned in 'Advanced Git Commands') or `git merge origin/develop`. Rebasing is often preferred for a cleaner history before merging back to `develop`.

**3. Completing the Feature or Session:**

   a. **Finalize Work:** Ensure all development, documentation, and testing for the feature (or the current session's scope) are complete on the feature branch.
   b. **Update Session Handoff:** If pausing work or preparing for merge, update `Docs/process/SessionHandoff.md` with the current status, key accomplishments, and next steps.
   c. **Commit Final Changes:** Commit any last-minute changes, including the handoff document update.
   d. **Push All Changes:** Ensure all local commits on the feature branch are pushed to the remote.
      ```bash
      git push origin cX-feature/task-description
      ```

**4. Merging the Feature Branch into `develop`:**

   a. **Switch to `develop`:** Check out your local `develop` branch.
      ```bash
      git checkout develop
      ```
   b. **Update Local `develop` (Again):** Pull the latest changes for `develop` from the remote. This is crucial to ensure you're merging into the absolute latest version of `develop`, especially if other work has been merged since you started your feature branch or last pulled.
      ```bash
      git pull origin develop
      ```
   c. **Merge Feature Branch:** Merge your completed feature branch into your local `develop` branch. This integrates all commits from the feature branch into `develop`.
      ```bash
      git merge cX-feature/task-description
      ```
   d. **Resolve Conflicts (If Any):** If Git reports merge conflicts, you must resolve them manually. Open the conflicted files, edit them to incorporate changes from both branches correctly, save the files, and then stage them.
      ```bash
      git add <conflicted-file-1> <conflicted-file-2>
      ```
      Once all conflicts are resolved and staged, continue the merge, which usually involves a commit.
      ```bash
      git commit  # Git often pre-fills the merge commit message
      # Or, if prompted by Git during the merge process, follow its instructions.
      ```

**5. Pushing Merged `develop` to Remote:**

   a. **Push `develop`:** After the feature branch has been successfully merged into your local `develop` branch (and any conflicts resolved), push the updated `develop` branch to the remote repository.
      ```bash
      git push origin develop
      ```
      Now, the `develop` branch on GitHub contains the newly integrated feature.

**6. Cleaning Up (Optional but Recommended):**

   a. **Delete Local Feature Branch:** Once the feature branch is merged into `develop` and `develop` is pushed, you can delete the local copy of the feature branch.
      ```bash
      git branch -d cX-feature/task-description
      ```
   b. **Delete Remote Feature Branch:** You can also delete the feature branch from the remote repository (GitHub) if it's no longer needed.
      ```bash
      git push origin --delete cX-feature/task-description
      ```

This detailed lifecycle helps maintain a clean and understandable project history, facilitates collaboration, and ensures that the `develop` branch remains a reliable source of truth for the project's current integrated state.

## Pull Request Process

1. Create the PR against the `develop` branch
2. Fill out the PR template completely
3. Assign reviewers
4. Address all feedback
5. Ensure CI checks pass
6. Use "Squash and merge" when merging to keep `develop` history clean

## Advanced Git Commands

### Updating Your Branch with Latest Develop

```bash
# While on your feature branch
git fetch origin
git rebase origin/develop

# If you have conflicts, resolve them and then
git add .
git rebase --continue
```

### Creating a Fixup Commit

```bash
# Make changes and stage them
git add .
# Create a fixup commit targeting a previous commit
git commit --fixup=<commit-hash>
```

### Interactive Rebase to Clean Up Commits

```bash
# Rebase the last N commits
git rebase -i HEAD~N

# Or rebase all commits since branching from develop
git rebase -i origin/develop
```

## GitHub Actions CI

Our CI pipeline automatically runs on all pull requests and pushes to `develop`, checking:

1. Code linting
2. Type checking
3. Unit tests
4. Build verification

## Best Practices

1. **Commit Often**: Make small, focused commits rather than large ones
2. **Keep PRs Small**: Aim for PRs that implement a single feature or fix
3. **Write Clear Commit Messages**: Follow the conventional commits standard
4. **Reference Tasks/Issues**: Include task IDs in branch names and commit messages
5. **Update Documentation**: Keep documentation in sync with code changes
6. **Pull Regularly**: Frequently update your branch with changes from `develop`
7. **Synchronize Documentation**: Follow the documentation synchronization workflow

## Including Git Context in Handoffs

Update your SessionHandoff.md entries to include:

```markdown
### Git & Version Control Context
* **Current Branch:** [branch name]
* **Latest Commit:** [commit hash and message]
* **Related PR:** [PR link if applicable]
* **CI Status:** [passing/failing]
```

## Branch Verification Protocol

To ensure we're always working on the correct branch, we've implemented a mandatory branch verification process:

### Automatic Branch Verification

1. **Start of Each Conversation**:
   - First action in any development session must be to check the current branch
   - Create a feature branch if not already on one

2. **Pre-Session Checklist**:
   ```
   - [ ] Verify current branch (`git branch --show-current`)
   - [ ] Create feature branch if needed (`git checkout -b c{conversation#}-feature/{task#}-{description}-{model}`)
   - [ ] Push branch to remote (`git push -u origin c{conversation#}-feature/{task#}-{description}-{model}`)
   ```

3. **Git Aliases for Streamlined Workflow**:

   Add these to your `.gitconfig`:
   ```
   [alias]
     start-task = "!f() { git checkout develop && git pull && git checkout -b \"c$1-feature/$2\" && git push -u origin \"c$1-feature/$2\"; }; f"
     task-done = "!f() { git add . && git commit -m \"$1\" && git push; }; f"
   ```

   Usage:
   ```bash
   # Start new task
   git start-task 5 0.14-zustand-store-swe-1

   # Commit and push changes
   git task-done "feat(setup): initialize vite project"
   ```

### Pre-Commit Verification (Coming Soon)

We plan to implement Git hooks to:
- Verify branch naming conventions
- Validate commit message format
- Prevent direct commits to develop or main

## Documentation Synchronization Workflow

Documentation changes require special handling to ensure all branches have the most current documentation.

### Documentation Update Process

1. **Create a dedicated documentation branch from main**:
   ```bash
   git checkout develop
   git pull  # Ensure develop is up-to-date
   git checkout -b c{conversation#}-docs/implementation-sync-{model}
   # Example
   git checkout -b c5-docs/implementation-sync-swe-1
   ```

2. **Make documentation changes and commit them**:
   ```bash
   git add Docs/
   git commit -m "docs: Synchronize implementation documentation with codebase state"
   ```

3. **Merge documentation branch into develop**:
   ```bash
   git checkout develop
   git merge c{conversation#}-docs/implementation-sync-{model}
   ```

4. **Merge develop into all active feature branches**:
   For each active feature branch:
   ```bash
   git checkout {feature-branch}
   git merge develop
   ```

### Documentation Synchronization Maintenance

To ensure documentation stays synchronized across branches:

1. **Regular merges from develop to feature branches**:
   - Schedule weekly merges from develop to all active feature branches
   - This ensures documentation changes flow to all active work

2. **Documentation updates as part of Definition of Done**:
   - Include "Update relevant documentation" in your Definition of Done
   - Document changes in your PR description

3. **Document verification in pull requests**:
   - PR template includes a "Documentation Changes" section
   - Reviewers should verify documentation is accurate and complete

## Questions or Issues?

If you encounter any issues with this Git workflow, please discuss them in the project's channel.
