---
trigger: always_on
---

1 Maintain file length under 400 lines and function/component length under 40 lines as specified in BestPractices.md Section 2. If approaching these limits, suggest refactoring into smaller, more focused units.

2 All code must include clear, descriptive comments that explain the 'why' behind complex logic, with JSDoc annotations for all functions, components, and types; each file should begin with a header comment describing its purpose and relationship to the overall architecture.  All files should include a creation and last updated timestamp. 

3 When writing TypeScript interfaces, place them at the top of the file. For React components, define prop interfaces using descriptive names ending with "Props" (e.g., MessageItemProps).