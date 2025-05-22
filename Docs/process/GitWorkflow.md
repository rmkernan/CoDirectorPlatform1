# Co-Director Platform: Git Workflow Guide

**Created:** 2025-05-22, 03:45 PM ET  
**Last Updated:** 2025-05-22, 03:45 PM ET

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
# Ensure you have the latest main branch
git checkout main
git pull origin main

# Create a new branch using our naming convention
git checkout -b feature/0-1-initialize-vite
```

## Branching Strategy

We use a simplified GitHub Flow with semantic branch naming:

| Branch Type | Purpose | Naming Convention | Example |
|-------------|---------|-------------------|---------|
| `feature/*` | New functionality | `feature/<task-id>-<description>` | `feature/1-3-chat-component` |
| `bugfix/*` | Fix issues | `bugfix/<issue-id>-<description>` | `bugfix/23-message-display` |
| `refactor/*` | Code improvements | `refactor/<task-id>-<description>` | `refactor/chat-state` |
| `docs/*` | Documentation only | `docs/<description>` | `docs/update-readme` |
| `release/*` | Release preparation | `release/v<version>` | `release/v1.0.0` |

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
2. **Create a branch** using the appropriate naming convention
3. **Implement the changes** following our code quality guidelines
4. **Commit regularly** with descriptive commit messages
5. **Push your branch** to GitHub
6. **Create a Pull Request** using the PR template
7. **Address review feedback** by making additional commits
8. **Merge** once approved and CI passes

## Pull Request Process

1. Create the PR against the `main` branch
2. Fill out the PR template completely
3. Assign reviewers
4. Address all feedback
5. Ensure CI checks pass
6. Use "Squash and merge" when merging to keep `main` history clean

## Advanced Git Commands

### Updating Your Branch with Latest Main

```bash
# While on your feature branch
git fetch origin
git rebase origin/main

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

# Or rebase all commits since branching from main
git rebase -i origin/main
```

## GitHub Actions CI

Our CI pipeline automatically runs on all pull requests and pushes to `main`, checking:

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
6. **Pull Regularly**: Frequently update your branch with changes from `main`

## Including Git Context in Handoffs

Update your SessionHandoff.md entries to include:

```markdown
### Git & Version Control Context
* **Current Branch:** [branch name]
* **Latest Commit:** [commit hash and message]
* **Related PR:** [PR link if applicable]
* **CI Status:** [passing/failing]
```

## Questions or Issues?

If you encounter any issues with this Git workflow, please discuss them in the project's channel.
