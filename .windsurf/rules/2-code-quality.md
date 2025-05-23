---
trigger: always_on
---

1. **Code Structure**
   - Maintain file length under 400 lines and function/component length under 40 lines as specified in BestPractices.md Section 2. If approaching these limits, suggest refactoring into smaller, more focused units.

2. **Documentation & Comments**
   - All code must include clear, descriptive comments that explain the 'why' behind complex logic, with JSDoc annotations for all functions, components, and types.
   - Each file should begin with a header comment describing its purpose and relationship to the overall architecture.
   - All files should include a creation and last updated timestamp in the format `YYYY-MM-DD HH:MM ET` (e.g., `2025-05-22 21:57 ET`). This format must be strictly followed for all timestamps.

3. **TypeScript & Interfaces**
   - When writing TypeScript interfaces, place them at the top of the file.
   - For React components, define prop interfaces using descriptive names ending with "Props" (e.g., `MessageItemProps`).
   - Use type aliases for complex types and document them with JSDoc comments.

4. **Context7 MCP Integration**
   - **Documentation First**: Before implementing new features or fixing issues, check Context7 MCP for:
     - Latest library versions and compatibility
     - Recommended patterns and best practices
     - Known issues and workarounds
   - **Documentation in Code**: When using Context7 MCP findings:
     - Add a comment with the MCP reference (e.g., `// Context7: See MCP-1234 for pattern`)
     - Note the version of documentation referenced
     - Document any deviations from the recommended approach
   - **Verification**: For any third-party library usage:
     - Verify the implementation matches the latest Context7 MCP documentation
     - Document any version-specific considerations
     - Include relevant MCP references in JSDoc comments