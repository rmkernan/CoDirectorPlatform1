---
trigger: model_decision
description: When starting work on new features, when working on API integration. 
---

1. **Feature-Specific Documentation:**
   - Ensure any new feature has a corresponding `README.md` within its feature directory (e.g., `src/features/[featureName]/README.md`) explaining its purpose, components, and usage.
   - If the feature involves complex state or utility logic, document this clearly within its respective files or the feature README.

2. **API Integration Documentation:**
   - For new API endpoint integrations, document the endpoint's purpose, expected request parameters, and response structure (including success and error cases) within the relevant service file or a dedicated API documentation section.
   - If mock data is created for the API, ensure it's clearly documented or self-explanatory.

3. **Project-Level Documentation Updates:**
   - After implementing a new feature or significant API change, update `Docs/technical/Implementation-Updates.md` with a detailed summary of the work done.
   - Ensure `Docs/process/DevProgress.md` and `Docs/technical/Implementation-Index.md` are updated to reflect the status of the related task(s).

4. **Cross-Referencing:**
   - When implementing a feature or component, reference the relevant sections of `TDD.md` and `TechnicalPatterns.md` in code comments or feature documentation where appropriate.
   - Update `SessionHandoff.md` with which patterns were applied or key decisions made at the end of development sessions.