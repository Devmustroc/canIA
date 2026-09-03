# Git Commit & Micro-PR Policy

## Strict Rules for Commits and PRs

1. **Micro-Commits Only**:
   - Every commit MUST be small and focused (maximum ~100 to 400 lines of modified code).
   - Never combine unrelated features, refactors, or fixes in a single commit.

2. **Conventional Commits Format**:
   - All commit messages MUST follow the Conventional Commits specification:
     - `feat(<scope>): <description>`
     - `fix(<scope>): <description>`
     - `test(<scope>): <description>`
     - `chore(<scope>): <description>`
     - `style(<scope>): <description>`
     - `ci(<scope>): <description>`

3. **Pre-Commit Verification**:
   - Always run typecheck (`npx tsc --noEmit`) and unit tests (`npm run test`) before making a commit.
