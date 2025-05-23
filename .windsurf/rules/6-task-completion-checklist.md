---
trigger: manual
description: Checklist to ensure all steps are covered before marking a task as fully complete.
---

1.  **Code Implementation:**
    -   All primary functional requirements of the task are met.
    -   Code adheres to project structure (`1-project-structure.md`) and implementation patterns (`3-implemenation-patterns.md`).
    -   Code quality standards are met (file/function length, clarity, etc. per `2-code-quality.md`).

2.  **Documentation (Code Level):**
    -   All new/modified code includes JSDoc annotations for functions, components, types, and complex logic (per `2-code-quality.md`).
    -   File headers are present and correct (purpose, created/updated timestamps in ET) (per `2-code-quality.md`).

3.  **Documentation (Feature/API Level - if applicable, per `4-documentation.md`):
    -   Feature-specific `README.md` updated/created.
    -   API endpoint details (purpose, params, response) documented.
    -   Mock data for APIs documented.

4.  **Testing (if applicable, per `5-testing.md`):
    -   Unit tests for utility functions and store actions written and passing.
    -   Component tests (React Testing Library) written for new/modified components, focusing on behavior.

5.  **Project Documentation Updates (per `4-documentation.md`):
    -   `Docs/process/DevProgress.md` updated (task status, notes, completion counts).
    -   `Docs/technical/Implementation-Updates.md` updated with a detailed summary of the work.
    -   `Docs/technical/Implementation-Index.md` links and statuses updated.
    -   `Docs/process/SessionHandoff.md` updated with key decisions/patterns if at end of session.

6.  **Version Control:**
    -   All related changes are staged for commit.
    -   Commit message is descriptive and follows Conventional Commits format (per `2-code-quality.md`).
